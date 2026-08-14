export const EMPTY_STRING = '';
export const SPACE_STRING = ' ';
export const PAD_ZERO = '0';
export const TIME_SEPARATOR = ':';
export const ZERO_MINUTES_LABEL = '00';
export const RANGE_SEPARATOR = ' – ';
export const MORE_PREFIX = '+';
export const ROOT_ID_FALLBACK = 'root';

export const VIEW_MONTH = 'month';
export const VIEW_WEEK = 'week';
export const VIEW_DAY = 'day';
export const VIEW_AGENDA = 'agenda';

export const LAYOUT_CONTAINED = 'contained';
export const LAYOUT_FULL_PAGE = 'fullPage';
export const MODAL_CONTAINMENT_PAGE = 'page';
export const MODAL_CONTAINMENT_CALENDAR = 'calendar';

export const RELATION_VISIBLE_ALWAYS = 'always';
export const RELATION_VISIBLE_ON_CLICK = 'onClick';
export const RELATION_VISIBLE_NEVER = 'never';

export const MODAL_EFFECT_FADE = 'fade';
export const MODAL_EFFECT_SCALE = 'scale';
export const MODAL_EFFECT_SLIDE_UP = 'slideUp';
export const MODAL_EFFECT_NONE = 'none';

export const DRAFT_ID_PREFIX = 'cal-new-';
export const OCCURRENCE_ID_SEP = '__occ__';

export const RECURRENCE_NONE = 'none';
export const RECURRENCE_DAILY = 'daily';
export const RECURRENCE_WEEKLY = 'weekly';
export const RECURRENCE_MONTHLY = 'monthly';
export const RECURRENCE_EVERY_X_MONTHS = 'everyXMonths';
export const RECURRENCE_YEARLY = 'yearly';
export const CLOSE_GLYPH = '×';

export const MODE_LIGHT = 'light';
export const MODE_DARK = 'dark';

export const KEY_ARROW_LEFT = 'ArrowLeft';
export const KEY_ARROW_RIGHT = 'ArrowRight';
export const KEY_ARROW_UP = 'ArrowUp';
export const KEY_ARROW_DOWN = 'ArrowDown';
export const KEY_TODAY = 't';
export const KEY_TODAY_UPPER = 'T';
export const KEY_ENTER = 'Enter';

export const DEFAULT_LOCALE = 'en-US';

export const MONTH_YEAR_FORMAT: Intl.DateTimeFormatOptions = {
  month: 'long',
  year: 'numeric',
};

export const DAY_HEADING_FORMAT: Intl.DateTimeFormatOptions = {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
};

export const SHORT_DATE_FORMAT: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
};

export const AGENDA_DAY_FORMAT: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
};
