import type { CalendarEvent, NormalizedEvent } from '../types';
import {
  HOURS_IN_DAY,
  MIN_RESIZE_MINUTES,
  MINUTES_IN_HOUR,
  MS_IN_MINUTE,
  NUMBER_ZERO,
  SNAP_MINUTES,
} from '@constants';

export const snapMinutes = (minutes: number): number => {
  const snapped = Math.round(minutes / SNAP_MINUTES) * SNAP_MINUTES;
  return Math.max(MIN_RESIZE_MINUTES, snapped);
};

export const minutesFromHeight = (heightPx: number, columnHeightPx: number): number => {
  if (columnHeightPx <= NUMBER_ZERO) {
    return MIN_RESIZE_MINUTES;
  }
  return (heightPx / columnHeightPx) * HOURS_IN_DAY * MINUTES_IN_HOUR;
};

export const eventWithEndFromHeight = (
  event: NormalizedEvent,
  heightPx: number,
  columnHeightPx: number,
): CalendarEvent => {
  const minutes = snapMinutes(minutesFromHeight(heightPx, columnHeightPx));
  const end = new Date(event.start.getTime() + minutes * MS_IN_MINUTE);
  return {
    ...event.source,
    start: event.start,
    end,
  };
};
