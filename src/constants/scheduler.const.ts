import type { SchedulerThemeChoice } from '../types';
import { NUMBER_SEVEN } from './numbers.const';
import { VIEW_MONTH } from './generals.const';

export const THEME_DEFAULT: SchedulerThemeChoice = 'default';
export const THEME_LIGHT: SchedulerThemeChoice = 'light';
export const THEME_DARK: SchedulerThemeChoice = 'dark';

export const THEME_OPTIONS: { value: string; label: string }[] = [
  { value: THEME_DEFAULT, label: 'Default theme' },
  { value: THEME_LIGHT, label: 'Light' },
  { value: THEME_DARK, label: 'Dark' },
];

export const VIEW_YEAR = 'year';
export const VIEW_RANGE = 'range';

export const SHOW_DAY = 'day';
export const SHOW_MONTH = VIEW_MONTH;
export const SHOW_YEAR = VIEW_YEAR;
export const SHOW_RANGE = VIEW_RANGE;

export const SHOW_OPTIONS: { value: string; label: string }[] = [
  { value: SHOW_RANGE, label: 'From – to' },
  { value: SHOW_DAY, label: 'Day' },
  { value: SHOW_MONTH, label: 'Month' },
  { value: SHOW_YEAR, label: 'Year' },
];

export const WEEK_START_OPTIONS: { value: string; label: string }[] = [
  { value: '0', label: 'Sunday' },
  { value: '1', label: 'Monday' },
];

export const SCALE_MONTHS = 'months';

export const SCALE_OPTIONS: { value: string; label: string }[] = [
  { value: SCALE_MONTHS, label: 'Months' },
];

export const TIMELINE_MONTH_COUNT = NUMBER_SEVEN;

export const EVENT_CALENDAR_TITLE = 'Event calendar';
export const EVENT_CALENDAR_DESCRIPTION =
  'Plan events across a month. Filter resources to hide their events, and open an event to edit it.';

export const EVENT_TIMELINE_TITLE = 'Event timeline';
export const EVENT_TIMELINE_DESCRIPTION =
  'Each resource has a row. Event bars run across the months in view.';

export const RESOURCE_COLUMN_LABEL = 'Resource title';
export const RESOURCES_HEADING = 'Resources';
export const SIDEBAR_SHOW_LABEL = 'Show sidebar';
export const SIDEBAR_HIDE_LABEL = 'Hide sidebar';
export const SETTINGS_LABEL = 'Settings';
export const SETTINGS_SIDEBAR_LABEL = 'Show month and resources';
export const SETTINGS_WEEK_LABEL = 'Week starts';
export const FROM_LABEL = 'From';
export const TO_LABEL = 'To';
export const YEAR_EVENT_LABEL = 'events';
