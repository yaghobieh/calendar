import type { CalendarResource } from '../types';

export const RESOURCE_WORK = 'work';
export const RESOURCE_HEALTH = 'health';
export const RESOURCE_SOCIAL = 'social';
export const RESOURCE_PERSONAL = 'personal';
export const RESOURCE_TRAVEL = 'travel';
export const RESOURCE_FAMILY = 'family';

export const DEFAULT_EVENT_COLOR = '#3b82f6';
export const UNASSIGNED_RESOURCE_TITLE = 'Unassigned';
export const UNASSIGNED_RESOURCE_COLOR = '#94a3b8';

export const EVENT_COLOR_CHOICES: string[] = [
  '#ef4444',
  '#ec4899',
  '#8b5cf6',
  '#3b82f6',
  '#14b8a6',
  '#22c55e',
  '#84cc16',
  '#eab308',
  '#f97316',
  '#94a3b8',
];

export const DEFAULT_RESOURCES: CalendarResource[] = [
  { id: RESOURCE_WORK, title: 'Work', color: '#7c3aed' },
  { id: RESOURCE_HEALTH, title: 'Health', color: '#10b981' },
  { id: RESOURCE_SOCIAL, title: 'Social', color: '#f97316' },
  { id: RESOURCE_PERSONAL, title: 'Personal', color: '#84cc16' },
  { id: RESOURCE_TRAVEL, title: 'Travel', color: '#3b82f6' },
  { id: RESOURCE_FAMILY, title: 'Family', color: '#ec4899' },
];
