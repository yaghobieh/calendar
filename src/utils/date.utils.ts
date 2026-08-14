import type { CalendarView, FirstDayOfWeek } from '../types';
import {
  DAYS_IN_WEEK,
  DEFAULT_LOCALE,
  DAY_HEADING_FORMAT,
  HOUR_LABEL_PAD,
  HOURS_IN_DAY,
  MONDAY_INDEX,
  MONTH_CELL_COUNT,
  MONTH_YEAR_FORMAT,
  NUMBER_ONE,
  NUMBER_ZERO,
  PAD_ZERO,
  RANGE_SEPARATOR,
  SHORT_DATE_FORMAT,
  SUNDAY_INDEX,
  SUNDAY_MONDAY_OFFSET,
  TIME_SEPARATOR,
  VIEW_DAY,
  VIEW_MONTH,
  ZERO_MINUTES_LABEL,
} from '../constants';

export const toDate = (value: Date | string): Date => {
  if (value instanceof Date) {
    return new Date(value.getTime());
  }
  return new Date(value);
};

export const startOfDay = (date: Date): Date => {
  const next = new Date(date);
  next.setHours(NUMBER_ZERO, NUMBER_ZERO, NUMBER_ZERO, NUMBER_ZERO);
  return next;
};

export const addDays = (date: Date, amount: number): Date => {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
};

export const addMonths = (date: Date, amount: number): Date => {
  const next = new Date(date);
  next.setMonth(next.getMonth() + amount);
  return next;
};

export const startOfWeek = (date: Date, firstDayOfWeek: FirstDayOfWeek): Date => {
  const start = startOfDay(date);
  const day = start.getDay();
  if (firstDayOfWeek === MONDAY_INDEX) {
    const diff = day === SUNDAY_INDEX ? SUNDAY_MONDAY_OFFSET : day - NUMBER_ONE;
    return addDays(start, -diff);
  }
  return addDays(start, -day);
};

export const isSameDay = (left: Date, right: Date): boolean =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate();

export const isSameMonth = (left: Date, right: Date): boolean =>
  left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth();

export const formatMonthYear = (date: Date, locale: string = DEFAULT_LOCALE): string =>
  date.toLocaleDateString(locale, MONTH_YEAR_FORMAT);

export const formatDayHeading = (date: Date, locale: string = DEFAULT_LOCALE): string =>
  date.toLocaleDateString(locale, DAY_HEADING_FORMAT);

export const formatShortDate = (date: Date, locale: string = DEFAULT_LOCALE): string =>
  date.toLocaleDateString(locale, SHORT_DATE_FORMAT);

export const formatWeekRange = (
  date: Date,
  firstDayOfWeek: FirstDayOfWeek,
  locale: string = DEFAULT_LOCALE,
): string => {
  const start = startOfWeek(date, firstDayOfWeek);
  const end = addDays(start, DAYS_IN_WEEK - NUMBER_ONE);
  return `${formatShortDate(start, locale)}${RANGE_SEPARATOR}${formatShortDate(end, locale)}`;
};

export const getMonthGrid = (date: Date, firstDayOfWeek: FirstDayOfWeek): Date[] => {
  const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), NUMBER_ONE);
  const gridStart = startOfWeek(firstOfMonth, firstDayOfWeek);
  const cells: Date[] = [];
  for (let index = NUMBER_ZERO; index < MONTH_CELL_COUNT; index += NUMBER_ONE) {
    cells.push(addDays(gridStart, index));
  }
  return cells;
};

export const getWeekDays = (date: Date, firstDayOfWeek: FirstDayOfWeek): Date[] => {
  const start = startOfWeek(date, firstDayOfWeek);
  const days: Date[] = [];
  for (let index = NUMBER_ZERO; index < DAYS_IN_WEEK; index += NUMBER_ONE) {
    days.push(addDays(start, index));
  }
  return days;
};

export const hourLabels = (): string[] => {
  const labels: string[] = [];
  for (let hour = NUMBER_ZERO; hour < HOURS_IN_DAY; hour += NUMBER_ONE) {
    labels.push(
      `${String(hour).padStart(HOUR_LABEL_PAD, PAD_ZERO)}${TIME_SEPARATOR}${ZERO_MINUTES_LABEL}`,
    );
  }
  return labels;
};

export const shiftDate = (date: Date, view: CalendarView, direction: number): Date => {
  if (view === VIEW_MONTH) {
    return addMonths(date, direction);
  }
  if (view === VIEW_DAY) {
    return addDays(date, direction);
  }
  return addDays(date, direction * DAYS_IN_WEEK);
};

export const startOfHour = (date: Date, hour: number): Date => {
  const next = startOfDay(date);
  next.setHours(hour, NUMBER_ZERO, NUMBER_ZERO, NUMBER_ZERO);
  return next;
};
