import type {
  CalendarLayoutMode,
  CalendarTranslations,
  CalendarView,
  FirstDayOfWeek,
} from '../types';
import { NUMBER_ZERO } from './numbers.const';
import { LAYOUT_CONTAINED, VIEW_MONTH } from './generals.const';

export const DEFAULT_VIEW: CalendarView = VIEW_MONTH;

export const DEFAULT_LAYOUT: CalendarLayoutMode = LAYOUT_CONTAINED;

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
  close: 'Close',
  happeningNow: 'Happening now',
  edit: 'Edit',
  save: 'Save',
  cancel: 'Cancel',
  titleLabel: 'Title',
  startLabel: 'Start',
  endLabel: 'End',
  allDayLabel: 'All day',
  notesLabel: 'Notes',
  peopleLabel: 'People',
  relatedToLabel: 'Relation with',
  relatedToPlaceholder: 'Search events',
  startTimeLabel: 'Start time',
  endTimeLabel: 'End time',
  inviteLabel: 'Invite',
  invitePlaceholder: 'Search people to invite',
  emailLabel: 'Email',
  phoneLabel: 'Phone',
  linkedinLabel: 'LinkedIn',
  facebookLabel: 'Facebook',
  profileLabel: 'Profile',
  recurrenceLabel: 'Repeat',
  recurrenceNone: 'Does not repeat',
  recurrenceDaily: 'Every day',
  recurrenceWeekly: 'Every week at this time',
  recurrenceMonthly: 'Every month',
  recurrenceEveryXMonths: 'Every X months',
  recurrenceYearly: 'Every year',
  recurrenceIntervalLabel: 'Every how many months',
  create: 'Create event',
  untitled: 'New event',
  expandLayout: 'Full page',
  collapseLayout: 'Exit full page',
  weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
};
