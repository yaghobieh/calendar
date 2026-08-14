import {
  DEFAULT_LOCALE,
  HOUR_LABEL_PAD,
  PAD_ZERO,
  SHORT_DATE_FORMAT,
  TIME_SEPARATOR,
} from '@constants';
import { RANGE_SEPARATOR } from './EventChip.const';
import type { NormalizedEvent } from '../../types';

const pad = (value: number): string => String(value).padStart(HOUR_LABEL_PAD, PAD_ZERO);

export const formatChipPeekRange = (event: NormalizedEvent): string => {
  const day = event.start.toLocaleDateString(DEFAULT_LOCALE, SHORT_DATE_FORMAT);
  if (event.allDay) {
    return day;
  }
  const startLabel = `${pad(event.start.getHours())}${TIME_SEPARATOR}${pad(event.start.getMinutes())}`;
  const endLabel = `${pad(event.end.getHours())}${TIME_SEPARATOR}${pad(event.end.getMinutes())}`;
  return `${day} ${startLabel}${RANGE_SEPARATOR}${endLabel}`;
};
