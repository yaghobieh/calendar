import type { CalendarView } from '../../types';
import { VIEW_AGENDA, VIEW_DAY, VIEW_MONTH, VIEW_WEEK } from '@constants';

export const CAL_HEADER = 'Cal-CalendarHeader';
export const CAL_HEADER_NAV = 'Cal-CalendarHeader__nav';
export const CAL_HEADER_TITLE = 'Cal-CalendarHeader__title';
export const CAL_HEADER_VIEWS = 'Cal-CalendarHeader__views';
export const CAL_HEADER_VIEW = 'Cal-CalendarHeader__view';
export const CAL_HEADER_VIEW_ACTIVE = 'Cal-CalendarHeader__view--active';
export const CAL_HEADER_NAV_BTN = 'Cal-CalendarHeader__navBtn';
export const CAL_HEADER_NAV_BTN_ICON = 'Cal-CalendarHeader__navBtn--icon';
export const CAL_HEADER_LAYOUT_ICON = 'Cal-CalendarHeader__layoutIcon';
export const CALENDAR_VIEWS: CalendarView[] = [VIEW_MONTH, VIEW_WEEK, VIEW_DAY, VIEW_AGENDA];
export const BUTTON_TYPE = 'button' as const;
export const LAYOUT_ICON_VIEWBOX = '0 0 24 24';
