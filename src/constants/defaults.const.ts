import type { CalendarTranslations, CalendarView, FirstDayOfWeek } from '../types';
import { NUMBER_ZERO } from './numbers.const';
import { VIEW_MONTH } from './generals.const';

export const DEFAULT_VIEW: CalendarView = VIEW_MONTH;

export const DEFAULT_FIRST_DAY: FirstDayOfWeek = NUMBER_ZERO;

export const DEFAULT_TRANSLATIONS: CalendarTranslations = {
  month: 'Month',
  week: 'Week',
  day: 'Day',
  agenda: 'Agenda',
  today: 'Today',
  previous: 'Previous',
  next: 'Next',
  noEvents: 'No events',
  weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
};
