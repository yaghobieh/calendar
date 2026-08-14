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
export const BUSY_ID_PREFIX = 'cal-busy-';
export const OCCURRENCE_ID_SEP = '__occ__';
export const ATTR_CAL_EVENT = 'data-cal-event';
export const ATTR_CAL_SLOT = 'data-cal-slot';
export const ATTR_CAL_ALL_DAY = 'data-cal-all-day';
export const ATTR_TRUE = 'true';

export const RECURRENCE_NONE = 'none';
export const RECURRENCE_DAILY = 'daily';
export const RECURRENCE_WEEKLY = 'weekly';
export const RECURRENCE_MONTHLY = 'monthly';
export const RECURRENCE_EVERY_X_MONTHS = 'everyXMonths';
export const RECURRENCE_YEARLY = 'yearly';
export const CLOSE_GLYPH = '×';

export const MODE_LIGHT = 'light';
export const MODE_DARK = 'dark';

export const SHOW_AS_FREE = 'free';
export const SHOW_AS_BUSY = 'busy';
export const SHOW_AS_TENTATIVE = 'tentative';
export const SHOW_AS_OOF = 'oof';
export const DEFAULT_SHOW_AS = SHOW_AS_BUSY;

export const SEVERITY_NONE = 'none';
export const SEVERITY_LOW = 'low';
export const SEVERITY_NORMAL = 'normal';
export const SEVERITY_HIGH = 'high';
export const SEVERITY_URGENT = 'urgent';

export const TIME_GRID_COLUMN_SELECTOR = '.Cal-TimeGrid__column';
export const CAL_BG_VAR = '--cal-bg';
export const CAL_TEXT_VAR = '--cal-text';
export const CAL_BORDER_VAR = '--cal-border';
export const CAL_MUTED_VAR = '--cal-muted';
export const CAL_PRIMARY_VAR = '--cal-primary';
export const PEEK_BG_FALLBACK = '#0f172a';
export const PEEK_TEXT_FALLBACK = '#f8fafc';
export const PEEK_BORDER_FALLBACK = 'rgba(148, 163, 184, 0.35)';
export const PEEK_MUTED_FALLBACK = '#94a3b8';
export const PEEK_PRIMARY_FALLBACK = '#14b8a6';

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
