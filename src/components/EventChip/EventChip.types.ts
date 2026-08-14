import type { CSSProperties } from 'react';
import type { CalendarEvent, NormalizedEvent } from '../../types';

export type EventChipVariant = 'chip' | 'block';

export interface EventChipProps {
  event: NormalizedEvent;
  variant?: EventChipVariant;
  onEventClick?: (event: CalendarEvent) => void;
  onEventChange?: (event: CalendarEvent) => void;
  resizable?: boolean;
  style?: CSSProperties;
  joinMeeting?: string;
}
