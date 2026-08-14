import type { CalendarPersonIcons } from '../../types';
import { CAL_PERSON_ICON } from './PersonChip.const';

const IconSvg = (path: string) => (
  <svg viewBox="0 0 24 24" className={CAL_PERSON_ICON} aria-hidden="true">
    <path d={path} />
  </svg>
);

export const DEFAULT_PERSON_ICONS: Required<CalendarPersonIcons> = {
  email: IconSvg('M4 6h16v12H4z M4 6l8 7 8-7'),
  phone: IconSvg('M6.5 3.5h3l1.5 3.5-2 1.5a12 12 0 0 0 6 6l1.5-2 3.5 1.5v3A2 2 0 0 1 18 19 15 15 0 0 1 5 6a2 2 0 0 1 1.5-2.5z'),
  linkedin: IconSvg('M6 9v10M6 5.5v.5 M10 19v-6a3 3 0 0 1 6 0v6 M10 11v8'),
  facebook: IconSvg('M14 8h3V5h-3a4 4 0 0 0-4 4v3H8v3h2v7h3v-7h3l1-3h-4V9a1 1 0 0 1 1-1z'),
  profile: IconSvg('M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4z M4 20a8 8 0 0 1 16 0'),
};
