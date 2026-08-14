import type { CalendarEvent, NormalizedEvent, PositionedEvent } from '../types';
import {
  HOURS_IN_DAY,
  MIN_EVENT_MINUTES,
  MINUTES_IN_HOUR,
  MS_IN_MINUTE,
  NUMBER_ONE,
  NUMBER_ONE_HUNDRED,
  NUMBER_ZERO,
} from '../constants';
import { addDays, startOfDay, toDate } from './date.utils';

export const normalizeEvent = (event: CalendarEvent): NormalizedEvent | null => {
  const start = toDate(event.start);
  const end = toDate(event.end);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return null;
  }
  const resolvedEnd = end < start ? new Date(start.getTime()) : end;
  return {
    id: event.id,
    title: event.title,
    start,
    end: resolvedEnd,
    allDay: Boolean(event.allDay),
    color: event.color,
    description: event.description,
    source: event,
  };
};

export const normalizeEvents = (events?: CalendarEvent[]): NormalizedEvent[] => {
  if (!events) {
    return [];
  }
  const normalized: NormalizedEvent[] = [];
  for (let index = NUMBER_ZERO; index < events.length; index += NUMBER_ONE) {
    const next = normalizeEvent(events[index]);
    if (next) {
      normalized.push(next);
    }
  }
  return normalized;
};

export const eventsOverlappingRange = (
  events: NormalizedEvent[],
  start: Date,
  end: Date,
): NormalizedEvent[] => events.filter((event) => event.start < end && event.end > start);

export const eventsForDay = (events: NormalizedEvent[], day: Date): NormalizedEvent[] => {
  const start = startOfDay(day);
  const end = addDays(start, NUMBER_ONE);
  return eventsOverlappingRange(events, start, end);
};

export const allDayEventsForDay = (events: NormalizedEvent[], day: Date): NormalizedEvent[] =>
  eventsForDay(events, day).filter((event) => event.allDay);

export const timedEventsForDay = (events: NormalizedEvent[], day: Date): NormalizedEvent[] =>
  eventsForDay(events, day).filter((event) => !event.allDay);

export const positionTimedEvents = (events: NormalizedEvent[], day: Date): PositionedEvent[] => {
  const dayStart = startOfDay(day);
  const dayEnd = addDays(dayStart, NUMBER_ONE);
  const totalMinutes = HOURS_IN_DAY * MINUTES_IN_HOUR;
  const timed = timedEventsForDay(events, day)
    .filter((event) => event.start < dayEnd && event.end > dayStart)
    .sort((left, right) => left.start.getTime() - right.start.getTime());

  const columnEnds: Date[] = [];
  const columnIndexes: number[] = [];

  for (let index = NUMBER_ZERO; index < timed.length; index += NUMBER_ONE) {
    const event = timed[index];
    let columnIndex = columnEnds.length;
    let placed = false;
    for (let column = NUMBER_ZERO; column < columnEnds.length; column += NUMBER_ONE) {
      if (columnEnds[column].getTime() <= event.start.getTime()) {
        columnIndex = column;
        columnEnds[column] = event.end;
        placed = true;
        break;
      }
    }
    if (!placed) {
      columnEnds.push(event.end);
    }
    columnIndexes.push(columnIndex);
  }

  const columnCount = Math.max(columnEnds.length, NUMBER_ONE);
  const positioned: PositionedEvent[] = [];

  for (let index = NUMBER_ZERO; index < timed.length; index += NUMBER_ONE) {
    const event = timed[index];
    const startMinutes = Math.max(
      NUMBER_ZERO,
      (event.start.getTime() - dayStart.getTime()) / MS_IN_MINUTE,
    );
    const endMinutes = Math.max(
      startMinutes + MIN_EVENT_MINUTES,
      (event.end.getTime() - dayStart.getTime()) / MS_IN_MINUTE,
    );
    positioned.push({
      event,
      topPercent: (startMinutes / totalMinutes) * NUMBER_ONE_HUNDRED,
      heightPercent: ((endMinutes - startMinutes) / totalMinutes) * NUMBER_ONE_HUNDRED,
      columnIndex: columnIndexes[index],
      columnCount,
    });
  }

  return positioned;
};
