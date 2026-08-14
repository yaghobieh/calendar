import type { CalendarEvent, NormalizedEvent, PositionedEvent } from '../types';
import {
  HOURS_IN_DAY,
  MIN_EVENT_MINUTES,
  MINUTES_IN_HOUR,
  MS_IN_MINUTE,
  NUMBER_ONE,
  NUMBER_ONE_HUNDRED,
  NUMBER_ZERO,
} from '@constants';
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

export const isEventHappeningNow = (event: NormalizedEvent, now: Date = new Date()): boolean =>
  event.start.getTime() <= now.getTime() && event.end.getTime() > now.getTime();

const splitOverlapClusters = (timed: NormalizedEvent[]): NormalizedEvent[][] => {
  const clusters: NormalizedEvent[][] = [];
  let current: NormalizedEvent[] = [];
  let clusterEnd = NUMBER_ZERO;

  for (let index = NUMBER_ZERO; index < timed.length; index += NUMBER_ONE) {
    const event = timed[index];
    if (current.length === NUMBER_ZERO || event.start.getTime() < clusterEnd) {
      current.push(event);
      clusterEnd = Math.max(clusterEnd, event.end.getTime());
      continue;
    }
    clusters.push(current);
    current = [event];
    clusterEnd = event.end.getTime();
  }

  if (current.length > NUMBER_ZERO) {
    clusters.push(current);
  }

  return clusters;
};

const positionCluster = (
  cluster: NormalizedEvent[],
  dayStart: Date,
  totalMinutes: number,
): PositionedEvent[] => {
  const columnEnds: Date[] = [];
  const columnIndexes: number[] = [];

  for (let index = NUMBER_ZERO; index < cluster.length; index += NUMBER_ONE) {
    const event = cluster[index];
    let columnIndex = NUMBER_ZERO;
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
      columnIndex = columnEnds.length;
      columnEnds.push(event.end);
    }
    columnIndexes.push(columnIndex);
  }

  const columnCount = Math.max(columnEnds.length, NUMBER_ONE);
  const positioned: PositionedEvent[] = [];

  for (let index = NUMBER_ZERO; index < cluster.length; index += NUMBER_ONE) {
    const event = cluster[index];
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

export const positionTimedEvents = (events: NormalizedEvent[], day: Date): PositionedEvent[] => {
  const dayStart = startOfDay(day);
  const dayEnd = addDays(dayStart, NUMBER_ONE);
  const totalMinutes = HOURS_IN_DAY * MINUTES_IN_HOUR;
  const timed = timedEventsForDay(events, day)
    .filter((event) => event.start < dayEnd && event.end > dayStart)
    .sort((left, right) => {
      const startDiff = left.start.getTime() - right.start.getTime();
      if (startDiff !== NUMBER_ZERO) {
        return startDiff;
      }
      return right.end.getTime() - left.end.getTime();
    });

  const clusters = splitOverlapClusters(timed);
  const positioned: PositionedEvent[] = [];
  for (let index = NUMBER_ZERO; index < clusters.length; index += NUMBER_ONE) {
    const clusterPositions = positionCluster(clusters[index], dayStart, totalMinutes);
    for (let item = NUMBER_ZERO; item < clusterPositions.length; item += NUMBER_ONE) {
      positioned.push(clusterPositions[item]);
    }
  }
  return positioned;
};
