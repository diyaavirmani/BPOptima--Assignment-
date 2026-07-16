import { forwardRef, type CSSProperties } from 'react';
import type { TourScene } from '../data/tourData';

type TourTooltipProps = {
  scene: TourScene;
  descriptionVisible: boolean;
  style: CSSProperties;
};

const TourTooltip = forwardRef<HTMLDivElement, TourTooltipProps>(
  (
    {
      scene,
      descriptionVisible,
      style,
    },
    ref,
  ) => (
    <aside
      className={`tour-tooltip ${descriptionVisible ? 'is-ready' : ''}`}
      ref={ref}
      style={style}
      tabIndex={-1}
      aria-labelledby="tour-tooltip-title"
      aria-describedby="tour-tooltip-body"
    >
      <h2 id="tour-tooltip-title">{scene.tooltipTitle}</h2>
      <p id="tour-tooltip-body">{scene.tooltipBody}</p>
    </aside>
  ),
);

TourTooltip.displayName = 'TourTooltip';

export default TourTooltip;
