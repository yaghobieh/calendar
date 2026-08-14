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

Pass `theme` or a `config` object (`defineCalendarConfig`) to set `--cal-primary`, `--cal-border`, `--cal-bg`, `--cal-text`, `--cal-muted`, `--cal-today`, `--cal-event`.

## Events

Clicking a chip opens a wider Outlook-style popup (title, subtitle, time, severity icon, people, description, Join meeting when `meetingUrl` is set). Hover a chip for a popover preview. Edit and create flip to a full-size card; Save and Cancel stay in the footer. Right-click a slot or event and handle `onContextMenu` (Create event, Mark as busy day, Open event). Drag the bottom edge of a timed week or day block to resize; `onEventChange` receives the new end time. The edit icon, close icon, Save, and Cancel are configurable via `eventModal`. Pass a `people` collection (`avatar`, `name`, `fullName`, `email`, `phone`, `linkedin`, `facebook`, `profileUrl`, `title`) and assign them with `peopleIds`. Hover a person chip for name, avatar, email, and phone; click for the full profile. Override connection icons with `personIcons` and severity marks with `severityIcons` (`none` | `low` | `normal` | `high` | `urgent`). Invite and relation overlay the field (`translations.inviteLabel`) and list remaining options when opened. Set `relatedTo` on events to draw relation ribbons across month and week; hover a ribbon to see both event titles and times. `relations.visible` is `'always'`, `'onClick'`, or `'never'`. Edit **Relation with** against the full event list (`editModal.fields.relatedTo`); choosing a related event draws the ribbons immediately. Set `recurrence` on an event (`daily`, `weekly`, `monthly`, `everyXMonths`, `yearly`) to repeat it in the visible range. Click an empty month day to open a create popup (`eventModal.createOnSlot`). Open/close effects: `fade`, `scale`, `slideUp`, `none` — also style `--cal-modal-open-duration`, `--cal-modal-header-bg`, `--cal-modal-body-bg`. All popup labels go through `translations`.

`layout` / `defaultLayout` is `'contained'` or `'fullPage'` (header icon toggle, overridable with `layoutIcons`). `eventModal.containment` is `'page'` (covers the viewport) or `'calendar'` (stays inside the calendar root).

Previous / Today / Next and Month / Week / Day / Agenda live in `Calendar`. Pass `navIcons` to swap the nav labels for icons.

## Version policy

Patches `1.0.0`–`1.0.9`, then minor `1.1.0`.

## Links

- Site: [https://forgecalendar.com](https://forgecalendar.com)
- GitHub: [https://github.com/yaghobieh/calendar](https://github.com/yaghobieh/calendar)
- npm: [@forgedevstack/calendar](https://www.npmjs.com/package/@forgedevstack/calendar)

## License

MIT © John Yaghobieh
