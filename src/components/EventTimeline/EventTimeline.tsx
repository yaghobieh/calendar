import { useState } from 'react';
import { Button, Select, Typography } from '@forgedevstack/bear';
import type { CalendarResource, NormalizedEvent, SchedulerThemeChoice } from '../../types';
import type { EventTimelineProps } from './EventTimeline.types';
import { EventEditDialog } from '../EventEditDialog';
import {
  CAL_EVENT_CALENDAR_BODY,
  CAL_SCHEDULER,
  CAL_SCHEDULER_CONTROLS,
  CAL_SCHEDULER_COPY,
  CAL_SCHEDULER_INTRO,
  CAL_SCHEDULER_SELECT,
} from '../EventCalendar/EventCalendar.const';
import {
  BAR_LANE_PX,
  BAR_TOP_PX,
  BUTTON_TYPE,
  CAL_EVENT_TIMELINE,
  CAL_TIMELINE_BAR,
  CAL_TIMELINE_CARD,
  CAL_TIMELINE_DOT,
  CAL_TIMELINE_GUTTER,
  CAL_TIMELINE_HEAD,
  CAL_TIMELINE_LABEL,
  CAL_TIMELINE_LINE,
  CAL_TIMELINE_LINES,
  CAL_TIMELINE_MONTH,
  CAL_TIMELINE_MONTHS,
  CAL_TIMELINE_NAV,
  CAL_TIMELINE_ROW,
  CAL_TIMELINE_TRACK,
  CAL_TIMELINE_YEAR,
  GUTTER_WIDTH,
} from './EventTimeline.const';
import {
  DEFAULT_RESOURCES,
  DEFAULT_TRANSLATIONS,
  EVENT_TIMELINE_DESCRIPTION,
  EVENT_TIMELINE_TITLE,
  NUMBER_ONE,
  NUMBER_ZERO,
  RESOURCE_COLUMN_LABEL,
  SCALE_MONTHS,
  SCALE_OPTIONS,
  THEME_DARK,
  THEME_DEFAULT,
  THEME_LIGHT,
  THEME_OPTIONS,
  TIMELINE_MONTH_COUNT,
  UNASSIGNED_RESOURCE_COLOR,
  UNASSIGNED_RESOURCE_TITLE,
} from '@constants';
import { useSchedulerEvents } from '../../hooks/useSchedulerEvents';
import {
  addMonths,
  eventColor,
  eventsForResource,
  expandRecurringEvents,
  formatMonthShort,
  joinClassNames,
  normalizeEvents,
  startOfMonth,
  timelineBars,
  timelineYearLabel,
  tintedBarStyle,
  unassignedEvents,
} from '@utils';

function monthColumns(anchor: Date): Date[] {
  const start = startOfMonth(anchor);
  const months: Date[] = [];
  for (let index = NUMBER_ZERO; index < TIMELINE_MONTH_COUNT; index += NUMBER_ONE) {
    months.push(addMonths(start, index));
  }
  return months;
}

function trackTemplate(count: number): string {
  return `${GUTTER_WIDTH} repeat(${count}, minmax(4.5rem, 1fr))`;
}

interface TimelineRowProps {
  resource: CalendarResource;
  events: NormalizedEvent[];
  resources: CalendarResource[];
  rangeStart: Date;
  rangeEnd: Date;
  monthCount: number;
  onEventClick: (event: NormalizedEvent) => void;
}

function TimelineRow(props: TimelineRowProps) {
  const { resource, events, resources, rangeStart, rangeEnd, monthCount, onEventClick } = props;
  const bars = timelineBars(events, rangeStart, rangeEnd);
  let laneCount = NUMBER_ONE;
  for (let index = NUMBER_ZERO; index < bars.length; index += NUMBER_ONE) {
    if (bars[index].lane + NUMBER_ONE > laneCount) {
      laneCount = bars[index].lane + NUMBER_ONE;
    }
  }
  const lines: number[] = [];
  for (let index = NUMBER_ZERO; index < monthCount; index += NUMBER_ONE) {
    lines.push(index);
  }

  return (
    <div className={CAL_TIMELINE_ROW} style={{ gridTemplateColumns: trackTemplate(monthCount) }}>
      <div className={CAL_TIMELINE_LABEL}>
        <span className={CAL_TIMELINE_DOT} style={{ background: resource.color }} />
        <Typography variant="body2">{resource.title}</Typography>
      </div>
      <div
        className={CAL_TIMELINE_TRACK}
        style={{ minHeight: laneCount * BAR_LANE_PX + BAR_TOP_PX }}
      >
        <div
          className={CAL_TIMELINE_LINES}
          style={{ gridTemplateColumns: `repeat(${monthCount}, minmax(0, 1fr))` }}
        >
          {lines.map((line) => (
            <div key={line} className={CAL_TIMELINE_LINE} />
          ))}
        </div>
        {bars.map((bar) => (
          <button
            key={bar.event.id}
            type={BUTTON_TYPE}
            className={CAL_TIMELINE_BAR}
            style={{
              ...tintedBarStyle(eventColor(bar.event, resources)),
              left: `${bar.left * 100}%`,
              width: `${bar.width * 100}%`,
              top: BAR_TOP_PX + bar.lane * BAR_LANE_PX,
            }}
            onClick={() => onEventClick(bar.event)}
          >
            {bar.event.title}
          </button>
        ))}
      </div>
    </div>
  );
}

export function EventTimeline(props: EventTimelineProps) {
  const {
    id,
    testId,
    className,
    title = EVENT_TIMELINE_TITLE,
    description = EVENT_TIMELINE_DESCRIPTION,
    date,
    defaultDate,
    onDateChange,
    events,
    resources = DEFAULT_RESOURCES,
    onEventClick,
    onEventChange,
    onEventCreate,
    onEventDelete,
  } = props;
  const scheduler = useSchedulerEvents({ events, onEventChange, onEventCreate, onEventDelete });
  const [uncontrolledDate, setUncontrolledDate] = useState(() => defaultDate ?? new Date());
  const [theme, setTheme] = useState<SchedulerThemeChoice>(THEME_DEFAULT);
  const activeDate = date ?? uncontrolledDate;
  const months = monthColumns(activeDate);
  const rangeStart = months[NUMBER_ZERO];
  const rangeEnd = addMonths(rangeStart, TIMELINE_MONTH_COUNT);
  const normalized = normalizeEvents(
    expandRecurringEvents(scheduler.events, rangeStart, rangeEnd),
  );
  const extra = unassignedEvents(normalized, resources);
  const mode = theme === THEME_DEFAULT ? undefined : theme;
  const columns = trackTemplate(months.length);

  const updateDate = (next: Date) => {
    if (date === undefined) {
      setUncontrolledDate(next);
    }
    onDateChange?.(next);
  };

  const openEvent = (event: NormalizedEvent) => {
    onEventClick?.(event.source);
    scheduler.openEvent(event.source);
  };

  return (
    <section
      id={id}
      className={joinClassNames(CAL_SCHEDULER, CAL_EVENT_TIMELINE, className)}
      data-testid={testId}
      data-cal-mode={mode}
    >
      <div className={CAL_SCHEDULER_INTRO}>
        <Typography variant="h4" component="h2">
          {title}
        </Typography>
        <Typography variant="body2" className={CAL_SCHEDULER_COPY}>
          {description}
        </Typography>
      </div>
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
        <Select
          className={CAL_SCHEDULER_SELECT}
          options={SCALE_OPTIONS}
          value={SCALE_MONTHS}
          size="sm"
        />
        <div className={CAL_TIMELINE_NAV}>
          <Button
            type={BUTTON_TYPE}
            variant="ghost"
            size="sm"
            aria-label={DEFAULT_TRANSLATIONS.previous}
            onClick={() => updateDate(addMonths(activeDate, -NUMBER_ONE))}
          >
            {DEFAULT_TRANSLATIONS.previous}
          </Button>
          <Button
            type={BUTTON_TYPE}
            variant="outline"
            size="sm"
            onClick={() => updateDate(new Date())}
          >
            {DEFAULT_TRANSLATIONS.today}
          </Button>
          <Button
            type={BUTTON_TYPE}
            variant="ghost"
            size="sm"
            aria-label={DEFAULT_TRANSLATIONS.next}
            onClick={() => updateDate(addMonths(activeDate, NUMBER_ONE))}
          >
            {DEFAULT_TRANSLATIONS.next}
          </Button>
        </div>
      </div>
      <div className={CAL_EVENT_CALENDAR_BODY}>
      <div className={CAL_TIMELINE_CARD}>
        <div className={CAL_TIMELINE_YEAR} style={{ gridTemplateColumns: columns }}>
          <div className={CAL_TIMELINE_GUTTER} />
          <Typography variant="subtitle2" align="center">
            {timelineYearLabel(months)}
          </Typography>
        </div>
        <div className={CAL_TIMELINE_HEAD} style={{ gridTemplateColumns: columns }}>
          <div className={CAL_TIMELINE_GUTTER}>
            <Typography variant="caption">{RESOURCE_COLUMN_LABEL}</Typography>
          </div>
          <div
            className={CAL_TIMELINE_MONTHS}
            style={{ gridTemplateColumns: `repeat(${months.length}, minmax(0, 1fr))` }}
          >
            {months.map((month) => (
              <div key={month.toISOString()} className={CAL_TIMELINE_MONTH}>
                <Typography variant="caption">{formatMonthShort(month)}</Typography>
              </div>
            ))}
          </div>
        </div>
        {resources.map((resource) => (
          <TimelineRow
            key={resource.id}
            resource={resource}
            resources={resources}
            events={eventsForResource(normalized, resource.id)}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            monthCount={months.length}
            onEventClick={openEvent}
          />
        ))}
        {extra.length > NUMBER_ZERO ? (
          <TimelineRow
            resource={{
              id: 'unassigned',
              title: UNASSIGNED_RESOURCE_TITLE,
              color: UNASSIGNED_RESOURCE_COLOR,
            }}
            resources={resources}
            events={extra}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            monthCount={months.length}
            onEventClick={openEvent}
          />
        ) : null}
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
    </section>
  );
}
