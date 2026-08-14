import type {
  CalendarLayoutIcons,
  CalendarLayoutMode,
  CalendarNavIcons,
  CalendarTranslations,
  CalendarView,
} from '../../types';

export interface CalendarHeaderProps {
  title: string;
  view: CalendarView;
  translations: CalendarTranslations;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (view: CalendarView) => void;
  navIcons?: CalendarNavIcons;
  layout?: CalendarLayoutMode;
  layoutIcons?: CalendarLayoutIcons;
  showLayoutToggle?: boolean;
  onLayoutToggle?: () => void;
}
