# Sluiceboard

Sluiceboard is a self-contained React alarm triage board for fictional water treatment stations. Shift operators can inspect the treatment path, search and filter process alarms, preserve selections while the queue changes, acknowledge several alarms together, and record a new observed condition without a backend.

## What is included

- Three fictional stations with concrete process tags, readings, notes, and shift windows.
- Search by alarm title, instrument tag, or note, plus area, status, and critical-only controls.
- Selection that remains stable when filters temporarily hide an alarm.
- Bulk acknowledge and reopen actions with live-region feedback.
- A keyboard-friendly alarm report form with explicit labels and focus return.
- Defensive localStorage parsing and deterministic sample data.
- Pure-function and interaction tests that run without network access.

## Commands

```bash
npm ci
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
```

Node 20.19 or newer is required. The production build is written to `dist/`.

## Project map

- `src/hooks/useSluiceboard.ts` owns station, filter, selection, and mutation state.
- `src/lib/filters.ts` derives the visible queue and shift summaries.
- `src/lib/storage.ts` validates persistence and supplies sample stations.
- `src/components/` contains the operator-facing controls and data table.
- `public/fixtures/` provides compact scenarios for focused maintenance tasks.
- `docs/` records the state and accessibility decisions.

## Privacy and safety

The application contains fictional training data only. It is not connected to operational technology and must not be used to control physical equipment.
