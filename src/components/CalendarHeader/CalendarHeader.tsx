import type { ReactNode } from 'react';
import type { CalendarHeaderProps } from './CalendarHeader.types';
import {
  BUTTON_TYPE,
  CAL_HEADER,
  CAL_HEADER_LAYOUT_ICON,
  CAL_HEADER_NAV,
  CAL_HEADER_NAV_BTN,
  CAL_HEADER_NAV_BTN_ICON,
  CAL_HEADER_TITLE,
  CAL_HEADER_VIEW,
  CAL_HEADER_VIEWS,
  CAL_HEADER_VIEW_ACTIVE,
  CALENDAR_VIEWS,
  LAYOUT_ICON_VIEWBOX,
} from './CalendarHeader.const';
import { LAYOUT_FULL_PAGE } from '@constants';
import { joinClassNames } from '@utils';

const navButton = (
  label: string,
  onClick: () => void,
  icon?: ReactNode,
) => (
  <button
    type={BUTTON_TYPE}
    className={joinClassNames(CAL_HEADER_NAV_BTN, icon ? CAL_HEADER_NAV_BTN_ICON : undefined)}
    aria-label={label}
    onClick={onClick}
  >
    {icon ?? label}
  </button>
);

const DefaultExpandIcon = () => (
  <svg viewBox={LAYOUT_ICON_VIEWBOX} className={CAL_HEADER_LAYOUT_ICON} aria-hidden="true">
    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
  </svg>
);

const DefaultCollapseIcon = () => (
  <svg viewBox={LAYOUT_ICON_VIEWBOX} className={CAL_HEADER_LAYOUT_ICON} aria-hidden="true">
    <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7" />
  </svg>
);

export function CalendarHeader(props: CalendarHeaderProps) {
  const {
    title,
    view,
    translations,
    onPrevious,
    onNext,
    onToday,
    onViewChange,
    navIcons,
    layout,
    layoutIcons,
    showLayoutToggle,
    onLayoutToggle,
  } = props;
  const isFullPage = layout === LAYOUT_FULL_PAGE;
  const layoutLabel = isFullPage ? translations.collapseLayout : translations.expandLayout;
  const layoutIcon = isFullPage
    ? (layoutIcons?.collapse ?? <DefaultCollapseIcon />)
    : (layoutIcons?.expand ?? <DefaultExpandIcon />);

  return (
    <div className={CAL_HEADER}>
      <div className={CAL_HEADER_NAV}>
        {navButton(translations.previous, onPrevious, navIcons?.previous)}
        {navButton(translations.today, onToday, navIcons?.today)}
        {navButton(translations.next, onNext, navIcons?.next)}
      </div>
      <h2 className={CAL_HEADER_TITLE}>{title}</h2>
      <div className={CAL_HEADER_VIEWS}>
        {CALENDAR_VIEWS.map((viewKey) => (
          <button
            key={viewKey}
            type={BUTTON_TYPE}
            className={joinClassNames(
              CAL_HEADER_VIEW,
              viewKey === view ? CAL_HEADER_VIEW_ACTIVE : undefined,
            )}
            onClick={() => onViewChange(viewKey)}
          >
            {translations[viewKey]}
          </button>
        ))}
        {showLayoutToggle ? navButton(layoutLabel, () => onLayoutToggle?.(), layoutIcon) : null}
      </div>
    </div>
  );
}
