import { useRef } from 'react'
import { Handle, Position, useReactFlow, type Node, type NodeProps } from '@xyflow/react'
import { motion } from 'motion/react'
import type { TNode } from '../types'
import { useSim } from '../state'
import { MAX_DEPTH } from '../engine/engine'
import { EV_LABEL } from './ui'

export interface NodeData extends Record<string, unknown> {
  node: TNode
  selected: boolean
  isNew: boolean
  canExpand: boolean
  box: { x: number; y: number; h: number }
}
export type ThoughtFlowNode = Node<NodeData, 'thought'>

const SKIN: Record<TNode['kind'], string> = {
  incident: 'bg-ink text-paper border-ink',
  reasonable: 'bg-[#f4f1e8] border-ink',
  speculative: 'bg-[repeating-linear-gradient(45deg,#d9d5c9_0_6px,#e2ded2_6px_12px)] border-ink',
  absurd: 'bg-[#f4f1e8] border-warn',
  escalation: 'bg-warn text-paper border-[#6e1510]',
}

export default function ThoughtNode({ data }: NodeProps<ThoughtFlowNode>) {
  const { node, selected, isNew, canExpand, box } = data
  const { dispatch } = useSim()
  const rf = useReactFlow()
  const down = useRef<[number, number] | null>(null)

  const footer = node.expanded
    ? 'Analysed'
    : canExpand
      ? '[+] Analyse further'
      : node.depth >= MAX_DEPTH
        ? 'Depth limit'
        : 'Capacity full'

  return (
    <motion.div
      className="h-full w-full"
      initial={isNew ? { opacity: 0, scale: 0.6 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <Handle type="target" position={Position.Left} isConnectable={false} />
      <button
        type="button"
        data-node-id={node.id}
        className={`flex h-full w-full flex-col border-2 p-0 text-left text-[12px] leading-[18px] ${SKIN[node.kind]} ${
          selected ? 'shadow-[5px_5px_0_var(--color-ink)]' : 'shadow-[2px_2px_0_var(--color-grey)]'
        }`}
        onPointerDown={(e) => (down.current = [e.clientX, e.clientY])}
        onClick={(e) => {
          const d = down.current
          if (d && Math.hypot(e.clientX - d[0], e.clientY - d[1]) > 6) return // it was a pan, not a click
          dispatch({ t: 'expand', id: node.id })
        }}
        onFocus={(e) => {
          if (!e.currentTarget.matches(':focus-visible')) return
          dispatch({ t: 'select', id: node.id })
          rf.setCenter(box.x + 132, box.y + box.h / 2, { zoom: Math.max(rf.getZoom(), 0.8), duration: 300 })
        }}
      >
        <span className="flex items-center justify-between gap-2 border-b border-current px-3 py-[3px] text-[10px] tracking-wider uppercase">
          <span className="font-bold">{node.kind === 'incident' ? 'Incident' : node.kind === 'escalation' ? 'Escalated' : node.kind}</span>
          <span className="opacity-70">EX-{node.id.slice(1).padStart(2, '0')}</span>
        </span>
        <span className="flex-1 px-3 py-2">{node.text}</span>
        <span className="flex items-center justify-between gap-2 border-t border-current px-3 py-[5px] text-[10px] tracking-wider uppercase">
          <span className="font-bold">{footer}</span>
          <span className="opacity-70">EV: {EV_LABEL[node.evidence]}</span>
        </span>
      </button>
      <Handle type="source" position={Position.Right} isConnectable={false} />
    </motion.div>
  )
}

