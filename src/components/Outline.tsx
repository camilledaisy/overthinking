import { useEffect, useRef } from 'react'
import type { Sim, TNode } from '../types'
import { useSim } from '../state'
import { canExpand } from '../engine/engine'
import { EV_LABEL, KindTag } from './ui'

/** Linear, readable alternative to the graph: the same thoughts as an indented list. */
export default function Outline({ sim }: { sim: Sim }) {
  const { dispatch } = useSim()
  const kids = new Map<string | null, TNode[]>()
  for (const n of sim.nodes) kids.set(n.parent, [...(kids.get(n.parent) ?? []), n])
  const ordered: TNode[] = []
  const walk = (n: TNode) => { ordered.push(n); (kids.get(n.id) ?? []).forEach(walk) }
  walk(sim.nodes[0])

  const sel = useRef<HTMLLIElement>(null)
  useEffect(() => {
    sel.current?.scrollIntoView({ block: 'nearest', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }, [sim.selected, sim.nodes.length])

  return (
    <ol className="space-y-2 p-3" aria-label="Thought outline">
      {ordered.map((n) => {
        const isSel = n.id === sim.selected
        const can = canExpand(sim, n)
        const hot = n.kind === 'absurd' || n.kind === 'escalation'
        return (
          <li
            key={n.id}
            ref={isSel ? sel : undefined}
            style={{ marginLeft: Math.min(n.depth, 5) * 14 }}
            className={`border-l-4 pl-2 ${hot ? 'border-warn' : 'border-ink'}`}
          >
            <div className={`inset p-2 ${isSel ? 'outline-2 outline-ink' : ''} ${n.kind === 'escalation' ? 'bg-warn/10' : ''}`}>
              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                <KindTag kind={n.kind} />
                <span className="text-grey">EX-{n.id.slice(1).padStart(2, '0')} · {EV_LABEL[n.evidence]}</span>
              </div>
              <p className="mt-1 text-[13px]">{n.text}</p>
              {isSel && n.kind !== 'incident' && (
                <p className="mt-2 border-t border-dashed border-grey pt-1 text-[12px] text-grey">
                  <b>Alternate timeline.</b> {n.alt}
                </p>
              )}
              <div className="mt-2 flex gap-2">
                {can ? (
                  <button className="btn" onClick={() => dispatch({ t: 'expand', id: n.id })}>[+] Analyse further</button>
                ) : (
                  <button className="btn" onClick={() => dispatch({ t: 'select', id: n.id })} aria-pressed={isSel}>
                    {n.expanded ? 'Analysed — inspect' : 'Limit reached — inspect'}
                  </button>
                )}
              </div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
