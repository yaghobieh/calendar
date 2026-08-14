import type { CalendarEvent, NormalizedEvent } from '../../types';

export type EventChipVariant = 'chip' | 'block';

export interface EventChipProps {
  event: NormalizedEvent;
  variant?: EventChipVariant;
  onEventClick?: (event: CalendarEvent) => void;
  style?: { top?: string; height?: string; left?: string; width?: string };
}
