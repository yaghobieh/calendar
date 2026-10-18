import {
  RECURRENCE_DAILY,
  RECURRENCE_EVERY_X_MONTHS,
  RECURRENCE_MONTHLY,
  RECURRENCE_NONE,
  RECURRENCE_WEEKLY,
  RECURRENCE_YEARLY,
} from '@constants';

export const CAL_EVENT_EDIT = 'Cal-EventEdit';
export const CAL_EVENT_EDIT_HEADER = 'Cal-EventEdit__header';
export const CAL_EVENT_EDIT_SECTION = 'Cal-EventEdit__section';
export const CAL_EVENT_EDIT_HEADING = 'Cal-EventEdit__heading';
export const CAL_EVENT_EDIT_TIMES = 'Cal-EventEdit__times';
export const CAL_EVENT_EDIT_COLORS = 'Cal-EventEdit__colors';
export const CAL_EVENT_EDIT_COLOR = 'Cal-EventEdit__colorBtn';
export const CAL_EVENT_EDIT_SWATCH = 'Cal-EventEdit__swatch';
export const CAL_EVENT_EDIT_ACTIONS = 'Cal-EventEdit__actions';
export const CAL_EVENT_EDIT_DELETE = 'Cal-EventEdit__delete';

export const TAB_GENERAL = 'general';
export const TAB_RECURRENCE = 'recurrence';
export const BUTTON_TYPE = 'button';

export const EDIT_EVENT_TITLE = 'Edit event';
export const NEW_EVENT_TITLE = 'New event';
export const GENERAL_TAB_LABEL = 'General';
export const RECURRENCE_TAB_LABEL = 'Recurrence';
export const DATE_TIME_LABEL = 'Date and time';
export const RESOURCE_COLOR_LABEL = 'Resource and color';
export const START_DATE_LABEL = 'Start date';
export const START_TIME_LABEL = 'Start time';
export const END_DATE_LABEL = 'End date';
export const END_TIME_LABEL = 'End time';
export const ALL_DAY_LABEL = 'All day';
export const RESOURCE_LABEL = 'Resource';
export const DESCRIPTION_LABEL = 'Description';
export const TITLE_LABEL = 'Title';
export const DELETE_EVENT_LABEL = 'Delete event';
export const SAVE_EVENT_LABEL = 'Save';
export const CLOSE_EDITOR_LABEL = 'Close';
export const REPEAT_LABEL = 'Repeat';
export const INTERVAL_LABEL = 'Every how many months';
export const TIME_FORMAT = '24h';

export const RECURRENCE_OPTIONS: { value: string; label: string }[] = [
  { value: RECURRENCE_NONE, label: 'Does not repeat' },
  { value: RECURRENCE_DAILY, label: 'Every day' },
  { value: RECURRENCE_WEEKLY, label: 'Every week' },
  { value: RECURRENCE_MONTHLY, label: 'Every month' },
  { value: RECURRENCE_EVERY_X_MONTHS, label: 'Every X months' },
  { value: RECURRENCE_YEARLY, label: 'Every year' },
];
