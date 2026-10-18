import type { MouseEvent } from 'react';
import type { NormalizedEvent } from '../../types';
import type { EventMonthGridProps } from './EventCalendar.types';
import {
  BUTTON_TYPE,
  CAL_EVENT_MONTH,
  CAL_EVENT_MONTH_DATE,
  CAL_EVENT_MONTH_DATE_TODAY,
  CAL_EVENT_MONTH_DAY,
  CAL_EVENT_MONTH_DAY_OUTSIDE,
  CAL_EVENT_MONTH_DAY_TODAY,
  CAL_EVENT_MONTH_DOT,
  CAL_EVENT_MONTH_EVENTS,
  CAL_EVENT_MONTH_ITEM,
  CAL_EVENT_MONTH_MORE,
  CAL_EVENT_MONTH_SPAN,
  CAL_EVENT_MONTH_SPANS,
  CAL_EVENT_MONTH_TIME,
  CAL_EVENT_MONTH_TITLE,
  CAL_EVENT_MONTH_WEEK,
  CAL_EVENT_MONTH_WEEKDAY,
  CAL_EVENT_MONTH_WEEKDAYS,
  MAX_VISIBLE_DAY_EVENTS,
  SPAN_LANE_PX,
  SPAN_OFFSET_PX,
} from './EventCalendar.const';
import {
  DAYS_IN_WEEK,
  MORE_PREFIX,
  NUMBER_ONE,
  NUMBER_ZERO,
} from '@constants';
import {
  eventColor,
  eventsForDay,
  formatEventClock,
  formatMonthShort,
  getMonthGrid,
  isMultiDayEvent,
  isSameDay,
  isSameMonth,
  joinClassNames,
  startOfDay,
  tintedBarStyle,
  weekEventSpans,
} from '@utils';

const stop = (clickEvent: MouseEvent) => {
  clickEvent.stopPropagation();
};

function dayEvents(events: NormalizedEvent[], day: Date): NormalizedEvent[] {
  const matched = eventsForDay(events, day);
  const single: NormalizedEvent[] = [];
  for (let index = NUMBER_ZERO; index < matched.length; index += NUMBER_ONE) {
    if (!isMultiDayEvent(matched[index])) {
      single.push(matched[index]);
    }
  }
  return single;
}

export function EventMonthGrid(props: EventMonthGridProps) {
  const { date, events, resources, firstDayOfWeek, weekdays, onEventClick, onDayClick } = props;
  const today = new Date();
  const cells = getMonthGrid(date, firstDayOfWeek);
  const weekdayLabels = [
    ...weekdays.slice(firstDayOfWeek),
    ...weekdays.slice(NUMBER_ZERO, firstDayOfWeek),
  ];
  const weeks: Date[][] = [];
  for (let index = NUMBER_ZERO; index < cells.length; index += DAYS_IN_WEEK) {
    weeks.push(cells.slice(index, index + DAYS_IN_WEEK));
  }

  return (
    <div className={CAL_EVENT_MONTH}>
      <div className={CAL_EVENT_MONTH_WEEKDAYS}>
        {weekdayLabels.map((label) => (
          <div key={label} className={CAL_EVENT_MONTH_WEEKDAY}>
            {label}
          </div>
        ))}
      </div>
      {weeks.map((week) => {
        const spans = weekEventSpans(events, startOfDay(week[NUMBER_ZERO]));
        let laneCount = NUMBER_ZERO;
        for (let index = NUMBER_ZERO; index < spans.length; index += NUMBER_ONE) {
          if (spans[index].lane + NUMBER_ONE > laneCount) {
            laneCount = spans[index].lane + NUMBER_ONE;
          }
        }
        return (
          <div key={week[NUMBER_ZERO].toISOString()} className={CAL_EVENT_MONTH_WEEK}>
            {week.map((day) => {
              const items = dayEvents(events, day);
              const visible = items.slice(NUMBER_ZERO, MAX_VISIBLE_DAY_EVENTS);
              const hiddenCount = items.length - visible.length;
              const isToday = isSameDay(day, today);
              const outside = !isSameMonth(day, date);
              return (
                <div
                  key={day.toISOString()}
                  className={joinClassNames(
                    CAL_EVENT_MONTH_DAY,
                    outside ? CAL_EVENT_MONTH_DAY_OUTSIDE : undefined,
                    isToday ? CAL_EVENT_MONTH_DAY_TODAY : undefined,
                  )}
                  onClick={() => onDayClick(day)}
                >
                  <span
                    className={joinClassNames(
                      CAL_EVENT_MONTH_DATE,
                      isToday ? CAL_EVENT_MONTH_DATE_TODAY : undefined,
                    )}
                  >
                    {outside ? `${formatMonthShort(day)} ${day.getDate()}` : day.getDate()}
                  </span>
                  <div
                    className={CAL_EVENT_MONTH_EVENTS}
                    style={{ marginTop: laneCount * SPAN_LANE_PX }}
                  >
                    {visible.map((event) => (
                      <button
                        key={event.id}
                        type={BUTTON_TYPE}
                        className={CAL_EVENT_MONTH_ITEM}
                        onClick={(clickEvent) => {
                          stop(clickEvent);
                          onEventClick(event);
                        }}
                      >
                        <span
                          className={CAL_EVENT_MONTH_DOT}
                          style={{ background: eventColor(event, resources) }}
                        />
                        {event.allDay ? null : (
                          <span className={CAL_EVENT_MONTH_TIME}>{formatEventClock(event.start)}</span>
                        )}
                        <span className={CAL_EVENT_MONTH_TITLE}>{event.title}</span>
                      </button>
                    ))}
                    {hiddenCount > NUMBER_ZERO ? (
                      <span className={CAL_EVENT_MONTH_MORE}>
                        {MORE_PREFIX}
                        {hiddenCount}
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            })}
            <div className={CAL_EVENT_MONTH_SPANS} style={{ top: SPAN_OFFSET_PX }}>
              {spans.map((span) => (
                <button
                  key={`${span.event.id}-${span.columnStart}`}
                  type={BUTTON_TYPE}
                  className={CAL_EVENT_MONTH_SPAN}
                  style={{
                    ...tintedBarStyle(eventColor(span.event, resources)),
                    left: `calc(${span.columnStart} * 100% / ${DAYS_IN_WEEK} + 2px)`,
                    width: `calc(${span.columnSpan} * 100% / ${DAYS_IN_WEEK} - 4px)`,
                    top: span.lane * SPAN_LANE_PX,
                  }}
                  onClick={(clickEvent) => {
                    stop(clickEvent);
                    onEventClick(span.event);
                  }}
                >
                  {span.event.title}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
