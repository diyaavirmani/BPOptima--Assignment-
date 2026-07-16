import { forwardRef, type CSSProperties } from 'react';
import type { TourScene } from '../data/tourData';

type TourTooltipProps = {
  scene: TourScene;
  sceneIndex: number;
  totalScenes: number;
  descriptionVisible: boolean;
  style: CSSProperties;
  canGoBack: boolean;
  onBack: () => void;
  onFocusTarget: () => void;
};

const actionLabels = {
  click: 'Click the highlighted product control',
  select: 'Select the highlighted product item',
  run: 'Run the highlighted product action',
  inspect: 'Inspect the highlighted product item',
  continue: 'Use the highlighted product control',
};

const TourTooltip = forwardRef<HTMLDivElement, TourTooltipProps>(
  (
    {
      scene,
      sceneIndex,
      totalScenes,
      descriptionVisible,
      style,
      canGoBack,
      onBack,
      onFocusTarget,
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
      <span className="tour-tooltip-kicker">
        Step {sceneIndex + 1} of {totalScenes}
      </span>
      <h2 id="tour-tooltip-title">{scene.tooltipTitle}</h2>
      <p id="tour-tooltip-body">{scene.tooltipBody}</p>
      <p className="tour-tooltip-action">{actionLabels[scene.expectedAction]}</p>
      <div className="tour-tooltip-controls">
        <button type="button" className="tour-ghost-button" onClick={onBack} disabled={!canGoBack}>
          Back
        </button>
        <button type="button" className="tour-ghost-button" onClick={onFocusTarget}>
          Focus target
        </button>
      </div>
    </aside>
  ),
);

TourTooltip.displayName = 'TourTooltip';

export default TourTooltip;
