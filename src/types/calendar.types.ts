export type CalendarView = 'month' | 'week' | 'day' | 'agenda';
export type CalendarMode = 'light' | 'dark';
export type FirstDayOfWeek = 0 | 1;

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date | string;
  end: Date | string;
  allDay?: boolean;
  color?: string;
  description?: string;
}

export interface CalendarTranslations {
  month: string;
  week: string;
  day: string;
  agenda: string;
  today: string;
  previous: string;
  next: string;
  noEvents: string;
  weekdays: string[];
}

export interface CalendarSlot {
  start: Date;
  end: Date;
  allDay: boolean;
}

export interface CalendarProps {
  id?: string;
  testId?: string;
  className?: string;
  view?: CalendarView;
  defaultView?: CalendarView;
  onViewChange?: (view: CalendarView) => void;
  date?: Date;
  defaultDate?: Date;
  onDateChange?: (date: Date) => void;
  events?: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onSlotClick?: (slot: CalendarSlot) => void;
  firstDayOfWeek?: FirstDayOfWeek;
  translations?: Partial<CalendarTranslations>;
  mode?: CalendarMode;
}

export interface NormalizedEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  color?: string;
  description?: string;
  source: CalendarEvent;
}

export interface PositionedEvent {
  event: NormalizedEvent;
  topPercent: number;
  heightPercent: number;
  columnIndex: number;
  columnCount: number;
}

export interface UseCalendarOptions {
  view?: CalendarView;
  defaultView?: CalendarView;
  onViewChange?: (view: CalendarView) => void;
  date?: Date;
  defaultDate?: Date;
  onDateChange?: (date: Date) => void;
}

export interface UseCalendarReturn {
  view: CalendarView;
  date: Date;
  setView: (view: CalendarView) => void;
  setDate: (date: Date) => void;
  goToPrevious: () => void;
  goToNext: () => void;
  goToToday: () => void;
}

export interface CalendarViewBaseProps {
  date: Date;
  events: NormalizedEvent[];
  firstDayOfWeek: FirstDayOfWeek;
  weekdays: string[];
  onEventClick?: (event: CalendarEvent) => void;
  onSlotClick?: (slot: CalendarSlot) => void;
}
