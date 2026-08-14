import type { MouseEvent } from 'react';
import type { EventChipProps } from './EventChip.types';
import {
  BUTTON_TYPE,
  CAL_EVENT_CHIP,
  CAL_EVENT_CHIP_ALL_DAY,
  CAL_EVENT_CHIP_BLOCK,
  VARIANT_BLOCK,
  VARIANT_CHIP,
} from './EventChip.const';
import { joinClassNames } from '../../utils';

export function EventChip(props: EventChipProps) {
  const { event, variant = VARIANT_CHIP, onEventClick, style } = props;

  const handleClick = (mouseEvent: MouseEvent<HTMLButtonElement>) => {
    mouseEvent.stopPropagation();
    onEventClick?.(event.source);
  };

  const chipStyle = event.color
    ? { ...style, backgroundColor: event.color }
    : style;

  return (
    <button
      type={BUTTON_TYPE}
      className={joinClassNames(
        CAL_EVENT_CHIP,
        variant === VARIANT_BLOCK ? CAL_EVENT_CHIP_BLOCK : undefined,
        event.allDay ? CAL_EVENT_CHIP_ALL_DAY : undefined,
      )}
      title={event.title}
      style={chipStyle}
      onClick={handleClick}
    >
      {event.title}
    </button>
  );
}
