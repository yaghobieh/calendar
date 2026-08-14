import type { WeekViewProps } from './WeekView.types';
import {
  CAL_TIME_GRID,
  CAL_TIME_GRID_ALLDAY,
  CAL_TIME_GRID_BODY,
  CAL_TIME_GRID_COLUMN,
  CAL_TIME_GRID_COLUMNS,
  CAL_TIME_GRID_GUTTER,
  CAL_TIME_GRID_HEADER,
  CAL_TIME_GRID_SLOT,
  CAL_WEEK,
  CAL_WEEK_ALLDAY,
  CAL_WEEK_BODY,
  CAL_WEEK_COLUMN,
  CAL_WEEK_COLUMNS,
  CAL_WEEK_DAY,
  CAL_WEEK_GUTTER,
  CAL_WEEK_HEADER,
  CAL_WEEK_SLOT,
  PERCENT_UNIT,
  SLOT_ALL_DAY,
  SLOT_TIMED,
} from './WeekView.const';
import { VARIANT_BLOCK } from '../EventChip/EventChip.const';
import { EventChip } from '../EventChip';
import { NUMBER_ONE, NUMBER_ONE_HUNDRED } from '../../constants';
import {
  addDays,
  allDayEventsForDay,
  formatDayHeading,
  getWeekDays,
  hourLabels,
  joinClassNames,
  positionTimedEvents,
  startOfDay,
  startOfHour,
} from '../../utils';

export function WeekView(props: WeekViewProps) {
  const { date, events, firstDayOfWeek, onEventClick, onSlotClick } = props;
  const days = getWeekDays(date, firstDayOfWeek);
  const hours = hourLabels();

  return (
    <div className={joinClassNames(CAL_WEEK, CAL_TIME_GRID)}>
      <div className={joinClassNames(CAL_WEEK_HEADER, CAL_TIME_GRID_HEADER)}>
        <div className={CAL_WEEK_GUTTER} />
        {days.map((day) => (
          <div key={day.toISOString()} className={CAL_WEEK_DAY}>
            {formatDayHeading(day)}
          </div>
        ))}
      </div>
      <div className={joinClassNames(CAL_WEEK_ALLDAY, CAL_TIME_GRID_ALLDAY)}>
        <div className={CAL_WEEK_GUTTER} />
        {days.map((day) => {
          const dayStart = startOfDay(day);
          return (
            <div
              key={day.toISOString()}
              className={CAL_WEEK_DAY}
              onClick={() =>
                onSlotClick?.({
                  start: dayStart,
                  end: addDays(dayStart, NUMBER_ONE),
                  allDay: SLOT_ALL_DAY,
                })
              }
            >
              {allDayEventsForDay(events, day).map((event) => (
                <EventChip key={event.id} event={event} onEventClick={onEventClick} />
              ))}
            </div>
          );
        })}
      </div>
      <div className={joinClassNames(CAL_WEEK_BODY, CAL_TIME_GRID_BODY)}>
        <div className={joinClassNames(CAL_WEEK_GUTTER, CAL_TIME_GRID_GUTTER)}>
          {hours.map((label, hourIndex) => (
            <div key={hourIndex} className={CAL_TIME_GRID_SLOT}>
              {label}
            </div>
          ))}
        </div>
        <div className={joinClassNames(CAL_WEEK_COLUMNS, CAL_TIME_GRID_COLUMNS)}>
          {days.map((day) => (
            <div
              key={day.toISOString()}
              className={joinClassNames(CAL_WEEK_COLUMN, CAL_TIME_GRID_COLUMN)}
            >
              {hours.map((_label, hour) => {
                const start = startOfHour(day, hour);
                return (
                  <div
                    key={hour}
                    className={joinClassNames(CAL_WEEK_SLOT, CAL_TIME_GRID_SLOT)}
                    onClick={() =>
                      onSlotClick?.({
                        start,
                        end: startOfHour(day, hour + NUMBER_ONE),
                        allDay: SLOT_TIMED,
                      })
                    }
                  />
                );
              })}
              {positionTimedEvents(events, day).map((positioned) => (
                <EventChip
                  key={positioned.event.id}
                  event={positioned.event}
                  variant={VARIANT_BLOCK}
                  onEventClick={onEventClick}
                  style={{
                    top: `${positioned.topPercent}${PERCENT_UNIT}`,
                    height: `${positioned.heightPercent}${PERCENT_UNIT}`,
                    left: `${(positioned.columnIndex / positioned.columnCount) * NUMBER_ONE_HUNDRED}${PERCENT_UNIT}`,
                    width: `${NUMBER_ONE_HUNDRED / positioned.columnCount}${PERCENT_UNIT}`,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
