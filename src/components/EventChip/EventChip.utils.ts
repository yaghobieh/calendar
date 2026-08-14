import {
  CAL_BG_VAR,
  CAL_BORDER_VAR,
  CAL_MUTED_VAR,
  CAL_PRIMARY_VAR,
  CAL_TEXT_VAR,
  DEFAULT_LOCALE,
  HOUR_LABEL_PAD,
  NUMBER_ZERO,
  PAD_ZERO,
  PEEK_BG_FALLBACK,
  PEEK_BORDER_FALLBACK,
  PEEK_MUTED_FALLBACK,
  PEEK_PRIMARY_FALLBACK,
  PEEK_TEXT_FALLBACK,
  SHORT_DATE_FORMAT,
  TIME_SEPARATOR,
} from '@constants';
import { RANGE_SEPARATOR } from './EventChip.const';
import type { PeekPlacement, PeekTheme } from './EventChip.types';
import type { NormalizedEvent } from '../../types';

const pad = (value: number): string => String(value).padStart(HOUR_LABEL_PAD, PAD_ZERO);

const cssVar = (styles: CSSStyleDeclaration, name: string, fallback: string): string => {
  const value = styles.getPropertyValue(name).trim();
  return value.length > NUMBER_ZERO ? value : fallback;
};

export const formatChipPeekRange = (event: NormalizedEvent): string => {
  const day = event.start.toLocaleDateString(DEFAULT_LOCALE, SHORT_DATE_FORMAT);
  if (event.allDay) {
    return day;
  }
  const startLabel = `${pad(event.start.getHours())}${TIME_SEPARATOR}${pad(event.start.getMinutes())}`;
  const endLabel = `${pad(event.end.getHours())}${TIME_SEPARATOR}${pad(event.end.getMinutes())}`;
  return `${day} ${startLabel}${RANGE_SEPARATOR}${endLabel}`;
};

export const peekThemeFromNode = (node: HTMLElement): PeekTheme => {
  const styles = getComputedStyle(node);
  return {
    background: cssVar(styles, CAL_BG_VAR, PEEK_BG_FALLBACK),
    color: cssVar(styles, CAL_TEXT_VAR, PEEK_TEXT_FALLBACK),
    border: cssVar(styles, CAL_BORDER_VAR, PEEK_BORDER_FALLBACK),
    muted: cssVar(styles, CAL_MUTED_VAR, PEEK_MUTED_FALLBACK),
    primary: cssVar(styles, CAL_PRIMARY_VAR, PEEK_PRIMARY_FALLBACK),
  };
};

export const placePeek = (
  rect: DOMRect,
  viewportWidth: number,
  viewportHeight: number,
  pad: number,
  estimateHeight: number,
  maxWidth: number,
  theme: PeekTheme,
): PeekPlacement => {
  const below = rect.top < estimateHeight + pad;
  const y = below ? rect.bottom : rect.top;
  const maxX = viewportWidth - maxWidth - pad;
  const clampedMax = maxX < pad ? pad : maxX;
  let x = rect.left;
  if (x < pad) {
    x = pad;
  }
  if (x > clampedMax) {
    x = clampedMax;
  }
  if (y > viewportHeight - pad) {
    return { x, y: viewportHeight - pad, below: false, ...theme };
  }
  if (y < NUMBER_ZERO) {
    return { x, y: pad, below: true, ...theme };
  }
  return { x, y, below, ...theme };
};
