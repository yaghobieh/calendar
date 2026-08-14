import { toDate } from '@utils';
import {
  CLOSE_GLYPH,
  DEFAULT_LOCALE,
  DEFAULT_RECURRENCE_INTERVAL,
  DAY_HEADING_FORMAT,
  EMPTY_STRING,
  HOUR_LABEL_PAD,
  NUMBER_ONE,
  NUMBER_ZERO,
  PAD_ZERO,
  RECURRENCE_EVERY_X_MONTHS,
  RECURRENCE_NONE,
  TIME_SEPARATOR,
} from '@constants';
import type {
  CalendarEditFieldsConfig,
  CalendarEvent,
  CalendarPerson,
  CalendarRecurrence,
  CalendarRecurrenceFreq,
} from '../../types';
import { RANGE_SEPARATOR } from './EventPopover.const';

const pad = (value: number): string => String(value).padStart(HOUR_LABEL_PAD, PAD_ZERO);

export const formatCompactRange = (event: CalendarEvent): string => {
  const start = toDate(event.start);
  const end = toDate(event.end);
  const day = start.toLocaleDateString(DEFAULT_LOCALE, DAY_HEADING_FORMAT);
  if (event.allDay) {
    return day;
  }
  return `${day} ${toTimeValue(start)}${RANGE_SEPARATOR}${toTimeValue(end)}`;
};

export const toDateValue = (value: Date | string): string => {
  const date = toDate(value);
  if (Number.isNaN(date.getTime())) {
    return EMPTY_STRING;
  }
  return `${date.getFullYear()}-${pad(date.getMonth() + NUMBER_ONE)}-${pad(date.getDate())}`;
};

export const toTimeValue = (value: Date | string): string => {
  const date = toDate(value);
  if (Number.isNaN(date.getTime())) {
    return EMPTY_STRING;
  }
  return `${pad(date.getHours())}${TIME_SEPARATOR}${pad(date.getMinutes())}`;
};

export const combineDateAndTime = (dateValue: string, timeValue: string, allDay: boolean): Date => {
  if (allDay) {
    return new Date(`${dateValue}T00:00:00`);
  }
  return new Date(`${dateValue}T${timeValue}:00`);
};

export const recurrenceFromForm = (
  freq: CalendarRecurrenceFreq,
  interval: number,
): CalendarRecurrence | undefined => {
  if (freq === RECURRENCE_NONE) {
    return undefined;
  }
  if (freq === RECURRENCE_EVERY_X_MONTHS) {
    return {
      freq,
      interval: interval > NUMBER_ZERO ? interval : DEFAULT_RECURRENCE_INTERVAL,
    };
  }
  return { freq };
};

export interface EventEditFormState {
  title: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  allDay: boolean;
  description: string;
  peopleIds: string[];
  relatedTo: string[];
  recurrenceFreq: CalendarRecurrenceFreq;
  recurrenceInterval: number;
}

export const formFromEvent = (event: CalendarEvent): EventEditFormState => ({
  title: event.title,
  startDate: toDateValue(event.start),
  startTime: toTimeValue(event.start),
  endDate: toDateValue(event.end),
  endTime: toTimeValue(event.end),
  allDay: Boolean(event.allDay),
  description: event.description ?? EMPTY_STRING,
  peopleIds: event.peopleIds ? [...event.peopleIds] : [],
  relatedTo: event.relatedTo ? [...event.relatedTo] : [],
  recurrenceFreq: event.recurrence?.freq ?? RECURRENCE_NONE,
  recurrenceInterval: event.recurrence?.interval ?? DEFAULT_RECURRENCE_INTERVAL,
});

export const eventFromForm = (
  event: CalendarEvent,
  form: EventEditFormState,
  fallbackTitle: string,
): CalendarEvent | null => {
  const title = form.title.trim() || fallbackTitle;
  const start = combineDateAndTime(form.startDate, form.startTime, form.allDay);
  const end = combineDateAndTime(form.endDate, form.endTime, form.allDay);
  if (!title || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return null;
  }
  const description = form.description.trim();
  return {
    ...event,
    title,
    start,
    end,
    allDay: form.allDay,
    description: description.length > NUMBER_ZERO ? description : undefined,
    peopleIds: form.peopleIds,
    relatedTo: form.relatedTo,
    recurrence: recurrenceFromForm(form.recurrenceFreq, form.recurrenceInterval),
  };
};

export const peopleForEvent = (
  event: CalendarEvent,
  people: CalendarPerson[],
): CalendarPerson[] => {
  const ids = event.peopleIds ?? [];
  const matched: CalendarPerson[] = [];
  for (let index = NUMBER_ZERO; index < people.length; index += NUMBER_ONE) {
    const person = people[index];
    if (ids.includes(person.id)) {
      matched.push(person);
    }
  }
  return matched;
};

export const eventsForIds = (events: CalendarEvent[], ids: string[]): CalendarEvent[] => {
  const matched: CalendarEvent[] = [];
  for (let idIndex = NUMBER_ZERO; idIndex < ids.length; idIndex += NUMBER_ONE) {
    for (let index = NUMBER_ZERO; index < events.length; index += NUMBER_ONE) {
      if (events[index].id === ids[idIndex]) {
        matched.push(events[index]);
        break;
      }
    }
  }
  return matched;
};

export const relationCandidates = (
  events: CalendarEvent[],
  eventId: string,
  selected: string[],
): CalendarEvent[] => {
  const candidates: CalendarEvent[] = [];
  for (let index = NUMBER_ZERO; index < events.length; index += NUMBER_ONE) {
    const item = events[index];
    if (item.id !== eventId && !selected.includes(item.id)) {
      candidates.push(item);
    }
  }
  return candidates;
};

export const formatEventRange = formatCompactRange;

export const filterEventsByQuery = (events: CalendarEvent[], query: string): CalendarEvent[] => {
  const needle = query.trim().toLowerCase();
  const matched: CalendarEvent[] = [];
  for (let index = NUMBER_ZERO; index < events.length; index += NUMBER_ONE) {
    if (needle.length === NUMBER_ZERO || events[index].title.toLowerCase().includes(needle)) {
      matched.push(events[index]);
    }
  }
  return matched;
};

export const filterPeopleByQuery = (
  people: CalendarPerson[],
  selected: string[],
  query: string,
): CalendarPerson[] => {
  const needle = query.trim().toLowerCase();
  const matched: CalendarPerson[] = [];
  for (let index = NUMBER_ZERO; index < people.length; index += NUMBER_ONE) {
    const person = people[index];
    if (selected.includes(person.id)) {
      continue;
    }
    if (needle.length === NUMBER_ZERO) {
      matched.push(person);
      continue;
    }
    const haystack = `${person.name} ${person.fullName ?? EMPTY_STRING} ${person.email ?? EMPTY_STRING}`.toLowerCase();
    if (haystack.includes(needle)) {
      matched.push(person);
    }
  }
  return matched;
};

export const togglePersonId = (ids: string[], personId: string): string[] => {
  if (ids.includes(personId)) {
    return ids.filter((id) => id !== personId);
  }
  return [...ids, personId];
};

export const isEditFieldEnabled = (
  fields: CalendarEditFieldsConfig | undefined,
  field: keyof CalendarEditFieldsConfig,
): boolean => fields?.[field] !== false;

export const relatedRemoveLabel = CLOSE_GLYPH;
