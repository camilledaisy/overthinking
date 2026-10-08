import { useState } from 'react'
import { motion } from 'motion/react'
import { SCENARIOS } from '../engine/scenarios'
import { MAX_CUSTOM_LENGTH } from '../engine/engine'
import { useSim } from '../state'
import { Disclaimer, Window } from './ui'

export default function Home() {
  const { state, dispatch } = useSim()
  const [choice, setChoice] = useState<string>(SCENARIOS[0].id)
  const [custom, setCustom] = useState('')
  const isCustom = choice === 'custom'
  const ready = !isCustom || custom.trim().length >= 8

  const open = () =>
    ready && dispatch({ t: 'start', scenarioId: isCustom ? null : choice, text: custom })

  return (
    <main className="mx-auto flex min-h-full max-w-3xl flex-col gap-5 px-4 py-6 sm:py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Window title="Institute of Unnecessary Analysis — Intake Terminal 04" right="Form UA-27/B (Rev. 1998)">
          <div className="space-y-4 p-4 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] tracking-[0.2em] text-grey uppercase">Dept. of Interpretive Overreach</p>
                <h1 className="mt-1 text-2xl leading-tight font-bold tracking-tight sm:text-3xl">
                  Professional Overthinker Simulator<span className="align-super text-sm">™</span>
                </h1>
              </div>
              <span className="stamp hidden shrink-0 text-xs sm:inline-block">Not a diagnosis</span>
            </div>
            <p>
              Welcome. The Institute of Unnecessary Analysis exists to take small, finished events and make them
              larger, unfinished and somebody else's fault.
            </p>
            <p>
              Submit one mundane incident. Our system will open a case file and generate interpretations: reasonable,
              speculative, and increasingly absurd. You will be asked to click on them. You are not required to
              believe them. The Evidence Department will keep a tally.
            </p>
            <Disclaimer className="inset p-2" />
          </div>
        </Window>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <Window title="Step 1 of 1 — Select Incident" right="Required">
          <fieldset className="p-3 sm:p-4">
            <legend className="sr-only">Choose an incident</legend>
            <ul className="space-y-2">
              {SCENARIOS.map((s, i) => (
                <li key={s.id}>
                  <label
                    className={`inset flex cursor-pointer items-start gap-3 p-3 ${choice === s.id ? 'outline-2 outline-ink' : ''}`}
                  >
                    <input type="radio" name="incident" className="mt-1.5 accent-[#25272b]" checked={choice === s.id} onChange={() => setChoice(s.id)} />
                    <span>
                      <span className="block text-[11px] tracking-widest text-grey uppercase">
                        Exhibit {String(i + 1).padStart(2, '0')} · {s.teaser}
                      </span>
                      <span className="block font-bold">{s.label}</span>
                      <span className="block text-[13px] text-grey">{s.incident}</span>
                    </span>
                  </label>
                </li>
              ))}
              <li>
                <label className={`inset flex cursor-pointer items-start gap-3 p-3 ${isCustom ? 'outline-2 outline-ink' : ''}`}>
                  <input type="radio" name="incident" className="mt-1.5 accent-[#25272b]" checked={isCustom} onChange={() => setChoice('custom')} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11px] tracking-widest text-grey uppercase">Exhibit 06 · Self-reported</span>
                    <span className="block font-bold">Submit your own incident</span>
                    {isCustom && (
                      <>
                        <textarea
                          autoFocus
                          value={custom}
                          maxLength={MAX_CUSTOM_LENGTH}
                          onChange={(e) => setCustom(e.target.value)}
                          placeholder="e.g. My colleague replied “Noted.” to my three-paragraph email."
                          className="mt-2 h-20 w-full resize-none border-2 border-ink bg-paper p-2 text-[13px] placeholder:text-grey/70"
                          aria-describedby="custom-hint"
                        />
                        <span id="custom-hint" className="block text-right text-[11px] text-grey">
                          {custom.length}/{MAX_CUSTOM_LENGTH} · minimum 8 characters · phrase it as something that happened
                        </span>
                      </>
                    )}
                  </span>
                </label>
              </li>
            </ul>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button className="btn btn-red" onClick={open} disabled={!ready}>
                ▶ Open case file
              </button>
              {state.sim && (
                <button className="btn" onClick={() => dispatch({ t: 'resume' })}>
                  Resume case {state.sim.caseNo}
                </button>
              )}
            </div>
          </fieldset>
        </Window>
      </motion.div>

      <footer className="pb-4 text-center text-[11px] text-grey">
        The Institute is fictional. Open cases: 4,112 (unverified). Resolved cases: 0 (see above).
      </footer>
    </main>
  )
}
