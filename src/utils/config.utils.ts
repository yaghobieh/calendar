import type { CalendarConfig } from '../types';

export const defineCalendarConfig = (config: CalendarConfig): CalendarConfig => config;

export const resolveCalendarConfig = (
  config?: CalendarConfig,
  overrides?: CalendarConfig,
): CalendarConfig => ({
  theme: { ...config?.theme, ...overrides?.theme },
  eventModal: { ...config?.eventModal, ...overrides?.eventModal },
  editModal: {
    ...config?.editModal,
    ...overrides?.editModal,
    fields: { ...config?.editModal?.fields, ...overrides?.editModal?.fields },
  },
  relations: { ...config?.relations, ...overrides?.relations },
  layout: overrides?.layout ?? config?.layout,
  showLayoutToggle: overrides?.showLayoutToggle ?? config?.showLayoutToggle,
  personIcons: { ...config?.personIcons, ...overrides?.personIcons },
  severityIcons: { ...config?.severityIcons, ...overrides?.severityIcons },
});
