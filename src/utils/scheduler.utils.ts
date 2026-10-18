import type { CSSProperties } from 'react';
import type { CalendarEvent, CalendarResource, NormalizedEvent } from '../types';
import {
  DAYS_IN_WEEK,
  DEFAULT_EVENT_COLOR,
  DEFAULT_LOCALE,
  DRAFT_ID_PREFIX,
  MINUTES_IN_HOUR,
  MS_IN_MINUTE,
  NUMBER_NINE,
  NUMBER_ONE,
  NUMBER_ZERO,
  RANGE_SEPARATOR,
} from '@constants';
import { addDays, startOfDay } from './date.utils';

export const eventColor = (event: NormalizedEvent, resources: CalendarResource[]): string => {
  if (event.color) {
    return event.color;
  }
  const resourceId = event.source.resourceId;
  if (!resourceId) {
    return DEFAULT_EVENT_COLOR;
  }
  for (let index = NUMBER_ZERO; index < resources.length; index += NUMBER_ONE) {
    if (resources[index].id === resourceId) {
      return resources[index].color;
    }
  }
  return DEFAULT_EVENT_COLOR;
};

export const isMultiDayEvent = (event: NormalizedEvent): boolean => {
  const start = startOfDay(event.start);
  const inclusiveEnd = startOfDay(new Date(event.end.getTime() - NUMBER_ONE));
  return inclusiveEnd.getTime() > start.getTime();
};

export interface WeekEventSpan {
  event: NormalizedEvent;
  columnStart: number;
  columnSpan: number;
  lane: number;
}

export const weekEventSpans = (events: NormalizedEvent[], weekStart: Date): WeekEventSpan[] => {
  const pending: Array<Omit<WeekEventSpan, 'lane'> & { columnEnd: number }> = [];
  for (let index = NUMBER_ZERO; index < events.length; index += NUMBER_ONE) {
    const event = events[index];
    if (!isMultiDayEvent(event)) {
      continue;
    }
    let columnStart = -NUMBER_ONE;
    let columnEnd = -NUMBER_ONE;
    for (let column = NUMBER_ZERO; column < DAYS_IN_WEEK; column += NUMBER_ONE) {
      const day = addDays(weekStart, column);
      const next = addDays(day, NUMBER_ONE);
      if (event.start < next && event.end > day) {
        if (columnStart < NUMBER_ZERO) {
          columnStart = column;
        }
        columnEnd = column;
      }
    }
    if (columnStart < NUMBER_ZERO || columnEnd < columnStart) {
      continue;
    }
    pending.push({
      event,
      columnStart,
      columnSpan: columnEnd - columnStart + NUMBER_ONE,
      columnEnd,
    });
  }
  pending.sort(
    (left, right) => left.columnStart - right.columnStart || right.columnSpan - left.columnSpan,
  );
  const laneEnds: number[] = [];
  const spans: WeekEventSpan[] = [];
  for (let index = NUMBER_ZERO; index < pending.length; index += NUMBER_ONE) {
    const item = pending[index];
    let lane = NUMBER_ZERO;
    while (lane < laneEnds.length && laneEnds[lane] > item.columnStart) {
      lane += NUMBER_ONE;
    }
    const exclusiveColumn = item.columnEnd + NUMBER_ONE;
    if (lane === laneEnds.length) {
      laneEnds.push(exclusiveColumn);
    } else {
      laneEnds[lane] = exclusiveColumn;
    }
    spans.push({
      event: item.event,
      columnStart: item.columnStart,
      columnSpan: item.columnSpan,
      lane,
    });
  }
  return spans;
};

export interface TimelineBarPlacement {
  event: NormalizedEvent;
  left: number;
  width: number;
  lane: number;
}

const MIN_BAR_FRACTION = 0.02;

export const timelineBars = (
  events: NormalizedEvent[],
  rangeStart: Date,
  rangeEnd: Date,
): TimelineBarPlacement[] => {
  const total = rangeEnd.getTime() - rangeStart.getTime();
  if (total <= NUMBER_ZERO) {
    return [];
  }
  const pending: Array<TimelineBarPlacement & { startMs: number; endMs: number }> = [];
  for (let index = NUMBER_ZERO; index < events.length; index += NUMBER_ONE) {
    const event = events[index];
    if (event.end <= rangeStart || event.start >= rangeEnd) {
      continue;
    }
    const startMs = Math.max(event.start.getTime(), rangeStart.getTime());
    const endMs = Math.min(event.end.getTime(), rangeEnd.getTime());
    pending.push({
      event,
      left: (startMs - rangeStart.getTime()) / total,
      width: Math.max((endMs - startMs) / total, MIN_BAR_FRACTION),
      lane: NUMBER_ZERO,
      startMs,
      endMs,
    });
  }
  pending.sort((left, right) => left.startMs - right.startMs);
  const laneEnds: number[] = [];
  for (let index = NUMBER_ZERO; index < pending.length; index += NUMBER_ONE) {
    const item = pending[index];
    let lane = NUMBER_ZERO;
    while (lane < laneEnds.length && laneEnds[lane] > item.startMs) {
      lane += NUMBER_ONE;
    }
    if (lane === laneEnds.length) {
      laneEnds.push(item.endMs);
    } else {
      laneEnds[lane] = item.endMs;
    }
    item.lane = lane;
  }
  return pending;
};

export const filterEventsByResources = (
  events: CalendarEvent[],
  visibleResourceIds: string[],
): CalendarEvent[] => {
  const visible: CalendarEvent[] = [];
  for (let index = NUMBER_ZERO; index < events.length; index += NUMBER_ONE) {
    const event = events[index];
    if (!event.resourceId || visibleResourceIds.includes(event.resourceId)) {
      visible.push(event);
    }
  }
  return visible;
};

export const withoutHiddenEvents = (
  events: CalendarEvent[],
  hiddenIds: string[],
): CalendarEvent[] => {
  if (hiddenIds.length === NUMBER_ZERO) {
    return events;
  }
  const visible: CalendarEvent[] = [];
  for (let index = NUMBER_ZERO; index < events.length; index += NUMBER_ONE) {
    if (!hiddenIds.includes(events[index].id)) {
      visible.push(events[index]);
    }
  }
  return visible;
};

export const upsertEvent = (events: CalendarEvent[], event: CalendarEvent): CalendarEvent[] => {
  const next: CalendarEvent[] = [];
  let replaced = false;
  for (let index = NUMBER_ZERO; index < events.length; index += NUMBER_ONE) {
    if (events[index].id === event.id) {
      next.push(event);
      replaced = true;
    } else {
      next.push(events[index]);
    }
  }
  if (!replaced) {
    next.push(event);
  }
  return next;
};

export const createResourceDraft = (day: Date, resource?: CalendarResource): CalendarEvent => {
  const start = startOfDay(day);
  start.setHours(NUMBER_NINE, NUMBER_ZERO, NUMBER_ZERO, NUMBER_ZERO);
  const end = new Date(start.getTime() + MINUTES_IN_HOUR * MS_IN_MINUTE);
  return {
    id: `${DRAFT_ID_PREFIX}${Date.now()}`,
    title: '',
    start,
    end,
    resourceId: resource?.id,
    color: resource?.color,
  };
};

export const formatEventClock = (date: Date): string =>
  date.toLocaleTimeString(DEFAULT_LOCALE, { hour: 'numeric', minute: '2-digit' });

export const formatMonthShort = (date: Date): string =>
  date.toLocaleDateString(DEFAULT_LOCALE, { month: 'short' });

export const timelineYearLabel = (months: Date[]): string => {
  if (months.length === NUMBER_ZERO) {
    return '';
  }
  const first = months[NUMBER_ZERO].getFullYear();
  const last = months[months.length - NUMBER_ONE].getFullYear();
  if (first === last) {
    return String(first);
  }
  return `${first}${RANGE_SEPARATOR}${last}`;
};

export const tintedBarStyle = (color: string): CSSProperties => ({
  background: `color-mix(in srgb, ${color} 40%, var(--cal-bar-mix, white))`,
  color: 'var(--cal-text)',
});

export const eventsForResource = (
  events: NormalizedEvent[],
  resourceId: string,
): NormalizedEvent[] => {
  const matched: NormalizedEvent[] = [];
  for (let index = NUMBER_ZERO; index < events.length; index += NUMBER_ONE) {
    if (events[index].source.resourceId === resourceId) {
      matched.push(events[index]);
    }
  }
  return matched;
};

export const unassignedEvents = (
  events: NormalizedEvent[],
  resources: CalendarResource[],
): NormalizedEvent[] => {
  const ids: string[] = [];
  for (let index = NUMBER_ZERO; index < resources.length; index += NUMBER_ONE) {
    ids.push(resources[index].id);
  }
  const matched: NormalizedEvent[] = [];
  for (let index = NUMBER_ZERO; index < events.length; index += NUMBER_ONE) {
    const resourceId = events[index].source.resourceId;
    if (!resourceId || !ids.includes(resourceId)) {
      matched.push(events[index]);
    }
  }
  return matched;
};

export const resourceIds = (resources: CalendarResource[]): string[] => {
  const ids: string[] = [];
  for (let index = NUMBER_ZERO; index < resources.length; index += NUMBER_ONE) {
    ids.push(resources[index].id);
  }
  return ids;
};
