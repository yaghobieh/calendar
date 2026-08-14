import { useState, type AnimationEvent, type ChangeEvent, type FormEvent, type KeyboardEvent } from 'react';
import type { CalendarEvent, CalendarEventSeverity, CalendarRecurrenceFreq } from '../../types';
import type { EventPopoverProps } from './EventPopover.types';
import {
  BUTTON_TYPE,
  CAL_POPOVER,
  CAL_POPOVER_ACTIONS,
  CAL_POPOVER_BACKDROP,
  CAL_POPOVER_BODY,
  CAL_POPOVER_CALENDAR,
  CAL_POPOVER_CANCEL,
  CAL_POPOVER_CHECK,
  CAL_POPOVER_CLOSE,
  CAL_POPOVER_CLOSE_ICON,
  CAL_POPOVER_CONTENT,
  CAL_POPOVER_EDIT,
  CAL_POPOVER_EDIT_ICON,
  CAL_POPOVER_FACE,
  CAL_POPOVER_FACE_EDIT,
  CAL_POPOVER_FACE_VIEW,
  CAL_POPOVER_FIELD,
  CAL_POPOVER_FLIP,
  CAL_POPOVER_FLIP_EDIT,
  CAL_POPOVER_FOOTER,
  CAL_POPOVER_FORM,
  CAL_POPOVER_HEADER,
  CAL_POPOVER_INPUT,
  CAL_POPOVER_LABEL,
  CAL_POPOVER_LIVE,
  CAL_POPOVER_META,
  CAL_POPOVER_PAGE,
  CAL_POPOVER_PEOPLE,
  CAL_POPOVER_PERSON,
  CAL_POPOVER_RELATED,
  CAL_POPOVER_RELATED_REMOVE,
  CAL_POPOVER_SAVE,
  CAL_POPOVER_SCENE,
  CAL_POPOVER_SCENE_EDIT,
  CAL_POPOVER_ACCENT,
  CAL_POPOVER_SCROLL,
  CAL_POPOVER_SHOW_AS,
  CAL_POPOVER_SUBTITLE,
  CAL_POPOVER_SEVERITY,
  CAL_POPOVER_SUGGEST_ITEM,
  CAL_POPOVER_SUGGEST_META,
  CAL_POPOVER_TEXTAREA,
  CAL_POPOVER_TITLE,
  CAL_POPOVER_TITLE_ID,
  CAL_POPOVER_JOIN,
  CAL_POPOVER_DROPDOWN,
  CAL_POPOVER_DROPDOWN_OPEN,
  CAL_POPOVER_DROPDOWN_TRIGGER,
  CAL_POPOVER_DROPDOWN_MENU,
  CAL_POPOVER_DROPDOWN_CHEVRON,
  CAL_POPOVER_FIELD_GROW,
  TARGET_BLANK,
  REL_NOOPENER,
  ROLE_LISTBOX,
  ROLE_OPTION,
  ARIA_HASPOPUP_LISTBOX,
  AUTOCOMPLETE_OFF,
  FIELD_ALL_DAY,
  FIELD_END,
  FIELD_NOTES,
  FIELD_PEOPLE,
  FIELD_RECURRENCE,
  FIELD_RELATED_TO,
  FIELD_SEVERITY,
  FIELD_SHOW_AS,
  FIELD_START,
  FIELD_TITLE,
  INPUT_CHECKBOX,
  INPUT_DATE,
  INPUT_NUMBER,
  INPUT_TEXT,
  INPUT_TIME,
  SUBMIT_TYPE,
  TEXTAREA_ROWS,
} from './EventPopover.const';
import {
  eventFromForm,
  eventsForIds,
  filterEventsByQuery,
  filterPeopleByQuery,
  formFromEvent,
  formatCompactRange,
  isEditFieldEnabled,
  peopleForEvent,
  relatedRemoveLabel,
  relationCandidates,
  severityLabel,
  showAsLabel,
} from './EventPopover.utils';
import type { EventEditFormState } from './EventPopover.utils';
import {
  EMPTY_STRING,
  KEY_ENTER,
  MODAL_CONTAINMENT_CALENDAR,
  MODAL_EFFECT_FADE,
  MODAL_EFFECT_NONE,
  NUMBER_ONE,
  NUMBER_ZERO,
  RECURRENCE_DAILY,
  RECURRENCE_EVERY_X_MONTHS,
  RECURRENCE_MONTHLY,
  RECURRENCE_NONE,
  RECURRENCE_WEEKLY,
  RECURRENCE_YEARLY,
  SEVERITY_HIGH,
  SEVERITY_LOW,
  SEVERITY_NONE,
  SEVERITY_NORMAL,
  SEVERITY_URGENT,
  SHOW_AS_BUSY,
  SHOW_AS_FREE,
  SHOW_AS_OOF,
  SHOW_AS_TENTATIVE,
} from '@constants';
import { PersonChip } from '../PersonChip';
import { DEFAULT_SEVERITY_ICONS } from './EventPopover.icons';
import { isEventHappeningNow, joinClassNames, modalEffectClassName, MODAL_PHASE_CLOSE, MODAL_PHASE_OPEN, normalizeEvent } from '@utils';

const DefaultEditIcon = () => (
  <svg viewBox="0 0 24 24" className={CAL_POPOVER_EDIT_ICON} aria-hidden="true">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

const DefaultCloseIcon = () => (
  <svg viewBox="0 0 24 24" className={CAL_POPOVER_CLOSE_ICON} aria-hidden="true">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const DropdownChevron = () => (
  <svg viewBox="0 0 24 24" className={CAL_POPOVER_DROPDOWN_CHEVRON} aria-hidden="true">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export function EventPopover(props: EventPopoverProps) {
  const {
    event,
    translations,
    onClose,
    people = [],
    events = [],
    fields,
    isCreate = false,
    renderEventBody,
    renderEventEdit,
    editIcon,
    closeIcon,
    saveContent,
    cancelContent,
    showEdit = true,
    showClose = true,
    showSave = true,
    showCancel = true,
    onEventEdit,
    onEventChange,
    onDraftChange,
    personIcons,
    severityIcons,
    containment,
    openEffect = MODAL_EFFECT_FADE,
    closeEffect = MODAL_EFFECT_FADE,
  } = props;
  const normalized = normalizeEvent(event);
  const live = normalized ? isEventHappeningNow(normalized) : false;
  const [editing, setEditing] = useState(isCreate);
  const [closing, setClosing] = useState(false);
  const [relatedQuery, setRelatedQuery] = useState(EMPTY_STRING);
  const [inviteQuery, setInviteQuery] = useState(EMPTY_STRING);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [relatedOpen, setRelatedOpen] = useState(false);
  const [form, setForm] = useState<EventEditFormState>(() => formFromEvent(event));
  const assignedPeople = peopleForEvent(event, people);
  const relatedEvents = eventsForIds(events, event.relatedTo ?? []);
  const relatedChoices = relationCandidates(events, event.id, form.relatedTo);
  const relatedMatches = filterEventsByQuery(relatedChoices, relatedQuery);
  const inviteMatches = filterPeopleByQuery(people, form.peopleIds, inviteQuery);
  const isCalendarContained = containment === MODAL_CONTAINMENT_CALENDAR;
  const showField = (field: Parameters<typeof isEditFieldEnabled>[1]) => isEditFieldEnabled(fields, field);
  const effectClass = modalEffectClassName(closing ? MODAL_PHASE_CLOSE : MODAL_PHASE_OPEN, closing ? closeEffect : openEffect);

  const applyForm = (next: EventEditFormState) => {
    setForm(next);
    const nextEvent = eventFromForm(event, next, translations.untitled);
    if (nextEvent) {
      onDraftChange?.(nextEvent);
    }
  };

  const requestClose = () => {
    if (closing) {
      return;
    }
    if (closeEffect === MODAL_EFFECT_NONE) {
      onClose();
      return;
    }
    setClosing(true);
  };

  const handleSceneAnimationEnd = (animationEvent: AnimationEvent<HTMLDivElement>) => {
    if (!closing) {
      return;
    }
    if (animationEvent.target !== animationEvent.currentTarget) {
      return;
    }
    onClose();
  };

  const handleEdit = () => {
    setForm(formFromEvent(event));
    setEditing(true);
    onEventEdit?.(event);
  };

  const handleCancelEdit = () => {
    if (isCreate) {
      requestClose();
      return;
    }
    setEditing(false);
  };

  const handleSaveEvent = (nextEvent: CalendarEvent) => {
    onEventChange?.(nextEvent);
    setEditing(false);
  };

  const handleSubmit = (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();
    const nextEvent = eventFromForm(event, form, translations.untitled);
    if (!nextEvent) {
      return;
    }
    handleSaveEvent(nextEvent);
  };

  const addRelated = (id: string) => {
    if (!id || form.relatedTo.includes(id) || id === event.id) {
      return;
    }
    applyForm({ ...form, relatedTo: [...form.relatedTo, id] });
    setRelatedQuery(EMPTY_STRING);
  };

  const toggleInviteOpen = () => {
    setInviteOpen((open) => !open);
    setRelatedOpen(false);
  };

  const toggleRelatedOpen = () => {
    setRelatedOpen((open) => !open);
    setInviteOpen(false);
  };

  const handleRelatedInput = (value: string) => {
    setRelatedQuery(value);
  };

  const handleRelatedKeyDown = (keyboardEvent: KeyboardEvent<HTMLInputElement>) => {
    if (keyboardEvent.key !== KEY_ENTER) {
      return;
    }
    keyboardEvent.preventDefault();
    if (relatedMatches.length === NUMBER_ZERO) {
      return;
    }
    addRelated(relatedMatches[NUMBER_ZERO].id);
  };

  const editActions = {
    onSave: handleSaveEvent,
    onCancel: handleCancelEdit,
    people,
    events,
    translations,
    saveContent,
    cancelContent,
    showSave,
    showCancel,
    fields,
    isCreate,
    onDraftChange,
    personIcons,
  };

  const renderCloseButton = () =>
    showClose ? (
      <button
        type={BUTTON_TYPE}
        className={CAL_POPOVER_CLOSE}
        aria-label={translations.close}
        onClick={requestClose}
      >
        {closeIcon ?? <DefaultCloseIcon />}
      </button>
    ) : null;

  const selectedRelated = eventsForIds(events, form.relatedTo);

  const editForm = renderEventEdit ? (
    renderEventEdit(event, editActions)
  ) : (
    <form className={CAL_POPOVER_FORM} onSubmit={handleSubmit}>
      <div className={CAL_POPOVER_SCROLL}>
      {showField(FIELD_TITLE) ? (
        <label className={CAL_POPOVER_FIELD}>
          <span className={CAL_POPOVER_LABEL}>{translations.titleLabel}</span>
          <input
            className={CAL_POPOVER_INPUT}
            type={INPUT_TEXT}
            value={form.title}
            onChange={(change: ChangeEvent<HTMLInputElement>) =>
              applyForm({ ...form, title: change.target.value })
            }
            required={!isCreate}
          />
        </label>
      ) : null}
      {showField(FIELD_ALL_DAY) ? (
        <label className={CAL_POPOVER_CHECK}>
          <input
            type={INPUT_CHECKBOX}
            checked={form.allDay}
            onChange={(change: ChangeEvent<HTMLInputElement>) =>
              applyForm({ ...form, allDay: change.target.checked })
            }
          />
          <span>{translations.allDayLabel}</span>
        </label>
      ) : null}
      {showField(FIELD_START) ? (
        <label className={CAL_POPOVER_FIELD}>
          <span className={CAL_POPOVER_LABEL}>{translations.startLabel}</span>
          <input
            className={CAL_POPOVER_INPUT}
            type={INPUT_DATE}
            value={form.startDate}
            onChange={(change: ChangeEvent<HTMLInputElement>) =>
              applyForm({ ...form, startDate: change.target.value })
            }
          />
        </label>
      ) : null}
      {showField(FIELD_START) && !form.allDay ? (
        <label className={CAL_POPOVER_FIELD}>
          <span className={CAL_POPOVER_LABEL}>{translations.startTimeLabel}</span>
          <input
            className={CAL_POPOVER_INPUT}
            type={INPUT_TIME}
            value={form.startTime}
            onChange={(change: ChangeEvent<HTMLInputElement>) =>
              applyForm({ ...form, startTime: change.target.value })
            }
          />
        </label>
      ) : null}
      {showField(FIELD_END) ? (
        <label className={CAL_POPOVER_FIELD}>
          <span className={CAL_POPOVER_LABEL}>{translations.endLabel}</span>
          <input
            className={CAL_POPOVER_INPUT}
            type={INPUT_DATE}
            value={form.endDate}
            onChange={(change: ChangeEvent<HTMLInputElement>) =>
              applyForm({ ...form, endDate: change.target.value })
            }
          />
        </label>
      ) : null}
      {showField(FIELD_END) && !form.allDay ? (
        <label className={CAL_POPOVER_FIELD}>
          <span className={CAL_POPOVER_LABEL}>{translations.endTimeLabel}</span>
          <input
            className={CAL_POPOVER_INPUT}
            type={INPUT_TIME}
            value={form.endTime}
            onChange={(change: ChangeEvent<HTMLInputElement>) =>
              applyForm({ ...form, endTime: change.target.value })
            }
          />
        </label>
      ) : null}
      {showField(FIELD_RECURRENCE) ? (
        <label className={CAL_POPOVER_FIELD}>
          <span className={CAL_POPOVER_LABEL}>{translations.recurrenceLabel}</span>
          <select
            className={CAL_POPOVER_INPUT}
            value={form.recurrenceFreq}
            onChange={(change: ChangeEvent<HTMLSelectElement>) =>
              applyForm({ ...form, recurrenceFreq: change.target.value as CalendarRecurrenceFreq })
            }
          >
            <option value={RECURRENCE_NONE}>{translations.recurrenceNone}</option>
            <option value={RECURRENCE_DAILY}>{translations.recurrenceDaily}</option>
            <option value={RECURRENCE_WEEKLY}>{translations.recurrenceWeekly}</option>
            <option value={RECURRENCE_MONTHLY}>{translations.recurrenceMonthly}</option>
            <option value={RECURRENCE_EVERY_X_MONTHS}>{translations.recurrenceEveryXMonths}</option>
            <option value={RECURRENCE_YEARLY}>{translations.recurrenceYearly}</option>
          </select>
        </label>
      ) : null}
      {showField(FIELD_RECURRENCE) && form.recurrenceFreq === RECURRENCE_EVERY_X_MONTHS ? (
        <label className={CAL_POPOVER_FIELD}>
          <span className={CAL_POPOVER_LABEL}>{translations.recurrenceIntervalLabel}</span>
          <input
            className={CAL_POPOVER_INPUT}
            type={INPUT_NUMBER}
            min={NUMBER_ONE}
            value={form.recurrenceInterval}
            onChange={(change: ChangeEvent<HTMLInputElement>) =>
              applyForm({ ...form, recurrenceInterval: Number(change.target.value) })
            }
          />
        </label>
      ) : null}
      {showField(FIELD_PEOPLE) && people.length > NUMBER_ZERO ? (
        <div className={CAL_POPOVER_FIELD}>
          <span className={CAL_POPOVER_LABEL}>{translations.inviteLabel}</span>
          {form.peopleIds.length > NUMBER_ZERO ? (
            <div className={CAL_POPOVER_PEOPLE}>
              {peopleForEvent({ ...event, peopleIds: form.peopleIds }, people).map((person) => (
                <PersonChip
                  key={person.id}
                  person={person}
                  translations={translations}
                  icons={personIcons}
                  removeLabel={relatedRemoveLabel}
                  onRemove={() =>
                    applyForm({
                      ...form,
                      peopleIds: form.peopleIds.filter((id) => id !== person.id),
                    })
                  }
                />
              ))}
            </div>
          ) : null}
          <div className={joinClassNames(CAL_POPOVER_DROPDOWN, inviteOpen ? CAL_POPOVER_DROPDOWN_OPEN : undefined)}>
            <button
              type={BUTTON_TYPE}
              className={CAL_POPOVER_DROPDOWN_TRIGGER}
              aria-expanded={inviteOpen}
              aria-haspopup={ARIA_HASPOPUP_LISTBOX}
              onClick={toggleInviteOpen}
            >
              <span>{translations.invitePlaceholder}</span>
              <DropdownChevron />
            </button>
            {inviteOpen ? (
              <div className={CAL_POPOVER_DROPDOWN_MENU} role={ROLE_LISTBOX}>
                <input
                  className={CAL_POPOVER_INPUT}
                  type={INPUT_TEXT}
                  value={inviteQuery}
                  autoComplete={AUTOCOMPLETE_OFF}
                  placeholder={translations.invitePlaceholder}
                  onChange={(change: ChangeEvent<HTMLInputElement>) => setInviteQuery(change.target.value)}
                />
                {inviteMatches.map((person) => (
                  <button
                    key={person.id}
                    type={BUTTON_TYPE}
                    role={ROLE_OPTION}
                    className={CAL_POPOVER_SUGGEST_ITEM}
                    onClick={() => {
                      applyForm({ ...form, peopleIds: [...form.peopleIds, person.id] });
                      setInviteQuery(EMPTY_STRING);
                    }}
                  >
                    <span>{person.name}</span>
                    {person.email ? <span className={CAL_POPOVER_SUGGEST_META}>{person.email}</span> : null}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
      {showField(FIELD_RELATED_TO) ? (
        <div className={CAL_POPOVER_FIELD}>
          <span className={CAL_POPOVER_LABEL}>{translations.relatedToLabel}</span>
          {selectedRelated.length > NUMBER_ZERO ? (
            <div className={CAL_POPOVER_RELATED}>
              {selectedRelated.map((item) => (
                <span key={item.id} className={CAL_POPOVER_PERSON}>
                  {item.title}
                  <button
                    type={BUTTON_TYPE}
                    className={CAL_POPOVER_RELATED_REMOVE}
                    aria-label={translations.close}
                    onClick={() =>
                      applyForm({
                        ...form,
                        relatedTo: form.relatedTo.filter((id) => id !== item.id),
                      })
                    }
                  >
                    {relatedRemoveLabel}
                  </button>
                </span>
              ))}
            </div>
          ) : null}
          <div className={joinClassNames(CAL_POPOVER_DROPDOWN, relatedOpen ? CAL_POPOVER_DROPDOWN_OPEN : undefined)}>
            <button
              type={BUTTON_TYPE}
              className={CAL_POPOVER_DROPDOWN_TRIGGER}
              aria-expanded={relatedOpen}
              aria-haspopup={ARIA_HASPOPUP_LISTBOX}
              onClick={toggleRelatedOpen}
            >
              <span>{translations.relatedToPlaceholder}</span>
              <DropdownChevron />
            </button>
            {relatedOpen ? (
              <div className={CAL_POPOVER_DROPDOWN_MENU} role={ROLE_LISTBOX}>
                <input
                  className={CAL_POPOVER_INPUT}
                  type={INPUT_TEXT}
                  value={relatedQuery}
                  autoComplete={AUTOCOMPLETE_OFF}
                  placeholder={translations.relatedToPlaceholder}
                  onChange={(change: ChangeEvent<HTMLInputElement>) => handleRelatedInput(change.target.value)}
                  onKeyDown={handleRelatedKeyDown}
                />
                {relatedMatches.map((item) => (
                  <button
                    key={item.id}
                    type={BUTTON_TYPE}
                    role={ROLE_OPTION}
                    className={CAL_POPOVER_SUGGEST_ITEM}
                    onClick={() => addRelated(item.id)}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
      {showField(FIELD_SHOW_AS) ? (
        <label className={CAL_POPOVER_FIELD}>
          <span className={CAL_POPOVER_LABEL}>{translations.showAsLabel}</span>
          <select
            className={CAL_POPOVER_INPUT}
            value={form.showAs}
            onChange={(change: ChangeEvent<HTMLSelectElement>) =>
              applyForm({ ...form, showAs: change.target.value as EventEditFormState['showAs'] })
            }
          >
            <option value={SHOW_AS_BUSY}>{translations.showAsBusy}</option>
            <option value={SHOW_AS_FREE}>{translations.showAsFree}</option>
            <option value={SHOW_AS_TENTATIVE}>{translations.showAsTentative}</option>
            <option value={SHOW_AS_OOF}>{translations.showAsOof}</option>
          </select>
        </label>
      ) : null}
      {showField(FIELD_SEVERITY) ? (
        <label className={CAL_POPOVER_FIELD}>
          <span className={CAL_POPOVER_LABEL}>{translations.severityLabel}</span>
          <select
            className={CAL_POPOVER_INPUT}
            value={form.severity}
            onChange={(change: ChangeEvent<HTMLSelectElement>) =>
              applyForm({ ...form, severity: change.target.value as CalendarEventSeverity })
            }
          >
            <option value={SEVERITY_NONE}>{translations.severityNone}</option>
            <option value={SEVERITY_LOW}>{translations.severityLow}</option>
            <option value={SEVERITY_NORMAL}>{translations.severityNormal}</option>
            <option value={SEVERITY_HIGH}>{translations.severityHigh}</option>
            <option value={SEVERITY_URGENT}>{translations.severityUrgent}</option>
          </select>
        </label>
      ) : null}
      {showField(FIELD_NOTES) ? (
        <label className={joinClassNames(CAL_POPOVER_FIELD, CAL_POPOVER_FIELD_GROW)}>
          <span className={CAL_POPOVER_LABEL}>{translations.notesLabel}</span>
          <textarea
            className={CAL_POPOVER_TEXTAREA}
            rows={TEXTAREA_ROWS}
            value={form.description}
            onChange={(change: ChangeEvent<HTMLTextAreaElement>) =>
              applyForm({ ...form, description: change.target.value })
            }
          />
        </label>
      ) : null}
      </div>
      <div className={CAL_POPOVER_FOOTER}>
        {showCancel ? (
          <button type={BUTTON_TYPE} className={CAL_POPOVER_CANCEL} onClick={handleCancelEdit}>
            {cancelContent ?? translations.cancel}
          </button>
        ) : null}
        {showSave ? (
          <button type={SUBMIT_TYPE} className={CAL_POPOVER_SAVE}>
            {saveContent ?? translations.save}
          </button>
        ) : null}
      </div>
    </form>
  );

  const headerTitle = isCreate ? translations.create : event.title || translations.untitled;
  const severityMark = event.severity
    ? { ...DEFAULT_SEVERITY_ICONS, ...severityIcons }[event.severity]
    : null;
  const notesBody = renderEventBody?.(event);
  const descriptionText = event.description ?? EMPTY_STRING;

  return (
    <div
      className={joinClassNames(
        CAL_POPOVER,
        isCalendarContained ? CAL_POPOVER_CALENDAR : CAL_POPOVER_PAGE,
        effectClass,
      )}
    >
      <button
        type={BUTTON_TYPE}
        className={CAL_POPOVER_BACKDROP}
        aria-label={translations.close}
        onClick={requestClose}
      />
      <div
        className={joinClassNames(CAL_POPOVER_SCENE, editing ? CAL_POPOVER_SCENE_EDIT : undefined)}
        onAnimationEnd={handleSceneAnimationEnd}
      >
        <div className={joinClassNames(CAL_POPOVER_FLIP, editing ? CAL_POPOVER_FLIP_EDIT : undefined)}>
          <div
            className={joinClassNames(CAL_POPOVER_FACE, CAL_POPOVER_FACE_VIEW)}
            role="dialog"
            aria-labelledby={CAL_POPOVER_TITLE_ID}
            aria-hidden={editing}
          >
            <span
              className={CAL_POPOVER_ACCENT}
              style={event.color ? { background: event.color } : undefined}
            />
            <div className={CAL_POPOVER_HEADER}>
              <div>
                <h3 id={CAL_POPOVER_TITLE_ID} className={CAL_POPOVER_TITLE}>
                  {headerTitle}
                </h3>
                {event.subtitle ? <p className={CAL_POPOVER_SUBTITLE}>{event.subtitle}</p> : null}
              </div>
              <div className={CAL_POPOVER_ACTIONS}>
                {severityMark ? <span className={CAL_POPOVER_SEVERITY}>{severityMark}</span> : null}
                {showEdit && !isCreate ? (
                  <button
                    type={BUTTON_TYPE}
                    className={CAL_POPOVER_EDIT}
                    aria-label={translations.edit}
                    onClick={handleEdit}
                  >
                    {editIcon ?? <DefaultEditIcon />}
                  </button>
                ) : null}
                {renderCloseButton()}
              </div>
            </div>
            <div className={CAL_POPOVER_CONTENT}>
              <p className={CAL_POPOVER_META}>{formatCompactRange(event)}</p>
              <p className={CAL_POPOVER_SHOW_AS}>
                {translations.showAsLabel}: {showAsLabel(translations, event.showAs)}
              </p>
              {event.severity && event.severity !== SEVERITY_NONE ? (
                <p className={CAL_POPOVER_META}>
                  {translations.severityLabel}: {severityLabel(translations, event.severity)}
                </p>
              ) : null}
              {live ? <p className={CAL_POPOVER_LIVE}>{translations.happeningNow}</p> : null}
              {event.meetingUrl ? (
                <a
                  className={CAL_POPOVER_JOIN}
                  href={event.meetingUrl}
                  target={TARGET_BLANK}
                  rel={REL_NOOPENER}
                >
                  {translations.joinMeeting}
                </a>
              ) : null}
              {assignedPeople.length > NUMBER_ZERO ? (
                <div className={CAL_POPOVER_PEOPLE}>
                  {assignedPeople.map((person) => (
                    <PersonChip
                      key={person.id}
                      person={person}
                      translations={translations}
                      icons={personIcons}
                    />
                  ))}
                </div>
              ) : null}
              {relatedEvents.length > NUMBER_ZERO ? (
                <div className={CAL_POPOVER_RELATED}>
                  {relatedEvents.map((item) => (
                    <span key={item.id} className={CAL_POPOVER_PERSON}>
                      {item.title}
                    </span>
                  ))}
                </div>
              ) : null}
              {notesBody ? (
                <div className={CAL_POPOVER_BODY}>{notesBody}</div>
              ) : descriptionText.length > NUMBER_ZERO ? (
                <div className={CAL_POPOVER_BODY}>{descriptionText}</div>
              ) : null}
            </div>
          </div>
          <div
            className={joinClassNames(CAL_POPOVER_FACE, CAL_POPOVER_FACE_EDIT)}
            role="dialog"
            aria-hidden={!editing}
          >
            <span
              className={CAL_POPOVER_ACCENT}
              style={event.color ? { background: event.color } : undefined}
            />
            <div className={CAL_POPOVER_HEADER}>
              <h3 className={CAL_POPOVER_TITLE}>{headerTitle}</h3>
              <div className={CAL_POPOVER_ACTIONS}>{renderCloseButton()}</div>
            </div>
            <div className={CAL_POPOVER_CONTENT}>{editForm}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
