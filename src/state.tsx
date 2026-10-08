import { createContext, useContext, useEffect, useReducer, type Dispatch, type ReactNode } from 'react'
import type { AppState, Sim } from './types'
import { escalate, expand, setReality, startSim } from './engine/engine'
import { NARRATOR } from './engine/templates'

const KEY = 'pos.v1'
const HISTORY_LIMIT = 60

export type Action =
  | { t: 'start'; scenarioId: string | null; text?: string }
  | { t: 'expand'; id: string }
  | { t: 'escalate' }
  | { t: 'select'; id: string }
  | { t: 'reality'; on: boolean }
  | { t: 'undo' }
  | { t: 'restart' }
  | { t: 'home' }
  | { t: 'resume' }
  | { t: 'dismiss' }

function load(): AppState {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) ?? '')
    if (s && Array.isArray(s.sim?.nodes) && Array.isArray(s.past)) return s
  } catch { /* corrupt or unavailable storage: start fresh */ }
  return { view: 'home', sim: null, past: [] }
}

/** Run a simulation change; record history only if something actually changed. */
function commit(st: AppState, next: Sim): AppState {
  if (!st.sim || next === st.sim) return st
  return { ...st, sim: next, past: [...st.past, st.sim].slice(-HISTORY_LIMIT) }
}

function reduce(st: AppState, a: Action): AppState {
  const sim = st.sim
  switch (a.t) {
    case 'start':
      return { view: 'sim', sim: startSim(a.scenarioId, a.text), past: [] }
    case 'resume':
      return sim ? { ...st, view: 'sim' } : st
    case 'home':
      return { ...st, view: 'home' }
    case 'restart':
      return sim ? { view: 'sim', sim: { ...startSim(sim.scenarioId, sim.incident), log: [NARRATOR.restart] }, past: [] } : st
    case 'expand':
      return sim ? commit(st, expand(sim, a.id)) : st
    case 'escalate':
      return sim ? commit(st, escalate(sim)) : st
    case 'reality':
      return sim ? commit(st, setReality(sim, a.on)) : st
    case 'select':
      return sim ? { ...st, sim: { ...sim, selected: a.id, fresh: [] } } : st
    case 'dismiss':
      return sim ? { ...st, sim: { ...sim, popup: null } } : st
    case 'undo': {
      if (!st.past.length) return st
      const prev = st.past[st.past.length - 1]
      return { ...st, sim: { ...prev, popup: null, fresh: [], log: [...prev.log, NARRATOR.undo] }, past: st.past.slice(0, -1) }
    }
  }
}

const Ctx = createContext<{ state: AppState; dispatch: Dispatch<Action> } | null>(null)

export function SimProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reduce, undefined, load)
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* storage full or blocked */ }
  }, [state])
  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>
}

export function useSim() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useSim outside SimProvider')
  return c
}
