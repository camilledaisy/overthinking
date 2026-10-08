import { useState } from 'react'
import type { Evidence, Sim } from '../types'
import { MAX_DEPTH, MAX_NODES, canExpand, stats } from '../engine/engine'
import { useSim } from '../state'
import { Disclaimer, EV_LABEL, KindTag } from './ui'

const TABS = ['Stats', 'File', 'Evidence', 'Log'] as const
type Tab = (typeof TABS)[number]

function Meter({ label, value, max, unit, hot }: { label: string; value: number; max: number; unit?: string; hot?: boolean }) {
  const cells = 20
  const on = Math.min(cells, Math.ceil((value / max) * cells))
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 text-[12px]">
        <span>{label}</span>
        <b className={hot ? 'text-warn' : ''}>{value}{unit && <span className="font-normal"> {unit}</span>}</b>
      </div>
      <div className="mt-1 flex gap-[2px]" aria-hidden>
        {Array.from({ length: cells }, (_, i) => (
          <i key={i} className={`h-2.5 flex-1 border border-ink ${i < on ? (hot ? 'bg-warn' : 'bg-ink') : ''}`} />
        ))}
      </div>
    </div>
  )
}

function StatsPanel({ sim }: { sim: Sim }) {
  const s = stats(sim)
  return (
    <div className="space-y-3 p-3">
      <Meter label="Unsupported assumptions" value={s.unsupported} max={40} hot />
      <Meter label="Mental gymnastics" value={s.gymnastics} max={400} unit="MG" />
      <Meter label="Distance from incident" value={Number(s.km.toFixed(1))} max={60} unit="km" />
      <Meter label="Plausibility (longest chain)" value={Number((s.plausibility * 100).toFixed(2))} max={100} unit="%" />
      <Meter label="Alternate timelines opened" value={s.timelines} max={MAX_NODES} />
      <div className="flex items-center justify-between gap-2 border-t-2 border-ink pt-2 text-[12px]">
        <span>Classification</span>
        <span className={`tag font-bold ${s.gymnastics >= 40 ? 'text-warn' : ''}`}>{s.grade}</span>
      </div>
      <p className="text-[11px] text-grey">
        Capacity {sim.nodes.length}/{MAX_NODES} nodes · depth {s.maxDepth}/{MAX_DEPTH}
      </p>
      <Disclaimer />
    </div>
  )
}

function FilePanel({ sim }: { sim: Sim }) {
  const { dispatch } = useSim()
  const n = sim.nodes.find((x) => x.id === sim.selected)
  if (!n) return <p className="p-3 text-[12px] text-grey">No exhibit selected. Select a thought to open its file.</p>
  return (
    <div className="space-y-3 p-3 text-[13px]">
      <div className="flex flex-wrap items-center gap-2"><KindTag kind={n.kind} /><span className="text-[11px] text-grey">EX-{n.id.slice(1).padStart(2, '0')} · depth {n.depth}</span></div>
      <p>{n.text}</p>
      <dl className="space-y-2 text-[12px]">
        <div><dt className="font-bold">Evidence — {EV_LABEL[n.evidence]}</dt><dd className="text-grey">{n.evNote}</dd></div>
        {n.alt && <div><dt className="font-bold">Alternate timeline</dt><dd className="text-grey">{n.alt}</dd></div>}
      </dl>
      {canExpand(sim, n) && !sim.reality && <button className="btn" onClick={() => dispatch({ t: 'expand', id: n.id })}>[+] Analyse further</button>}
      <p className="text-[11px] text-grey">Escalate to Management attaches its branch to the selected exhibit.</p>
    </div>
  )
}

const FILTERS: (Evidence | 'all')[] = ['all', 'none', 'circumstantial', 'supported']

function EvidencePanel({ sim, onFocus }: { sim: Sim; onFocus: (id: string) => void }) {
  const [f, setF] = useState<Evidence | 'all'>('all')
  const s = stats(sim)
  const total = sim.nodes.length
  const rows = sim.nodes.filter((n) => n.parent && (f === 'all' || n.evidence === f))
  const verdict =
    s.unsupported === 0 ? 'The evidence department has nothing to report, which it enjoys.'
    : s.supported / total > 0.3 ? 'Evidence is thin but present. The Department is cautiously bored.'
    : 'The evidence department has declined to comment.'
  const seg = (n: number, cls: string) => n > 0 && <i className={`h-full ${cls}`} style={{ width: `${(n / total) * 100}%` }} />
  return (
    <div className="p-3">
      <p className="text-[12px]">{verdict}</p>
      <div className="mt-2 flex h-3 border-2 border-ink" aria-hidden>
        {seg(s.supported, 'bg-ink')}
        {seg(s.circumstantial, 'bg-grey')}
        {seg(s.unsupported, 'bg-warn')}
      </div>
      <p className="mt-1 text-[11px] text-grey">
        <b className="text-ink">{s.supported}</b> happened · <b className="text-ink">{s.circumstantial}</b> plausible · <b className="text-warn">{s.unsupported}</b> made up
      </p>
      <div className="mt-3 flex flex-wrap gap-1" role="group" aria-label="Filter evidence">
        {FILTERS.map((x) => (
          <button key={x} className="btn !min-h-7 !px-2 !py-0 !text-[10px]" aria-pressed={f === x} onClick={() => setF(x)}>
            {x === 'all' ? 'All' : EV_LABEL[x]}
          </button>
        ))}
      </div>
      <ul className="mt-2 divide-y divide-grey/40 border-y border-grey/40">
        {rows.length === 0 && <li className="py-2 text-[12px] text-grey">Nothing filed here yet. Click a thought on the map first.</li>}
        {rows.map((n) => {
          const open = n.id === sim.selected
          return (
            <li key={n.id}>
              <button className={`block w-full px-1 py-1.5 text-left text-[12px] ${open ? 'bg-paper-2' : 'hover:bg-paper-2'}`} aria-expanded={open} onClick={() => onFocus(n.id)}>
                <span className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 shrink-0 border border-ink ${n.evidence === 'none' ? 'bg-warn' : n.evidence === 'circumstantial' ? 'bg-grey' : 'bg-ink'}`} aria-hidden />
                  <span className={open ? 'font-bold' : 'truncate'}>{n.text}</span>
                </span>
                {open && (
                  <span className="mt-1 block pl-[18px] text-grey">
                    <b className="text-ink">{EV_LABEL[n.evidence]}.</b> {n.evNote}
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function LogPanel({ sim }: { sim: Sim }) {
  return (
    <ol className="space-y-1 p-3 text-[12px]">
      {[...sim.log].reverse().map((m, i) => (
        <li key={sim.log.length - i} className={i === 0 ? 'font-bold' : 'text-grey'}>
          {String(sim.log.length - i).padStart(3, '0')}&gt; {m}
        </li>
      ))}
    </ol>
  )
}

export default function SidePanel({ sim, onFocus }: { sim: Sim; onFocus: (id: string) => void }) {
  const [tab, setTab] = useState<Tab>('Stats')
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div role="tablist" aria-label="Case panels" className="flex border-b-2 border-ink">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            id={`tab-${t}`}
            aria-selected={tab === t}
            aria-controls="side-panel"
            onClick={() => setTab(t)}
            className={`flex-1 border-r border-ink px-1 py-2 text-[11px] tracking-wider uppercase last:border-r-0 ${tab === t ? 'bg-ink text-paper' : 'bg-paper-2 hover:bg-paper'}`}
          >
            {t}
          </button>
        ))}
      </div>
      <div id="side-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="min-h-0 flex-1 overflow-y-auto">
        {tab === 'Stats' && <StatsPanel sim={sim} />}
        {tab === 'File' && <FilePanel sim={sim} />}
        {tab === 'Evidence' && <EvidencePanel sim={sim} onFocus={onFocus} />}
        {tab === 'Log' && <LogPanel sim={sim} />}
      </div>
    </div>
  )
}
