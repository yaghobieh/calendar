import { describe, expect, it } from 'vitest';
import { NUMBER_ONE, NUMBER_THREE, NUMBER_ZERO } from '@constants';
import { normalizeEvents } from './events.utils';
import { filterEventsByResources, timelineBars, weekEventSpans } from './scheduler.utils';

describe('scheduler.utils', () => {
  it('hides events whose resource is unchecked and keeps events without a resource', () => {
    const visible = filterEventsByResources(
      [
        { id: 'a', title: 'A', start: '2025-07-01', end: '2025-07-02', resourceId: 'work' },
        { id: 'b', title: 'B', start: '2025-07-01', end: '2025-07-02', resourceId: 'health' },
        { id: 'c', title: 'C', start: '2025-07-01', end: '2025-07-02' },
      ],
      ['health'],
    );
    expect(visible.map((event) => event.id)).toEqual(['b', 'c']);
  });

  it('places a multi-day event across Thursday through Saturday', () => {
    const events = normalizeEvents([
      {
        id: 'birthday',
        title: 'Birthday',
        start: '2025-07-03T00:00:00',
        end: '2025-07-06T00:00:00',
        allDay: true,
      },
    ]);
    const weekStart = new Date(2025, 5, 29);
    const spans = weekEventSpans(events, weekStart);
    expect(spans).toHaveLength(NUMBER_ONE);
    expect(spans[NUMBER_ZERO].columnStart).toBe(4);
    expect(spans[NUMBER_ZERO].columnSpan).toBe(NUMBER_THREE);
  });

  it('sizes a timeline bar across the first month of a seven-month range', () => {
    const events = normalizeEvents([
      {
        id: 'close',
        title: 'Close',
        start: '2025-07-01T00:00:00',
        end: '2025-08-01T00:00:00',
      },
    ]);
    const rangeStart = new Date(2025, 6, 1);
    const rangeEnd = new Date(2026, 0, 1);
    const bars = timelineBars(events, rangeStart, rangeEnd);
    expect(bars).toHaveLength(NUMBER_ONE);
    expect(bars[NUMBER_ZERO].left).toBe(NUMBER_ZERO);
    expect(bars[NUMBER_ZERO].width).toBeGreaterThan(NUMBER_ZERO);
    expect(bars[NUMBER_ZERO].width).toBeLessThan(NUMBER_ONE);
  });
});