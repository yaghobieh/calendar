import type { CalendarEvent, CalendarSlot } from '../types';
import {
  ATTR_CAL_ALL_DAY,
  ATTR_CAL_EVENT,
  ATTR_CAL_SLOT,
  ATTR_TRUE,
  BUSY_ID_PREFIX,
  NUMBER_ONE,
  NUMBER_ZERO,
  SHOW_AS_BUSY,
} from '@constants';
import { addDays, startOfDay } from './date.utils';

export const eventDataAttrs = (eventId: string): Record<string, string> => ({
  [ATTR_CAL_EVENT]: eventId,
});

export const slotDataAttrs = (start: Date, allDay: boolean): Record<string, string> => {
  const attrs: Record<string, string> = {
    [ATTR_CAL_SLOT]: start.toISOString(),
  };
  if (allDay) {
    attrs[ATTR_CAL_ALL_DAY] = ATTR_TRUE;
  }
  return attrs;
};

export const slotFromEvent = (event: CalendarEvent): CalendarSlot => ({
  start: new Date(event.start),
  end: new Date(event.end),
  allDay: Boolean(event.allDay),
});

export const slotFromIso = (iso: string, allDay: boolean): CalendarSlot => {
  const start = new Date(iso);
  if (allDay) {
    const dayStart = startOfDay(start);
    return {
      start: dayStart,
      end: addDays(dayStart, NUMBER_ONE),
      allDay: true,
    };
  }
  const end = new Date(start);
  end.setHours(end.getHours() + NUMBER_ONE);
  return { start, end, allDay: false };
};

export const createBusyEvent = (slot: CalendarSlot, title: string): CalendarEvent => {
  const dayStart = startOfDay(new Date(slot.start));
  return {
    id: `${BUSY_ID_PREFIX}${Date.now()}`,
    title,
    start: dayStart,
    end: addDays(dayStart, NUMBER_ONE),
    allDay: true,
    showAs: SHOW_AS_BUSY,
  };
};

export const parseContextMenuTarget = (
  target: EventTarget | null,
  events: CalendarEvent[],
): { type: 'slot' | 'event'; event?: CalendarEvent; slot?: CalendarSlot } | null => {
  if (!(target instanceof Element)) {
    return null;
  }
  const eventNode = target.closest(`[${ATTR_CAL_EVENT}]`);
  if (eventNode) {
    const eventId = eventNode.getAttribute(ATTR_CAL_EVENT);
    if (eventId) {
      let match: CalendarEvent | undefined;
      for (let index = NUMBER_ZERO; index < events.length; index += NUMBER_ONE) {
        if (events[index].id === eventId) {
          match = events[index];
          break;
        }
      }
      if (match) {
        return { type: 'event', event: match, slot: slotFromEvent(match) };
      }
    }
  }
  const slotNode = target.closest(`[${ATTR_CAL_SLOT}]`);
  if (!slotNode) {
    return null;
  }
  const iso = slotNode.getAttribute(ATTR_CAL_SLOT);
  if (!iso) {
    return null;
  }
  const allDay = slotNode.getAttribute(ATTR_CAL_ALL_DAY) === ATTR_TRUE;
  return { type: 'slot', slot: slotFromIso(iso, allDay) };
};
