# @forgedevstack/calendar

<p align="center">
  <strong>Forge Calendar</strong> — A React scheduler and event calendar.<br/>
  Month, week, day, and agenda views with timed and all-day events.<br/>
  The scheduling layer of <a href="https://forgedevstack.com">ForgeStack</a>.
</p>

Bear Calendar stays a date-picker widget. This library is the full scheduler: grids, time gutters, event chips, and navigation.

## Installation

```bash
npm i @forgedevstack/calendar
```

### Import CSS

```tsx
import '@forgedevstack/calendar/styles.css';
```

## Quick Start

```tsx
import { Calendar } from '@forgedevstack/calendar';
import type { CalendarEvent } from '@forgedevstack/calendar';
import '@forgedevstack/calendar/styles.css';

const events: CalendarEvent[] = [
  {
    id: 'standup',
    title: 'Standup',
    start: '2026-08-14T09:00:00',
    end: '2026-08-14T09:30:00',
  },
];

function App() {
  return <Calendar defaultView="month" events={events} />;
}
```

## Views

- **Month** — 6×7 grid, muted other-month days, today highlight, up to three event chips then +N
- **Week** — time gutter 00–23, all-day row, timed events as blocks
- **Day** — single-day time grid with the same all-day and timed layout
- **Agenda** — list grouped by day

## Keyboard

Focus the calendar root (`tabIndex={0}`):

- Arrow keys move the visible date (month / week / day / agenda step)
- `t` jumps to today

## Theming

Set `mode="light"` or `mode="dark"`. Dark mode also follows `prefers-color-scheme` when `mode` is omitted.

CSS variables: `--cal-primary`, `--cal-border`, `--cal-bg`, `--cal-text`, `--cal-muted`, `--cal-today`, `--cal-event`.

## Version policy

Patches `1.0.0`–`1.0.9`, then minor `1.1.0`.

## Links

- Site: [https://forgecalendar.com](https://forgecalendar.com)
- GitHub: [https://github.com/yaghobieh/calendar](https://github.com/yaghobieh/calendar)
- npm: [@forgedevstack/calendar](https://www.npmjs.com/package/@forgedevstack/calendar)

## License

MIT © John Yaghobieh
