import type { CalendarTranslations, CalendarView } from '../../types';

export interface CalendarHeaderProps {
  title: string;
  view: CalendarView;
  translations: CalendarTranslations;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (view: CalendarView) => void;
}
