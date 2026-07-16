import {
  CheckCircle2,
  FileText,
  Play,
  RotateCcw,
  ShieldCheck,
  X,
} from 'lucide-react';
import {
  type CSSProperties,
  type MouseEventHandler,
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { caseData } from '../data/caseData';
import {
  getSubstepCount,
  mainTourSteps,
  type MainTourStep,
  type TourScene,
  type TourScreen,
  tourScenes,
} from '../data/tourData';
import LogoMark from './LogoMark';
import TourTooltip from './TourTooltip';

type TourDirection = 'forward' | 'backward';

type TourState = {
  started: boolean;
  mainStep: MainTourStep;
  subStep: number;
  direction: TourDirection;
  completedActions: string[];
};

type ProductTourProps = {
  onExit: () => void;
  onOpenDashboard: () => void;
};

type TourAction =
  | { type: 'start' }
  | { type: 'next' }
  | { type: 'back' }
  | { type: 'restart' }
  | { type: 'reset-policy-run' }
  | { type: 'complete-action'; actionId: string };

type TargetPosition = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type TourTargetProps = {
  'data-tour-id': string;
  'data-tour-active'?: 'true';
  onClick: MouseEventHandler<HTMLElement>;
};

const initialTourState: TourState = {
  started: false,
  mainStep: 'evidence',
  subStep: 0,
  direction: 'forward',
  completedActions: [],
};

const tooltipFallback = {
  width: 280,
  height: 156,
};

const viewportPadding = 16;

function findSceneIndex(state: TourState) {
  return Math.max(
    0,
    tourScenes.findIndex(
      (scene) => scene.mainStep === state.mainStep && scene.subStep === state.subStep,
    ),
  );
}

function getStateForScene(scene: TourScene, direction: TourDirection, completedActions: string[]): TourState {
  return {
    started: true,
    mainStep: scene.mainStep,
    subStep: scene.subStep,
    direction,
    completedActions,
  };
}

function tourReducer(state: TourState, action: TourAction): TourState {
  const currentIndex = findSceneIndex(state);

  switch (action.type) {
    case 'start':
      return getStateForScene(tourScenes[0], 'forward', []);
    case 'next': {
      const nextScene = tourScenes[Math.min(currentIndex + 1, tourScenes.length - 1)];
      return getStateForScene(nextScene, 'forward', state.completedActions);
    }
    case 'back': {
      const previousScene = tourScenes[Math.max(currentIndex - 1, 0)];
      return getStateForScene(previousScene, 'backward', state.completedActions);
    }
    case 'restart':
      return getStateForScene(tourScenes[0], 'forward', []);
    case 'reset-policy-run': {
      const policyScene = tourScenes.find((scene) => scene.id === 'run-policy') ?? tourScenes[0];
      return getStateForScene(
        policyScene,
        'backward',
        state.completedActions.filter(
          (actionId) =>
            ![
              'run-policy',
              'inspect-failed-rule',
            ].includes(actionId),
        ),
      );
    }
    case 'complete-action':
      return state.completedActions.includes(action.actionId)
        ? state
        : {
            ...state,
            completedActions: [...state.completedActions, action.actionId],
          };
    default:
      return state;
  }
}

function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPrefersReducedMotion(query.matches);

    query.addEventListener('change', updatePreference);
    return () => query.removeEventListener('change', updatePreference);
  }, []);

  return prefersReducedMotion;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    window.matchMedia('(max-width: 720px)').matches,
  );

  useEffect(() => {
    const query = window.matchMedia('(max-width: 720px)');
    const updateViewport = () => setIsMobile(query.matches);

    query.addEventListener('change', updateViewport);
    return () => query.removeEventListener('change', updateViewport);
  }, []);

  return isMobile;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

function getTooltipStyle(
  position: TargetPosition | null,
  placement: TourScene['placement'],
  isMobile: boolean,
  sceneId: string,
  tooltipRect?: DOMRect,
): CSSProperties {
  if (isMobile) {
    return {
      right: 16,
      bottom: 16,
      left: 16,
      top: 'auto',
      width: 'auto',
    };
  }

  if (!position) {
    return {
      top: viewportPadding,
      left: viewportPadding,
      width: tooltipFallback.width,
    };
  }

  const tooltipWidth = tooltipRect?.width ?? tooltipFallback.width;
  const tooltipHeight = tooltipRect?.height ?? tooltipFallback.height;
  const gap = 18;

  if (sceneId === 'select-revenue-fact') {
    return {
      top: 'auto',
      left: viewportPadding + 12,
      bottom: viewportPadding + 12,
      width: tooltipFallback.width,
    };
  }

  let top = position.top + position.height / 2 - tooltipHeight / 2;
  let left = position.left + position.width + gap;

  if (placement === 'left') {
    left = position.left - tooltipWidth - gap;
  }

  if (placement === 'top') {
    top = position.top - tooltipHeight - gap;
    left = position.left + position.width / 2 - tooltipWidth / 2;
  }

  if (placement === 'bottom') {
    top = position.top + position.height + gap;
    left = position.left + position.width / 2 - tooltipWidth / 2;
  }

  return {
    top: clamp(top, viewportPadding, window.innerHeight - tooltipHeight - viewportPadding),
    left: clamp(left, viewportPadding, window.innerWidth - tooltipWidth - viewportPadding),
    width: tooltipFallback.width,
  };
}

function StatusPill({ tone, children }: { tone: 'pass' | 'fail' | 'warn' | 'neutral'; children: ReactNode }) {
  return <span className={`tour-status tour-status-${tone}`}>{children}</span>;
}

const documentRegions = [
  {
    id: 'business-information',
    label: 'Business information',
    value: `${caseData.applicant} · Retail — General Stores`,
    reference: 'CH-02',
    className: 'region-business-info',
  },
  {
    id: 'financial-information',
    label: 'Financial information',
    value: `${caseData.facts[0].value} revenue · ${caseData.facts[1].value} obligations`,
    reference: 'CH-04',
    className: 'region-financial-info',
  },
  {
    id: 'requested-loan-amount',
    label: 'Requested loan amount',
    value: caseData.requestedAmount,
    reference: 'CH-03',
    className: 'region-loan-amount',
  },
  {
    id: 'bank-statement-completeness',
    label: 'Bank-statement completeness',
    value: '4 months included',
    reference: 'CH-05',
    className: 'region-bank-completeness',
  },
] as const;

const parsedChunks = [
  {
    id: 'CH-01',
    type: 'Heading',
    label: 'Loan Application Form',
    value: 'Document heading detected',
  },
  {
    id: 'CH-02',
    type: 'Text',
    label: 'Business profile',
    value: 'Asha Stores · Retail — General Stores',
  },
  {
    id: 'CH-03',
    type: 'Field group',
    label: 'Loan request',
    value: `${caseData.requestedAmount} requested`,
  },
  {
    id: 'CH-04',
    type: 'Financial table',
    label: 'Revenue and obligations',
    value: `${caseData.facts[0].value} revenue · ${caseData.facts[1].value} obligations`,
  },
  {
    id: 'CH-05',
    type: 'Evidence-completeness field',
    label: 'Bank statement package',
    value: '4 of 6 required months supplied',
  },
] as const;

const policyInputFacts = [
  ['Revenue', '₹82,000'],
  ['Obligations', '₹24,000'],
  ['Debt-service ratio', '29.3%'],
  ['Statements supplied', '4 of 6'],
  ['Requested amount', '₹5,00,000'],
] as const;

const policyGraphNodes = [
  {
    id: 'input',
    code: 'INPUT',
    title: 'Structured Facts',
    subtitle: '5 facts available',
    result: 'READY',
    tone: 'neutral',
    delay: 0,
    targetId: undefined,
  },
  {
    id: 'cr-001',
    code: 'CR-001',
    title: 'Revenue ≥ ₹60,000',
    subtitle: 'Observed: ₹82,000 · Threshold: ₹60,000',
    result: 'PASS',
    tone: 'pass',
    delay: 400,
    targetId: undefined,
  },
  {
    id: 'cr-008',
    code: 'CR-008',
    title: 'Debt-service ratio ≤ 40%',
    subtitle: 'Observed: 29.3% · Threshold: 40%',
    result: 'PASS',
    tone: 'pass',
    delay: 950,
    targetId: undefined,
  },
  {
    id: 'doc-006',
    code: 'DOC-006',
    title: 'Six consecutive bank statements required',
    subtitle: 'Observed: 4 of 6 statements · Required: 6',
    result: 'FAIL',
    tone: 'fail',
    delay: 1500,
    targetId: 'failed-rule',
  },
  {
    id: 'esc-002',
    code: 'ESC-002',
    title: 'Missing mandatory evidence → Human review',
    subtitle: 'Condition: Missing mandatory evidence',
    result: 'TRIGGERED',
    tone: 'warn',
    delay: 2150,
    targetId: undefined,
  },
  {
    id: 'output',
    code: 'OUTPUT',
    title: 'Route decision',
    subtitle: 'Route: HUMAN REVIEW',
    result: 'HUMAN REVIEW',
    tone: 'warn',
    delay: 2750,
    targetId: undefined,
  },
] as const;

function hasReachedScene(activeScene: TourScene, sceneId: string) {
  const activeIndex = tourScenes.findIndex((scene) => scene.id === activeScene.id);
  const targetIndex = tourScenes.findIndex((scene) => scene.id === sceneId);

  if (activeIndex === -1 || targetIndex === -1) {
    return false;
  }

  return (
    activeIndex >= targetIndex
  );
}

function ProductTour({ onExit, onOpenDashboard }: ProductTourProps) {
  const [state, dispatch] = useReducer(tourReducer, initialTourState);
  const activeSceneIndex = findSceneIndex(state);
  const activeScene = tourScenes[activeSceneIndex];
  const [displayedScreen, setDisplayedScreen] = useState<TourScreen>(activeScene.screen);
  const [screenPhase, setScreenPhase] = useState<'entered' | 'exit' | 'enter'>('entered');
  const [targetPosition, setTargetPosition] = useState<TargetPosition | null>(null);
  const [descriptionVisible, setDescriptionVisible] = useState(false);
  const [liveMessage, setLiveMessage] = useState('Product tour ready.');
  const [spotlightNudge, setSpotlightNudge] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const stageRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const hasPositionedRef = useRef(false);
  const expectedSceneIdRef = useRef(activeScene.id);
  const screenTimerRef = useRef<number | null>(null);
  const policyRunTimerRef = useRef<number | null>(null);
  const routeTimerRef = useRef<number | null>(null);
  const nudgeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, []);

  const activeMainStepIndex = mainTourSteps.findIndex((step) => step.id === activeScene.mainStep);
  const completedMainSteps = new Set(
    mainTourSteps
      .slice(0, activeMainStepIndex)
      .map((step) => step.id),
  );

  const substepCount = getSubstepCount(activeScene.mainStep);
  const progressPercent = Math.round(((activeSceneIndex + 1) / tourScenes.length) * 100);

  const clearNudgeTimer = useCallback(() => {
    if (nudgeTimerRef.current) {
      window.clearTimeout(nudgeTimerRef.current);
      nudgeTimerRef.current = null;
    }
  }, []);

  const startSpotlightNudge = useCallback(() => {
    clearNudgeTimer();
    setSpotlightNudge(true);
    nudgeTimerRef.current = window.setTimeout(() => {
      nudgeTimerRef.current = null;
      setSpotlightNudge(false);
    }, 360);
  }, [clearNudgeTimer]);

  const updatePosition = useCallback(() => {
    if (!state.started) {
      return;
    }

    const target = document.querySelector<HTMLElement>(
      `[data-tour-id="${activeScene.targetId}"]`,
    );

    if (!target) {
      return;
    }

    const rect = target.getBoundingClientRect();
    setTargetPosition({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    });
  }, [activeScene.targetId, state.started]);

  const goNext = useCallback(() => {
    clearNudgeTimer();

    if (policyRunTimerRef.current) {
      window.clearTimeout(policyRunTimerRef.current);
      policyRunTimerRef.current = null;
    }

    if (routeTimerRef.current) {
      window.clearTimeout(routeTimerRef.current);
      routeTimerRef.current = null;
    }

    dispatch({ type: 'complete-action', actionId: activeScene.id });

    if (
      activeScene.id === 'run-policy' &&
      !state.completedActions.includes('run-policy')
    ) {
      policyRunTimerRef.current = window.setTimeout(() => {
        policyRunTimerRef.current = null;
        dispatch({ type: 'next' });
      }, 3300);
      return;
    }

    if (
      activeScene.id === 'route-human-review' &&
      !state.completedActions.includes('route-human-review')
    ) {
      routeTimerRef.current = window.setTimeout(() => {
        routeTimerRef.current = null;
        dispatch({ type: 'next' });
      }, 900);
      return;
    }

    const delayedTransition =
      activeScene.id === 'select-revenue-fact' ||
      activeScene.id === 'inspect-failed-rule' ||
      activeScene.id === 'open-failed-rule-detail';

    if (delayedTransition && !state.completedActions.includes(activeScene.id)) {
      routeTimerRef.current = window.setTimeout(() => {
        routeTimerRef.current = null;
        dispatch({ type: 'next' });
      }, 900);
      return;
    }

    if (activeSceneIndex === tourScenes.length - 1) {
      dispatch({ type: 'restart' });
      return;
    }

    dispatch({ type: 'next' });
  }, [activeScene.id, activeSceneIndex, clearNudgeTimer, state.completedActions]);

  const goBack = useCallback(() => {
    clearNudgeTimer();

    if (policyRunTimerRef.current) {
      window.clearTimeout(policyRunTimerRef.current);
      policyRunTimerRef.current = null;
    }

    if (routeTimerRef.current) {
      window.clearTimeout(routeTimerRef.current);
      routeTimerRef.current = null;
    }

    dispatch({ type: 'back' });
  }, [clearNudgeTimer]);

  const restartTour = useCallback(() => {
    clearNudgeTimer();

    if (policyRunTimerRef.current) {
      window.clearTimeout(policyRunTimerRef.current);
      policyRunTimerRef.current = null;
    }

    if (routeTimerRef.current) {
      window.clearTimeout(routeTimerRef.current);
      routeTimerRef.current = null;
    }

    dispatch({ type: 'restart' });
  }, [clearNudgeTimer]);

  const resetPolicyRun = useCallback(() => {
    clearNudgeTimer();

    if (policyRunTimerRef.current) {
      window.clearTimeout(policyRunTimerRef.current);
      policyRunTimerRef.current = null;
    }

    if (routeTimerRef.current) {
      window.clearTimeout(routeTimerRef.current);
      routeTimerRef.current = null;
    }

    dispatch({ type: 'reset-policy-run' });
  }, [clearNudgeTimer]);

  const startTour = () => {
    dispatch({ type: 'start' });
  };

  const handleTargetAction = (targetId: string) => {
    if (targetId === activeScene.targetId) {
      goNext();
      return;
    }

    startSpotlightNudge();
  };

  const targetProps = (targetId: string): TourTargetProps => ({
    'data-tour-id': targetId,
    'data-tour-active': activeScene.targetId === targetId ? 'true' : undefined,
    onClick: () => handleTargetAction(targetId),
  });

  const focusActiveTarget = useCallback(() => {
    const target = document.querySelector<HTMLElement>(
      `[data-tour-id="${activeScene.targetId}"]`,
    );

    if (target) {
      target.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      target.focus({ preventScroll: true });
      window.requestAnimationFrame(updatePosition);
    }

    startSpotlightNudge();
  }, [activeScene.targetId, startSpotlightNudge, updatePosition]);

  useEffect(() => {
    if (!state.started) {
      return undefined;
    }

    const onKeyDown = (event: KeyboardEvent | globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        onExit();
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goBack();
        return;
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        focusActiveTarget();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [focusActiveTarget, goBack, onExit, state.started]);

  useEffect(() => {
    if (screenTimerRef.current) {
      window.clearTimeout(screenTimerRef.current);
    }

    if (!state.started || activeScene.screen === displayedScreen || prefersReducedMotion) {
      setDisplayedScreen(activeScene.screen);
      setScreenPhase('entered');
      return undefined;
    }

    setScreenPhase('exit');
    screenTimerRef.current = window.setTimeout(() => {
      setDisplayedScreen(activeScene.screen);
      setScreenPhase('enter');
      window.requestAnimationFrame(() => setScreenPhase('entered'));
    }, 180);

    return () => {
      if (screenTimerRef.current) {
        window.clearTimeout(screenTimerRef.current);
      }
    };
  }, [activeScene.screen, displayedScreen, prefersReducedMotion, state.started]);

  useEffect(
    () => () => {
      if (policyRunTimerRef.current) {
        window.clearTimeout(policyRunTimerRef.current);
      }
      if (routeTimerRef.current) {
        window.clearTimeout(routeTimerRef.current);
      }
      clearNudgeTimer();
    },
    [clearNudgeTimer],
  );

  useEffect(() => {
    if (!state.started) {
      return;
    }

    expectedSceneIdRef.current = activeScene.id;
    setDescriptionVisible(false);
    setLiveMessage(
      `${mainTourSteps[activeMainStepIndex].label}, substep ${activeScene.subStep + 1} of ${substepCount}: ${activeScene.tooltipTitle}`,
    );

    window.requestAnimationFrame(updatePosition);

    if (prefersReducedMotion || !hasPositionedRef.current) {
      hasPositionedRef.current = true;
      setDescriptionVisible(true);
    }
  }, [
    activeMainStepIndex,
    activeScene.id,
    activeScene.subStep,
    activeScene.tooltipTitle,
    displayedScreen,
    prefersReducedMotion,
    state.started,
    substepCount,
    updatePosition,
  ]);

  useEffect(() => {
    if (!state.started) {
      return undefined;
    }

    const target = document.querySelector<HTMLElement>(
      `[data-tour-id="${activeScene.targetId}"]`,
    );
    const observer = new ResizeObserver(() => updatePosition());

    if (stageRef.current) {
      observer.observe(stageRef.current);
    }

    if (target) {
      observer.observe(target);
    }

    window.addEventListener('resize', updatePosition);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updatePosition);
    };
  }, [activeScene.targetId, state.started, updatePosition]);

  useEffect(() => {
    if (!descriptionVisible) {
      return;
    }

    const target = document.querySelector<HTMLElement>(
      `[data-tour-id="${activeScene.targetId}"]`,
    );

    target?.focus({ preventScroll: true });
  }, [activeScene.targetId, descriptionVisible]);

  const hotspotStyle = useMemo<CSSProperties>(() => {
    if (!targetPosition) {
      return { opacity: 0 };
    }

    return {
      top: targetPosition.top + Math.min(18, Math.max(10, targetPosition.height * 0.34)),
      left: targetPosition.left + Math.min(targetPosition.width - 8, Math.max(8, targetPosition.width - 12)),
    };
  }, [targetPosition]);

  const tooltipStyle = useMemo(
    () =>
      getTooltipStyle(
        targetPosition,
        activeScene.placement,
        isMobile,
        activeScene.id,
        tooltipRef.current?.getBoundingClientRect(),
      ),
    [activeScene.id, activeScene.placement, isMobile, targetPosition],
  );

  const screenStyle = {
    '--screen-shift':
      state.direction === 'forward' ? '14px' : '-14px',
    '--screen-exit-shift':
      state.direction === 'forward' ? '-14px' : '14px',
  } as CSSProperties;

  if (!state.started) {
    return (
      <main className="tour-gate" aria-labelledby="tour-gate-title">
        <div className="tour-gate-card">
          <div className="tour-gate-brand">
            <LogoMark />
            <span>BPOptima</span>
          </div>
          <h1 id="tour-gate-title">Decision Replay</h1>
          <p>Replay one synthetic MSME decision from evidence to audit.</p>
          <ul className="tour-gate-labels" aria-label="Tour labels">
            <li>Synthetic demo</li>
            <li>No real customer data</li>
            <li>Illustrative client policy</li>
            <li>Approximately 2 minutes</li>
          </ul>
          <div className="tour-gate-actions">
            <button className="primary-button" type="button" onClick={startTour}>
              <Play size={17} aria-hidden="true" />
              Start Product Demo
            </button>
            <button className="secondary-button" type="button" onClick={onExit}>
              Exit Tour
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="product-tour" aria-labelledby="tour-title">
      <p className="sr-only" role="status" aria-live="polite">
        {liveMessage}
      </p>

      <header className="tour-shell-header">
        <div className="tour-title-block">
          <span className="tour-brand">
            <LogoMark />
            BPOptima
          </span>
          <div>
            <h1 id="tour-title">Decision Replay</h1>
            <span>Synthetic Demo</span>
            <p className="tour-honesty-note">
              No real customer data · Illustrative client policy
            </p>
          </div>
        </div>

        <div className="tour-progress-summary" aria-label="Tour progress">
          <strong>{progressPercent}%</strong>
          <span>
            {mainTourSteps[activeMainStepIndex].label} · Substep{' '}
            {activeScene.subStep + 1} of {substepCount}
          </span>
        </div>

        <div className="tour-header-actions">
          <button
            type="button"
            className="tour-icon-button"
            onClick={goBack}
            disabled={activeSceneIndex === 0}
          >
            Back
          </button>
          <button type="button" className="tour-icon-button" onClick={restartTour}>
            <RotateCcw size={16} aria-hidden="true" />
            Restart
          </button>
          <button type="button" className="tour-icon-button" onClick={onExit}>
            <X size={16} aria-hidden="true" />
            Exit Tour
          </button>
        </div>
      </header>

      <nav className="tour-main-progress" aria-label="Main tour steps">
        {mainTourSteps.map((step) => {
          const isCurrent = step.id === activeScene.mainStep;
          const isComplete = completedMainSteps.has(step.id);

          return (
            <span
              key={step.id}
              aria-current={isCurrent ? 'step' : undefined}
              data-complete={isComplete ? 'true' : undefined}
            >
              {isComplete && <CheckCircle2 size={14} aria-hidden="true" />}
              {step.label}
            </span>
          );
        })}
      </nav>

      <section className="tour-workspace" aria-label="BPOptima product interface">
        <div className="tour-stage" ref={stageRef}>
          <div
            className="tour-product-screen"
            data-phase={screenPhase}
            data-direction={state.direction}
            style={screenStyle}
          >
            {renderProductScreen(
              displayedScreen,
              activeScene,
              targetProps,
              state.completedActions,
              resetPolicyRun,
              onExit,
              onOpenDashboard,
            )}
          </div>
        </div>

        <span
          className={`tour-hotspot ${spotlightNudge ? 'is-nudging' : ''}`}
          style={hotspotStyle}
          onTransitionEnd={(event) => {
            if (
              event.currentTarget === event.target &&
              (event.propertyName === 'top' || event.propertyName === 'left') &&
              expectedSceneIdRef.current === activeScene.id
            ) {
              setDescriptionVisible(true);
            }
          }}
          aria-hidden="true"
        />

        <TourTooltip
          ref={tooltipRef}
          scene={activeScene}
          descriptionVisible={descriptionVisible}
          style={tooltipStyle}
        />
      </section>
    </main>
  );
}

function renderProductScreen(
  screen: TourScreen,
  activeScene: TourScene,
  targetProps: (targetId: string) => TourTargetProps,
  completedActions: string[],
  onPolicyReset: () => void,
  onTourExit: () => void,
  onOpenDashboard: () => void,
) {
  if (screen === 'evidence') {
    const caseSelected = hasReachedScene(activeScene, 'load-evidence');
    const evidenceLoaded =
      completedActions.includes('load-evidence') ||
      hasReachedScene(activeScene, 'parse-document');

    return (
      <div className="tour-screen-grid tour-evidence-grid">
        <section className="tour-product-panel tour-case-panel">
          <span className="tour-panel-label">Case library</span>
          <h2>Choose a sample decision</h2>
          <p>
            One fixed MSME application is available for this replay. No real
            customer data is uploaded or processed.
          </p>

          <article
            className="tour-case-card"
            data-selected={caseSelected ? 'true' : undefined}
          >
            <span className="tour-case-card-header">
              <span>{caseData.caseId}</span>
              <StatusPill tone="warn">Synthetic data</StatusPill>
            </span>
            <strong>{caseData.applicant}</strong>
            <span>{caseData.workflow}</span>
            <dl>
              <div>
                <dt>Requested</dt>
                <dd>{caseData.requestedAmount}</dd>
              </div>
              <div>
                <dt>Evidence items</dt>
                <dd>3</dd>
              </div>
            </dl>
            <button
              type="button"
              className="tour-action-button"
              disabled={caseSelected}
              {...targetProps('case-select')}
            >
              Use synthetic case
            </button>
          </article>
        </section>

        <section className="tour-product-panel">
          <span className="tour-panel-label">Evidence intake</span>
          <h2>Load synthetic evidence package</h2>
          <p>
            The package contains a loan application, sales ledger, and an
            incomplete bank-statement set. This is a simulated package, not a
            real file input.
          </p>

          <div
            className="tour-evidence-dropzone"
            data-ready={caseSelected ? 'true' : undefined}
          >
            <FileText size={20} aria-hidden="true" />
            <strong>Load synthetic evidence package</strong>
            <span>3 fixed files · No real customer data</span>
            <button
              type="button"
              className="tour-action-button tour-load-button"
              disabled={!caseSelected || evidenceLoaded}
              {...targetProps('evidence-load')}
            >
              Load evidence
            </button>
          </div>

          <span className="tour-evidence-queue-label">Evidence queue</span>
          <div className="tour-evidence-list" data-loaded={evidenceLoaded ? 'true' : undefined}>
            {caseData.evidence.map((item) => (
              <article key={item.id}>
                <FileText size={18} aria-hidden="true" />
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.detail}</span>
                </div>
                <StatusPill tone={item.status === 'Complete' ? 'neutral' : 'warn'}>
                  {item.status}
                </StatusPill>
              </article>
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (screen === 'document-workbench') {
    const parsed = hasReachedScene(activeScene, 'extract-structured-facts');
    const factsExtracted = hasReachedScene(activeScene, 'select-revenue-fact');
    const revenueSelected = completedActions.includes('select-revenue-fact');
    const sourceHighlighted = completedActions.includes('select-revenue-fact');

    return (
      <div className="tour-workbench-shell">
        <div className="tour-workbench-toolbar" aria-label="Document workbench toolbar">
          <div className="tour-toolbar-primary">
            <button
              type="button"
              className="tour-tool-button"
              disabled={parsed}
              {...targetProps('document-parse')}
            >
              {parsed ? 'Parsed ✓' : 'Parse'}
            </button>
            <button
              type="button"
              className="tour-tool-button"
              disabled={!parsed || factsExtracted}
              {...targetProps('facts-extract')}
            >
              {factsExtracted ? 'Extracted ✓' : 'Extract'}
            </button>
          </div>
          <div className="tour-toolbar-secondary">
            <span className="tour-tool-chip">Synthetic demo</span>
            <span className="tour-toolbar-note">Page 1 of 2</span>
          </div>
        </div>

        <div className="tour-workbench-grid">
          <section className="tour-product-panel tour-document-viewer">
            <div className="tour-workbench-pane-header">
              <div>
                <span className="tour-panel-label">Document viewer</span>
                <h2>Loan Application.pdf</h2>
              </div>
              <span>Synthetic document</span>
            </div>

            <div className="tour-document-shell">
              <div className="tour-document-canvas">
                <div
                  className="tour-document-preview"
                  data-parsed={parsed ? 'true' : undefined}
                  data-source-highlighted={sourceHighlighted ? 'true' : undefined}
                >
                  <span className="tour-document-watermark">
                    Synthetic demonstration document
                  </span>
                  <span className="tour-document-page-label">
                    Page 1 · Synthetic loan application
                  </span>
                  <div className="tour-loan-document">
                    <h3>LOAN APPLICATION FORM</h3>
                    <dl>
                      <div>
                        <dt>Business name</dt>
                        <dd>Asha Stores</dd>
                      </div>
                      <div>
                        <dt>Business type</dt>
                        <dd>Retail — General Stores</dd>
                      </div>
                      <div>
                        <dt>Requested loan amount</dt>
                        <dd>{caseData.requestedAmount}</dd>
                      </div>
                      <div>
                        <dt>Average monthly revenue</dt>
                        <dd>{caseData.facts[0].value}</dd>
                      </div>
                      <div>
                        <dt>Existing monthly obligations</dt>
                        <dd>{caseData.facts[1].value}</dd>
                      </div>
                      <div>
                        <dt>Bank statements included</dt>
                        <dd>4 months</dd>
                      </div>
                    </dl>
                  </div>

                  {documentRegions.map((region, index) => (
                    <span
                      className={`tour-document-region ${region.className}`}
                      aria-label={`${region.reference} ${region.label}`}
                      style={{ '--region-delay': `${index * 120 + 250}ms` } as CSSProperties}
                      key={region.id}
                    >
                      <span>{index + 1}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div
              className="tour-sales-ledger-preview"
              data-source-highlighted={sourceHighlighted ? 'true' : undefined}
            >
              <span className="tour-document-page-label">Sales Ledger.jpg · Page 1</span>
              <span className="tour-source-region" data-selected={sourceHighlighted ? 'true' : undefined}>
                <span>R-03</span>
                <strong>Average monthly revenue</strong>
                <small>{caseData.facts[0].value}</small>
              </span>
            </div>
          </section>

          <section className="tour-product-panel tour-output-panel">
            <div className="tour-workbench-pane-header">
              <div>
                <span className="tour-panel-label">
                  {factsExtracted ? 'Extracted facts' : 'Parse output'}
                </span>
                <h2>{factsExtracted ? 'Structured facts' : 'Document structure'}</h2>
              </div>
              <span>Synthetic data</span>
            </div>

            {!parsed && (
              <div className="tour-output-empty">
                <strong>Awaiting parse</strong>
                <span>Run Parse to identify document sections, fields, and tables.</span>
              </div>
            )}

            {parsed && !factsExtracted && (
              <>
                <div className="tour-parse-status" data-complete="true">
                  <strong>Simulated parse complete</strong>
                  <span>
                    Document regions and parsed chunks are ready for extraction.
                  </span>
                </div>

                <div className="tour-parsed-chunks" data-visible="true">
                  {parsedChunks.map((chunk, index) => (
                    <article
                      key={chunk.id}
                      style={{ '--chunk-delay': `${index * 100 + 900}ms` } as CSSProperties}
                    >
                      <span>{chunk.id}</span>
                      <strong>{chunk.label}</strong>
                    </article>
                  ))}
                </div>
              </>
            )}

            {factsExtracted && (
              <>
                <div className="tour-facts-header">
                  <strong>5 structured facts extracted</strong>
                  <StatusPill tone="neutral">Illustrative evidence references</StatusPill>
                </div>
                <div className="tour-fact-list" data-extracted="true">
                  {caseData.facts.map((fact, index) => {
                    const reference = fact.reference ?? fact.id;
                    const source = fact.id === 'F-05'
                      ? `${fact.source} · ${reference}`
                      : `${fact.source.replace(', Page 1', '')} · ${reference}`;

                    return (
                      <button
                        type="button"
                        key={fact.id}
                        className={`tour-fact-button ${revenueSelected && index === 0 ? 'is-selected' : ''}`}
                        style={{ '--fact-delay': `${index * 100}ms` } as CSSProperties}
                        {...(index === 0 ? targetProps('fact-revenue') : {})}
                      >
                        <span>
                          {fact.id} · {fact.label}
                        </span>
                        <strong>{fact.value}</strong>
                        <small>Source: {source}</small>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            <div className="tour-source-explanation" data-visible={sourceHighlighted ? 'true' : undefined}>
              <strong>Illustrative evidence reference</strong>
              <span className="tour-source-link">
                R-03 connects the selected fact to the highlighted source region.
              </span>
              <span>Sales Ledger.jpg · Page 1</span>
            </div>

          </section>
        </div>
      </div>
    );
  }

  if (screen === 'policy') {
    const inputFactsVisible = true;
    const policyRunStarted = completedActions.includes('run-policy');
    const policyRunComplete = hasReachedScene(activeScene, 'inspect-failed-rule');
    const showRunState = policyRunStarted || policyRunComplete;
    const docRuleSelected = completedActions.includes('inspect-failed-rule');
    const escalationRuleSelected = false;

    return (
      <div className="tour-policy-shell">
        <header className="tour-policy-topbar">
          <div>
            <span className="tour-panel-label">Read-only simulation</span>
            <h2>{caseData.policyName}</h2>
          </div>
          <div className="tour-policy-controls">
            <span className="tour-tool-chip">Input facts visible</span>
            <button
              type="button"
              className="tour-tool-button"
              disabled={!inputFactsVisible || policyRunStarted || policyRunComplete}
              {...targetProps('policy-run')}
            >
              Run policy
            </button>
            <button
              type="button"
              className="tour-tool-button"
              disabled={!policyRunStarted && !policyRunComplete}
              onClick={onPolicyReset}
            >
              Reset run
            </button>
          </div>
        </header>

        <div className="tour-policy-layout">
          <section className="tour-policy-canvas" aria-label="Illustrative policy graph">
            {inputFactsVisible && (
              <aside className="tour-policy-facts-panel">
                <strong>Input facts</strong>
                <dl>
                  {policyInputFacts.map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              </aside>
            )}

            <div
              className="tour-policy-graph"
              data-run={showRunState ? 'true' : undefined}
              aria-label="Policy nodes"
            >
              {policyGraphNodes.map((node, index) => {
                const isDocRule = node.id === 'doc-006';
                const isSelected = isDocRule && docRuleSelected;
                const isDisabled = isDocRule && !policyRunComplete;
                const nodeProps = node.targetId ? targetProps(node.targetId) : {};
                const nodeContent = (
                  <>
                    <span className="tour-policy-node-code">{node.code}</span>
                    <strong>{node.title}</strong>
                    <small>{node.subtitle}</small>
                    <span className="tour-policy-node-result">
                      {showRunState ? node.result : 'Pending'}
                    </span>
                  </>
                );

                return (
                  <div className="tour-policy-node-row" key={node.id}>
                    {node.targetId ? (
                      <button
                        type="button"
                        className="tour-policy-node"
                        data-tone={node.tone}
                        data-selected={isSelected ? 'true' : undefined}
                        disabled={isDisabled}
                        style={{ '--node-delay': `${node.delay}ms` } as CSSProperties}
                        {...nodeProps}
                      >
                        {nodeContent}
                      </button>
                    ) : (
                      <article
                        className="tour-policy-node"
                        data-tone={node.tone}
                        style={{ '--node-delay': `${node.delay}ms` } as CSSProperties}
                      >
                        {nodeContent}
                      </article>
                    )}

                    {index < policyGraphNodes.length - 1 && (
                      <span
                        className="tour-policy-edge"
                        style={
                          {
                            '--edge-delay': `${policyGraphNodes[index + 1].delay}ms`,
                          } as CSSProperties
                        }
                        aria-hidden="true"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <aside className="tour-policy-inspector" aria-label="Policy inspector">
            {!docRuleSelected && !escalationRuleSelected && (
              <>
                <span className="tour-panel-label">Policy run</span>
                <h3>Policy run</h3>
                <p>
                  Run the illustrative policy to inspect how each decision rule
                  evaluates the synthetic facts.
                </p>
              </>
            )}

            {docRuleSelected && !escalationRuleSelected && (
              <>
                <span className="tour-panel-label">Rule ID: DOC-006</span>
                <h3>Six consecutive bank statements required</h3>
                <dl>
                  <div>
                    <dt>Observed fact</dt>
                    <dd>4 of 6 supplied</dd>
                  </div>
                  <div>
                    <dt>Result</dt>
                    <dd>
                      <StatusPill tone="fail">FAIL</StatusPill>
                    </dd>
                  </div>
                  <div>
                    <dt>Related evidence</dt>
                    <dd>Bank Statements package · E-03</dd>
                  </div>
                  <div>
                    <dt>Effect on route</dt>
                    <dd>Triggered ESC-002</dd>
                  </div>
                  <div>
                    <dt>Route</dt>
                    <dd>Senior Credit Reviewer</dd>
                  </div>
                  <div>
                    <dt>Trust statement</dt>
                    <dd>Client policy determined the route.</dd>
                  </div>
                </dl>
              </>
            )}

            {escalationRuleSelected && (
              <>
                <span className="tour-panel-label">Rule ID: ESC-002</span>
                <h3>Missing mandatory evidence → Human review</h3>
                <dl>
                  <div>
                    <dt>Result</dt>
                    <dd>
                      <StatusPill tone="warn">TRIGGERED</StatusPill>
                    </dd>
                  </div>
                  <div>
                    <dt>Route</dt>
                    <dd>Senior Credit Reviewer</dd>
                  </div>
                  <div>
                    <dt>Trust statement</dt>
                    <dd>Client policy determined the route.</dd>
                  </div>
                </dl>
                <button
                  type="button"
                  className="tour-action-button tour-continue-button"
                >
                  Continue to route
                </button>
              </>
            )}
          </aside>
        </div>
      </div>
    );
  }

  if (screen === 'route') {
    const escalationReviewed = true;
    const routedToQueue = completedActions.includes('route-human-review');

    return (
      <div className="tour-route-shell">
        <section className="tour-product-panel tour-route-main">
          <span className="tour-panel-label">Operational route</span>
          <div className="tour-escalate-result">
            <span>{caseData.route.finalRoute}</span>
            <strong>{caseData.route.supportingText}</strong>
          </div>

          <div className="tour-route-reason" data-visible={escalationReviewed ? 'true' : undefined}>
            <strong>Reason</strong>
            <p>{caseData.route.reason}</p>
            <span>Related rule: DOC-006 / ESC-002</span>
          </div>

          <div className="tour-route-trust">
            <strong>Trust statement</strong>
            <p>{caseData.route.statement}</p>
          </div>
        </section>

        <section className="tour-product-panel tour-route-ops">
          <div className="tour-route-lanes" data-routed={routedToQueue ? 'true' : undefined}>
            <article className="tour-route-case-card">
              <span>{caseData.caseId}</span>
              <strong>{caseData.applicant}</strong>
              <small>Policy context attached</small>
            </article>

            <div className="tour-route-arrow" aria-hidden="true" />

            <article className="tour-human-queue">
              <span className="tour-panel-label">Human Review Queue</span>
              <h3>{caseData.route.queue}</h3>
              <p>Assigned to {caseData.route.assignment}</p>
              {routedToQueue && <StatusPill tone="neutral">Route recorded</StatusPill>}
            </article>
          </div>

          <dl className="tour-route-details">
            <div>
              <dt>Assigned to</dt>
              <dd>{caseData.route.assignment}</dd>
            </div>
            <div>
              <dt>Queue</dt>
              <dd>{caseData.route.queue}</dd>
            </div>
            <div>
              <dt>Priority</dt>
              <dd>{caseData.route.priority}</dd>
            </div>
            <div>
              <dt>Case</dt>
              <dd>{caseData.caseId}</dd>
            </div>
          </dl>

          <button
            type="button"
            className="tour-action-button"
            disabled={!escalationReviewed || routedToQueue}
            {...targetProps('route-human')}
          >
            Route to human review
          </button>
        </section>
      </div>
    );
  }

  const auditDetailVisible =
    completedActions.includes('open-failed-rule-detail') ||
    hasReachedScene(activeScene, 'complete-tour');
  const auditCompletionVisible = hasReachedScene(activeScene, 'complete-tour');

  return (
    <div className="tour-audit-shell">
      <section className="tour-product-panel tour-audit-panel">
        <span className="tour-panel-label">Decision audit trail</span>
        <div className="tour-audit-table" role="list">
          {caseData.auditEvents.map((event) => {
            const isDocFailure = event.reference === 'DOC-006';

            if (isDocFailure && !auditDetailVisible) {
              return (
                <button
                  type="button"
                  key={`${event.time}-${event.reference}`}
                  className="tour-audit-row-button"
                  {...targetProps('audit-doc-rule')}
                >
                  <span>{event.time}</span>
                  <strong>{event.event}</strong>
                  <small>{event.reference}</small>
                </button>
              );
            }

            return (
              <span
                key={`${event.time}-${event.reference}`}
                data-selected={isDocFailure && auditDetailVisible ? 'true' : undefined}
              >
                <span>{event.time}</span>
                <strong>{event.event}</strong>
                <small>{event.reference}</small>
              </span>
            );
          })}
        </div>
      </section>

      <section className="tour-product-panel tour-audit-detail-panel">
        <span className="tour-panel-label">Selected audit detail</span>
        {!auditDetailVisible && (
          <div className="tour-audit-empty">
            <strong>Select Rule DOC-006 failed</strong>
            <span>Inspect the failed requirement that caused human review.</span>
          </div>
        )}

        {auditDetailVisible && (
          <div className="tour-audit-detail">
            <ShieldCheck size={20} aria-hidden="true" />
            <div>
              <h3>Rule DOC-006 failed</h3>
              <dl>
                <div>
                  <dt>Rule</dt>
                  <dd>{caseData.auditDetail.rule}</dd>
                </div>
                <div>
                  <dt>Observed evidence</dt>
                  <dd>{caseData.auditDetail.observedEvidence}</dd>
                </div>
                <div>
                  <dt>Effect</dt>
                  <dd>{caseData.auditDetail.effect}</dd>
                </div>
                <div>
                  <dt>Related evidence</dt>
                  <dd>{caseData.auditDetail.relatedEvidence}</dd>
                </div>
                <div>
                  <dt>Related policy</dt>
                  <dd>{caseData.auditDetail.relatedPolicy}</dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        {auditCompletionVisible && (
          <div className="tour-completion-panel">
            <span className="tour-panel-label">Decision replay complete</span>
            <h3>Decision replay complete</h3>
            <dl>
              <div>
                <dt>Evidence received</dt>
                <dd>3 items</dd>
              </div>
              <div>
                <dt>Structured facts</dt>
                <dd>5</dd>
              </div>
              <div>
                <dt>Policy results</dt>
                <dd>2 passed / 1 failed / 1 escalation triggered</dd>
              </div>
              <div>
                <dt>Final route</dt>
                <dd>Human review required</dd>
              </div>
              <div>
                <dt>Audit events</dt>
                <dd>6</dd>
              </div>
            </dl>
            <p>Same evidence + same illustrative policy = same route.</p>
            <div className="tour-completion-actions">
              <button
                type="button"
                className="tour-action-button"
                {...targetProps('complete-tour')}
              >
                Replay decision
              </button>
              <button type="button" className="tour-ghost-button" onClick={onTourExit}>
                Return to landing page
              </button>
              <button type="button" className="tour-ghost-button" onClick={onOpenDashboard}>
                Open Decision Control Center
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default ProductTour;
