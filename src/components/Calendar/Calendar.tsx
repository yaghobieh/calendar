import type { KeyboardEvent } from 'react';
import type { CalendarProps } from '../../types';
import { CalendarHeader } from '../CalendarHeader';
import { MonthView } from '../MonthView';
import { WeekView } from '../WeekView';
import { DayView } from '../DayView';
import { AgendaView } from '../AgendaView';
import { CAL_BEM, TAB_INDEX_ROOT } from './Calendar.const';
import { headerTitle, mergeTranslations, resolveCalendarId } from './Calendar.utils';
import {
  DEFAULT_FIRST_DAY,
  KEY_ARROW_DOWN,
  KEY_ARROW_LEFT,
  KEY_ARROW_RIGHT,
  KEY_ARROW_UP,
  KEY_TODAY,
  KEY_TODAY_UPPER,
  VIEW_AGENDA,
  VIEW_DAY,
  VIEW_MONTH,
  VIEW_WEEK,
} from '../../constants';
import { useCalendar } from '../../hooks';
import { joinClassNames, normalizeEvents } from '../../utils';

export function Calendar(props: CalendarProps) {
  const {
    id,
    testId,
    className,
    view,
    defaultView,
    onViewChange,
    date,
    defaultDate,
    onDateChange,
    events,
    onEventClick,
    onSlotClick,
    firstDayOfWeek = DEFAULT_FIRST_DAY,
    translations,
    mode,
  } = props;
  const calendar = useCalendar({ view, defaultView, onViewChange, date, defaultDate, onDateChange });
  const labels = mergeTranslations(translations);
  const normalized = normalizeEvents(events);
  const rootId = resolveCalendarId(id);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const key = event.key;
    if (key === KEY_ARROW_LEFT || key === KEY_ARROW_UP) {
      event.preventDefault();
      calendar.goToPrevious();
      return;
    }
    if (key === KEY_ARROW_RIGHT || key === KEY_ARROW_DOWN) {
      event.preventDefault();
      calendar.goToNext();
      return;
    }
    if (key === KEY_TODAY || key === KEY_TODAY_UPPER) {
      event.preventDefault();
      calendar.goToToday();
    }
  };

  return (
    <div
      id={rootId}
      data-testid={testId}
      data-cal-mode={mode}
      className={joinClassNames(CAL_BEM, className)}
      tabIndex={TAB_INDEX_ROOT}
      onKeyDown={handleKeyDown}
    >
      <CalendarHeader
        title={headerTitle(calendar.view, calendar.date, firstDayOfWeek)}
        view={calendar.view}
        translations={labels}
        onPrevious={calendar.goToPrevious}
        onNext={calendar.goToNext}
        onToday={calendar.goToToday}
        onViewChange={calendar.setView}
      />
      {calendar.view === VIEW_MONTH && (
        <MonthView
          date={calendar.date}
          events={normalized}
          firstDayOfWeek={firstDayOfWeek}
          weekdays={labels.weekdays}
          onEventClick={onEventClick}
          onSlotClick={onSlotClick}
        />
      )}
      {calendar.view === VIEW_WEEK && (
        <WeekView
          date={calendar.date}
          events={normalized}
          firstDayOfWeek={firstDayOfWeek}
          weekdays={labels.weekdays}
          onEventClick={onEventClick}
          onSlotClick={onSlotClick}
        />
      )}
      {calendar.view === VIEW_DAY && (
        <DayView
          date={calendar.date}
          events={normalized}
          firstDayOfWeek={firstDayOfWeek}
          weekdays={labels.weekdays}
          onEventClick={onEventClick}
          onSlotClick={onSlotClick}
        />
      )}
      {calendar.view === VIEW_AGENDA && (
        <AgendaView
          date={calendar.date}
          events={normalized}
          firstDayOfWeek={firstDayOfWeek}
          weekdays={labels.weekdays}
          onEventClick={onEventClick}
          onSlotClick={onSlotClick}
          noEvents={labels.noEvents}
        />
      )}
    </div>
  );
}
