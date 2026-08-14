import { useState } from 'react';
import type { CalendarView, UseCalendarOptions, UseCalendarReturn } from '../types';
import { DEFAULT_VIEW, NUMBER_ONE } from '../constants';
import { shiftDate, startOfDay } from '../utils';

export const useCalendar = (options: UseCalendarOptions = {}): UseCalendarReturn => {
  const {
    view: viewProp,
    defaultView = DEFAULT_VIEW,
    onViewChange,
    date: dateProp,
    defaultDate,
    onDateChange,
  } = options;

  const [internalView, setInternalView] = useState<CalendarView>(defaultView);
  const [internalDate, setInternalDate] = useState(() => startOfDay(defaultDate ?? new Date()));

  const view = viewProp ?? internalView;
  const date = dateProp !== undefined ? startOfDay(dateProp) : internalDate;

  const setView = (nextView: CalendarView) => {
    if (viewProp === undefined) {
      setInternalView(nextView);
    }
    onViewChange?.(nextView);
  };

  const setDate = (nextDate: Date) => {
    const normalized = startOfDay(nextDate);
    if (dateProp === undefined) {
      setInternalDate(normalized);
    }
    onDateChange?.(normalized);
  };

  const goToPrevious = () => {
    setDate(shiftDate(date, view, -NUMBER_ONE));
  };

  const goToNext = () => {
    setDate(shiftDate(date, view, NUMBER_ONE));
  };

  const goToToday = () => {
    setDate(new Date());
  };

  return {
    view,
    date,
    setView,
    setDate,
    goToPrevious,
    goToNext,
    goToToday,
  };
};
