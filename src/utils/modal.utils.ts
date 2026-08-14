import type { CalendarEventModalConfig, CalendarModalEffect } from '../types';
import { MODAL_EFFECT_FADE, MODAL_EFFECT_NONE } from '@constants';
import { CAL_POPOVER_EFFECT_PREFIX } from '../components/EventPopover/EventPopover.const';

export const MODAL_PHASE_OPEN = 'open';
export const MODAL_PHASE_CLOSE = 'close';

export const resolveModalEffects = (
  eventModal?: CalendarEventModalConfig,
): { openEffect: CalendarModalEffect; closeEffect: CalendarModalEffect } => {
  const fallback = eventModal?.effect ?? MODAL_EFFECT_FADE;
  return {
    openEffect: eventModal?.openEffect ?? fallback,
    closeEffect: eventModal?.closeEffect ?? fallback,
  };
};

export const modalEffectClassName = (
  phase: typeof MODAL_PHASE_OPEN | typeof MODAL_PHASE_CLOSE,
  effect: CalendarModalEffect,
): string | undefined => {
  if (effect === MODAL_EFFECT_NONE) {
    return undefined;
  }
  return `${CAL_POPOVER_EFFECT_PREFIX}${phase}-${effect}`;
};
