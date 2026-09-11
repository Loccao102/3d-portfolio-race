# Production Readiness — 3D Portfolio

This document defines the production bar introduced in Phase 13. It is intentionally stricter than “the scene builds”.

## Runtime goals

- Desktop target: 55–60 FPS on a typical modern integrated/discrete GPU.
- Adaptive threshold: sustained <34 FPS in four sample windows may downgrade visual quality.
- Mobile/low quality: fewer ambient actors, no expensive shadows, smaller DPR, shorter district streaming radius.
- Loading: authored district GLBs mount only near the player; far districts retain lightweight visual massing.
- No global world blink while a streamed district GLB loads: each cluster owns a local Suspense fallback.

## Accessibility

- Respect `prefers-reduced-motion`.
- Disable camera shake and tour camera orbit for reduced-motion visitors.
- Freeze ambient drone/traffic/pedestrian loops while keeping the city composition readable.
- Do not hide portfolio information behind driving skill: Quick View and recruiter tour remain available.

## Reliability

- The page-level `ExperienceErrorBoundary` must recover from render/WebGL failures with a visible reload path.
- WebGL context loss is prevented from hard-crashing the page and can restore when the browser recovers.
- Multiplayer is an enhancement, not a hard dependency; the portfolio remains usable while disconnected.

## World integrity

`npm run test:world` protects authored invariants:

1. street-scale props retain `zone`, `role`, and `purpose` metadata;
2. empty-purpose placement is rejected;
3. purposeful-placement guardrails remain present;
4. recruiter tour remains exactly 90 seconds;
5. every flagship project has an engineering-story/system-map definition;
6. Project Garage bay positions derive from project count rather than assuming three projects.

## Feature boundaries after Phase 9–13

- **Phase 9** — Project Garage is an interactive engineering case-study surface.
- **Phase 10** — District visual assets stream by distance with lightweight far proxies.
- **Phase 11** — World infrastructure has behavior: access control, safety state, or portfolio interaction.
- **Phase 12** — Multiplayer communicates useful visitor presence, district location, emotes, and lightweight chat.
- **Phase 13** — CI, accessibility, runtime fallback, and production budgets guard future changes.

## CI gate

Every pull request to `main` must pass:

```text
npm ci
npm run test:world
npm run typecheck
npm run build
```

A visual feature is not complete if it passes TypeScript but violates world intent, accessibility, or the production build.
