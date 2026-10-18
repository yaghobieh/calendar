import type { CalendarEvent, CalendarResource } from '../../types';

export interface EventEditDialogProps {
  id?: string;
  testId?: string;
  open: boolean;
  event: CalendarEvent | null;
  resources?: CalendarResource[];
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete?: (event: CalendarEvent) => void;
}
