import type { MonthViewProps } from './MonthView.types';
import {
  CAL_MONTH,
  CAL_MONTH_CELL,
  CAL_MONTH_CELL_OTHER,
  CAL_MONTH_CELL_TODAY,
  CAL_MONTH_DATE,
  CAL_MONTH_DATE_TODAY,
  CAL_MONTH_EVENTS,
  CAL_MONTH_GRID,
  CAL_MONTH_MORE,
  CAL_MONTH_WEEKDAY,
  CAL_MONTH_WEEKDAYS,
  SLOT_ALL_DAY,
} from './MonthView.const';
import { LAYOUT_MONTH } from '../RelationRibbons/RelationRibbons.const';
import { RelationRibbons } from '../RelationRibbons';
import { VARIANT_CHIP } from '../EventChip/EventChip.const';
import { EventChip } from '../EventChip';
import {
  MAX_VISIBLE_MONTH_EVENTS,
  MORE_PREFIX,
  NUMBER_ONE,
  NUMBER_ZERO,
} from '@constants';
import {
  addDays,
  eventsForDay,
  getMonthGrid,
  isSameDay,
  isSameMonth,
  joinClassNames,
  startOfDay,
} from '@utils';

export function MonthView(props: MonthViewProps) {
  const { date, events, firstDayOfWeek, weekdays, onEventClick, onSlotClick, relationVisible, activeEventId } = props;
  const today = new Date();
  const cells = getMonthGrid(date, firstDayOfWeek);
  const weekdayLabels = [
    ...weekdays.slice(firstDayOfWeek),
    ...weekdays.slice(NUMBER_ZERO, firstDayOfWeek),
  ];

  return (
    <div className={CAL_MONTH}>
      <div className={CAL_MONTH_WEEKDAYS}>
        {weekdayLabels.map((label, index) => (
          <div key={index} className={CAL_MONTH_WEEKDAY}>
            {label}
          </div>
        ))}
      </div>
      <div className={CAL_MONTH_GRID}>
        {cells.map((cell) => {
          const dayStart = startOfDay(cell);
          const dayEvents = eventsForDay(events, cell);
          const visible = dayEvents.slice(NUMBER_ZERO, MAX_VISIBLE_MONTH_EVENTS);
          const hiddenCount = dayEvents.length - visible.length;
          const isToday = isSameDay(cell, today);
          const isOther = !isSameMonth(cell, date);

          return (
            <div
              key={cell.toISOString()}
              className={joinClassNames(
                CAL_MONTH_CELL,
                isToday ? CAL_MONTH_CELL_TODAY : undefined,
                isOther ? CAL_MONTH_CELL_OTHER : undefined,
              )}
              onClick={() =>
                onSlotClick?.({
                  start: dayStart,
                  end: addDays(dayStart, NUMBER_ONE),
                  allDay: SLOT_ALL_DAY,
                })
              }
            >
              <span className={joinClassNames(CAL_MONTH_DATE, isToday ? CAL_MONTH_DATE_TODAY : undefined)}>
                {cell.getDate()}
              </span>
              <div className={CAL_MONTH_EVENTS}>
                {visible.map((event) => (
                  <EventChip
                    key={event.id}
                    event={event}
                    variant={VARIANT_CHIP}
                    onEventClick={onEventClick}
                  />
                ))}
                {hiddenCount > NUMBER_ZERO ? (
                  <span className={CAL_MONTH_MORE}>
                    {MORE_PREFIX}
                    {hiddenCount}
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
        <RelationRibbons
          layout={LAYOUT_MONTH}
          cells={cells}
          events={events}
          visible={relationVisible}
          activeEventId={activeEventId}
        />
      </div>
    </div>
  );
}
