import type { CalendarEvent, CalendarResource, FirstDayOfWeek, NormalizedEvent, SchedulerThemeChoice } from '../../types';

export interface EventCalendarProps {
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
  visibleResourceIds?: string[];
  defaultVisibleResourceIds?: string[];
  onVisibleResourceIdsChange?: (ids: string[]) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onEventChange?: (event: CalendarEvent) => void;
  onEventCreate?: (event: CalendarEvent) => void;
  onEventDelete?: (event: CalendarEvent) => void;
  firstDayOfWeek?: FirstDayOfWeek;
  weekdays?: string[];
  showMiniCalendar?: boolean;
  showResourceFilter?: boolean;
  mode?: SchedulerThemeChoice;
}

export interface EventMonthGridProps {
  date: Date;
  events: NormalizedEvent[];
  resources: CalendarResource[];
  firstDayOfWeek: FirstDayOfWeek;
  weekdays: string[];
  onEventClick: (event: NormalizedEvent) => void;
  onDayClick: (day: Date) => void;
}
