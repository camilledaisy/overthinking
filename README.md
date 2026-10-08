# Professional Overthinker Simulator™

A satirical thought-map simulator from the fictional *Institute of Unnecessary Analysis*.
React + TypeScript + Tailwind v4 + React Flow (`@xyflow/react`) + Motion. No backend, no paid API.
All statistics and "assessments" are fictional satire, not psychological diagnoses.

```
npm install
npm run dev      # local
npm test         # engine checks: caps, overlap, unfilled slots, duplicate text
npm run build    # outputs dist/ (Netlify: netlify.toml is included)
```

## How it works

- `src/engine/scenarios.ts` — five curated presets (3 interpretations × 3 follow-ups each, plus escalations and the grounded "Return to Reality" text). **To add a scenario, append one object.**
- `src/engine/templates.ts` — reusable templates for custom incidents and for depths beyond the curated text, plus the narrator, popups, evidence notes and alternate timelines.
- `src/engine/engine.ts` — pure functions: expand, escalate, stats, tidy-tree layout. Limits: `MAX_NODES = 46`, `MAX_DEPTH = 6`.
- `src/state.tsx` — reducer with undo history; the whole simulation persists to `localStorage` (`pos.v1`).
- `src/components/` — `ThoughtMap` (React Flow + tweened layout), `Outline` (readable mobile alternative), `Panels` (stats / file / evidence / log), `Overlays` (memo popups, Return to Reality, report dialog).
- `src/lib/report.ts` — canvas-drawn PNG case report and plain-text report.

Keys: `U` undo · `E` escalate · `R` return to reality · `F` file report · `M` map/outline · `0` reset view · `+`/`-` zoom.
