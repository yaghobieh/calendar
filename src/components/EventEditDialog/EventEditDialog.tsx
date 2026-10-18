import { useState } from 'react';
import {
  Button,
  DatePicker,
  Input,
  Select,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  TimePicker,
  Typography,
} from '@forgedevstack/bear';
import type { CalendarEvent, CalendarRecurrenceFreq, CalendarResource } from '../../types';
import type { EventEditDialogProps } from './EventEditDialog.types';
import {
  ALL_DAY_LABEL,
  BUTTON_TYPE,
  CAL_EVENT_EDIT,
  CAL_EVENT_EDIT_ACTIONS,
  CAL_EVENT_EDIT_HEADER,
  CAL_EVENT_EDIT_COLOR,
  CAL_EVENT_EDIT_COLORS,
  CAL_EVENT_EDIT_DELETE,
  CAL_EVENT_EDIT_HEADING,
  CAL_EVENT_EDIT_SECTION,
  CAL_EVENT_EDIT_SWATCH,
  CAL_EVENT_EDIT_TIMES,
  CLOSE_EDITOR_LABEL,
  DATE_TIME_LABEL,
  DELETE_EVENT_LABEL,
  DESCRIPTION_LABEL,
  END_DATE_LABEL,
  END_TIME_LABEL,
  GENERAL_TAB_LABEL,
  NEW_EVENT_TITLE,
  INTERVAL_LABEL,
  RECURRENCE_OPTIONS,
  RECURRENCE_TAB_LABEL,
  REPEAT_LABEL,
  RESOURCE_COLOR_LABEL,
  RESOURCE_LABEL,
  SAVE_EVENT_LABEL,
  START_DATE_LABEL,
  START_TIME_LABEL,
  TAB_GENERAL,
  TAB_RECURRENCE,
  TIME_FORMAT,
  TITLE_LABEL,
} from './EventEditDialog.const';
import {
  displayEndDate,
  recurrenceFromForm,
  resolveEventRange,
  savedTitle,
  toTimeValue,
} from './EventEditDialog.utils';
import {
  DEFAULT_RECURRENCE_INTERVAL,
  DEFAULT_RESOURCES,
  EVENT_COLOR_CHOICES,
  NUMBER_ONE,
  NUMBER_ZERO,
  RECURRENCE_EVERY_X_MONTHS,
  RECURRENCE_NONE,
} from '@constants';
import { startOfDay, toDate } from '@utils';

interface EventEditFormProps {
  event: CalendarEvent;
  resources: CalendarResource[];
  onSave: (event: CalendarEvent) => void;
  onDelete?: (event: CalendarEvent) => void;
}

function colorChoices(current: string): string[] {
  if (EVENT_COLOR_CHOICES.includes(current)) {
    return EVENT_COLOR_CHOICES;
  }
  return [current, ...EVENT_COLOR_CHOICES];
}

function EventEditForm(props: EventEditFormProps) {
  const { event, resources, onSave, onDelete } = props;
  const initialResource = event.resourceId ?? '';
  const matched = resources.find((resource) => resource.id === initialResource);
  const [title, setTitle] = useState(event.title);
  const [startDate, setStartDate] = useState(() => startOfDay(toDate(event.start)));
  const [endDate, setEndDate] = useState(() => displayEndDate(event));
  const [startTime, setStartTime] = useState(() => toTimeValue(event.start));
  const [endTime, setEndTime] = useState(() => toTimeValue(event.end));
  const [allDay, setAllDay] = useState(Boolean(event.allDay));
  const [resourceId, setResourceId] = useState(initialResource);
  const [color, setColor] = useState(event.color ?? matched?.color ?? EVENT_COLOR_CHOICES[NUMBER_ZERO]);
  const [description, setDescription] = useState(event.description ?? '');
  const [freq, setFreq] = useState<CalendarRecurrenceFreq>(event.recurrence?.freq ?? RECURRENCE_NONE);
  const [intervalText, setIntervalText] = useState(
    String(event.recurrence?.interval ?? DEFAULT_RECURRENCE_INTERVAL),
  );

  const resourceOptions = resources.map((resource) => ({
    value: resource.id,
    label: resource.title,
  }));

  const save = () => {
    const range = resolveEventRange(startDate, endDate, startTime, endTime, allDay);
    onSave({
      ...event,
      title: savedTitle(title),
      start: range.start,
      end: range.end,
      allDay,
      resourceId: resourceId || undefined,
      color,
      description,
      recurrence: recurrenceFromForm(freq, intervalText),
    });
  };

  return (
    <div>
      <Input
        aria-label={TITLE_LABEL}
        placeholder={TITLE_LABEL}
        value={title}
        fullWidth
        onChange={(changeEvent) => setTitle(changeEvent.target.value)}
      />
      <Tabs defaultTab={TAB_GENERAL} variant="line">
        <TabList>
          <Tab id={TAB_GENERAL}>{GENERAL_TAB_LABEL}</Tab>
          <Tab id={TAB_RECURRENCE}>{RECURRENCE_TAB_LABEL}</Tab>
        </TabList>
        <TabPanel tabId={TAB_GENERAL}>
          <div className={CAL_EVENT_EDIT_SECTION}>
            <Typography variant="caption" className={CAL_EVENT_EDIT_HEADING}>
              {DATE_TIME_LABEL}
            </Typography>
            <div className={CAL_EVENT_EDIT_TIMES}>
              <DatePicker
                label={START_DATE_LABEL}
                value={startDate}
                onChange={(next) => {
                  if (next) {
                    setStartDate(next);
                  }
                }}
              />
              <TimePicker
                label={START_TIME_LABEL}
                value={startTime}
                format={TIME_FORMAT}
                disabled={allDay}
                onChange={(next) => setStartTime(next ?? startTime)}
              />
              <DatePicker
                label={END_DATE_LABEL}
                value={endDate}
                onChange={(next) => {
                  if (next) {
                    setEndDate(next);
                  }
                }}
              />
              <TimePicker
                label={END_TIME_LABEL}
                value={endTime}
                format={TIME_FORMAT}
                disabled={allDay}
                onChange={(next) => setEndTime(next ?? endTime)}
              />
            </div>
            <Switch label={ALL_DAY_LABEL} checked={allDay} onCheckedChange={setAllDay} />
          </div>
          <div className={CAL_EVENT_EDIT_SECTION}>
            <Typography variant="caption" className={CAL_EVENT_EDIT_HEADING}>
              {RESOURCE_COLOR_LABEL}
            </Typography>
            <Select
              label={RESOURCE_LABEL}
              options={resourceOptions}
              value={resourceId}
              placeholder={RESOURCE_LABEL}
              fullWidth
              onChange={(next) => {
                setResourceId(next);
                for (let index = NUMBER_ZERO; index < resources.length; index += NUMBER_ONE) {
                  if (resources[index].id === next) {
                    setColor(resources[index].color);
                    break;
                  }
                }
              }}
            />
            <div className={CAL_EVENT_EDIT_COLORS}>
              {colorChoices(color).map((swatch) => (
                <Button
                  key={swatch}
                  type={BUTTON_TYPE}
                  variant={swatch === color ? 'primary' : 'outline'}
                  size="sm"
                  className={CAL_EVENT_EDIT_COLOR}
                  aria-label={swatch}
                  aria-pressed={swatch === color}
                  onClick={() => setColor(swatch)}
                >
                  <span className={CAL_EVENT_EDIT_SWATCH} style={{ background: swatch }} />
                </Button>
              ))}
            </div>
            <Input
              label={DESCRIPTION_LABEL}
              value={description}
              fullWidth
              onChange={(changeEvent) => setDescription(changeEvent.target.value)}
            />
          </div>
        </TabPanel>
        <TabPanel tabId={TAB_RECURRENCE}>
          <div className={CAL_EVENT_EDIT_SECTION}>
            <Select
              label={REPEAT_LABEL}
              options={RECURRENCE_OPTIONS}
              value={freq}
              fullWidth
              onChange={(next) => setFreq(next as CalendarRecurrenceFreq)}
            />
            {freq === RECURRENCE_EVERY_X_MONTHS ? (
              <Input
                label={INTERVAL_LABEL}
                type="number"
                min={NUMBER_ONE}
                value={intervalText}
                fullWidth
                onChange={(changeEvent) => setIntervalText(changeEvent.target.value)}
              />
            ) : null}
          </div>
        </TabPanel>
      </Tabs>
      <div className={CAL_EVENT_EDIT_ACTIONS}>
        {onDelete ? (
          <Button
            type={BUTTON_TYPE}
            variant="ghost"
            className={CAL_EVENT_EDIT_DELETE}
            style={{ color: '#dc2626' }}
            onClick={() => onDelete(event)}
          >
            {DELETE_EVENT_LABEL}
          </Button>
        ) : (
          <span />
        )}
        <Button type={BUTTON_TYPE} variant="primary" onClick={save}>
          {SAVE_EVENT_LABEL}
        </Button>
      </div>
    </div>
  );
}

export function EventEditDialog(props: EventEditDialogProps) {
  const {
    id,
    testId,
    open,
    event,
    resources = DEFAULT_RESOURCES,
    onClose,
    onSave,
    onDelete,
  } = props;

  if (!open || !event) {
    return null;
  }

  return (
    <aside id={id} data-testid={testId} className={CAL_EVENT_EDIT}>
      <div className={CAL_EVENT_EDIT_HEADER}>
        <Typography variant="h5">{event.title || NEW_EVENT_TITLE}</Typography>
        <Button type={BUTTON_TYPE} variant="ghost" size="sm" aria-label={CLOSE_EDITOR_LABEL} onClick={onClose}>
          {CLOSE_EDITOR_LABEL}
        </Button>
      </div>
      <EventEditForm
        key={event.id}
        event={event}
        resources={resources}
        onSave={onSave}
        onDelete={onDelete}
      />
    </aside>
  );
}
