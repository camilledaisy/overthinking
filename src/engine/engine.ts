import type { Evidence, Kind, Popup, Scenario, Seed, Sim, TNode, Vars } from '../types'
import { SCENARIOS } from './scenarios'
import {
  ALT_TIMELINES,
  DEFAULT_VARS,
  ESCALATION_LADDER,
  EV_NOTES,
  FLAVOURS,
  NARRATOR,
  POPUPS,
  TIERS,
  TIREDNESS_CONSIDERED,
  tierFor,
} from './templates'

export const MAX_NODES = 46
export const MAX_DEPTH = 6
export const MAX_CUSTOM_LENGTH = 160
const KINDS: Kind[] = ['reasonable', 'speculative', 'absurd']
const LOG_LIMIT = 60

export const scenarioById = (id: string | null): Scenario | undefined => SCENARIOS.find((s) => s.id === id)

export function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return h >>> 0
}
const pick = <T,>(a: T[], seed: number): T => a[seed % a.length]

function fill(tpl: string, v: Vars, n: number): string {
  const out = tpl
    .replace(/\{THING\}/g, v.thing.replace(/^the /, '').toUpperCase())
    .replace(/\{who\}/g, v.who)
    .replace(/\{thing\}/g, v.thing)
    .replace(/\{place\}/g, v.place)
    .replace(/\{n\}/g, String(n))
  // capitalise sentence starts ("the incident was..." at the front of a template)
  return out.replace(/(^|[.!?]["”]?\s+)([a-z])/g, (_, a: string, b: string) => a + b.toUpperCase())
}

const minutes = (sim: Sim) => 4 + sim.nodes.length

// ---- construction ----------------------------------------------------------

export function startSim(scenarioId: string | null, custom = ''): Sim {
  const sc = scenarioById(scenarioId)
  const incident = sc ? sc.incident : custom.trim().slice(0, MAX_CUSTOM_LENGTH)
  const vars = sc ? sc.vars : (FLAVOURS.find((f) => f.test.test(incident))?.vars ?? DEFAULT_VARS)
  const caseNo = `UA-${(hash(incident) % 9000) + 1000}-${String.fromCharCode(65 + (hash(incident + 'x') % 26))}`
  const root: TNode = {
    id: 'n0',
    parent: null,
    kind: 'incident',
    depth: 0,
    text: incident,
    evidence: 'supported',
    evNote: 'Verified. You were there. This is the only item on file with that property.',
    alt: '',
    expanded: false,
    kids: sc?.kids,
  }
  return {
    caseNo,
    scenarioId: sc?.id ?? null,
    incident,
    vars,
    nodes: [root],
    seq: 1,
    log: [NARRATOR.start],
    fired: [],
    esc: 0,
    reality: false,
    selected: 'n0',
    fresh: [],
    popup: null,
  }
}

const EVIDENCE_FOR: Record<Kind, Evidence> = {
  incident: 'supported',
  reasonable: 'circumstantial',
  speculative: 'none',
  absurd: 'none',
  escalation: 'none',
}

function makeChild(sim: Sim, parent: TNode, kind: Kind, seed: Seed | undefined, id: string): TNode {
  const depth = parent.depth + 1
  const n = minutes(sim)
  const used = new Set(sim.nodes.map((x) => x.text))
  let text = seed?.t
  if (!text) {
    const own = tierFor(depth)
    const order = [0, 1, 2, 3].sort((a, b) => Math.abs(a - own) - Math.abs(b - own) || a - b)
    const pool = order.flatMap((t) => TIERS[t][KINDS.indexOf(kind)])
    const start = hash(id + sim.caseNo)
    for (let i = 0; i < pool.length; i++) {
      text = fill(pool[(start + i) % pool.length], sim.vars, n)
      if (!used.has(text)) break
    }
  }
  const noteKind = kind === 'incident' ? 'reasonable' : kind
  return {
    id,
    parent: parent.id,
    kind,
    depth,
    text: text!,
    evidence: EVIDENCE_FOR[kind],
    evNote: seed?.ev ?? pick(EV_NOTES[noteKind], hash(id + 'ev')),
    alt: seed?.alt ?? fill(pick(ALT_TIMELINES, hash(id + sim.caseNo + 'alt')), sim.vars, n),
    expanded: false,
    kids: seed?.k,
  }
}

// ---- narrator --------------------------------------------------------------

export function stats(sim: Sim) {
  const W: Record<Kind, number> = { incident: 0, reasonable: 1, speculative: 3, absurd: 7, escalation: 12 }
  const P: Record<Kind, number> = { incident: 1, reasonable: 0.8, speculative: 0.5, absurd: 0.15, escalation: 0.05 }
  const chain = new Map<string, { km: number; p: number }>()
  let km = 0
  let plausibility = 1
  let maxDepth = 0
  let gymnastics = 0
  let unsupported = 0
  let circumstantial = 0
  for (const nd of sim.nodes) {
    const up = nd.parent ? chain.get(nd.parent)! : { km: 0, p: 1 }
    const c = { km: up.km + W[nd.kind] * 0.9, p: up.p * P[nd.kind] }
    chain.set(nd.id, c)
    if (c.km > km) {
      km = c.km
      plausibility = c.p
    }
    maxDepth = Math.max(maxDepth, nd.depth)
    gymnastics += nd.depth * W[nd.kind]
    if (nd.evidence === 'none') unsupported++
    if (nd.evidence === 'circumstantial') circumstantial++
  }
  const grade =
    gymnastics < 10 ? 'ROUTINE CONCERN'
    : gymnastics < 40 ? 'MODERATE SPIRAL'
    : gymnastics < 100 ? 'REGIONAL SPIRAL'
    : gymnastics < 200 ? 'JURISDICTIONAL MATTER'
    : 'BEYOND INSTITUTE AUTHORITY'
  return {
    unsupported,
    circumstantial,
    supported: sim.nodes.length - unsupported - circumstantial,
    gymnastics,
    km,
    plausibility,
    maxDepth,
    timelines: sim.nodes.length - 1,
    grade,
  }
}

function say(sim: Sim, msg: string): Sim {
  return { ...sim, log: [...sim.log, msg].slice(-LOG_LIMIT) }
}

function narrate(sim: Sim, deepest: number): string {
  const seed = hash(sim.caseNo + sim.seq)
  const s = stats(sim)
  const pool = deepest >= 4 && seed % 2 ? NARRATOR.deep : NARRATOR.expand
  return pick(pool, seed >>> 3)
    .replace('{m}', String(minutes(sim)))
    .replace('{km}', s.km.toFixed(1))
    .replace('{c}', pick(TIREDNESS_CONSIDERED, seed >>> 5))
}

function maybePopup(sim: Sim): Sim {
  const s = stats(sim)
  const checks: [string, boolean, boolean?][] = [
    ['full', sim.nodes.length + 3 > MAX_NODES, true],
    ['management', sim.esc >= 1],
    ['compliance', sim.nodes.some((x) => x.kind === 'absurd' && x.expanded)],
    ['surveyors', s.maxDepth >= 4],
    ['audit', sim.nodes.length >= 10],
    ['evidence', sim.nodes.length >= 25],
    ['facilities', sim.nodes.length >= 40],
    ['records', sim.nodes.length >= 4],
  ]
  const hit = checks.find(([id, ok]) => ok && !sim.fired.includes(id))
  if (!hit) return sim
  const p = POPUPS.find((x) => x.id === hit[0])!
  const popup: Popup = { ...p, report: hit[2] }
  return { ...sim, popup, fired: [...sim.fired, p.id] }
}

// ---- actions ---------------------------------------------------------------

export function canExpand(sim: Sim, nd: TNode) {
  return !nd.expanded && nd.depth < MAX_DEPTH && sim.nodes.length + 3 <= MAX_NODES
}

export function expand(sim: Sim, id: string): Sim {
  const nd = sim.nodes.find((x) => x.id === id)
  if (!nd || sim.reality) return sim
  const selected = { ...sim, selected: id, fresh: [] as string[] }
  if (nd.expanded) return say(selected, NARRATOR.revisit)
  if (nd.depth >= MAX_DEPTH) return say(selected, NARRATOR.fullDepth)
  if (sim.nodes.length + 3 > MAX_NODES) return say(selected, NARRATOR.fullNodes)

  const kids = KINDS.map((k, i) => makeChild(sim, nd, k, nd.kids?.[i], `n${sim.seq + i}`))
  const next: Sim = {
    ...selected,
    nodes: [...sim.nodes.map((x) => (x.id === id ? { ...x, expanded: true } : x)), ...kids],
    seq: sim.seq + 3,
    fresh: kids.map((k) => k.id),
  }
  return maybePopup(say(next, narrate(next, nd.depth + 1)))
}

export function escalate(sim: Sim): Sim {
  if (sim.reality) return sim
  if (sim.nodes.length + 1 > MAX_NODES) return say(sim, NARRATOR.fullNodes)
  const sel = sim.nodes.find((x) => x.id === sim.selected)
  const open = (x: TNode) => x.depth < MAX_DEPTH
  const parent = sel && open(sel) ? sel : [...sim.nodes].reverse().find(open)!
  const sc = scenarioById(sim.scenarioId)
  const lines = [...(sc?.esc ?? []), ...ESCALATION_LADDER]
  const raw = lines[sim.esc % lines.length]
  const id = `n${sim.seq}`
  const child: TNode = {
    id,
    parent: parent.id,
    kind: 'escalation',
    depth: parent.depth + 1,
    text: fill(raw, sim.vars, minutes(sim)),
    evidence: 'none',
    evNote: pick(EV_NOTES.escalation, hash(id)),
    alt: fill(pick(ALT_TIMELINES, hash(id + sim.caseNo)), sim.vars, minutes(sim)),
    expanded: false,
  }
  const next: Sim = {
    ...sim,
    nodes: [...sim.nodes.map((x) => (x.id === parent.id ? { ...x, expanded: true } : x)), child],
    seq: sim.seq + 1,
    esc: sim.esc + 1,
    selected: id,
    fresh: [id],
  }
  return maybePopup(say(next, pick(NARRATOR.escalate, hash(sim.caseNo + sim.esc))))
}

export const setReality = (sim: Sim, on: boolean): Sim =>
  say({ ...sim, reality: on, fresh: [] }, on ? NARRATOR.reality : NARRATOR.resume)

export const groundedText = (sim: Sim) =>
  scenarioById(sim.scenarioId)?.grounded ??
  'The most likely explanation is the least interesting one: everyone involved was busy, slightly tired, and thinking mostly about themselves, which is the great equaliser. No further action is required. Nobody is relocating.'

// ---- layout ----------------------------------------------------------------

export const NODE_W = 264
export const GAP_X = 110
const GAP_Y = 28

/** Conservative estimate: 12px mono in a 240px column wraps at roughly 29 chars. */
export const nodeHeight = (text: string) => 84 + Math.ceil(text.length / 29) * 18

export interface Box {
  x: number
  y: number
  h: number
}

/** Left-to-right tidy tree. Leaves stack vertically, parents centre on their children. */
export function layout(nodes: TNode[]): Map<string, Box> {
  const kids = new Map<string | null, TNode[]>()
  for (const nd of nodes) kids.set(nd.parent, [...(kids.get(nd.parent) ?? []), nd])
  const pos = new Map<string, Box>()
  let cursor = 0
  const walk = (nd: TNode) => {
    const h = nodeHeight(nd.text)
    const start = cursor
    const children = kids.get(nd.id) ?? []
    children.forEach(walk)
    let y = start
    if (children.length) {
      const a = pos.get(children[0].id)!
      const b = pos.get(children[children.length - 1].id)!
      y = Math.max(start, (a.y + b.y + b.h) / 2 - h / 2)
    }
    pos.set(nd.id, { x: nd.depth * (NODE_W + GAP_X), y, h })
    cursor = Math.max(cursor, y + h + GAP_Y)
  }
  const root = nodes.find((x) => x.parent === null)
  if (root) walk(root)
  return pos
}
