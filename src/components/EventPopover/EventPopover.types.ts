import type {
  CalendarEditFieldsConfig,
  CalendarEvent,
  CalendarModalContainment,
  CalendarModalEffect,
  CalendarPerson,
  CalendarPersonIcons,
  CalendarSeverityIcons,
  CalendarTranslations,
  EventEditActions,
} from '../../types';
import type { ReactNode } from 'react';

export interface EventPopoverProps {
  event: CalendarEvent;
  translations: CalendarTranslations;
  onClose: () => void;
  people?: CalendarPerson[];
  renderEventBody?: (event: CalendarEvent) => ReactNode;
  renderEventEdit?: (event: CalendarEvent, actions: EventEditActions) => ReactNode;
  editIcon?: ReactNode;
  closeIcon?: ReactNode;
  saveContent?: ReactNode;
  cancelContent?: ReactNode;
  showEdit?: boolean;
  showClose?: boolean;
  showSave?: boolean;
  showCancel?: boolean;
  onEventEdit?: (event: CalendarEvent) => void;
  onEventChange?: (event: CalendarEvent) => void;
  onDraftChange?: (event: CalendarEvent) => void;
  personIcons?: CalendarPersonIcons;
  severityIcons?: CalendarSeverityIcons;
  containment?: CalendarModalContainment;
  events?: CalendarEvent[];
  fields?: CalendarEditFieldsConfig;
  isCreate?: boolean;
  openEffect?: CalendarModalEffect;
  closeEffect?: CalendarModalEffect;
}
