import type { CalendarView } from '../../types';
import { VIEW_AGENDA, VIEW_DAY, VIEW_MONTH, VIEW_WEEK } from '../../constants';

export const CAL_HEADER = 'Cal-CalendarHeader';
export const CAL_HEADER_NAV = 'Cal-CalendarHeader__nav';
export const CAL_HEADER_TITLE = 'Cal-CalendarHeader__title';
export const CAL_HEADER_VIEWS = 'Cal-CalendarHeader__views';
export const CAL_HEADER_VIEW = 'Cal-CalendarHeader__view';
export const CAL_HEADER_VIEW_ACTIVE = 'Cal-CalendarHeader__view--active';
export const CALENDAR_VIEWS: CalendarView[] = [VIEW_MONTH, VIEW_WEEK, VIEW_DAY, VIEW_AGENDA];
export const BUTTON_TYPE = 'button' as const;
