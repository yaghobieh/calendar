import { describe, it, expect } from 'vitest';
import {
  HOUR_LABEL_PAD,
  HOURS_IN_DAY,
  MONTH_CELL_COUNT,
  NUMBER_ONE,
  NUMBER_SEVEN,
  NUMBER_TEN,
  NUMBER_TWELVE,
  NUMBER_TWENTY_THREE,
  NUMBER_TWO,
  NUMBER_ZERO,
  PAD_ZERO,
  TIME_SEPARATOR,
  ZERO_MINUTES_LABEL,
} from '../constants';
import {
  addDays,
  getMonthGrid,
  hourLabels,
  isSameDay,
  startOfDay,
  startOfWeek,
} from './date.utils';

describe('date.utils', () => {
  it('zeros time at start of day', () => {
    const date = new Date(2026, NUMBER_SEVEN, NUMBER_TEN, NUMBER_TWELVE, NUMBER_TEN, NUMBER_TEN);
    const start = startOfDay(date);
    expect(start.getHours()).toBe(NUMBER_ZERO);
    expect(start.getMinutes()).toBe(NUMBER_ZERO);
    expect(start.getSeconds()).toBe(NUMBER_ZERO);
    expect(start.getMilliseconds()).toBe(NUMBER_ZERO);
    expect(start.getDate()).toBe(date.getDate());
  });

  it('adds days', () => {
    const date = new Date(2026, NUMBER_SEVEN, NUMBER_TEN);
    const next = addDays(date, NUMBER_TWO);
    expect(next.getDate()).toBe(NUMBER_TWELVE);
  });

  it('detects the same day and different days', () => {
    const morning = new Date(2026, NUMBER_SEVEN, NUMBER_TEN, NUMBER_ONE);
    const evening = new Date(2026, NUMBER_SEVEN, NUMBER_TEN, NUMBER_TWELVE);
    expect(isSameDay(morning, evening)).toBe(true);
    expect(isSameDay(morning, addDays(morning, NUMBER_ONE))).toBe(false);
  });

  it('lands on Sunday when first day of week is Sunday', () => {
    const wednesday = new Date(2026, NUMBER_SEVEN, NUMBER_TWELVE);
    const start = startOfWeek(wednesday, NUMBER_ZERO);
    expect(start.getDay()).toBe(NUMBER_ZERO);
  });

  it('builds a month grid with MONTH_CELL_COUNT cells', () => {
    const august = new Date(2026, NUMBER_SEVEN, NUMBER_ONE);
    const grid = getMonthGrid(august, NUMBER_ZERO);
    expect(grid.length).toBe(MONTH_CELL_COUNT);
  });

  it('builds hour labels from 00:00 to 23:00', () => {
    const labels = hourLabels();
    const firstLabel = `${String(NUMBER_ZERO).padStart(HOUR_LABEL_PAD, PAD_ZERO)}${TIME_SEPARATOR}${ZERO_MINUTES_LABEL}`;
    const lastLabel = `${String(NUMBER_TWENTY_THREE).padStart(HOUR_LABEL_PAD, PAD_ZERO)}${TIME_SEPARATOR}${ZERO_MINUTES_LABEL}`;
    expect(labels.length).toBe(HOURS_IN_DAY);
    expect(labels[NUMBER_ZERO]).toBe(firstLabel);
    expect(labels[NUMBER_TWENTY_THREE]).toBe(lastLabel);
  });
});
