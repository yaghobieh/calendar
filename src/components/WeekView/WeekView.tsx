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
  CAL_WEEK_DAY_TODAY,
  CAL_WEEK_GUTTER,
  CAL_WEEK_HEADER,
  CAL_WEEK_SLOT,
  SLOT_ALL_DAY,
  SLOT_TIMED,
} from './WeekView.const';
import { EventChip } from '../EventChip';
import { RelationRibbons } from '../RelationRibbons';
import { LAYOUT_WEEK } from '../RelationRibbons/RelationRibbons.const';
import { PositionedEventBlocks, TimeGutterHours } from '../TimeGrid';
import { NUMBER_ONE } from '@constants';
import {
  addDays,
  allDayEventsForDay,
  formatDayHeading,
  getWeekDays,
  isSameDay,
  hourLabels,
  joinClassNames,
  positionTimedEvents,
  startOfDay,
  startOfHour,
  slotDataAttrs,
} from '@utils';

export function WeekView(props: WeekViewProps) {
  const { date, events, firstDayOfWeek, onEventClick, onEventChange, onSlotClick, resizable, relationVisible, activeEventId, joinMeeting } = props;
  const days = getWeekDays(date, firstDayOfWeek);
  const hours = hourLabels();
  const today = new Date();

  return (
    <div className={joinClassNames(CAL_WEEK, CAL_TIME_GRID)}>
      <div className={joinClassNames(CAL_WEEK_HEADER, CAL_TIME_GRID_HEADER)}>
        <div className={CAL_WEEK_GUTTER} />
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className={joinClassNames(CAL_WEEK_DAY, isSameDay(day, today) ? CAL_WEEK_DAY_TODAY : undefined)}
          >
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
              {...slotDataAttrs(dayStart, SLOT_ALL_DAY)}
              onClick={() =>
                onSlotClick?.({
                  start: dayStart,
                  end: addDays(dayStart, NUMBER_ONE),
                  allDay: SLOT_ALL_DAY,
                })
              }
            >
              {allDayEventsForDay(events, day).map((event) => (
                <EventChip key={event.id} event={event} onEventClick={onEventClick} joinMeeting={joinMeeting} />
              ))}
            </div>
          );
        })}
      </div>
      <div className={joinClassNames(CAL_WEEK_BODY, CAL_TIME_GRID_BODY)}>
        <div className={joinClassNames(CAL_WEEK_GUTTER, CAL_TIME_GRID_GUTTER)}>
          <TimeGutterHours hours={hours} slotClassName={CAL_TIME_GRID_SLOT} />
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
                    {...slotDataAttrs(start, SLOT_TIMED)}
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
              <PositionedEventBlocks
                events={positionTimedEvents(events, day)}
                onEventClick={onEventClick}
                onEventChange={onEventChange}
                resizable={resizable}
                joinMeeting={joinMeeting}
              />
            </div>
          ))}
          <RelationRibbons
            layout={LAYOUT_WEEK}
            cells={days}
            events={events}
            visible={relationVisible}
            activeEventId={activeEventId}
          />
        </div>
      </div>
    </div>
  );
}
