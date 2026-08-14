import { EMPTY_STRING, SPACE_STRING } from '../constants';

export const joinClassNames = (...parts: Array<string | undefined>): string =>
  parts.filter((part) => part !== undefined && part !== EMPTY_STRING).join(SPACE_STRING);
