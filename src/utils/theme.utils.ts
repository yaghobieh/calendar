import type { CSSProperties } from 'react';
import type { CalendarTheme } from '../types';
import { NUMBER_ONE, NUMBER_ZERO, THEME_CSS_VAR_MAP, THEME_KEYS } from '@constants';

export const themeToCssVars = (theme?: CalendarTheme): CSSProperties | undefined => {
  if (!theme) {
    return undefined;
  }
  const vars: Record<string, string> = {};
  for (let index = NUMBER_ZERO; index < THEME_KEYS.length; index += NUMBER_ONE) {
    const key = THEME_KEYS[index];
    const value = theme[key];
    if (value) {
      vars[THEME_CSS_VAR_MAP[key]] = value;
    }
  }
  return vars as CSSProperties;
};
