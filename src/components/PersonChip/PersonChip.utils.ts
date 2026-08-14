import { EMPTY_STRING, NUMBER_ONE, NUMBER_ZERO, SPACE_STRING } from '@constants';
import { INITIALS_LENGTH } from './PersonChip.const';
import type { CalendarPerson } from '../../types';

export const personDisplayName = (person: CalendarPerson): string =>
  person.fullName && person.fullName.trim().length > NUMBER_ZERO ? person.fullName : person.name;

export const personInitials = (person: CalendarPerson): string => {
  const source = personDisplayName(person).trim();
  const parts = source.split(SPACE_STRING).filter((part) => part.length > NUMBER_ZERO);
  if (parts.length === NUMBER_ZERO) {
    return EMPTY_STRING;
  }
  if (parts.length === NUMBER_ONE) {
    return parts[NUMBER_ZERO].slice(NUMBER_ZERO, INITIALS_LENGTH).toUpperCase();
  }
  return `${parts[NUMBER_ZERO].charAt(NUMBER_ZERO)}${parts[parts.length - NUMBER_ONE].charAt(NUMBER_ZERO)}`.toUpperCase();
};
