import type { ReactNode } from 'react'
import type { Evidence, Kind } from '../types'

export const KIND_LABEL: Record<Kind, string> = {
  incident: 'Incident',
  reasonable: 'Reasonable',
  speculative: 'Speculative',
  absurd: 'Absurd',
  escalation: 'Escalated',
}

export const EV_LABEL: Record<Evidence, string> = {
  supported: 'Supported',
  circumstantial: 'Circumstantial',
  none: 'Unsupported',
}

export const kindColor: Record<Kind, string> = {
  incident: '#25272b',
  reasonable: '#c6c2b5',
  speculative: '#8f8f86',
  absurd: '#e9e5db',
  escalation: '#b3261e',
}

export function Window({
  title,
  right,
  children,
  className = '',
}: {
  title: string
  right?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={`win flex flex-col ${className}`}>
      <header className="win-title">
        <span>{title}</span>
        {right && <span>{right}</span>}
      </header>
      {children}
    </section>
  )
}

export const DISCLAIMER =
  'SATIRE NOTICE: every statistic, grade, assessment and finding in this simulation is fictional and for comedic purposes. Nothing here is a psychological diagnosis, clinical opinion or advice.'

export function Disclaimer({ className = '' }: { className?: string }) {
  return <p className={`text-[11px] leading-snug text-grey ${className}`}>{DISCLAIMER}</p>
}

export function KindTag({ kind }: { kind: Kind }) {
  const red = kind === 'absurd' || kind === 'escalation'
  return <span className={`tag ${red ? 'text-warn' : ''}`}>{KIND_LABEL[kind]}</span>
}
