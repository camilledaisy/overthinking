import { useEffect, useMemo, useRef, useState } from 'react'
import { Background, BackgroundVariant, MiniMap, ReactFlow, useReactFlow, type Edge } from '@xyflow/react'
import type { Sim, TNode } from '../types'
import { NODE_W, canExpand, layout, type Box } from '../engine/engine'
import ThoughtNode, { type ThoughtFlowNode } from './ThoughtNode'
import { kindColor } from './ui'

const nodeTypes = { thought: ThoughtNode }
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const ease = (t: number) => 1 - Math.pow(1 - t, 3)

/** Glide every node from where it currently is (new nodes start at their parent) to its layout slot. */
function useTweened(target: Map<string, Box>, nodes: TNode[]) {
  const [pos, setPos] = useState(target)
  const cur = useRef(target)
  useEffect(() => {
    if (reduced()) { cur.current = target; setPos(target); return }
    const parent = new Map(nodes.map((n) => [n.id, n.parent]))
    const from = new Map<string, Box>()
    for (const [id, to] of target) {
      let f = cur.current.get(id)
      for (let p = parent.get(id); !f && p; p = parent.get(p)) f = cur.current.get(p)
      from.set(id, f ?? to)
    }
    const t0 = performance.now()
    let raf = 0
    const step = (t: number) => {
      const k = ease(Math.min(1, (t - t0) / 550))
      const next = new Map<string, Box>()
      for (const [id, to] of target) {
        const f = from.get(id)!
        next.set(id, { x: f.x + (to.x - f.x) * k, y: f.y + (to.y - f.y) * k, h: to.h })
      }
      cur.current = next
      setPos(next)
      if (k < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, nodes])
  return pos
}

function bounds(ids: string[], target: Map<string, Box>) {
  const boxes = ids.map((i) => target.get(i)).filter(Boolean) as Box[]
  const x = Math.min(...boxes.map((b) => b.x))
  const y = Math.min(...boxes.map((b) => b.y))
  return {
    x,
    y,
    width: Math.max(...boxes.map((b) => b.x + NODE_W)) - x,
    height: Math.max(...boxes.map((b) => b.y + b.h)) - y,
  }
}

export default function ThoughtMap({ sim, focus }: { sim: Sim; focus: { id: string; n: number } }) {
  const rf = useReactFlow()
  const target = useMemo(() => layout(sim.nodes), [sim.nodes])
  const pos = useTweened(target, sim.nodes)
  const mounted = useRef(false)
  const wrap = useRef<HTMLDivElement>(null)

  /** Fit a rect into the pane without ever zooming in past 1:1 (fitBounds would blow up small branches). */
  const frame = (r: { x: number; y: number; width: number; height: number }, duration: number) => {
    const W = wrap.current?.clientWidth ?? 800
    const H = wrap.current?.clientHeight ?? 600
    const zoom = Math.min(1, W / (r.width * 1.3), H / (r.height * 1.3))
    rf.setViewport({ zoom, x: W / 2 - (r.x + r.width / 2) * zoom, y: H / 2 - (r.y + r.height / 2) * zoom }, { duration })
  }

  // frame the new branch after an expansion, or the whole map after undo / restart / first load
  useEffect(() => {
    const first = sim.fresh[0] && sim.nodes.find((n) => n.id === sim.fresh[0])
    const ids = first ? [first.parent!, ...sim.fresh] : sim.nodes.map((n) => n.id)
    frame(bounds(ids, target), mounted.current && !reduced() ? 700 : 0)
    mounted.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sim.nodes.length, sim.caseNo])

  useEffect(() => {
    const b = target.get(focus.id)
    if (focus.n && b) rf.setCenter(b.x + NODE_W / 2, b.y + b.h / 2, { zoom: Math.max(rf.getZoom(), 0.9), duration: 500 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus.n])

  const resetView = () => frame(bounds(sim.nodes.map((n) => n.id), target), 500)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || /input|textarea|select/i.test((e.target as HTMLElement).tagName)) return
      if (e.key === '0') resetView()
      else if (e.key === '+' || e.key === '=') rf.zoomIn({ duration: 200 })
      else if (e.key === '-') rf.zoomOut({ duration: 200 })
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  })

  const nodes: ThoughtFlowNode[] = sim.nodes.map((n) => {
    const t = target.get(n.id)!
    const p = pos.get(n.id) ?? t
    return {
      id: n.id,
      type: 'thought',
      position: { x: p.x, y: p.y },
      width: NODE_W,
      height: t.h,
      draggable: false,
      style: { pointerEvents: 'all' },
      data: { node: n, selected: n.id === sim.selected, isNew: sim.fresh.includes(n.id), canExpand: canExpand(sim, n), box: t },
    }
  })
  const edges: Edge[] = sim.nodes
    .filter((n) => n.parent)
    .map((n) => ({
      id: `e-${n.id}`,
      source: n.parent!,
      target: n.id,
      className: `${n.kind === 'absurd' || n.kind === 'escalation' ? 'edge-hot' : ''} ${sim.fresh.includes(n.id) ? 'edge-new' : ''}`,
    }))

  return (
    <div ref={wrap} className="relative h-full min-h-[360px] w-full" role="region" aria-label="Thought map. Pan by dragging, zoom with scroll or pinch. Tab moves between thoughts; Enter expands one.">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        nodesFocusable={false}
        edgesFocusable={false}
        elementsSelectable={false}
        minZoom={0.15}
        maxZoom={1.6}
        defaultViewport={{ x: 40, y: 40, zoom: 0.9 }}
        zoomOnDoubleClick={false}
      >
        <Background variant={BackgroundVariant.Lines} gap={32} color="rgba(37,39,43,0.07)" />
        <MiniMap
          className="!hidden sm:!block !h-[90px] !w-[130px]"
          pannable
          zoomable
          nodeColor={(n) => kindColor[(n.data as { node: TNode }).node.kind]}
          nodeStrokeColor="#25272b"
          nodeStrokeWidth={6}
          maskColor="rgba(37,39,43,0.12)"
        />
      </ReactFlow>
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        <button className="btn !px-0 w-9 text-base" aria-label="Zoom in" title="Zoom in (+)" onClick={() => rf.zoomIn({ duration: 200 })}>+</button>
        <button className="btn !px-0 w-9 text-base" aria-label="Zoom out" title="Zoom out (−)" onClick={() => rf.zoomOut({ duration: 200 })}>−</button>
        <button className="btn !px-0 w-9" aria-label="Reset view" title="Reset view (0)" onClick={resetView}>⌖</button>
      </div>
    </div>
  )
}
