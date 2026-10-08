import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ReactFlowProvider } from '@xyflow/react'
import type { Sim } from '../types'
import { MAX_NODES } from '../engine/engine'
import { useSim } from '../state'
import ThoughtMap from './ThoughtMap'
import Outline from './Outline'
import SidePanel from './Panels'
import { PopupWindow, RealityPanel, ReportModal } from './Overlays'
import { Window } from './ui'

const wide = () => window.matchMedia('(min-width: 900px)').matches

function Narrator({ sim }: { sim: Sim }) {
  const msg = sim.log[sim.log.length - 1]
  return (
    <div className="win flex items-start gap-2 px-3 py-2 text-[13px]" role="status" aria-live="polite">
      <b className="shrink-0 text-warn">NARRATOR&gt;</b>
      <AnimatePresence mode="wait">
        <motion.span key={sim.log.length} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="cursor">
          {msg}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

export default function SimScreen({ sim }: { sim: Sim }) {
  const { state, dispatch } = useSim()
  const [mode, setMode] = useState<'map' | 'outline'>(() => (wide() ? 'map' : 'outline'))
  const [focus, setFocus] = useState({ id: 'n0', n: 0 })
  const [report, setReport] = useState(false)
  const full = sim.nodes.length + 1 > MAX_NODES
  const canUndo = state.past.length > 0

  const focusNode = (id: string) => {
    dispatch({ t: 'select', id })
    setFocus((f) => ({ id, n: f.n + 1 }))
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (report || /input|textarea|select/i.test((e.target as HTMLElement).tagName)) return
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); dispatch({ t: 'undo' }); return }
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const k = e.key.toLowerCase()
      if (k === 'u') dispatch({ t: 'undo' })
      else if (k === 'e') dispatch({ t: 'escalate' })
      else if (k === 'r') dispatch({ t: 'reality', on: !sim.reality })
      else if (k === 'f') setReport(true)
      else if (k === 'm') setMode((m) => (m === 'map' ? 'outline' : 'map'))
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [dispatch, sim.reality, report])

  return (
    <ReactFlowProvider>
      <div className="mx-auto flex min-h-full max-w-[1600px] flex-col gap-3 p-2 sm:p-3 lg:h-full">
        <header className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-[10px] tracking-[0.2em] text-grey uppercase">Institute of Unnecessary Analysis</p>
            <h1 className="text-base leading-tight font-bold sm:text-lg">Professional Overthinker Simulator™</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="tag">Case {sim.caseNo}</span>
            <span className="tag text-warn">Fictional</span>
            <button className="btn" onClick={() => dispatch({ t: 'home' })}>Home</button>
          </div>
        </header>

        <Narrator sim={sim} />

        <div className="flex flex-wrap gap-2" role="toolbar" aria-label="Case controls">
          <button className="btn" disabled={!canUndo} onClick={() => dispatch({ t: 'undo' })} title="Undo (U)">↶ Undo</button>
          <button className="btn" onClick={() => dispatch({ t: 'restart' })}>⟲ Restart</button>
          <button className="btn btn-red" disabled={sim.reality || full} onClick={() => dispatch({ t: 'escalate' })} title="Escalate (E)">▲ Escalate to Management</button>
          <button className="btn" onClick={() => dispatch({ t: 'reality', on: !sim.reality })} aria-pressed={sim.reality} title="Return to Reality (R)">
            {sim.reality ? '◀ Resume investigation' : '◉ Return to Reality'}
          </button>
          <button className="btn" onClick={() => setReport(true)} title="File report (F)">⎙ File case report</button>
        </div>

        <div className="grid gap-3 lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(0,1fr)_380px]">
          <Window
            title={sim.reality ? 'Findings' : mode === 'map' ? 'Thought map' : 'Thought outline'}
            right={
              !sim.reality && (
                <button className="underline underline-offset-2" onClick={() => setMode(mode === 'map' ? 'outline' : 'map')} title="Toggle view (M)">
                  Switch to {mode === 'map' ? 'outline' : 'map'}
                </button>
              )
            }
            className="h-[70vh] min-h-[420px] lg:h-auto lg:min-h-0"
          >
            <div className="relative min-h-0 flex-1 overflow-auto">
              {sim.reality ? <RealityPanel sim={sim} onReport={() => setReport(true)} /> : mode === 'map' ? <ThoughtMap sim={sim} focus={focus} /> : <Outline sim={sim} />}
            </div>
            <p className="border-t-2 border-ink px-2 py-1 text-[10px] text-grey">
              Click a thought to expand it · drag to pan · scroll or pinch to zoom · keys: U undo, E escalate, R reality, F report, M view, 0 reset view
            </p>
          </Window>
          <Window title="Case panel" className="max-h-[80vh] min-h-[320px] lg:max-h-none lg:min-h-0">
            <SidePanel sim={sim} onFocus={focusNode} />
          </Window>
        </div>
      </div>
      <PopupWindow sim={sim} onReport={() => setReport(true)} />
      <ReportModal sim={sim} open={report} onClose={() => setReport(false)} />
    </ReactFlowProvider>
  )
}
