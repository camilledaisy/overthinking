export type Kind = 'incident' | 'reasonable' | 'speculative' | 'absurd' | 'escalation'
export type Evidence = 'supported' | 'circumstantial' | 'none'

/** Curated content for a branch. Children are ordered reasonable, speculative, absurd. */
export interface Seed {
  t: string
  ev?: string
  alt?: string
  k?: [Seed, Seed, Seed]
}

export interface Vars {
  who: string
  thing: string
  place: string
}

export interface Scenario {
  id: string
  label: string
  teaser: string
  incident: string
  grounded: string
  vars: Vars
  kids: [Seed, Seed, Seed]
  /** The spiral: one [reasonable, speculative, absurd] line for each of depths 3-6. */
  deep: [string, string, string][]
  esc: string[]
}

export interface TNode {
  id: string
  parent: string | null
  kind: Kind
  depth: number
  text: string
  evidence: Evidence
  evNote: string
  alt: string
  expanded: boolean
  kids?: [Seed, Seed, Seed]
}

export interface Popup {
  id: string
  title: string
  body: string
  report?: boolean
}

export interface Sim {
  caseNo: string
  scenarioId: string | null
  incident: string
  vars: Vars
  nodes: TNode[]
  seq: number
  log: string[]
  fired: string[]
  esc: number
  reality: boolean
  selected: string | null
  fresh: string[]
  popup: Popup | null
}

export interface AppState {
  view: 'home' | 'sim'
  sim: Sim | null
  past: Sim[]
}
