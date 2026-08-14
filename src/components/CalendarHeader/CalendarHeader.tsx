import type { CalendarHeaderProps } from './CalendarHeader.types';
import {
  BUTTON_TYPE,
  CAL_HEADER,
  CAL_HEADER_NAV,
  CAL_HEADER_TITLE,
  CAL_HEADER_VIEW,
  CAL_HEADER_VIEWS,
  CAL_HEADER_VIEW_ACTIVE,
  CALENDAR_VIEWS,
} from './CalendarHeader.const';
import { joinClassNames } from '../../utils';

export function CalendarHeader(props: CalendarHeaderProps) {
  const { title, view, translations, onPrevious, onNext, onToday, onViewChange } = props;

  return (
    <div className={CAL_HEADER}>
      <div className={CAL_HEADER_NAV}>
        <button type={BUTTON_TYPE} aria-label={translations.previous} onClick={onPrevious}>
          {translations.previous}
        </button>
        <button type={BUTTON_TYPE} aria-label={translations.today} onClick={onToday}>
          {translations.today}
        </button>
        <button type={BUTTON_TYPE} aria-label={translations.next} onClick={onNext}>
          {translations.next}
        </button>
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
      </div>
    </div>
  );
}
