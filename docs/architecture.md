# Architecture

Sluiceboard is a browser-only React application for triaging water treatment process alarms. It does not call a plant network, API, or external service. All sample information is fictional.

## Data flow

`useSluiceboard` owns the station collection, active station, filters, selection, and live-region announcement. Components receive values and callbacks; they do not keep duplicate copies of domain state.

The visible alarm list, acknowledgement progress, process-area counts, and visible selection count are derived with `useMemo`. Selection is keyed by stable alarm IDs and remains independent from the filtered list, so hiding a row cannot silently clear it.

## Boundaries

- `src/lib/storage.ts` validates persisted JSON and falls back to cloned sample data.
- `src/lib/filters.ts` contains pure filtering and summary functions.
- `src/hooks/useSluiceboard.ts` coordinates React state and persistence.
- `src/components/` contains controlled, accessible interface surfaces.
- `public/fixtures/` contains compact handover and drill scenarios for task authoring.

## Persistence

Only station alarm data is persisted. Filters, station choice, selections, and announcements are intentionally session state. Invalid or corrupt storage never enters the interface.
