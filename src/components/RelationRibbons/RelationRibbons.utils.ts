import type { CalendarRelationVisibility, NormalizedEvent } from '../../types';
import {
  ATTR_CAL_EVENT,
  DAYS_IN_WEEK,
  DEFAULT_LOCALE,
  HOUR_LABEL_PAD,
  HOURS_IN_DAY,
  MINUTES_IN_HOUR,
  MONTH_GRID_WEEKS,
  NUMBER_ONE,
  NUMBER_ONE_HUNDRED,
  NUMBER_TWO,
  NUMBER_ZERO,
  PAD_ZERO,
  RELATION_VISIBLE_ALWAYS,
  RELATION_VISIBLE_NEVER,
  RELATION_VISIBLE_ON_CLICK,
  SHORT_DATE_FORMAT,
  TIME_SEPARATOR,
} from '@constants';
import { isSameDay, seriesIdFromEventId } from '@utils';
import {
  ALL_DAY_Y,
  CELL_CENTER,
  CURVE_END,
  CURVE_LIFT,
  CURVE_START,
  EVENT_ANCHOR_Y,
  FALLBACK_COLOR,
  INDEX_NONE,
  LAYOUT_MONTH,
  PAIR_SEP,
} from './RelationRibbons.const';
import type { RelationLayout, RelationPath, RibbonPoint } from './RelationRibbons.types';

const pad = (value: number): string => String(value).padStart(HOUR_LABEL_PAD, PAD_ZERO);

export const formatRibbonTime = (event: NormalizedEvent): string => {
  const day = event.start.toLocaleDateString(DEFAULT_LOCALE, SHORT_DATE_FORMAT);
  if (event.allDay) {
    return day;
  }
  const startLabel = `${pad(event.start.getHours())}${TIME_SEPARATOR}${pad(event.start.getMinutes())}`;
  const endLabel = `${pad(event.end.getHours())}${TIME_SEPARATOR}${pad(event.end.getMinutes())}`;
  return `${day} ${startLabel}–${endLabel}`;
};

const cellIndexForDate = (cells: Date[], date: Date): number => {
  for (let index = NUMBER_ZERO; index < cells.length; index += NUMBER_ONE) {
    if (isSameDay(cells[index], date)) {
      return index;
    }
  }
  return INDEX_NONE;
};

const pointForMonth = (index: number): { x: number; y: number } => {
  const col = index % DAYS_IN_WEEK;
  const row = Math.floor(index / DAYS_IN_WEEK);
  return {
    x: ((col + CELL_CENTER) / DAYS_IN_WEEK) * NUMBER_ONE_HUNDRED,
    y: ((row + EVENT_ANCHOR_Y) / MONTH_GRID_WEEKS) * NUMBER_ONE_HUNDRED,
  };
};

const yForEvent = (event: NormalizedEvent): number => {
  if (event.allDay) {
    return ALL_DAY_Y;
  }
  const minutes = event.start.getHours() * MINUTES_IN_HOUR + event.start.getMinutes();
  return (minutes / (HOURS_IN_DAY * MINUTES_IN_HOUR)) * NUMBER_ONE_HUNDRED;
};

const pointForWeek = (index: number, event: NormalizedEvent, columns: number): { x: number; y: number } => ({
  x: ((index + CELL_CENTER) / columns) * NUMBER_ONE_HUNDRED,
  y: yForEvent(event),
});

const ribbonPath = (x1: number, y1: number, x2: number, y2: number): string => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const cx1 = x1 + dx * CURVE_START;
  const cy1 = y1 + dy * CURVE_START - CURVE_LIFT;
  const cx2 = x1 + dx * CURVE_END;
  const cy2 = y2 - dy * (NUMBER_ONE - CURVE_END) + CURVE_LIFT;
  return `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
};

const pairKey = (left: string, right: string): string =>
  left < right ? `${left}${PAIR_SEP}${right}` : `${right}${PAIR_SEP}${left}`;

export const measureEventPoints = (
  overlay: HTMLElement,
  events: NormalizedEvent[],
): Map<string, RibbonPoint> => {
  const overlayRect = overlay.getBoundingClientRect();
  const width = overlayRect.width;
  const height = overlayRect.height;
  const points = new Map<string, RibbonPoint>();
  if (width <= NUMBER_ZERO || height <= NUMBER_ZERO) {
    return points;
  }
  const scope = overlay.parentElement ?? overlay;
  for (let index = NUMBER_ZERO; index < events.length; index += NUMBER_ONE) {
    const event = events[index];
    const node = scope.querySelector(`[${ATTR_CAL_EVENT}="${CSS.escape(event.id)}"]`);
    if (!(node instanceof HTMLElement)) {
      continue;
    }
    const rect = node.getBoundingClientRect();
    points.set(event.id, {
      x: ((rect.left + rect.width / NUMBER_TWO - overlayRect.left) / width) * NUMBER_ONE_HUNDRED,
      y: ((rect.top + rect.height / NUMBER_TWO - overlayRect.top) / height) * NUMBER_ONE_HUNDRED,
    });
  }
  return points;
};

export const relationPaths = (
  cells: Date[],
  events: NormalizedEvent[],
  layout: RelationLayout,
  visible: CalendarRelationVisibility = RELATION_VISIBLE_ALWAYS,
  activeEventId?: string,
  measured?: Map<string, RibbonPoint>,
): RelationPath[] => {
  if (visible === RELATION_VISIBLE_NEVER) {
    return [];
  }
  if (visible === RELATION_VISIBLE_ON_CLICK && !activeEventId) {
    return [];
  }
  const byId = new Map<string, NormalizedEvent>();
  const bySource = new Map<string, NormalizedEvent[]>();
  for (let index = NUMBER_ZERO; index < events.length; index += NUMBER_ONE) {
    const item = events[index];
    byId.set(item.id, item);
    const sourceId = item.source.id;
    const existing = bySource.get(sourceId);
    if (existing) {
      existing.push(item);
    } else {
      bySource.set(sourceId, [item]);
    }
  }
  const seen = new Set<string>();
  const paths: RelationPath[] = [];
  const columns = cells.length > NUMBER_ZERO ? cells.length : DAYS_IN_WEEK;
  const activeSeriesId = activeEventId ? seriesIdFromEventId(activeEventId) : undefined;

  const targetsFor = (relatedId: string): NormalizedEvent[] => {
    const fromSource = bySource.get(relatedId);
    if (fromSource) {
      return fromSource;
    }
    const single = byId.get(relatedId);
    return single ? [single] : [];
  };

  for (let index = NUMBER_ZERO; index < events.length; index += NUMBER_ONE) {
    const event = events[index];
    const related = event.source.relatedTo;
    if (!related) {
      continue;
    }
    const fromIndex = cellIndexForDate(cells, event.start);
    if (fromIndex === INDEX_NONE) {
      continue;
    }
    for (let relatedIndex = NUMBER_ZERO; relatedIndex < related.length; relatedIndex += NUMBER_ONE) {
      const targets = targetsFor(related[relatedIndex]);
      for (let targetIndex = NUMBER_ZERO; targetIndex < targets.length; targetIndex += NUMBER_ONE) {
        const target = targets[targetIndex];
        if (target.id === event.id) {
          continue;
        }
        const eventSeriesId = event.source.id;
        const targetSeriesId = target.source.id;
        if (
          visible === RELATION_VISIBLE_ON_CLICK &&
          eventSeriesId !== activeSeriesId &&
          targetSeriesId !== activeSeriesId
        ) {
          continue;
        }
        const key = pairKey(event.id, target.id);
        if (seen.has(key)) {
          continue;
        }
        const toIndex = cellIndexForDate(cells, target.start);
        if (toIndex === INDEX_NONE) {
          continue;
        }
        seen.add(key);
        const measuredFrom = measured?.get(event.id);
        const measuredTo = measured?.get(target.id);
        const from =
          measuredFrom ??
          (layout === LAYOUT_MONTH
            ? pointForMonth(fromIndex)
            : pointForWeek(fromIndex, event, columns));
        const to =
          measuredTo ??
          (layout === LAYOUT_MONTH ? pointForMonth(toIndex) : pointForWeek(toIndex, target, columns));
        paths.push({
          id: key,
          d: ribbonPath(from.x, from.y, to.x, to.y),
          color: event.color ?? target.color ?? FALLBACK_COLOR,
          fromTitle: event.title,
          fromTime: formatRibbonTime(event),
          toTitle: target.title,
          toTime: formatRibbonTime(target),
        });
      }
    }
  }
  return paths;
};
