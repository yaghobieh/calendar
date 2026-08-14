import type { AgendaViewProps } from './AgendaView.types';
import {
  CAL_AGENDA,
  CAL_AGENDA_DAY,
  CAL_AGENDA_EMPTY,
  CAL_AGENDA_GROUP,
  CAL_AGENDA_LIST,
  SLOT_ALL_DAY,
} from './AgendaView.const';
import { EventChip } from '../EventChip';
import {
  AGENDA_DAY_COUNT,
  AGENDA_DAY_FORMAT,
  DEFAULT_LOCALE,
  NUMBER_ONE,
  NUMBER_ZERO,
} from '@constants';
import { addDays, eventsForDay, slotDataAttrs, startOfDay } from '@utils';

export function AgendaView(props: AgendaViewProps) {
  const { date, events, noEvents, onEventClick, onSlotClick, joinMeeting } = props;
  const start = startOfDay(date);
  const days: Date[] = [];
  for (let index = NUMBER_ZERO; index < AGENDA_DAY_COUNT; index += NUMBER_ONE) {
    days.push(addDays(start, index));
  }

  return (
    <div className={CAL_AGENDA}>
      {days.map((day) => {
        const dayStart = startOfDay(day);
        const dayEvents = eventsForDay(events, day);
        return (
          <div
            key={day.toISOString()}
            className={CAL_AGENDA_GROUP}
            {...slotDataAttrs(dayStart, SLOT_ALL_DAY)}
            onClick={() =>
              onSlotClick?.({
                start: dayStart,
                end: addDays(dayStart, NUMBER_ONE),
                allDay: SLOT_ALL_DAY,
              })
            }
          >
            <h3 className={CAL_AGENDA_DAY}>
              {day.toLocaleDateString(DEFAULT_LOCALE, AGENDA_DAY_FORMAT)}
            </h3>
            {dayEvents.length === NUMBER_ZERO ? (
              <div className={CAL_AGENDA_EMPTY}>{noEvents}</div>
            ) : (
              <div className={CAL_AGENDA_LIST}>
                {dayEvents.map((event) => (
                  <EventChip key={event.id} event={event} onEventClick={onEventClick} joinMeeting={joinMeeting} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
