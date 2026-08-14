import { useRef, useState, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import type { EventChipProps } from './EventChip.types';
import {
  BUTTON_TYPE,
  CAL_EVENT_CHIP,
  CAL_EVENT_CHIP_ALERT,
  CAL_EVENT_CHIP_ALL_DAY,
  CAL_EVENT_CHIP_BLOCK,
  CAL_EVENT_CHIP_LIVE,
  CAL_EVENT_CHIP_PEEK,
  CAL_EVENT_CHIP_PEEK_JOIN,
  CAL_EVENT_CHIP_PEEK_META,
  CAL_EVENT_CHIP_PEEK_TITLE,
  CAL_EVENT_CHIP_RESIZE,
  CAL_EVENT_CHIP_RESIZING,
  CAL_EVENT_CHIP_WRAP,
  CAL_EVENT_CHIP_WRAP_BLOCK,
  PEEK_HIDE_MS,
  REL_NOOPENER,
  TARGET_BLANK,
  TIP_OFFSET_PX,
  VARIANT_BLOCK,
  VARIANT_CHIP,
} from './EventChip.const';
import { formatChipPeekRange } from './EventChip.utils';
import { DEFAULT_TRANSLATIONS } from '@constants';
import { useEventResize } from '@hooks';
import { eventDataAttrs, isEventHappeningNow, joinClassNames } from '@utils';

interface PeekPoint {
  x: number;
  y: number;
}

export function EventChip(props: EventChipProps) {
  const { event, variant = VARIANT_CHIP, onEventClick, onEventChange, resizable, style, joinMeeting } =
    props;
  const live = isEventHappeningNow(event);
  const canResize = Boolean(resizable && variant === VARIANT_BLOCK && !event.allDay);
  const resize = useEventResize({
    event,
    enabled: canResize,
    onEventChange,
  });
  const [peek, setPeek] = useState<PeekPoint | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const joinLabel = joinMeeting ?? DEFAULT_TRANSLATIONS.joinMeeting;
  const meetingUrl = event.source.meetingUrl;
  const isBlock = variant === VARIANT_BLOCK;

  const cancelHidePeek = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const showPeek = (mouseEvent: MouseEvent<HTMLElement>) => {
    cancelHidePeek();
    setPeek({
      x: mouseEvent.clientX + TIP_OFFSET_PX,
      y: mouseEvent.clientY + TIP_OFFSET_PX,
    });
  };

  const scheduleHidePeek = () => {
    cancelHidePeek();
    hideTimerRef.current = setTimeout(() => setPeek(null), PEEK_HIDE_MS);
  };

  const handleClick = (mouseEvent: MouseEvent<HTMLButtonElement>) => {
    mouseEvent.stopPropagation();
    if (resize.consumeClickIfResized()) {
      return;
    }
    onEventClick?.(event.source);
  };

  const colorStyle = event.color ? { backgroundColor: event.color } : undefined;
  const sizedStyle =
    resize.heightPx === undefined ? style : { ...style, height: `${resize.heightPx}px` };
  const wrapStyle = isBlock ? sizedStyle : undefined;
  const buttonStyle = isBlock ? colorStyle : { ...colorStyle, ...sizedStyle };

  return (
    <div
      ref={resize.chipRef}
      className={joinClassNames(CAL_EVENT_CHIP_WRAP, isBlock ? CAL_EVENT_CHIP_WRAP_BLOCK : undefined)}
      style={wrapStyle}
      onMouseEnter={showPeek}
      onMouseLeave={scheduleHidePeek}
      {...eventDataAttrs(event.source.id)}
    >
      <button
        type={BUTTON_TYPE}
        className={joinClassNames(
          CAL_EVENT_CHIP,
          isBlock ? CAL_EVENT_CHIP_BLOCK : undefined,
          event.allDay ? CAL_EVENT_CHIP_ALL_DAY : undefined,
          live ? CAL_EVENT_CHIP_LIVE : undefined,
          resize.resizing ? CAL_EVENT_CHIP_RESIZING : undefined,
        )}
        style={buttonStyle}
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
      {peek
        ? createPortal(
            <div
              className={CAL_EVENT_CHIP_PEEK}
              style={{ top: peek.y, left: peek.x }}
              onMouseEnter={cancelHidePeek}
              onMouseLeave={scheduleHidePeek}
            >
              <span className={CAL_EVENT_CHIP_PEEK_TITLE}>{event.title}</span>
              {event.source.subtitle ? (
                <span className={CAL_EVENT_CHIP_PEEK_META}>{event.source.subtitle}</span>
              ) : null}
              <span className={CAL_EVENT_CHIP_PEEK_META}>{formatChipPeekRange(event)}</span>
              {meetingUrl ? (
                <a
                  className={CAL_EVENT_CHIP_PEEK_JOIN}
                  href={meetingUrl}
                  target={TARGET_BLANK}
                  rel={REL_NOOPENER}
                  onClick={(linkEvent) => linkEvent.stopPropagation()}
                >
                  {joinLabel}
                </a>
              ) : null}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
