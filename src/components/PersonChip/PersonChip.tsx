import { useState } from 'react';
import type { PersonChipProps } from './PersonChip.types';
import {
  BUTTON_TYPE,
  CAL_PERSON,
  CAL_PERSON_AVATAR,
  CAL_PERSON_CARD,
  CAL_PERSON_LINK,
  CAL_PERSON_NAME,
  CAL_PERSON_OPEN,
  CAL_PERSON_PEEK,
  CAL_PERSON_REMOVE,
  CAL_PERSON_ROW,
} from './PersonChip.const';
import { personDisplayName, personInitials } from './PersonChip.utils';
import { DEFAULT_PERSON_ICONS } from './PersonChip.icons';
import { joinClassNames } from '@utils';
import { NUMBER_ZERO } from '@constants';

export function PersonChip(props: PersonChipProps) {
  const { person, translations, icons, onRemove, removeLabel } = props;
  const [open, setOpen] = useState(false);
  const displayName = personDisplayName(person);
  const mergedIcons = { ...DEFAULT_PERSON_ICONS, ...icons };
  const hasPeek =
    Boolean(person.email) || Boolean(person.phone) || Boolean(person.avatar) || displayName.length > NUMBER_ZERO;
  const hasProfile =
    Boolean(person.fullName) ||
    Boolean(person.email) ||
    Boolean(person.phone) ||
    Boolean(person.linkedin) ||
    Boolean(person.facebook) ||
    Boolean(person.profileUrl) ||
    Boolean(person.title);

  return (
    <div className={joinClassNames(CAL_PERSON, open ? CAL_PERSON_OPEN : undefined)}>
      <button
        type={BUTTON_TYPE}
        className={CAL_PERSON_ROW}
        onClick={() => setOpen((current) => !current)}
      >
        {person.avatar ? (
          <img className={CAL_PERSON_AVATAR} src={person.avatar} alt={displayName} />
        ) : (
          <span className={CAL_PERSON_AVATAR}>{personInitials(person)}</span>
        )}
        <span className={CAL_PERSON_NAME}>{person.name}</span>
      </button>
      {onRemove ? (
        <button type={BUTTON_TYPE} className={CAL_PERSON_REMOVE} aria-label={removeLabel} onClick={onRemove}>
          {removeLabel}
        </button>
      ) : null}
      {hasPeek && !open ? (
        <div className={CAL_PERSON_PEEK}>
          {person.avatar ? (
            <img className={CAL_PERSON_AVATAR} src={person.avatar} alt={displayName} />
          ) : (
            <span className={CAL_PERSON_AVATAR}>{personInitials(person)}</span>
          )}
          <strong>{displayName}</strong>
          {person.email ? <span>{person.email}</span> : null}
          {person.phone ? <span>{person.phone}</span> : null}
        </div>
      ) : null}
      {open && hasProfile ? (
        <div className={CAL_PERSON_CARD}>
          {person.avatar ? (
            <img className={CAL_PERSON_AVATAR} src={person.avatar} alt={displayName} />
          ) : (
            <span className={CAL_PERSON_AVATAR}>{personInitials(person)}</span>
          )}
          <strong>{displayName}</strong>
          {person.title ? <span>{person.title}</span> : null}
          {person.email ? (
            <a className={CAL_PERSON_LINK} href={`mailto:${person.email}`}>
              {mergedIcons.email}
              <span>{person.email}</span>
            </a>
          ) : null}
          {person.phone ? (
            <a className={CAL_PERSON_LINK} href={`tel:${person.phone}`}>
              {mergedIcons.phone}
              <span>{person.phone}</span>
            </a>
          ) : null}
          {person.linkedin ? (
            <a className={CAL_PERSON_LINK} href={person.linkedin} target="_blank" rel="noreferrer">
              {mergedIcons.linkedin}
              <span>{translations.linkedinLabel}</span>
            </a>
          ) : null}
          {person.facebook ? (
            <a className={CAL_PERSON_LINK} href={person.facebook} target="_blank" rel="noreferrer">
              {mergedIcons.facebook}
              <span>{translations.facebookLabel}</span>
            </a>
          ) : null}
          {person.profileUrl ? (
            <a className={CAL_PERSON_LINK} href={person.profileUrl} target="_blank" rel="noreferrer">
              {mergedIcons.profile}
              <span>{translations.profileLabel}</span>
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
