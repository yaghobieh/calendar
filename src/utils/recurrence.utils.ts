import type {
  CalendarEvent,
  CalendarRecurrence,
  CalendarRecurrenceFreq,
  CalendarView,
  FirstDayOfWeek,
} from '../types';
import {
  AGENDA_DAY_COUNT,
  DAYS_IN_WEEK,
  DEFAULT_RECURRENCE_INTERVAL,
  INDEX_NONE,
  MAX_RECURRENCE_OCCURRENCES,
  MONTHS_IN_YEAR,
  NUMBER_ONE,
  NUMBER_ZERO,
  OCCURRENCE_ID_SEP,
  RECURRENCE_DAILY,
  RECURRENCE_EVERY_X_MONTHS,
  RECURRENCE_MONTHLY,
  RECURRENCE_NONE,
  RECURRENCE_WEEKLY,
  RECURRENCE_YEARLY,
  VIEW_AGENDA,
  VIEW_MONTH,
  VIEW_WEEK,
} from '@constants';
import { addDays, addMonths, getMonthGrid, startOfDay, startOfWeek, toDate } from './date.utils';

export const seriesIdFromEventId = (id: string): string => {
  const index = id.indexOf(OCCURRENCE_ID_SEP);
  if (index === INDEX_NONE) {
    return id;
  }
  return id.slice(NUMBER_ZERO, index);
};

export const resolveSeriesEvent = (
  events: CalendarEvent[],
  event: CalendarEvent,
): CalendarEvent => {
  const seriesId = seriesIdFromEventId(event.id);
  for (let index = NUMBER_ZERO; index < events.length; index += NUMBER_ONE) {
    if (events[index].id === seriesId) {
      return events[index];
    }
  }
  return event;
};

export const visibleRangeForView = (
  view: CalendarView,
  date: Date,
  firstDayOfWeek: FirstDayOfWeek,
): { start: Date; end: Date } => {
  if (view === VIEW_MONTH) {
    const cells = getMonthGrid(date, firstDayOfWeek);
    const start = startOfDay(cells[NUMBER_ZERO]);
    const last = cells[cells.length - NUMBER_ONE];
    return { start, end: addDays(startOfDay(last), NUMBER_ONE) };
  }
  if (view === VIEW_WEEK) {
    const start = startOfWeek(date, firstDayOfWeek);
    return { start, end: addDays(start, DAYS_IN_WEEK) };
  }
  if (view === VIEW_AGENDA) {
    const start = startOfDay(date);
    return { start, end: addDays(start, AGENDA_DAY_COUNT) };
  }
  const start = startOfDay(date);
  return { start, end: addDays(start, NUMBER_ONE) };
};

const recurrenceInterval = (recurrence: CalendarRecurrence): number => {
  if (recurrence.freq !== RECURRENCE_EVERY_X_MONTHS) {
    return NUMBER_ONE;
  }
  if (!recurrence.interval || recurrence.interval < NUMBER_ONE) {
    return DEFAULT_RECURRENCE_INTERVAL;
  }
  return recurrence.interval;
};

const nextOccurrenceStart = (
  start: Date,
  freq: CalendarRecurrenceFreq,
  interval: number,
): Date => {
  if (freq === RECURRENCE_DAILY) {
    return addDays(start, interval);
  }
  if (freq === RECURRENCE_WEEKLY) {
    return addDays(start, DAYS_IN_WEEK * interval);
  }
  if (freq === RECURRENCE_MONTHLY) {
    return addMonths(start, interval);
  }
  if (freq === RECURRENCE_EVERY_X_MONTHS) {
    return addMonths(start, interval);
  }
  if (freq === RECURRENCE_YEARLY) {
    return addMonths(start, MONTHS_IN_YEAR * interval);
  }
  return addDays(start, interval);
};

const occurrenceEvent = (
  event: CalendarEvent,
  occStart: Date,
  occEnd: Date,
  isMaster: boolean,
): CalendarEvent => ({
  ...event,
  id: isMaster ? event.id : `${event.id}${OCCURRENCE_ID_SEP}${occStart.getTime()}`,
  start: occStart,
  end: occEnd,
});

const expandOne = (
  event: CalendarEvent,
  rangeStart: Date,
  rangeEnd: Date,
): CalendarEvent[] => {
  const recurrence = event.recurrence;
  if (!recurrence || recurrence.freq === RECURRENCE_NONE) {
    return [event];
  }
  const masterStart = toDate(event.start);
  const masterEnd = toDate(event.end);
  const duration = masterEnd.getTime() - masterStart.getTime();
  const interval = recurrenceInterval(recurrence);
  const expanded: CalendarEvent[] = [];
  let occStart = new Date(masterStart.getTime());
  let count = NUMBER_ZERO;
  while (count < MAX_RECURRENCE_OCCURRENCES && occStart.getTime() < rangeEnd.getTime()) {
    const occEnd = new Date(occStart.getTime() + duration);
    if (occEnd.getTime() > rangeStart.getTime()) {
      const isMaster = occStart.getTime() === masterStart.getTime();
      expanded.push(occurrenceEvent(event, new Date(occStart.getTime()), occEnd, isMaster));
    }
    occStart = nextOccurrenceStart(occStart, recurrence.freq, interval);
    count += NUMBER_ONE;
  }
  return expanded.length > NUMBER_ZERO ? expanded : [event];
};

export const expandRecurringEvents = (
  events: CalendarEvent[],
  rangeStart: Date,
  rangeEnd: Date,
): CalendarEvent[] => {
  const expanded: CalendarEvent[] = [];
  for (let index = NUMBER_ZERO; index < events.length; index += NUMBER_ONE) {
    const next = expandOne(events[index], rangeStart, rangeEnd);
    for (let nextIndex = NUMBER_ZERO; nextIndex < next.length; nextIndex += NUMBER_ONE) {
      expanded.push(next[nextIndex]);
    }
  }
  return expanded;
};
