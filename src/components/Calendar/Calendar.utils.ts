import type { CalendarEvent, CalendarSlot, CalendarTranslations, CalendarView, FirstDayOfWeek } from '../../types';
import {
  DAYS_IN_WEEK,
  DEFAULT_TRANSLATIONS,
  DRAFT_ID_PREFIX,
  NUMBER_ONE,
  NUMBER_ZERO,
  ROOT_ID_FALLBACK,
  VIEW_DAY,
  VIEW_WEEK,
} from '@constants';
import { formatDayHeading, formatMonthYear, formatWeekRange } from '@utils';
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

export const mergeCalendarEvents = (
  source: CalendarEvent[] | undefined,
  local: CalendarEvent[],
): CalendarEvent[] => {
  const base = source ?? [];
  const merged: CalendarEvent[] = [];
  for (let index = NUMBER_ZERO; index < base.length; index += NUMBER_ONE) {
    let override: CalendarEvent | undefined;
    for (let localIndex = NUMBER_ZERO; localIndex < local.length; localIndex += NUMBER_ONE) {
      if (local[localIndex].id === base[index].id) {
        override = local[localIndex];
        break;
      }
    }
    merged.push(override ?? base[index]);
  }
  for (let localIndex = NUMBER_ZERO; localIndex < local.length; localIndex += NUMBER_ONE) {
    let exists = false;
    for (let index = NUMBER_ZERO; index < base.length; index += NUMBER_ONE) {
      if (base[index].id === local[localIndex].id) {
        exists = true;
        break;
      }
    }
    if (!exists) {
      merged.push(local[localIndex]);
    }
  }
  return merged;
};

export const createDraftEvent = (slot: CalendarSlot, title: string): CalendarEvent => ({
  id: `${DRAFT_ID_PREFIX}${Date.now()}`,
  title,
  start: slot.start,
  end: slot.end,
  allDay: slot.allDay,
});
