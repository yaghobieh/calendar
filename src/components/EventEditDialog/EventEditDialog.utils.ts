import type { CalendarEvent, CalendarRecurrence, CalendarRecurrenceFreq } from '../../types';
import {
  DEFAULT_RECURRENCE_INTERVAL,
  DEFAULT_TRANSLATIONS,
  MINUTES_IN_HOUR,
  MS_IN_MINUTE,
  NUMBER_ONE,
  NUMBER_ZERO,
  PAD_ZERO,
  RECURRENCE_EVERY_X_MONTHS,
  RECURRENCE_NONE,
  TIME_SEPARATOR,
} from '@constants';
import { addDays, startOfDay, toDate } from '@utils';

export const toTimeValue = (value: Date | string): string => {
  const date = toDate(value);
  const hours = String(date.getHours()).padStart(2, PAD_ZERO);
  const minutes = String(date.getMinutes()).padStart(2, PAD_ZERO);
  return `${hours}${TIME_SEPARATOR}${minutes}`;
};

export const applyTimeValue = (day: Date, time: string | null): Date => {
  const next = startOfDay(day);
  if (!time) {
    return next;
  }
  const match = /^(\d{1,2}):(\d{2})/.exec(time);
  if (!match) {
    return next;
  }
  next.setHours(Number(match[1]), Number(match[2]), NUMBER_ZERO, NUMBER_ZERO);
  return next;
};

export const displayEndDate = (event: CalendarEvent): Date => {
  const end = startOfDay(toDate(event.end));
  const start = startOfDay(toDate(event.start));
  if (event.allDay && end.getTime() > start.getTime()) {
    return addDays(end, -NUMBER_ONE);
  }
  return startOfDay(toDate(event.end));
};

export const resolveEventRange = (
  startDate: Date,
  endDate: Date,
  startTime: string | null,
  endTime: string | null,
  allDay: boolean,
): { start: Date; end: Date } => {
  if (allDay) {
    const start = startOfDay(startDate);
    let end = addDays(startOfDay(endDate), NUMBER_ONE);
    if (end.getTime() <= start.getTime()) {
      end = addDays(start, NUMBER_ONE);
    }
    return { start, end };
  }
  const start = applyTimeValue(startDate, startTime);
  let end = applyTimeValue(endDate, endTime);
  if (end.getTime() <= start.getTime()) {
    end = new Date(start.getTime() + MINUTES_IN_HOUR * MS_IN_MINUTE);
  }
  return { start, end };
};

export const recurrenceFromForm = (
  freq: CalendarRecurrenceFreq,
  intervalText: string,
): CalendarRecurrence | undefined => {
  if (freq === RECURRENCE_NONE) {
    return undefined;
  }
  if (freq !== RECURRENCE_EVERY_X_MONTHS) {
    return { freq };
  }
  const parsed = Number(intervalText);
  const interval =
    Number.isFinite(parsed) && parsed > NUMBER_ZERO ? parsed : DEFAULT_RECURRENCE_INTERVAL;
  return { freq, interval };
};

export const savedTitle = (title: string): string => {
  const trimmed = title.trim();
  if (trimmed.length === NUMBER_ZERO) {
    return DEFAULT_TRANSLATIONS.untitled;
  }
  return trimmed;
};
