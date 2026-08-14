import type { DayViewProps } from './DayView.types';
import {
  CAL_DAY,
  CAL_DAY_ALLDAY,
  CAL_DAY_BODY,
  CAL_DAY_COLUMN,
  CAL_DAY_COLUMNS,
  CAL_DAY_DAY,
  CAL_DAY_DAY_TODAY,
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
  SLOT_ALL_DAY,
  SLOT_TIMED,
} from './DayView.const';
import { EventChip } from '../EventChip';
import { PositionedEventBlocks, TimeGutterHours } from '../TimeGrid';
import { NUMBER_ONE } from '@constants';
import {
  addDays,
  allDayEventsForDay,
  formatDayHeading,
  hourLabels,
  isSameDay,
  joinClassNames,
  positionTimedEvents,
  startOfDay,
  startOfHour,
  slotDataAttrs,
} from '@utils';

export function DayView(props: DayViewProps) {
  const { date, events, onEventClick, onEventChange, onSlotClick, resizable, joinMeeting } = props;
  const hours = hourLabels();
  const dayStart = startOfDay(date);
  const isToday = isSameDay(date, new Date());

  return (
    <div className={joinClassNames(CAL_DAY, CAL_TIME_GRID)}>
      <div className={joinClassNames(CAL_DAY_HEADER, CAL_TIME_GRID_HEADER)}>
        <div className={CAL_DAY_GUTTER} />
        <div className={joinClassNames(CAL_DAY_DAY, isToday ? CAL_DAY_DAY_TODAY : undefined)}>
          {formatDayHeading(date)}
        </div>
      </div>
      <div
        className={joinClassNames(CAL_DAY_ALLDAY, CAL_TIME_GRID_ALLDAY)}
        {...slotDataAttrs(dayStart, SLOT_ALL_DAY)}
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
          {allDayEventsForDay(events, dayStart).map((event) => (
            <EventChip key={event.id} event={event} onEventClick={onEventClick} joinMeeting={joinMeeting} />
          ))}
        </div>
      </div>
      <div className={joinClassNames(CAL_DAY_BODY, CAL_TIME_GRID_BODY)}>
        <div className={joinClassNames(CAL_DAY_GUTTER, CAL_TIME_GRID_GUTTER)}>
          <TimeGutterHours hours={hours} slotClassName={CAL_TIME_GRID_SLOT} />
        </div>
        <div className={joinClassNames(CAL_DAY_COLUMNS, CAL_TIME_GRID_COLUMNS)}>
          <div className={joinClassNames(CAL_DAY_COLUMN, CAL_TIME_GRID_COLUMN)}>
            {hours.map((_label, hour) => {
              const start = startOfHour(date, hour);
              return (
                <div
                  key={hour}
                  className={joinClassNames(CAL_DAY_SLOT, CAL_TIME_GRID_SLOT)}
                  {...slotDataAttrs(start, SLOT_TIMED)}
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
            <PositionedEventBlocks
              events={positionTimedEvents(events, date)}
              onEventClick={onEventClick}
              onEventChange={onEventChange}
              resizable={resizable}
              joinMeeting={joinMeeting}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
