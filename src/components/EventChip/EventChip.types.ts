import type { CSSProperties } from 'react';
import type { CalendarEvent, NormalizedEvent } from '../../types';

export type EventChipVariant = 'chip' | 'block';

export interface PeekTheme {
  background: string;
  color: string;
  border: string;
  muted: string;
  primary: string;
}

export interface PeekPlacement extends PeekTheme {
  x: number;
  y: number;
  below: boolean;
}

export interface EventChipProps {
  event: NormalizedEvent;
  variant?: EventChipVariant;
  onEventClick?: (event: CalendarEvent) => void;
  onEventChange?: (event: CalendarEvent) => void;
  resizable?: boolean;
  style?: CSSProperties;
  joinMeeting?: string;
}
