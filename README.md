# Sluiceboard

Sluiceboard is a small, browser-based workspace for reviewing alarms at fictional water treatment stations. It is designed around a familiar shift workflow: see what needs attention, narrow the queue, acknowledge related alarms together, and leave useful context for the next operator.

There is no server to configure and no external service behind the data. Once the dependencies are installed, everything runs locally in the browser without an account or network connection.

## Take a quick tour

Start by choosing a station from the header. Each station has its own shift window, process summary, and alarm queue. From there you can:

- Search by alarm title, instrument tag, or operator note.
- Focus on a process area, alarm status, or critical alarms only.
- Select alarms, even when a filter temporarily hides some of them.
- Acknowledge several alarms at once or return them to the open queue.
- Record a new alarm with its reading, timestamp, and operator notes.

Counts and status messages are written out in the interface instead of being communicated by colour alone. The controls also have visible labels and can be used with a keyboard.

## Run it locally

You will need Node.js 20.19 or newer.

```bash
git clone https://github.com/AbdallaRoshdy69/sluiceboard.git
cd sluiceboard
npm ci
npm run dev
```

Vite will print the local address to open in your browser.

## Check your changes

The usual project checks are available as separate commands:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

The tests cover both the filtering logic and the operator-facing interactions. They are self-contained and do not make network requests. A production build is written to `dist/`.

## How the data works

The sample stations, alarms, readings, and notes are all fictional. Changes are saved in browser storage so the alarm queue survives a refresh. If the saved data is missing or malformed, Sluiceboard falls back to a fresh copy of the sample stations.

## Finding your way around

- `src/components/` contains the controls, form, summaries, and alarm table.
- `src/hooks/useSluiceboard.ts` coordinates the active station, filters, selections, and alarm updates.
- `src/lib/filters.ts` contains the queue filtering and summary calculations.
- `src/lib/storage.ts` validates saved data and provides the sample stations.
- `docs/` explains the main architecture and accessibility decisions.

## A note on scope

Sluiceboard is a training application, not an operational SCADA system. It is not connected to treatment equipment and must not be used to monitor or control a physical process.

## License

This project is available under the [MIT License](LICENSE).
