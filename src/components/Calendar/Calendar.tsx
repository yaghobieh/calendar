import { useState, type KeyboardEvent, type MouseEvent } from 'react';
import type { CalendarEvent, CalendarLayoutMode, CalendarProps, CalendarSlot } from '../../types';
import { CalendarHeader } from '../CalendarHeader';
import { MonthView } from '../MonthView';
import { WeekView } from '../WeekView';
import { DayView } from '../DayView';
import { AgendaView } from '../AgendaView';
import { EventPopover } from '../EventPopover';
import { CAL_BEM, CAL_BEM_FULL_PAGE, TAB_INDEX_ROOT } from './Calendar.const';
import {
  createDraftEvent,
  headerTitle,
  mergeCalendarEvents,
  mergeTranslations,
  resolveCalendarId,
} from './Calendar.utils';
import {
  DEFAULT_FIRST_DAY,
  DEFAULT_LAYOUT,
  EMPTY_STRING,
  KEY_ARROW_DOWN,
  KEY_ARROW_LEFT,
  KEY_ARROW_RIGHT,
  KEY_ARROW_UP,
  KEY_TODAY,
  KEY_TODAY_UPPER,
  LAYOUT_CONTAINED,
  LAYOUT_FULL_PAGE,
  MODAL_CONTAINMENT_CALENDAR,
  MODAL_CONTAINMENT_PAGE,
  NUMBER_ONE,
  NUMBER_ZERO,
  RELATION_VISIBLE_ALWAYS,
  VIEW_AGENDA,
  VIEW_DAY,
  VIEW_MONTH,
  VIEW_WEEK,
} from '@constants';
import { useCalendar } from '@hooks';
import {
  createBusyEvent,
  expandRecurringEvents,
  joinClassNames,
  normalizeEvents,
  parseContextMenuTarget,
  resolveCalendarConfig,
  resolveModalEffects,
  resolveSeriesEvent,
  seriesIdFromEventId,
  startOfDay,
  addDays,
  themeToCssVars,
  visibleRangeForView,
} from '@utils';

export function Calendar(props: CalendarProps) {
  const {
    id,
    testId,
    className,
    view,
    defaultView,
    onViewChange,
    date,
    defaultDate,
    onDateChange,
    events,
    onEventClick,
    onEventEdit,
    onEventChange,
    onEventCreate,
    onSlotClick,
    onContextMenu,
    firstDayOfWeek = DEFAULT_FIRST_DAY,
    translations,
    mode,
    navIcons,
    renderEventBody,
    renderEventEdit,
    theme,
    eventModal,
    editModal,
    relations,
    config,
    people,
    layout,
    defaultLayout,
    onLayoutChange,
    layoutIcons,
    showLayoutToggle,
    personIcons,
    severityIcons,
  } = props;
  const calendar = useCalendar({ view, defaultView, onViewChange, date, defaultDate, onDateChange });
  const labels = mergeTranslations(translations);
  const [localEvents, setLocalEvents] = useState<CalendarEvent[]>([]);
  const mergedEvents = mergeCalendarEvents(events, localEvents);
  const visibleRange = visibleRangeForView(calendar.view, calendar.date, firstDayOfWeek);
  const displayEvents = expandRecurringEvents(mergedEvents, visibleRange.start, visibleRange.end);
  const normalized = normalizeEvents(displayEvents);
  const rootId = resolveCalendarId(id);
  const [openEvent, setOpenEvent] = useState<CalendarEvent | null>(null);
  const [isCreate, setIsCreate] = useState(false);
  const resolved = resolveCalendarConfig(config, {
    theme,
    eventModal,
    editModal,
    relations,
    showLayoutToggle,
    personIcons,
    severityIcons,
  });
  const [internalLayout, setInternalLayout] = useState<CalendarLayoutMode>(
    defaultLayout ?? resolved.layout ?? DEFAULT_LAYOUT,
  );
  const layoutMode = layout ?? internalLayout;
  const resizable = resolved.editModal?.resizable !== false;
  const containment =
    resolved.eventModal?.containment === MODAL_CONTAINMENT_CALENDAR
      ? MODAL_CONTAINMENT_CALENDAR
      : MODAL_CONTAINMENT_PAGE;
  const layoutToggleVisible = resolved.showLayoutToggle !== false;
  const relationVisible = resolved.relations?.visible ?? RELATION_VISIBLE_ALWAYS;
  const modalEffects = resolveModalEffects(resolved.eventModal);

  const upsertLocalEvent = (event: CalendarEvent) => {
    setLocalEvents((current) => {
      const next: CalendarEvent[] = [];
      let replaced = false;
      for (let index = NUMBER_ZERO; index < current.length; index += NUMBER_ONE) {
        if (current[index].id === event.id) {
          next.push(event);
          replaced = true;
        } else {
          next.push(current[index]);
        }
      }
      if (!replaced) {
        next.push(event);
      }
      return next;
    });
  };

  const persistSeriesEvent = (event: CalendarEvent): CalendarEvent => {
    const seriesId = seriesIdFromEventId(event.id);
    const series = resolveSeriesEvent(mergedEvents, event);
    return { ...series, ...event, id: seriesId };
  };

  const handleEventClick = (event: CalendarEvent) => {
    const series = resolveSeriesEvent(mergedEvents, event);
    setIsCreate(false);
    setOpenEvent(series);
    onEventClick?.(series);
  };

  const handleDraftChange = (event: CalendarEvent) => {
    const next = persistSeriesEvent(event);
    setOpenEvent((current) => (current?.id === next.id ? next : current));
    upsertLocalEvent(next);
  };

  const handleEventChange = (event: CalendarEvent) => {
    const next = persistSeriesEvent(event);
    setOpenEvent((current) => (current?.id === next.id ? next : current));
    upsertLocalEvent(next);
    if (isCreate) {
      setIsCreate(false);
      onEventCreate?.(next);
    }
    onEventChange?.(next);
  };

  const openCreateFromSlot = (slot: CalendarSlot) => {
    const draft = createDraftEvent(slot, EMPTY_STRING);
    setIsCreate(true);
    setOpenEvent(draft);
    upsertLocalEvent(draft);
  };

  const handleSlotClick = (slot: CalendarSlot) => {
    onSlotClick?.(slot);
    if (calendar.view !== VIEW_MONTH) {
      return;
    }
    if (resolved.eventModal?.createOnSlot === false) {
      return;
    }
    openCreateFromSlot(slot);
  };

  const markBusyDay = (slot: CalendarSlot) => {
    const busy = createBusyEvent(slot, labels.busyDay);
    upsertLocalEvent(busy);
    onEventCreate?.(busy);
  };

  const handleRootContextMenu = (nativeEvent: MouseEvent<HTMLDivElement>) => {
    if (!onContextMenu) {
      return;
    }
    const parsed = parseContextMenuTarget(nativeEvent.target, mergedEvents);
    const dayStart = startOfDay(calendar.date);
    const fallbackSlot: CalendarSlot = {
      start: dayStart,
      end: addDays(dayStart, NUMBER_ONE),
      allDay: true,
    };
    const slot = parsed?.slot ?? fallbackSlot;
    const clicked = parsed?.event;
    onContextMenu({
      type: parsed?.type ?? 'slot',
      slot,
      event: clicked,
      clientX: nativeEvent.clientX,
      clientY: nativeEvent.clientY,
      openCreate: () => {
        openCreateFromSlot(slot);
      },
      openEvent: () => {
        if (!clicked) {
          return;
        }
        handleEventClick(clicked);
      },
      markBusy: () => {
        markBusyDay(slot);
      },
    });
  };

  const handleLayoutToggle = () => {
    const next = layoutMode === LAYOUT_FULL_PAGE ? LAYOUT_CONTAINED : LAYOUT_FULL_PAGE;
    if (layout === undefined) {
      setInternalLayout(next);
    }
    onLayoutChange?.(next);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const key = event.key;
    if (key === KEY_ARROW_LEFT || key === KEY_ARROW_UP) {
      event.preventDefault();
      calendar.goToPrevious();
      return;
    }
    if (key === KEY_ARROW_RIGHT || key === KEY_ARROW_DOWN) {
      event.preventDefault();
      calendar.goToNext();
      return;
    }
    if (key === KEY_TODAY || key === KEY_TODAY_UPPER) {
      event.preventDefault();
      calendar.goToToday();
    }
  };

  return (
    <div
      id={rootId}
      data-testid={testId}
      data-cal-mode={mode}
      className={joinClassNames(
        CAL_BEM,
        layoutMode === LAYOUT_FULL_PAGE ? CAL_BEM_FULL_PAGE : undefined,
        className,
      )}
      tabIndex={TAB_INDEX_ROOT}
      style={themeToCssVars(resolved.theme)}
      onKeyDown={handleKeyDown}
      onContextMenu={handleRootContextMenu}
    >
      <CalendarHeader
        title={headerTitle(calendar.view, calendar.date, firstDayOfWeek)}
        view={calendar.view}
        translations={labels}
        onPrevious={calendar.goToPrevious}
        onNext={calendar.goToNext}
        onToday={calendar.goToToday}
        onViewChange={calendar.setView}
        navIcons={navIcons}
        layout={layoutMode}
        layoutIcons={layoutIcons}
        showLayoutToggle={layoutToggleVisible}
        onLayoutToggle={handleLayoutToggle}
      />
      {calendar.view === VIEW_MONTH && (
        <MonthView
          date={calendar.date}
          events={normalized}
          firstDayOfWeek={firstDayOfWeek}
          weekdays={labels.weekdays}
          onEventClick={handleEventClick}
          onSlotClick={handleSlotClick}
          relationVisible={relationVisible}
          activeEventId={openEvent?.id}
          joinMeeting={labels.joinMeeting}
        />
      )}
      {calendar.view === VIEW_WEEK && (
        <WeekView
          date={calendar.date}
          events={normalized}
          firstDayOfWeek={firstDayOfWeek}
          weekdays={labels.weekdays}
          onEventClick={handleEventClick}
          onEventChange={handleEventChange}
          onSlotClick={onSlotClick}
          resizable={resizable}
          relationVisible={relationVisible}
          activeEventId={openEvent?.id}
          joinMeeting={labels.joinMeeting}
        />
      )}
      {calendar.view === VIEW_DAY && (
        <DayView
          date={calendar.date}
          events={normalized}
          firstDayOfWeek={firstDayOfWeek}
          weekdays={labels.weekdays}
          onEventClick={handleEventClick}
          onEventChange={handleEventChange}
          onSlotClick={onSlotClick}
          resizable={resizable}
          joinMeeting={labels.joinMeeting}
        />
      )}
      {calendar.view === VIEW_AGENDA && (
        <AgendaView
          date={calendar.date}
          events={normalized}
          firstDayOfWeek={firstDayOfWeek}
          weekdays={labels.weekdays}
          onEventClick={handleEventClick}
          onSlotClick={onSlotClick}
          noEvents={labels.noEvents}
          joinMeeting={labels.joinMeeting}
        />
      )}
      {openEvent ? (
        <EventPopover
          key={openEvent.id}
          event={openEvent}
          translations={labels}
          onClose={() => {
            if (isCreate && openEvent) {
              const draftId = openEvent.id;
              setLocalEvents((current) => current.filter((item) => item.id !== draftId));
            }
            setOpenEvent(null);
            setIsCreate(false);
          }}
          renderEventBody={renderEventBody}
          renderEventEdit={renderEventEdit}
          people={people}
          events={mergedEvents}
          fields={resolved.editModal?.fields}
          isCreate={isCreate}
          editIcon={resolved.eventModal?.editIcon}
          closeIcon={resolved.eventModal?.closeIcon}
          saveContent={resolved.eventModal?.saveContent}
          cancelContent={resolved.eventModal?.cancelContent}
          showEdit={resolved.eventModal?.showEdit}
          showClose={resolved.eventModal?.showClose}
          showSave={resolved.eventModal?.showSave}
          showCancel={resolved.eventModal?.showCancel}
          onEventEdit={onEventEdit}
          onEventChange={handleEventChange}
          onDraftChange={handleDraftChange}
          personIcons={resolved.personIcons}
          severityIcons={resolved.severityIcons}
          containment={containment}
          openEffect={modalEffects.openEffect}
          closeEffect={modalEffects.closeEffect}
        />
      ) : null}
    </div>
  );
}
