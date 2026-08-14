import type { DayViewProps } from './DayView.types';
import {
  CAL_DAY,
  CAL_DAY_ALLDAY,
  CAL_DAY_BODY,
  CAL_DAY_COLUMN,
  CAL_DAY_COLUMNS,
  CAL_DAY_DAY,
  CAL_DAY_GUTTER,
  CAL_DAY_HEADER,
  CAL_DAY_SLOT,
  CAL_TIME_GRID,
  CAL_TIME_GRID_ALLDAY,
  CAL_TIME_GRID_BODY,
  CAL_TIME_GRID_COLUMN,
  CAL_TIME_GRID_COLUMNS,
  CAL_TIME_GRID_GUTTER,
  CAL_TIME_GRID_HEADER,
  CAL_TIME_GRID_SLOT,
  PERCENT_UNIT,
  SLOT_ALL_DAY,
  SLOT_TIMED,
} from './DayView.const';
import { VARIANT_BLOCK } from '../EventChip/EventChip.const';
import { EventChip } from '../EventChip';
import { NUMBER_ONE, NUMBER_ONE_HUNDRED } from '../../constants';
import {
  addDays,
  allDayEventsForDay,
  formatDayHeading,
  hourLabels,
  joinClassNames,
  positionTimedEvents,
  startOfDay,
  startOfHour,
} from '../../utils';

export function DayView(props: DayViewProps) {
  const { date, events, onEventClick, onSlotClick } = props;
  const hours = hourLabels();
  const dayStart = startOfDay(date);

  return (
    <div className={joinClassNames(CAL_DAY, CAL_TIME_GRID)}>
      <div className={joinClassNames(CAL_DAY_HEADER, CAL_TIME_GRID_HEADER)}>
        <div className={CAL_DAY_GUTTER} />
        <div className={CAL_DAY_DAY}>{formatDayHeading(date)}</div>
      </div>
      <div
        className={joinClassNames(CAL_DAY_ALLDAY, CAL_TIME_GRID_ALLDAY)}
        onClick={() =>
          onSlotClick?.({
            start: dayStart,
            end: addDays(dayStart, NUMBER_ONE),
            allDay: SLOT_ALL_DAY,
          })
        }
      >
        <div className={CAL_DAY_GUTTER} />
        <div className={CAL_DAY_DAY}>
          {allDayEventsForDay(events, date).map((event) => (
            <EventChip key={event.id} event={event} onEventClick={onEventClick} />
          ))}
        </div>
      </div>
      <div className={joinClassNames(CAL_DAY_BODY, CAL_TIME_GRID_BODY)}>
        <div className={joinClassNames(CAL_DAY_GUTTER, CAL_TIME_GRID_GUTTER)}>
          {hours.map((label, hourIndex) => (
            <div key={hourIndex} className={CAL_TIME_GRID_SLOT}>
              {label}
            </div>
          ))}
        </div>
        <div className={joinClassNames(CAL_DAY_COLUMNS, CAL_TIME_GRID_COLUMNS)}>
          <div className={joinClassNames(CAL_DAY_COLUMN, CAL_TIME_GRID_COLUMN)}>
            {hours.map((_label, hour) => {
              const start = startOfHour(date, hour);
              return (
                <div
                  key={hour}
                  className={joinClassNames(CAL_DAY_SLOT, CAL_TIME_GRID_SLOT)}
                  onClick={() =>
                    onSlotClick?.({
                      start,
                      end: startOfHour(date, hour + NUMBER_ONE),
                      allDay: SLOT_TIMED,
                    })
                  }
                />
              );
            })}
            {positionTimedEvents(events, date).map((positioned) => (
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
        </div>
      </div>
    </div>
  );
}
