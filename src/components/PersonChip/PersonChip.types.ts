import type { CalendarPerson, CalendarPersonIcons, CalendarTranslations } from '../../types';

export interface PersonChipProps {
  person: CalendarPerson;
  translations: CalendarTranslations;
  icons?: CalendarPersonIcons;
  onRemove?: () => void;
  removeLabel?: string;
}
