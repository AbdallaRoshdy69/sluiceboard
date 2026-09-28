# Sluiceboard

Picture a future where clearing alarms at simulated water treatment plants is simple. Sluiceboard is a browser-based workspace in a box to make your shift workflow easier. What do you want to clear today?

How are you going to get through the queue today?

Sluiceboard let's you clear one or more related alarms all at once and provides you a spot to leave information for the next operator-all without configuration of any servers or third party data services. After you install the dependencies, it all just runs in your browser-no account, no network.

### Take a quick tour

Press start using the station from the header. The stations have their own shift window, process summary and alarm queue. Have a look and explore:

- Search using alarm titles, instrument tags, or operator notes.
- Narrow down to a particular process area, specific alarm status or narrow down to just critical alarms.
- Choose alarm with ease, you can filter away the alarm that do not concern you.
- Can acknowledge multiple alarm at the same time or transfer them back to open queue.
- Document new alarms with readings, units, time, and operator notes.

The interface provide counts and status messages that are not color-dependent. Labels are visible and full keyboard access is provided.

### Run it locally

Get started with Node.js 20.19 or newer.

```bash
git clone https://github.com/AbdallaRoshdy69/sluiceboard.git
cd sluiceboard
npm ci
npm run dev
```

Vite will give you the local address to open in your browser.

### Check your changes

You can run each project check on its own:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

The tests cover filtering and the main actions available to operators. They run without making network requests. The production build will be available inside `dist/`.

### How the data works

All stations, alarms, readings and operator notes in Sluiceboard are fictional. Changes are saved in the browser so the alarm queue can survive a refresh. If saved data is missing or not valid, the app returns to the original sample stations.

### Project structure

- `src/components/` contains the controls, alarm form, summaries and table.
- `src/hooks/useSluiceboard.ts` manages stations, filters, selected alarms and updates.
- `src/lib/filters.ts` handles queue filtering and summary calculations.
- `src/lib/storage.ts` checks saved data and provides sample stations.
- `docs/` contains notes about architecture and accessibility.

### Important note

Sluiceboard is a training application and not a real SCADA system. It is not connected to treatment equipment and should not be used to monitor or control any physical process.

### License

This project is available under the [MIT License](LICENSE).
