import type { CalendarSeverityIcons } from '../../types';
import { CAL_POPOVER_EDIT_ICON } from './EventPopover.const';

const SeveritySvg = (path: string) => (
  <svg viewBox="0 0 24 24" className={CAL_POPOVER_EDIT_ICON} aria-hidden="true">
    <path d={path} />
  </svg>
);

export const DEFAULT_SEVERITY_ICONS: Required<CalendarSeverityIcons> = {
  none: null,
  low: SeveritySvg('M12 19V5 M12 5l-4 4 M12 5l4 4'),
  normal: SeveritySvg('M5 12h14'),
  high: SeveritySvg('M12 5v14 M12 19l-4-4 M12 19l4-4'),
  urgent: SeveritySvg('M12 3l9 18H3z M12 9v5 M12 17v.5'),
};
