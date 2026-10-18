import { Checkbox, Typography } from '@forgedevstack/bear';
import type { ResourceFilterProps } from './ResourceFilter.types';
import {
  CAL_RESOURCE_FILTER,
  CAL_RESOURCE_FILTER_ITEM,
  CAL_RESOURCE_FILTER_LIST,
  CAL_RESOURCE_FILTER_TITLE,
} from './ResourceFilter.const';
import { DEFAULT_RESOURCES, NUMBER_ONE, NUMBER_ZERO, RESOURCES_HEADING } from '@constants';
import { joinClassNames } from '@utils';

export function ResourceFilter(props: ResourceFilterProps) {
  const {
    id,
    testId,
    className,
    title = RESOURCES_HEADING,
    resources = DEFAULT_RESOURCES,
    visibleResourceIds,
    onVisibleResourceIdsChange,
  } = props;

  const toggle = (resourceId: string, checked: boolean) => {
    const next: string[] = [];
    for (let index = NUMBER_ZERO; index < visibleResourceIds.length; index += NUMBER_ONE) {
      if (visibleResourceIds[index] !== resourceId) {
        next.push(visibleResourceIds[index]);
      }
    }
    if (checked) {
      next.push(resourceId);
    }
    onVisibleResourceIdsChange(next);
  };

  return (
    <div id={id} className={joinClassNames(CAL_RESOURCE_FILTER, className)} data-testid={testId}>
      <Typography variant="subtitle2" className={CAL_RESOURCE_FILTER_TITLE}>
        {title}
      </Typography>
      <div className={CAL_RESOURCE_FILTER_LIST}>
        {resources.map((resource) => (
          <div key={resource.id} className={CAL_RESOURCE_FILTER_ITEM}>
            <Checkbox
              label={resource.title}
              checked={visibleResourceIds.includes(resource.id)}
              color={resource.color}
              onChange={(changeEvent) => toggle(resource.id, changeEvent.target.checked)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
