import { Typography } from '@forgedevstack/bear';
import type { CalendarResource, NormalizedEvent } from '../../types';
import type { EventMonthGridProps } from './EventCalendar.types';
import {
  BUTTON_TYPE,
  CAL_EVENT_SHOW,
  CAL_EVENT_SHOW_DATE,
  CAL_EVENT_SHOW_DAY,
  CAL_EVENT_SHOW_DOT,
  CAL_EVENT_SHOW_EMPTY,
  CAL_EVENT_SHOW_ITEM,
  CAL_EVENT_YEAR,
  CAL_EVENT_YEAR_COUNT,
  CAL_EVENT_YEAR_MONTH,
  MONTHS_IN_YEAR,
  RANGE_DAY_CAP,
  ALL_DAY_SHOW_LABEL,
} from './EventShow.const';
import {
  DEFAULT_TRANSLATIONS,
  NUMBER_ONE,
  NUMBER_ZERO,
  SHOW_DAY,
  SHOW_RANGE,
  SHOW_YEAR,
  YEAR_EVENT_LABEL,
} from '@constants';
import {
  addDays,
  addMonths,
  eventColor,
  eventsForDay,
  formatEventClock,
  formatMonthShort,
  formatShortDate,
  startOfMonth,
} from '@utils';

interface EventShowProps {
  show: string;
  date: Date;
  rangeFrom: Date;
  rangeTo: Date;
  events: NormalizedEvent[];
  resources: CalendarResource[];
  onEventClick: EventMonthGridProps['onEventClick'];
  onPickMonth: (month: Date) => void;
}

function monthEventCount(events: NormalizedEvent[], month: Date): number {
  const start = startOfMonth(month).getTime();
  const end = addMonths(startOfMonth(month), NUMBER_ONE).getTime();
  let count = NUMBER_ZERO;
  for (let index = NUMBER_ZERO; index < events.length; index += NUMBER_ONE) {
    const event = events[index];
    if (event.start.getTime() < end && event.end.getTime() >= start) {
      count += NUMBER_ONE;
    }
  }
  return count;
}

function EventButton(props: {
  event: NormalizedEvent;
  resources: CalendarResource[];
  onEventClick: EventMonthGridProps['onEventClick'];
}) {
  const { event, resources, onEventClick } = props;
  return (
    <button type={BUTTON_TYPE} className={CAL_EVENT_SHOW_ITEM} onClick={() => onEventClick(event)}>
      <span className={CAL_EVENT_SHOW_DOT} style={{ background: eventColor(event, resources) }} />
      <span>{event.title}</span>
      <span>{event.allDay ? ALL_DAY_SHOW_LABEL : formatEventClock(event.start)}</span>
    </button>
  );
}

export function EventShow(props: EventShowProps) {
  const { show, date, rangeFrom, rangeTo, events, resources, onEventClick, onPickMonth } = props;

  if (show === SHOW_YEAR) {
    const january = startOfMonth(new Date(date.getFullYear(), NUMBER_ZERO, NUMBER_ONE));
    const months: Date[] = [];
    for (let index = NUMBER_ZERO; index < MONTHS_IN_YEAR; index += NUMBER_ONE) {
      months.push(addMonths(january, index));
    }
    return (
      <div className={CAL_EVENT_YEAR}>
        {months.map((month) => (
          <button
            key={month.toISOString()}
            type={BUTTON_TYPE}
            className={CAL_EVENT_YEAR_MONTH}
            onClick={() => onPickMonth(month)}
          >
            <Typography variant="subtitle2">{formatMonthShort(month)}</Typography>
            <span className={CAL_EVENT_YEAR_COUNT}>
              {monthEventCount(events, month)} {YEAR_EVENT_LABEL}
            </span>
          </button>
        ))}
      </div>
    );
  }

  if (show === SHOW_RANGE) {
    const start = rangeFrom.getTime() <= rangeTo.getTime() ? rangeFrom : rangeTo;
    const end = rangeFrom.getTime() <= rangeTo.getTime() ? rangeTo : rangeFrom;
    const days: Date[] = [];
    let cursor = start;
    while (cursor.getTime() <= end.getTime() && days.length < RANGE_DAY_CAP) {
      days.push(cursor);
      cursor = addDays(cursor, NUMBER_ONE);
    }
    return (
      <div className={CAL_EVENT_SHOW}>
        {days.map((day) => {
          const items = eventsForDay(events, day);
          return (
            <section key={day.toISOString()} className={CAL_EVENT_SHOW_DAY}>
              <Typography variant="caption" className={CAL_EVENT_SHOW_DATE}>
                {formatShortDate(day)}
              </Typography>
              {items.length === NUMBER_ZERO ? (
                <p className={CAL_EVENT_SHOW_EMPTY}>{DEFAULT_TRANSLATIONS.noEvents}</p>
              ) : (
                items.map((event) => (
                  <EventButton
                    key={`${day.toISOString()}-${event.id}`}
                    event={event}
                    resources={resources}
                    onEventClick={onEventClick}
                  />
                ))
              )}
            </section>
          );
        })}
      </div>
    );
  }

  if (show === SHOW_DAY) {
    const items = eventsForDay(events, date);
    return (
      <div className={CAL_EVENT_SHOW}>
        {items.length === NUMBER_ZERO ? (
          <p className={CAL_EVENT_SHOW_EMPTY}>{DEFAULT_TRANSLATIONS.noEvents}</p>
        ) : (
          items.map((event) => (
            <EventButton key={event.id} event={event} resources={resources} onEventClick={onEventClick} />
          ))
        )}
      </div>
    );
  }

  return null;
}
