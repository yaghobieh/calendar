import { useState } from 'react';
import type { CalendarEvent } from '../types';
import type { UseSchedulerEventsOptions, UseSchedulerEventsReturn } from './useSchedulerEvents.types';
import { mergeCalendarEvents } from '../components/Calendar/Calendar.utils';
import { resolveSeriesEvent, upsertEvent, withoutHiddenEvents } from '@utils';

export function useSchedulerEvents(options: UseSchedulerEventsOptions): UseSchedulerEventsReturn {
  const { events, onEventChange, onEventCreate, onEventDelete } = options;
  const [localEvents, setLocalEvents] = useState<CalendarEvent[]>([]);
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  const [editing, setEditing] = useState<CalendarEvent | null>(null);
  const [creating, setCreating] = useState(false);
  const merged = withoutHiddenEvents(mergeCalendarEvents(events, localEvents), hiddenIds);

  const openEvent = (event: CalendarEvent) => {
    setCreating(false);
    setEditing(resolveSeriesEvent(merged, event));
  };

  const openCreate = (event: CalendarEvent) => {
    setCreating(true);
    setEditing(event);
  };

  const closeEditor = () => {
    setEditing(null);
    setCreating(false);
  };

  const saveEvent = (event: CalendarEvent) => {
    const isCreate = creating;
    setLocalEvents((current) => upsertEvent(current, event));
    setHiddenIds((current) => {
      const next: string[] = [];
      for (let index = 0; index < current.length; index += 1) {
        if (current[index] !== event.id) {
          next.push(current[index]);
        }
      }
      return next;
    });
    if (isCreate) {
      onEventCreate?.(event);
    } else {
      onEventChange?.(event);
    }
    closeEditor();
  };

  const deleteEvent = (event: CalendarEvent) => {
    setHiddenIds((current) => [...current, event.id]);
    setLocalEvents((current) => {
      const next: CalendarEvent[] = [];
      for (let index = 0; index < current.length; index += 1) {
        if (current[index].id !== event.id) {
          next.push(current[index]);
        }
      }
      return next;
    });
    onEventDelete?.(event);
    closeEditor();
  };

  return { events: merged, editing, openEvent, openCreate, closeEditor, saveEvent, deleteEvent };
}
