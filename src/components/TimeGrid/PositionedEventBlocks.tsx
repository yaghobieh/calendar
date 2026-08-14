import type { CSSProperties } from 'react';
import type { PositionedEventBlocksProps } from './PositionedEventBlocks.types';
import { PERCENT_UNIT } from './PositionedEventBlocks.const';
import { EventChip } from '../EventChip';
import { VARIANT_BLOCK } from '../EventChip/EventChip.const';
import { NUMBER_ONE_HUNDRED, OVERLAP_GAP_PERCENT } from '@constants';

const blockStyle = (
  topPercent: number,
  heightPercent: number,
  columnIndex: number,
  columnCount: number,
): CSSProperties => {
  const columnWidth = NUMBER_ONE_HUNDRED / columnCount;
  const width = Math.max(columnWidth - OVERLAP_GAP_PERCENT, OVERLAP_GAP_PERCENT);
  const left = columnIndex * columnWidth;
  return {
    top: `${topPercent}${PERCENT_UNIT}`,
    height: `${heightPercent}${PERCENT_UNIT}`,
    left: `${left}${PERCENT_UNIT}`,
    width: `${width}${PERCENT_UNIT}`,
  };
};

export function PositionedEventBlocks(props: PositionedEventBlocksProps) {
  const { events, onEventClick, onEventChange, resizable, joinMeeting } = props;

  return (
    <>
      {events.map((positioned) => (
        <EventChip
          key={positioned.event.id}
          event={positioned.event}
          variant={VARIANT_BLOCK}
          onEventClick={onEventClick}
          onEventChange={onEventChange}
          resizable={resizable}
          joinMeeting={joinMeeting}
          style={blockStyle(
            positioned.topPercent,
            positioned.heightPercent,
            positioned.columnIndex,
            positioned.columnCount,
          )}
        />
      ))}
    </>
  );
}
