# Changelog

All notable changes to Forge Calendar will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] — Unreleased

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
- Event `subtitle` and `severity` (`none` | `low` | `normal` | `high` | `urgent`) with configurable `severityIcons`
- Invite search dropdown (no checkboxes); relation ribbon hover shows both event titles and times

### Changed

- Click popup is a wider Outlook-style card that hugs title, time, people, and notes
- Edit and create use a full-size card; notes and Ink fill the remaining space; Save/Cancel stay in the footer
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
