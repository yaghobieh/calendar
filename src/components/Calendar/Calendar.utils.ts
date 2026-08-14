import type { CalendarTranslations, CalendarView, FirstDayOfWeek } from '../../types';
import {
  DAYS_IN_WEEK,
  DEFAULT_TRANSLATIONS,
  ROOT_ID_FALLBACK,
  VIEW_DAY,
  VIEW_WEEK,
} from '../../constants';
import { formatDayHeading, formatMonthYear, formatWeekRange } from '../../utils';
import { CAL_ROOT_ID_PREFIX } from './Calendar.const';

export const resolveCalendarId = (id?: string): string =>
  `${CAL_ROOT_ID_PREFIX}${id ?? ROOT_ID_FALLBACK}`;

export const mergeTranslations = (
  partial?: Partial<CalendarTranslations>,
): CalendarTranslations => ({
  ...DEFAULT_TRANSLATIONS,
  ...partial,
  weekdays:
    partial?.weekdays?.length === DAYS_IN_WEEK
      ? partial.weekdays
      : DEFAULT_TRANSLATIONS.weekdays,
});

export const headerTitle = (
  view: CalendarView,
  date: Date,
  firstDay: FirstDayOfWeek,
): string => {
  if (view === VIEW_WEEK) {
    return formatWeekRange(date, firstDay);
  }
  if (view === VIEW_DAY) {
    return formatDayHeading(date);
  }
  return formatMonthYear(date);
};
