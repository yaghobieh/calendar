import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import type { CalendarEvent, NormalizedEvent } from '../types';
import { NUMBER_ZERO, TIME_GRID_COLUMN_SELECTOR } from '@constants';
import { eventWithEndFromHeight } from '@utils';

export interface UseEventResizeOptions {
  event: NormalizedEvent;
  enabled: boolean;
  onEventChange?: (event: CalendarEvent) => void;
}

export const useEventResize = (options: UseEventResizeOptions) => {
  const { event, enabled, onEventChange } = options;
  const chipRef = useRef<HTMLDivElement | null>(null);
  const skipClickRef = useRef(false);
  const [heightPx, setHeightPx] = useState<number | undefined>(undefined);
  const [resizing, setResizing] = useState(false);

  const handleResizePointerDown = (pointerEvent: ReactPointerEvent<HTMLSpanElement>) => {
    if (!enabled) {
      return;
    }
    pointerEvent.preventDefault();
    pointerEvent.stopPropagation();
    const chip = chipRef.current;
    const column = chip?.closest(TIME_GRID_COLUMN_SELECTOR) as HTMLElement | null;
    if (!chip || !column) {
      return;
    }
    const startY = pointerEvent.clientY;
    const startHeight = chip.getBoundingClientRect().height;
    const columnHeight = column.scrollHeight > NUMBER_ZERO ? column.scrollHeight : column.clientHeight;
    skipClickRef.current = true;
    setResizing(true);
    setHeightPx(startHeight);
    const handleId = pointerEvent.pointerId;
    pointerEvent.currentTarget.setPointerCapture(handleId);

    const onMove = (moveEvent: PointerEvent) => {
      const nextHeight = Math.max(startHeight + (moveEvent.clientY - startY), NUMBER_ZERO);
      setHeightPx(nextHeight);
    };

    const onUp = (upEvent: PointerEvent) => {
      const nextHeight = Math.max(startHeight + (upEvent.clientY - startY), NUMBER_ZERO);
      onEventChange?.(eventWithEndFromHeight(event, nextHeight, columnHeight));
      setHeightPx(undefined);
      setResizing(false);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const consumeClickIfResized = (): boolean => {
    if (!skipClickRef.current) {
      return false;
    }
    skipClickRef.current = false;
    return true;
  };

  return {
    chipRef,
    heightPx,
    resizing,
    handleResizePointerDown,
    consumeClickIfResized,
  };
};
