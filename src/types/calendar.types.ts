import type { ReactNode } from 'react';

export type CalendarView = 'month' | 'week' | 'day' | 'agenda';
export type CalendarMode = 'light' | 'dark';
export type FirstDayOfWeek = 0 | 1;
export type CalendarLayoutMode = 'contained' | 'fullPage';
export type CalendarModalContainment = 'calendar' | 'page';
export type CalendarRelationVisibility = 'always' | 'onClick' | 'never';
export type CalendarModalEffect = 'fade' | 'scale' | 'slideUp' | 'none';
export type CalendarEventSeverity = 'none' | 'low' | 'normal' | 'high' | 'urgent';
export type CalendarRecurrenceFreq =
  | 'none'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'everyXMonths'
  | 'yearly';

export interface CalendarPerson {
  id: string;
  name: string;
  fullName?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  facebook?: string;
  profileUrl?: string;
  title?: string;
}

export interface CalendarPersonIcons {
  email?: ReactNode;
  phone?: ReactNode;
  linkedin?: ReactNode;
  facebook?: ReactNode;
  profile?: ReactNode;
}

export interface CalendarSeverityIcons {
  none?: ReactNode;
  low?: ReactNode;
  normal?: ReactNode;
  high?: ReactNode;
  urgent?: ReactNode;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date | string;
  end: Date | string;
  allDay?: boolean;
  color?: string;
  description?: string;
  relatedTo?: string[];
  peopleIds?: string[];
  recurrence?: CalendarRecurrence;
  subtitle?: string;
  severity?: CalendarEventSeverity;
  meetingUrl?: string;
}

export interface CalendarRecurrence {
  freq: CalendarRecurrenceFreq;
  interval?: number;
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
  close: string;
  happeningNow: string;
  edit: string;
  save: string;
  cancel: string;
  titleLabel: string;
  startLabel: string;
  endLabel: string;
  allDayLabel: string;
  notesLabel: string;
  peopleLabel: string;
  relatedToLabel: string;
  relatedToPlaceholder: string;
  startTimeLabel: string;
  endTimeLabel: string;
  inviteLabel: string;
  invitePlaceholder: string;
  joinMeeting: string;
  emailLabel: string;
  phoneLabel: string;
  linkedinLabel: string;
  facebookLabel: string;
  profileLabel: string;
  recurrenceLabel: string;
  recurrenceNone: string;
  recurrenceDaily: string;
  recurrenceWeekly: string;
  recurrenceMonthly: string;
  recurrenceEveryXMonths: string;
  recurrenceYearly: string;
  recurrenceIntervalLabel: string;
  create: string;
  untitled: string;
  expandLayout: string;
  collapseLayout: string;
  markBusy: string;
  openEvent: string;
  busyDay: string;
  weekdays: string[];
}

export interface CalendarSlot {
  start: Date;
  end: Date;
  allDay: boolean;
}

export interface CalendarContextMenuPayload {
  type: 'slot' | 'event';
  slot?: CalendarSlot;
  event?: CalendarEvent;
  clientX: number;
  clientY: number;
  openCreate: () => void;
  openEvent: () => void;
  markBusy: () => void;
}

export interface CalendarNavIcons {
  previous?: ReactNode;
  today?: ReactNode;
  next?: ReactNode;
}

export interface CalendarTheme {
  primary?: string;
  border?: string;
  background?: string;
  text?: string;
  muted?: string;
  today?: string;
  event?: string;
}

export interface EventEditActions {
  onSave: (event: CalendarEvent) => void;
  onCancel: () => void;
  people: CalendarPerson[];
  events: CalendarEvent[];
  translations: CalendarTranslations;
  saveContent?: ReactNode;
  cancelContent?: ReactNode;
  showSave?: boolean;
  showCancel?: boolean;
  fields?: CalendarEditFieldsConfig;
  isCreate?: boolean;
  onDraftChange?: (event: CalendarEvent) => void;
  personIcons?: CalendarPersonIcons;
}

export interface CalendarEventModalConfig {
  showEdit?: boolean;
  showClose?: boolean;
  showSave?: boolean;
  showCancel?: boolean;
  editIcon?: ReactNode;
  closeIcon?: ReactNode;
  saveContent?: ReactNode;
  cancelContent?: ReactNode;
  containment?: CalendarModalContainment;
  createOnSlot?: boolean;
  effect?: CalendarModalEffect;
  openEffect?: CalendarModalEffect;
  closeEffect?: CalendarModalEffect;
}

export interface CalendarEditFieldsConfig {
  title?: boolean;
  start?: boolean;
  end?: boolean;
  allDay?: boolean;
  people?: boolean;
  notes?: boolean;
  relatedTo?: boolean;
  recurrence?: boolean;
}

export interface CalendarEditModalConfig {
  resizable?: boolean;
  fields?: CalendarEditFieldsConfig;
}

export interface CalendarRelationsConfig {
  visible?: CalendarRelationVisibility;
}

export interface CalendarLayoutIcons {
  expand?: ReactNode;
  collapse?: ReactNode;
}

export interface CalendarConfig {
  theme?: CalendarTheme;
  eventModal?: CalendarEventModalConfig;
  editModal?: CalendarEditModalConfig;
  relations?: CalendarRelationsConfig;
  layout?: CalendarLayoutMode;
  showLayoutToggle?: boolean;
  personIcons?: CalendarPersonIcons;
  severityIcons?: CalendarSeverityIcons;
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
  people?: CalendarPerson[];
  onEventClick?: (event: CalendarEvent) => void;
  onEventEdit?: (event: CalendarEvent) => void;
  onEventChange?: (event: CalendarEvent) => void;
  onEventCreate?: (event: CalendarEvent) => void;
  onSlotClick?: (slot: CalendarSlot) => void;
  onContextMenu?: (payload: CalendarContextMenuPayload) => void;
  firstDayOfWeek?: FirstDayOfWeek;
  translations?: Partial<CalendarTranslations>;
  mode?: CalendarMode;
  navIcons?: CalendarNavIcons;
  renderEventBody?: (event: CalendarEvent) => ReactNode;
  renderEventEdit?: (event: CalendarEvent, actions: EventEditActions) => ReactNode;
  theme?: CalendarTheme;
  eventModal?: CalendarEventModalConfig;
  editModal?: CalendarEditModalConfig;
  relations?: CalendarRelationsConfig;
  config?: CalendarConfig;
  layout?: CalendarLayoutMode;
  defaultLayout?: CalendarLayoutMode;
  onLayoutChange?: (layout: CalendarLayoutMode) => void;
  layoutIcons?: CalendarLayoutIcons;
  showLayoutToggle?: boolean;
  personIcons?: CalendarPersonIcons;
  severityIcons?: CalendarSeverityIcons;
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
  onEventChange?: (event: CalendarEvent) => void;
  onSlotClick?: (slot: CalendarSlot) => void;
  resizable?: boolean;
  relationVisible?: CalendarRelationVisibility;
  activeEventId?: string;
  joinMeeting?: string;
}
