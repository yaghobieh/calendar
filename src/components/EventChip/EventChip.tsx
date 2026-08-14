import type { MouseEvent } from 'react';
import type { EventChipProps } from './EventChip.types';
import {
  BUTTON_TYPE,
  CAL_EVENT_CHIP,
  CAL_EVENT_CHIP_ALERT,
  CAL_EVENT_CHIP_ALL_DAY,
  CAL_EVENT_CHIP_BLOCK,
  CAL_EVENT_CHIP_LIVE,
  CAL_EVENT_CHIP_RESIZE,
  CAL_EVENT_CHIP_RESIZING,
  VARIANT_BLOCK,
  VARIANT_CHIP,
} from './EventChip.const';
import { useEventResize } from '@hooks';
import { isEventHappeningNow, joinClassNames } from '@utils';

export function EventChip(props: EventChipProps) {
  const { event, variant = VARIANT_CHIP, onEventClick, onEventChange, resizable, style } = props;
  const live = isEventHappeningNow(event);
  const canResize = Boolean(resizable && variant === VARIANT_BLOCK && !event.allDay);
  const resize = useEventResize({
    event,
    enabled: canResize,
    onEventChange,
  });

  const handleClick = (mouseEvent: MouseEvent<HTMLButtonElement>) => {
    mouseEvent.stopPropagation();
    if (resize.consumeClickIfResized()) {
      return;
    }
    onEventClick?.(event.source);
  };

  const chipStyle = event.color
    ? { ...style, backgroundColor: event.color }
    : style;
  const sizedStyle =
    resize.heightPx === undefined ? chipStyle : { ...chipStyle, height: `${resize.heightPx}px` };

  return (
    <button
      ref={resize.chipRef}
      type={BUTTON_TYPE}
      className={joinClassNames(
        CAL_EVENT_CHIP,
        variant === VARIANT_BLOCK ? CAL_EVENT_CHIP_BLOCK : undefined,
        event.allDay ? CAL_EVENT_CHIP_ALL_DAY : undefined,
        live ? CAL_EVENT_CHIP_LIVE : undefined,
        resize.resizing ? CAL_EVENT_CHIP_RESIZING : undefined,
      )}
      title={event.title}
      style={sizedStyle}
      onClick={handleClick}
    >
      {live ? <span className={CAL_EVENT_CHIP_ALERT} aria-hidden="true" /> : null}
      {event.title}
      {canResize ? (
        <span
          className={CAL_EVENT_CHIP_RESIZE}
          onPointerDown={resize.handleResizePointerDown}
          onClick={(chipEvent) => chipEvent.stopPropagation()}
        />
      ) : null}
    </button>
  );
}
