import { useState } from 'react';
import {
  Button,
  Calendar as BearMonth,
  ChevronLeftIcon,
  ChevronRightIcon,
  DatePicker,
  MenuIcon,
  Select,
  SettingsIcon,
  Switch,
  Typography,
} from '@forgedevstack/bear';
import type { FirstDayOfWeek, SchedulerThemeChoice } from '../../types';
import type { EventCalendarProps } from './EventCalendar.types';
import { EventMonthGrid } from './EventMonthGrid';
import { EventShow } from './EventShow';
import { EventEditDialog } from '../EventEditDialog';
import { ResourceFilter } from '../ResourceFilter';
import {
  BUTTON_TYPE,
  CAL_EVENT_CALENDAR,
  CAL_EVENT_CALENDAR_BODY,
  CAL_EVENT_CALENDAR_CARD,
  CAL_EVENT_CALENDAR_MAIN,
  CAL_EVENT_CALENDAR_MINI,
  CAL_EVENT_CALENDAR_RANGE,
  CAL_EVENT_CALENDAR_SETTINGS,
  CAL_EVENT_CALENDAR_SIDE,
  CAL_EVENT_CALENDAR_TOOLBAR,
  CAL_EVENT_CALENDAR_TOOLBAR_END,
  CAL_SCHEDULER,
  CAL_SCHEDULER_CONTROLS,
  CAL_SCHEDULER_COPY,
  CAL_SCHEDULER_INTRO,
  CAL_SCHEDULER_SELECT,
} from './EventCalendar.const';
import {
  DEFAULT_FIRST_DAY,
  DEFAULT_RESOURCES,
  DEFAULT_TRANSLATIONS,
  EVENT_CALENDAR_DESCRIPTION,
  EVENT_CALENDAR_TITLE,
  FROM_LABEL,
  NUMBER_ONE,
  NUMBER_ZERO,
  RANGE_SEPARATOR,
  SETTINGS_LABEL,
  SETTINGS_SIDEBAR_LABEL,
  SETTINGS_WEEK_LABEL,
  SHOW_DAY,
  SHOW_MONTH,
  SHOW_OPTIONS,
  SHOW_RANGE,
  SHOW_YEAR,
  SIDEBAR_HIDE_LABEL,
  SIDEBAR_SHOW_LABEL,
  THEME_DARK,
  THEME_DEFAULT,
  THEME_LIGHT,
  THEME_OPTIONS,
  TO_LABEL,
  WEEK_START_OPTIONS,
} from '@constants';
import { useSchedulerEvents } from '../../hooks/useSchedulerEvents';
import {
  addDays,
  addMonths,
  createResourceDraft,
  expandRecurringEvents,
  filterEventsByResources,
  formatDayHeading,
  formatMonthYear,
  formatShortDate,
  joinClassNames,
  normalizeEvents,
  resourceIds,
  startOfMonth,
  visibleRangeForView,
} from '@utils';

export function EventCalendar(props: EventCalendarProps) {
  const {
    id,
    testId,
    className,
    title = EVENT_CALENDAR_TITLE,
    description = EVENT_CALENDAR_DESCRIPTION,
    date,
    defaultDate,
    onDateChange,
    events,
    resources = DEFAULT_RESOURCES,
    visibleResourceIds,
    defaultVisibleResourceIds,
    onVisibleResourceIdsChange,
    onEventClick,
    onEventChange,
    onEventCreate,
    onEventDelete,
    firstDayOfWeek = DEFAULT_FIRST_DAY,
    weekdays = DEFAULT_TRANSLATIONS.weekdays,
    showMiniCalendar = true,
    showResourceFilter = true,
    mode: modeProp,
  } = props;
  const scheduler = useSchedulerEvents({ events, onEventChange, onEventCreate, onEventDelete });
  const [uncontrolledDate, setUncontrolledDate] = useState(() => defaultDate ?? new Date());
  const [internalVisible, setInternalVisible] = useState<string[]>(
    () => defaultVisibleResourceIds ?? resourceIds(resources),
  );
  const [theme, setTheme] = useState<SchedulerThemeChoice>(
    modeProp === THEME_LIGHT || modeProp === THEME_DARK ? modeProp : THEME_DEFAULT,
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [show, setShow] = useState(SHOW_MONTH);
  const [weekStart, setWeekStart] = useState<FirstDayOfWeek>(firstDayOfWeek);
  const [rangeFrom, setRangeFrom] = useState(() => startOfMonth(defaultDate ?? new Date()));
  const [rangeTo, setRangeTo] = useState(() => addDays(addMonths(startOfMonth(defaultDate ?? new Date()), NUMBER_ONE), -NUMBER_ONE));
  const activeDate = date ?? uncontrolledDate;
  const visibleIds = visibleResourceIds ?? internalVisible;
  const mode = theme === THEME_DEFAULT ? undefined : theme;

  const updateDate = (next: Date) => {
    if (date === undefined) {
      setUncontrolledDate(next);
    }
    onDateChange?.(next);
  };

  const updateVisible = (ids: string[]) => {
    if (visibleResourceIds === undefined) {
      setInternalVisible(ids);
    }
    onVisibleResourceIdsChange?.(ids);
  };

  const range = visibleRangeForView(SHOW_MONTH, activeDate, weekStart);
  const filtered = filterEventsByResources(scheduler.events, visibleIds);
  const normalized = normalizeEvents(expandRecurringEvents(filtered, range.start, range.end));
  const showSide = sidebarOpen && (showMiniCalendar || showResourceFilter);

  const openDay = (day: Date) => {
    let resource = resources[NUMBER_ZERO];
    for (let index = 0; index < resources.length; index += NUMBER_ONE) {
      if (visibleIds.includes(resources[index].id)) {
        resource = resources[index];
        break;
      }
    }
    scheduler.openCreate(createResourceDraft(day, resource));
  };

  const shiftDate = (direction: number) => {
    if (show === SHOW_DAY) {
      updateDate(addDays(activeDate, direction));
      return;
    }
    if (show === SHOW_YEAR) {
      updateDate(addMonths(activeDate, direction * 12));
      return;
    }
    if (show === SHOW_RANGE) {
      const start = rangeFrom.getTime() <= rangeTo.getTime() ? rangeFrom : rangeTo;
      const end = rangeFrom.getTime() <= rangeTo.getTime() ? rangeTo : rangeFrom;
      let span = NUMBER_ONE;
      let cursor = start;
      while (cursor.getTime() < end.getTime()) {
        cursor = addDays(cursor, NUMBER_ONE);
        span += NUMBER_ONE;
      }
      setRangeFrom(addDays(start, direction * span));
      setRangeTo(addDays(end, direction * span));
      return;
    }
    updateDate(addMonths(activeDate, direction));
  };

  const heading = (() => {
    if (show === SHOW_DAY) {
      return formatDayHeading(activeDate);
    }
    if (show === SHOW_YEAR) {
      return String(activeDate.getFullYear());
    }
    if (show === SHOW_RANGE) {
      return `${formatShortDate(rangeFrom)}${RANGE_SEPARATOR}${formatShortDate(rangeTo)}`;
    }
    return formatMonthYear(activeDate);
  })();

  return (
    <section
      id={id}
      className={joinClassNames(CAL_SCHEDULER, CAL_EVENT_CALENDAR, className)}
      data-testid={testId}
      data-cal-mode={mode}
    >
      {title || description ? (
        <div className={CAL_SCHEDULER_INTRO}>
          {title ? (
            <Typography variant="h4" component="h2">
              {title}
            </Typography>
          ) : null}
          {description ? (
            <Typography variant="body2" className={CAL_SCHEDULER_COPY}>
              {description}
            </Typography>
          ) : null}
        </div>
      ) : null}
      <div className={CAL_SCHEDULER_CONTROLS}>
        <Select
          className={CAL_SCHEDULER_SELECT}
          options={THEME_OPTIONS}
          value={theme}
          size="sm"
          onChange={(next) => {
            if (next === THEME_LIGHT || next === THEME_DARK || next === THEME_DEFAULT) {
              setTheme(next);
            }
          }}
        />
      </div>
      <div className={CAL_EVENT_CALENDAR_CARD}>
        <div className={CAL_EVENT_CALENDAR_TOOLBAR}>
          <Button
            type={BUTTON_TYPE}
            variant="ghost"
            size="sm"
            aria-label={sidebarOpen ? SIDEBAR_HIDE_LABEL : SIDEBAR_SHOW_LABEL}
            aria-pressed={sidebarOpen}
            icon={<MenuIcon />}
            onClick={() => setSidebarOpen((open) => !open)}
          />
          <Typography variant="h5" component="h3">
            {heading}
          </Typography>
          <div className={CAL_EVENT_CALENDAR_TOOLBAR_END}>
            <Button
              type={BUTTON_TYPE}
              variant="ghost"
              size="sm"
              aria-label={DEFAULT_TRANSLATIONS.previous}
              icon={<ChevronLeftIcon />}
              onClick={() => shiftDate(-NUMBER_ONE)}
            />
            <Button
              type={BUTTON_TYPE}
              variant="ghost"
              size="sm"
              aria-label={DEFAULT_TRANSLATIONS.next}
              icon={<ChevronRightIcon />}
              onClick={() => shiftDate(NUMBER_ONE)}
            />
            <Button
              type={BUTTON_TYPE}
              variant="outline"
              size="sm"
              onClick={() => updateDate(new Date())}
            >
              {DEFAULT_TRANSLATIONS.today}
            </Button>
            <Select
              className={CAL_SCHEDULER_SELECT}
              options={SHOW_OPTIONS}
              value={show}
              size="sm"
              onChange={(next) => {
                if (next === SHOW_DAY || next === SHOW_MONTH || next === SHOW_YEAR || next === SHOW_RANGE) {
                  setShow(next);
                }
              }}
            />
            <Button
              type={BUTTON_TYPE}
              variant={settingsOpen ? 'primary' : 'ghost'}
              size="sm"
              aria-label={SETTINGS_LABEL}
              aria-expanded={settingsOpen}
              icon={<SettingsIcon />}
              onClick={() => setSettingsOpen((open) => !open)}
            />
          </div>
        </div>
        {settingsOpen ? (
          <div className={CAL_EVENT_CALENDAR_SETTINGS}>
            <Switch
              label={SETTINGS_SIDEBAR_LABEL}
              checked={sidebarOpen}
              onCheckedChange={setSidebarOpen}
            />
            <Select
              className={CAL_SCHEDULER_SELECT}
              label={SETTINGS_WEEK_LABEL}
              options={WEEK_START_OPTIONS}
              value={String(weekStart)}
              size="sm"
              onChange={(next) => setWeekStart(next === '1' ? 1 : 0)}
            />
          </div>
        ) : null}
        {show === SHOW_RANGE ? (
          <div className={CAL_EVENT_CALENDAR_RANGE}>
            <DatePicker
              label={FROM_LABEL}
              value={rangeFrom}
              onChange={(next) => {
                if (next) {
                  setRangeFrom(next);
                }
              }}
            />
            <DatePicker
              label={TO_LABEL}
              value={rangeTo}
              onChange={(next) => {
                if (next) {
                  setRangeTo(next);
                }
              }}
            />
          </div>
        ) : null}
      <div className={CAL_EVENT_CALENDAR_BODY}>
          {showSide ? (
            <aside className={CAL_EVENT_CALENDAR_SIDE}>
              {showMiniCalendar ? (
                <div className={CAL_EVENT_CALENDAR_MINI}>
                  <BearMonth
                    inline
                    viewDate={activeDate}
                    value={activeDate}
                    firstDayOfWeek={weekStart}
                    weekdayLabels={weekdays}
                    onSelect={updateDate}
                    onViewChange={updateDate}
                  />
                </div>
              ) : null}
              {showResourceFilter ? (
                <ResourceFilter
                  resources={resources}
                  visibleResourceIds={visibleIds}
                  onVisibleResourceIdsChange={updateVisible}
                />
              ) : null}
            </aside>
          ) : null}
          <div className={CAL_EVENT_CALENDAR_MAIN}>
            {show === SHOW_MONTH ? (
              <EventMonthGrid
                date={activeDate}
                events={normalized}
                resources={resources}
                firstDayOfWeek={weekStart}
                weekdays={weekdays}
                onDayClick={openDay}
                onEventClick={(event) => {
                  onEventClick?.(event.source);
                  scheduler.openEvent(event.source);
                }}
              />
            ) : (
              <EventShow
                show={show}
                date={activeDate}
                rangeFrom={rangeFrom}
                rangeTo={rangeTo}
                events={normalized}
                resources={resources}
                onEventClick={(event) => {
                  onEventClick?.(event.source);
                  scheduler.openEvent(event.source);
                }}
                onPickMonth={(month) => {
                  updateDate(month);
                  setShow(SHOW_MONTH);
                }}
              />
            )}
          </div>
          <EventEditDialog
            open={scheduler.editing !== null}
            event={scheduler.editing}
            resources={resources}
            onClose={scheduler.closeEditor}
            onSave={scheduler.saveEvent}
            onDelete={scheduler.deleteEvent}
          />
        </div>
      </div>
    </section>
  );
}
