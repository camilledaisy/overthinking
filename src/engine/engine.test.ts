// Run: npm test. Exercises every scenario plus a custom incident to the node cap.
import assert from 'node:assert/strict'
import { MAX_DEPTH, MAX_NODES, canExpand, escalate, expand, layout, nodeHeight, NODE_W, startSim, stats } from './engine'
import { SCENARIOS } from './scenarios'

for (const id of [...SCENARIOS.map((s) => s.id), null]) {
  let sim = startSim(id, 'My boss said "interesting" in reply to my email.')
  for (let guard = 0; guard < 100; guard++) {
    const next = sim.nodes.find((n) => canExpand(sim, n))
    if (!next) break
    sim = expand(sim, next.id)
    if (guard % 5 === 4) sim = escalate(sim)
  }
  assert.ok(sim.nodes.length <= MAX_NODES, 'node cap')
  assert.ok(sim.nodes.every((n) => n.depth <= MAX_DEPTH), 'depth cap')
  assert.ok(sim.nodes.every((n) => n.text.length > 10 && !/[{}]/.test(n.text)), `unfilled slot in ${id}`)
  const dupes = sim.nodes.length - new Set(sim.nodes.map((n) => n.text)).size
  assert.ok(dupes <= 1, `${id}: ${dupes} duplicate texts`)

  const pos = layout(sim.nodes)
  const boxes = sim.nodes.map((n) => ({ ...pos.get(n.id)!, id: n.id }))
  for (const a of boxes) for (const b of boxes) {
    if (a.id < b.id && a.x === b.x) assert.ok(a.y + a.h <= b.y || b.y + b.h <= a.y, `overlap ${a.id}/${b.id} in ${id}`)
  }
  assert.ok(sim.nodes.every((n) => nodeHeight(n.text) >= 100) && NODE_W > 0)
  console.log(id ?? 'custom', sim.nodes.length, 'nodes', JSON.stringify(stats(sim)), sim.popup?.id)
}
console.log('ok')
