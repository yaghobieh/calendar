import type { CalendarRelationVisibility, NormalizedEvent } from '../../types';

export type RelationLayout = 'month' | 'week';

export interface RibbonPoint {
  x: number;
  y: number;
}

export interface RelationPath {
  id: string;
  d: string;
  color: string;
  fromTitle: string;
  fromTime: string;
  toTitle: string;
  toTime: string;
}

export interface RelationRibbonsProps {
  cells: Date[];
  events: NormalizedEvent[];
  layout: RelationLayout;
  visible?: CalendarRelationVisibility;
  activeEventId?: string;
}
