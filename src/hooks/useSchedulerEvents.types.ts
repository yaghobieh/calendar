import type { CalendarEvent } from '../types';

export interface UseSchedulerEventsOptions {
  events?: CalendarEvent[];
  onEventChange?: (event: CalendarEvent) => void;
  onEventCreate?: (event: CalendarEvent) => void;
  onEventDelete?: (event: CalendarEvent) => void;
}

export interface UseSchedulerEventsReturn {
  events: CalendarEvent[];
  editing: CalendarEvent | null;
  openEvent: (event: CalendarEvent) => void;
  openCreate: (event: CalendarEvent) => void;
  closeEditor: () => void;
  saveEvent: (event: CalendarEvent) => void;
  deleteEvent: (event: CalendarEvent) => void;
}
