# Changelog

All notable changes to Forge Calendar will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] - 2026-10-18

### Added

- `EventCalendar` month grid with time and title on each day, previous, next, today, and a Month view label (FORGE-197)
- Mini month navigator beside the grid, using the Bear calendar
- `ResourceFilter` checkbox list for Work, Health, Social, Personal, Travel, and Family. Unchecked resources hide their events (FORGE-198)
- `EventEditDialog` sits beside the calendar, with Bear Input, DatePicker, TimePicker, Switch, Select, and Button (FORGE-199)
- `EventTimeline` with one row per resource and event bars on a seven-month scale (FORGE-200)
- Optional `resourceId` on `CalendarEvent`, plus `CalendarResource` and `DEFAULT_RESOURCES`
- `@forgedevstack/bear` peer dependency for the scheduler controls

Import the new views from the package entry, and load Bear styles next to the calendar styles:

```tsx
import { EventCalendar, EventTimeline, DEFAULT_RESOURCES } from '@forgedevstack/calendar';
import type { CalendarEvent, CalendarResource } from '@forgedevstack/calendar';
import '@forgedevstack/calendar/styles.css';
import '@forgedevstack/bear/styles.css';
```

`EventEditDialog` and `ResourceFilter` are exported from the same entry when you want them on their own.

These views are an original Forge layout. Dragging events is not included.

## [1.0.3] — Unreleased

### Added

- Event cache mechanism (FORGE-74)
- AI agent mode for scheduling (FORGE-61 / FORGE-68)

## [1.0.1] - 2026-08-14

### Added

- Hover popover on event chips (title, subtitle, time, Join meeting), portaled so it is not clipped
- `meetingUrl` on events; Join meeting in the peek and the view popup
- Invite and relation as overlay dropdowns that list remaining options
- Right-click payload `onContextMenu` with Create event, Mark as busy day, and Open event actions
- Drag the bottom of timed week/day events to resize; duration snaps to 15 minutes and saves through `onEventChange`
- Event popup flips from view to edit like a card
- `layout` / `defaultLayout` `'contained' | 'fullPage'` with a header toggle and `layoutIcons`
- `eventModal.containment` `'page' | 'calendar'` for where the popup is bounded
- Mobile header, month cells, week scroll, and full-width popup
- Relation lines (`relatedTo`) with `relations.visible` `'always' | 'onClick' | 'never'`
- Edit **Relation with** field; overlay search list (no portaled overlay inside the 3D flip)
- `editModal.fields` to show or hide title, start, end, allDay, people, notes, relatedTo, recurrence
- Recurrence on events: daily, weekly at this time, monthly, every X months, yearly
- Start/end time fields (hidden when all day); people invite copy via `translations.inviteLabel`
- Draft `relatedTo` updates relation ribbons before Save (`EventEditActions.onDraftChange`)
- Month day click opens a create popup (`eventModal.createOnSlot`)
- Modal open/close effects: `fade`, `scale`, `slideUp`, `none` (`eventModal.openEffect` / `closeEffect`), overridable with CSS
- People collection on `people`: `avatar`, `name`, `fullName`, `email`, `phone`, `linkedin`, `facebook`, `profileUrl`, `title`
- Person chips: hover peek (name, avatar, email, phone) and click card with configurable `personIcons`
- Event `subtitle`, `severity` (`none` | `low` | `normal` | `high` | `urgent`), and `showAs` (`free` | `busy` | `tentative` | `oof`) with configurable `severityIcons`
- Invite search dropdown (no checkboxes); relation ribbon hover shows both event titles and times

### Changed

- Click popup is a wider Outlook-style card; edit scrolls when content overflows and keeps Save/Cancel in the footer
- Hover peek is a solid card above the calendar chrome (copied theme tokens so it is not transparent)
- Relation lines connect event chips to event chips and use a thinner stroke
- Timed week/day resize uses the time column height and hides the peek while dragging
- Edit notes keep Ink HTML instead of stripping markup
- Today is a primary date badge instead of a solid mint cell fill
- Invite copy via `translations.inviteLabel` / `invitePlaceholder`
- Happening-now uses `--cal-primary` instead of orange
- Notes in the popup follow calendar light/dark tokens (no black Ink box in light mode)

## [1.0.0] - 2026-08-14

### Added

- Month, week, day, and agenda views
- Event model with timed and all-day events
- Previous, next, and today navigation
- Keyboard arrows and `t` for today
- Light and dark mode via `data-cal-mode`
- Replaceable translations for view labels and weekdays
- `useCalendar` hook for view and date state
