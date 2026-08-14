# Forge Calendar usage

Author: John Yaghobieh

Previous / Today / Next, Month / Week / Day / Agenda, and event-click popups are part of `@forgedevstack/calendar`. Bear icons and Ink are optional slots.

- Install: `npm i @forgedevstack/calendar`
- Import CSS: `import '@forgedevstack/calendar/styles.css'`
- Click a chip → wider Outlook-style popup (title, subtitle, time, show as, severity, people, description, Join meeting). Hover a chip for a popover preview. Click edit → full-size form that scrolls; Save/Cancel stay in the footer. `onEventChange` writes back to your state.
- Right-click a slot or event and handle `onContextMenu` (Create event, Mark as busy day, Open event).
- Pass `people` with avatar, name, fullName, email, phone, linkedin, facebook, profileUrl, title. Hover a chip for name/avatar/email/phone; click for the full profile. Invite and relation overlay the field and list remaining options.
- Set `meetingUrl` on an event to show Join meeting on the hover peek and the view card.
- Set `showAs` to `free`, `busy`, `tentative`, or `oof`. Set `severity` for the header mark.
- Hover a relation ribbon to see both event titles and times. Ribbons connect event chips, not the top of the cell.
- Switch views with the header or a controlled `view` + `onViewChange`.
- Theme via `theme` or `defineCalendarConfig` (`forgeCalendar.config.ts` / JSON).
- Drag the bottom of a timed week or day block to resize (`editModal.resizable`).
