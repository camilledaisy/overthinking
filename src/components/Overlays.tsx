import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { Sim } from '../types'
import { groundedText, stats } from '../engine/engine'
import { useSim } from '../state'
import { renderReport, reportText } from '../lib/report'
import { Disclaimer } from './ui'

export function PopupWindow({ sim, onReport }: { sim: Sim; onReport: () => void }) {
  const { dispatch } = useSim()
  const p = sim.popup
  useEffect(() => {
    if (!p) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && dispatch({ t: 'dismiss' })
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [p, dispatch])
  return (
    <AnimatePresence>
      {p && (
        <motion.div
          key={p.id}
          role="alert"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="win fixed right-3 bottom-3 left-3 z-50 sm:left-auto sm:w-[22rem]"
        >
          <div className="win-title"><span>Memo — {p.title}</span><span aria-hidden>▪</span></div>
          <div className="flex gap-3 p-3">
            <span aria-hidden className="grid h-9 w-9 shrink-0 place-items-center border-2 border-warn text-xl font-bold text-warn">!</span>
            <p className="text-[13px]">{p.body}</p>
          </div>
          <div className="flex justify-end gap-2 px-3 pb-3">
            {p.report && <button className="btn btn-red" onClick={() => { dispatch({ t: 'dismiss' }); onReport() }}>File report</button>}
            <button className="btn" onClick={() => dispatch({ t: 'dismiss' })}>OK</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function RealityPanel({ sim, onReport }: { sim: Sim; onReport: () => void }) {
  const { dispatch } = useSim()
  const s = stats(sim)
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-xl space-y-4 p-4 sm:p-8"
    >
      <span className="stamp">Returned to reality</span>
      <div className="inset p-3">
        <p className="text-[11px] tracking-widest text-grey uppercase">Original incident · {sim.caseNo}</p>
        <p className="mt-1">{sim.incident}</p>
      </div>
      <div>
        <p className="text-[11px] tracking-widest text-grey uppercase">Ordinary interpretation</p>
        <p className="mt-1 text-lg leading-snug font-bold">{groundedText(sim)}</p>
      </div>
      <table className="w-full text-[12px]">
        <tbody>
          {[
            ['Interpretations generated', String(sim.nodes.length - 1)],
            ['Interpretations supported by evidence', s.supported > 1 ? String(s.supported - 1) : '0'],
            ['Likelihood the boring explanation was correct', '“Very”'],
            ['Distance travelled in vain', `${s.km.toFixed(1)} km`],
          ].map(([k, v]) => (
            <tr key={k} className="border-b border-dashed border-grey"><td className="py-1">{k}</td><td className="py-1 text-right font-bold">{v}</td></tr>
          ))}
        </tbody>
      </table>
      <div className="flex flex-wrap gap-2">
        <button className="btn btn-red" onClick={onReport}>File case report</button>
        <button className="btn" onClick={() => dispatch({ t: 'reality', on: false })}>Resume investigation</button>
        <button className="btn" onClick={() => dispatch({ t: 'home' })}>New case</button>
      </div>
      <Disclaimer />
    </motion.div>
  )
}

export function ReportModal({ sim, open, onClose }: { sim: Sim; open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const [url, setUrl] = useState<string | null>(null)
  const [zoom, setZoom] = useState<number | 'actual'>(1) // 1 = fit to dialog width
  const name = `case-report-${sim.caseNo}`

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
    if (!open) return
    let live = true
    setUrl(null)
    setZoom(1)
    renderReport(sim).then((c) => live && setUrl(c.toDataURL('image/png')))
    return () => { live = false }
  }, [open, sim])

  const save = (href: string, file: string) => {
    const a = document.createElement('a')
    a.href = href
    a.download = file
    a.click()
  }
  const saveText = () => {
    const href = URL.createObjectURL(new Blob([reportText(sim)], { type: 'text/plain' }))
    save(href, `${name}.txt`)
    URL.revokeObjectURL(href)
  }
  const share = async () => {
    if (!url) return
    const file = new File([await (await fetch(url)).blob()], `${name}.png`, { type: 'image/png' })
    if (navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file], title: `Case ${sim.caseNo}` }).catch(() => {})
    else save(url, `${name}.png`)
  }

  return (
    <dialog ref={ref} onClose={onClose} onClick={(e) => e.target === ref.current && onClose()} className="m-auto max-h-[94vh] w-[min(96vw,60rem)] bg-transparent p-0 backdrop:bg-ink/60">
      <div className="win">
        <div className="win-title"><span>Case report — {sim.caseNo}</span><span aria-hidden>▪</span></div>
        <div className="flex flex-wrap items-center gap-1 border-b-2 border-ink p-2" role="group" aria-label="Report zoom">
          <button className="btn !px-3" aria-label="Zoom out" disabled={!url || zoom === 'actual' || zoom <= 1} onClick={() => setZoom((z) => Math.max(1, (z as number) - 0.5))}>−</button>
          <button className="btn !px-3" aria-label="Zoom in" disabled={!url || (zoom !== 'actual' && zoom >= 6)} onClick={() => setZoom((z) => (z === 'actual' ? 'actual' : Math.min(6, z + 0.5)))}>+</button>
          <button className="btn" disabled={!url} aria-pressed={zoom === 1} onClick={() => setZoom(1)}>Fit</button>
          <button className="btn" disabled={!url} aria-pressed={zoom === 'actual'} onClick={() => setZoom('actual')}>Actual size</button>
          <span className="ml-1 text-[11px] text-grey">{zoom === 'actual' ? 'Full resolution' : `${Math.round(zoom * 100)}%`} · scroll to pan</span>
        </div>
        <div className="max-h-[60vh] overflow-auto p-3">
          {url ? (
            <img
              src={url}
              alt={`Thought spiral for case ${sim.caseNo}: ${sim.nodes.length} nodes`}
              style={zoom === 'actual' ? { maxWidth: 'none' } : { width: `${zoom * 100}%`, maxWidth: 'none' }}
              className="h-auto border-2 border-ink"
            />
          ) : (
            <p className="p-8 text-center cursor">Typing up the report</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2 border-t-2 border-ink p-3">
          <button className="btn btn-red" disabled={!url} onClick={() => url && save(url, `${name}.png`)}>Download image (PNG)</button>
          <button className="btn" onClick={saveText}>Download report (TXT)</button>
          {typeof navigator.share === 'function' && <button className="btn" disabled={!url} onClick={share}>Share</button>}
          <button className="btn ml-auto" onClick={onClose}>Close</button>
        </div>
        <Disclaimer className="px-3 pb-3" />
      </div>
    </dialog>
  )
}
