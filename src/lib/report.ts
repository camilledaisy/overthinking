import type { Sim, TNode } from '../types'
import { GAP_X, NODE_W, groundedText, layout, stats } from '../engine/engine'
import { DISCLAIMER, EV_LABEL, KIND_LABEL } from '../components/ui'

const INK = '#25272b'
const PAPER = '#e9e5db'
const RED = '#b3261e'
const FILL: Record<TNode['kind'], string> = {
  incident: INK,
  reasonable: '#f4f1e8',
  speculative: '#c6c2b5',
  absurd: '#f4f1e8',
  escalation: RED,
}
const FONT = (px: number, bold = false) => `${bold ? 700 : 400} ${px}px "IBM Plex Mono", "Courier New", monospace`

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const lines: string[] = []
  let line = ''
  for (const word of text.split(/\s+/)) {
    const test = line ? `${line} ${word}` : word
    if (line && ctx.measureText(test).width > maxW) {
      lines.push(line)
      line = word
    } else line = test
  }
  if (line) lines.push(line)
  return lines
}

export async function renderReport(sim: Sim): Promise<HTMLCanvasElement> {
  await Promise.all([document.fonts.load(FONT(12)), document.fonts.load(FONT(12, true))]).catch(() => {})
  const pos = layout(sim.nodes)
  const s = stats(sim)
  const M = 40
  const HEAD = 230
  const FOOT = 110
  const cols = s.maxDepth + 1
  const gw = cols * NODE_W + (cols - 1) * GAP_X
  const gh = Math.max(...[...pos.values()].map((b) => b.y + b.h))
  const W = Math.max(gw + M * 2, 980)
  const H = HEAD + gh + FOOT
  const scale = Math.min(1, 4096 / Math.max(W, H))

  const canvas = document.createElement('canvas')
  canvas.width = Math.round(W * scale)
  canvas.height = Math.round(H * scale)
  const ctx = canvas.getContext('2d')!
  ctx.scale(scale, scale)
  ctx.textBaseline = 'top'

  ctx.fillStyle = PAPER
  ctx.fillRect(0, 0, W, H)
  ctx.strokeStyle = 'rgba(37,39,43,0.06)'
  ctx.lineWidth = 1
  for (let x = 0; x < W; x += 24) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke() }
  for (let y = 0; y < H; y += 24) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }
  ctx.strokeStyle = INK
  ctx.lineWidth = 4
  ctx.strokeRect(10, 10, W - 20, H - 20)

  // header
  ctx.fillStyle = INK
  ctx.fillRect(10, 10, W - 20, 30)
  ctx.fillStyle = PAPER
  ctx.font = FONT(13, true)
  ctx.fillText('INSTITUTE OF UNNECESSARY ANALYSIS  ·  CASE REPORT  ·  ' + sim.caseNo, M, 18)
  ctx.fillStyle = INK
  ctx.font = FONT(26, true)
  ctx.fillText('Professional Overthinker Simulator™', M, 62)
  ctx.font = FONT(15)
  const incidentLines = wrap(ctx, 'INCIDENT: ' + sim.incident, W - M * 2 - 260)
  incidentLines.slice(0, 4).forEach((l, i) => ctx.fillText(l, M, 105 + i * 21))
  ctx.font = FONT(13)
  ctx.fillText(
    `Unsupported assumptions: ${s.unsupported}   Mental gymnastics: ${s.gymnastics} MG   Distance from incident: ${s.km.toFixed(1)} km   Plausibility: ${(s.plausibility * 100).toFixed(2)}%`,
    M, HEAD - 62,
  )
  ctx.fillText(`Filed: ${new Date().toISOString().slice(0, 10)}   Interpretations: ${sim.nodes.length - 1}   Escalations: ${sim.esc}`, M, HEAD - 40)

  const stamp = (text: string, cx: number, cy: number, angle: number) => {
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(angle)
    ctx.font = FONT(18, true)
    const w = ctx.measureText(text).width + 24
    ctx.strokeStyle = RED
    ctx.fillStyle = RED
    ctx.lineWidth = 3
    ctx.strokeRect(-w / 2, -20, w, 40)
    ctx.lineWidth = 1
    ctx.strokeRect(-w / 2 + 4, -16, w - 8, 32)
    ctx.textAlign = 'center'
    ctx.fillText(text, 0, -9)
    ctx.restore()
  }
  stamp(s.grade, W - M - 150, 100, -0.08)
  if (sim.reality) stamp('RETURNED TO REALITY', W - M - 150, 160, 0.05)

  // graph
  const ox = (W - gw) / 2
  const oy = HEAD
  for (const n of sim.nodes) {
    if (!n.parent) continue
    const a = pos.get(n.parent)!
    const b = pos.get(n.id)!
    const x1 = ox + a.x + NODE_W, y1 = oy + a.y + a.h / 2
    const x2 = ox + b.x, y2 = oy + b.y + b.h / 2
    const hot = n.kind === 'absurd' || n.kind === 'escalation'
    ctx.strokeStyle = hot ? RED : INK
    ctx.lineWidth = 1.5
    ctx.setLineDash(hot ? [6, 4] : [])
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.bezierCurveTo(x1 + GAP_X / 2, y1, x2 - GAP_X / 2, y2, x2, y2)
    ctx.stroke()
  }
  ctx.setLineDash([])
  for (const n of sim.nodes) {
    const b = pos.get(n.id)!
    const x = ox + b.x, y = oy + b.y
    const dark = n.kind === 'incident' || n.kind === 'escalation'
    ctx.fillStyle = FILL[n.kind]
    ctx.fillRect(x, y, NODE_W, b.h)
    ctx.strokeStyle = n.kind === 'absurd' ? RED : INK
    ctx.lineWidth = 2
    ctx.strokeRect(x, y, NODE_W, b.h)
    ctx.fillStyle = dark ? PAPER : n.kind === 'absurd' ? RED : INK
    ctx.font = FONT(10, true)
    ctx.fillText(`${KIND_LABEL[n.kind].toUpperCase()}  EX-${n.id.slice(1).padStart(2, '0')}`, x + 12, y + 10)
    ctx.fillStyle = dark ? PAPER : INK
    ctx.font = FONT(12)
    wrap(ctx, n.text, NODE_W - 24).forEach((l, i) => ctx.fillText(l, x + 12, y + 34 + i * 18))
    ctx.font = FONT(10)
    ctx.fillText(`EVIDENCE: ${EV_LABEL[n.evidence].toUpperCase()}`, x + 12, y + b.h - 22)
  }

  // footer
  ctx.fillStyle = INK
  ctx.font = FONT(11)
  wrap(ctx, DISCLAIMER, W - M * 2).forEach((l, i) => ctx.fillText(l, M, H - FOOT + 30 + i * 16))
  ctx.fillText('Generated by the Professional Overthinker Simulator™. The Institute is fictional.', M, H - 40)
  return canvas
}

export function reportText(sim: Sim): string {
  const s = stats(sim)
  const kids = new Map<string | null, TNode[]>()
  for (const n of sim.nodes) kids.set(n.parent, [...(kids.get(n.parent) ?? []), n])
  const lines: string[] = []
  const walk = (n: TNode) => {
    const pad = '  '.repeat(n.depth)
    lines.push(`${pad}[${KIND_LABEL[n.kind].toUpperCase()}] ${n.text}`)
    if (n.kind !== 'incident') lines.push(`${pad}    Evidence: ${EV_LABEL[n.evidence]}. ${n.evNote}`)
    ;(kids.get(n.id) ?? []).forEach(walk)
  }
  walk(sim.nodes[0])
  return [
    'INSTITUTE OF UNNECESSARY ANALYSIS',
    `CASE REPORT ${sim.caseNo}   Filed ${new Date().toISOString().slice(0, 10)}`,
    '='.repeat(60),
    `INCIDENT: ${sim.incident}`,
    '',
    `Classification:          ${s.grade}`,
    `Unsupported assumptions: ${s.unsupported}`,
    `Mental gymnastics:       ${s.gymnastics} MG`,
    `Distance from incident:  ${s.km.toFixed(1)} km`,
    `Plausibility (chain):    ${(s.plausibility * 100).toFixed(2)}%`,
    `Alternate timelines:     ${s.timelines}`,
    `Escalations:             ${sim.esc}`,
    '',
    'THOUGHT MAP',
    '-'.repeat(60),
    ...lines,
    '',
    'FINDINGS',
    '-'.repeat(60),
    `Grounded interpretation: ${groundedText(sim)}`,
    sim.reality ? 'Status: RETURNED TO REALITY.' : 'Status: Investigation ongoing. Nobody has asked for it to continue.',
    '',
    DISCLAIMER,
  ].join('\n')
}
