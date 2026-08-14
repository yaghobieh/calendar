import { useState, type MouseEvent } from 'react';
import type { RelationPath, RelationRibbonsProps } from './RelationRibbons.types';
import {
  CAL_RIBBONS,
  CAL_RIBBONS_PATH,
  CAL_RIBBONS_SVG,
  CAL_RIBBONS_TIP,
  CAL_RIBBONS_TIP_TIME,
  CAL_RIBBONS_TIP_TITLE,
  PRESERVE_NONE,
  RIBBON_STROKE,
  SVG_FILL_NONE,
  SVG_VIEWBOX,
  TIP_OFFSET_PX,
} from './RelationRibbons.const';
import { relationPaths } from './RelationRibbons.utils';
import { NUMBER_ZERO } from '@constants';

interface HoverTip {
  path: RelationPath;
  x: number;
  y: number;
}

export function RelationRibbons(props: RelationRibbonsProps) {
  const { cells, events, layout, visible, activeEventId } = props;
  const paths = relationPaths(cells, events, layout, visible, activeEventId);
  const [hover, setHover] = useState<HoverTip | null>(null);

  const handleMove = (path: RelationPath, mouseEvent: MouseEvent<SVGPathElement>) => {
    setHover({
      path,
      x: mouseEvent.clientX + TIP_OFFSET_PX,
      y: mouseEvent.clientY + TIP_OFFSET_PX,
    });
  };

  if (paths.length === NUMBER_ZERO) {
    return null;
  }

  return (
    <div className={CAL_RIBBONS}>
      <svg
        className={CAL_RIBBONS_SVG}
        viewBox={SVG_VIEWBOX}
        preserveAspectRatio={PRESERVE_NONE}
      >
        {paths.map((path) => (
          <path
            key={path.id}
            className={CAL_RIBBONS_PATH}
            d={path.d}
            fill={SVG_FILL_NONE}
            stroke={path.color}
            strokeWidth={RIBBON_STROKE}
            onMouseEnter={(mouseEvent) => handleMove(path, mouseEvent)}
            onMouseMove={(mouseEvent) => handleMove(path, mouseEvent)}
            onMouseLeave={() => setHover(null)}
          />
        ))}
      </svg>
      {hover ? (
        <div className={CAL_RIBBONS_TIP} style={{ top: hover.y, left: hover.x }}>
          <span className={CAL_RIBBONS_TIP_TITLE}>{hover.path.fromTitle}</span>
          <span className={CAL_RIBBONS_TIP_TIME}>{hover.path.fromTime}</span>
          <span className={CAL_RIBBONS_TIP_TITLE}>{hover.path.toTitle}</span>
          <span className={CAL_RIBBONS_TIP_TIME}>{hover.path.toTime}</span>
        </div>
      ) : null}
    </div>
  );
}
