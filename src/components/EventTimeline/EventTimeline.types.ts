import type { CalendarEvent, CalendarResource } from '../../types';

export interface EventTimelineProps {
  id?: string;
  testId?: string;
  className?: string;
  title?: string;
  description?: string;
  date?: Date;
  defaultDate?: Date;
  onDateChange?: (date: Date) => void;
  events?: CalendarEvent[];
  resources?: CalendarResource[];
  onEventClick?: (event: CalendarEvent) => void;
  onEventChange?: (event: CalendarEvent) => void;
  onEventCreate?: (event: CalendarEvent) => void;
  onEventDelete?: (event: CalendarEvent) => void;
}
