# Forge Calendar usage

Author: John Yaghobieh

Previous / Today / Next, Month / Week / Day / Agenda, and event-click popups are part of `@forgedevstack/calendar`. Bear icons and Ink are optional slots.

- Install: `npm i @forgedevstack/calendar`
- Import CSS: `import '@forgedevstack/calendar/styles.css'`
- Click a chip → compact Outlook-style popup (title, subtitle, time, severity, people, description). Click edit → form. `onEventChange` writes back to your state.
- Pass `people` with avatar, name, fullName, email, phone, linkedin, facebook, profileUrl, title. Hover a chip for name/avatar/email/phone; click for the full profile. Invite is a search dropdown.
- Hover a relation ribbon to see both event titles and times.
- Switch views with the header or a controlled `view` + `onViewChange`.
- Theme via `theme` or `defineCalendarConfig` (`forgeCalendar.config.ts` / JSON).
- Resize of the notes field is planned for 1.1.0 (`editModal.resizable`).
