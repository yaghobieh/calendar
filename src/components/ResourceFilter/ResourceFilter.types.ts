import type { CalendarResource } from '../../types';

export interface ResourceFilterProps {
  id?: string;
  testId?: string;
  className?: string;
  title?: string;
  resources?: CalendarResource[];
  visibleResourceIds: string[];
  onVisibleResourceIdsChange: (ids: string[]) => void;
}
