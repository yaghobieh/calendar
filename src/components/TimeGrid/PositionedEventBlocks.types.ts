import type { CalendarEvent, PositionedEvent } from '../../types';

export interface PositionedEventBlocksProps {
  events: PositionedEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onEventChange?: (event: CalendarEvent) => void;
  resizable?: boolean;
}
