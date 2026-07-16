import {
  AlertTriangle,
  ClipboardCheck,
  FileText,
  Landmark,
  RefreshCcw,
  ShieldCheck,
} from 'lucide-react';
import { type CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import { caseData } from '../data/caseData';

const FINAL_PHASE = 10;

const phaseSchedule = [
  { phase: 1, delay: 0 },
  { phase: 2, delay: 500 },
  { phase: 3, delay: 950 },
  { phase: 4, delay: 1300 },
  { phase: 5, delay: 2300 },
  { phase: 6, delay: 3100 },
  { phase: 7, delay: 4000 },
  { phase: 8, delay: 5000 },
  { phase: 9, delay: 5700 },
  { phase: 10, delay: 6500 },
] as const;

const evidenceSignals = [
  {
    id: 'revenue',
    label: 'Average monthly revenue',
    value: '₹82,000',
    className: 'signal-revenue',
    warning: false,
    drift: true,
  },
  {
    id: 'obligations',
    label: 'Existing monthly obligations',
    value: '₹24,000',
    className: 'signal-obligations',
    warning: false,
    drift: false,
  },
  {
    id: 'amount',
    label: 'Requested amount',
    value: '₹5,00,000',
    className: 'signal-amount',
    warning: false,
    drift: true,
  },
  {
    id: 'statements',
    label: 'Bank statements',
    value: '4 of 6 supplied',
    className: 'signal-statements',
    warning: true,
    drift: false,
  },
  {
    id: 'business',
    label: 'Business type',
    value: 'Retail — General Stores',
    className: 'signal-business',
    warning: false,
    drift: true,
  },
  {
    id: 'source',
    label: 'Evidence source',
    value: 'Sales Ledger · Loan Application',
    className: 'signal-source',
    warning: false,
    drift: false,
  },
] as const;

function getPrefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function cx(...classNames: Array<string | false | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

function HeroAnimation() {
  const [phase, setPhase] = useState(() =>
    getPrefersReducedMotion() ? FINAL_PHASE : 0,
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    getPrefersReducedMotion,
  );
  const stageRef = useRef<HTMLElement | null>(null);
  const timersRef = useRef<number[]>([]);
  const hasAutoPlayedRef = useRef(false);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }, []);

  const startSequence = useCallback(() => {
    clearTimers();

    if (prefersReducedMotion) {
      setPhase(FINAL_PHASE);
      return;
    }

    setPhase(0);
    phaseSchedule.forEach(({ phase: nextPhase, delay }) => {
      const timer = window.setTimeout(() => setPhase(nextPhase), delay);
      timersRef.current.push(timer);
    });
  }, [clearTimers, prefersReducedMotion]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = () => {
      const shouldReduce = mediaQuery.matches;
      setPrefersReducedMotion(shouldReduce);

      if (shouldReduce) {
        clearTimers();
        setPhase(FINAL_PHASE);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [clearTimers]);

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage) {
      return undefined;
    }

    if (prefersReducedMotion) {
      hasAutoPlayedRef.current = true;
      setPhase(FINAL_PHASE);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          entry.intersectionRatio >= 0.24 &&
          !hasAutoPlayedRef.current
        ) {
          hasAutoPlayedRef.current = true;
          startSequence();
          observer.disconnect();
        }
      },
      { threshold: [0, 0.2, 0.3, 0.5, 1] },
    );

    observer.observe(stage);
    return () => observer.disconnect();
  }, [prefersReducedMotion, startSequence]);

  useEffect(() => clearTimers, [clearTimers]);

  const stageVisible = phase >= 1;
  const centralVisible = phase >= 2;
  const badgeVisible = phase >= 3;
  const signalsVisible = phase >= 4;
  const understandingVisible = phase >= 5;
  const understandingComplete = phase >= 6;
  const policyVisible = phase >= 7;
  const docFailed = phase >= 8;
  const humanTriggered = phase >= 9;
  const auditRecorded = phase >= 10;

  const understandingStatus = understandingComplete
    ? '5 structured facts prepared'
    : phase >= 5
      ? 'Structuring five decision facts...'
      : 'Reading synthetic evidence...';

  return (
    <section
      className={cx('hero-animation', stageVisible && 'stage-visible')}
      id="decision-preview"
      ref={stageRef}
      aria-labelledby="orchestration-title"
      aria-describedby="orchestration-summary"
    >
      <p className="sr-only" id="orchestration-summary">
        BPOptima structures synthetic evidence, applies illustrative client
        policy, detects that only four of six required bank statements were
        supplied, routes the case to human review, and records the decision
        event.
      </p>

      <div className="stage-glow" aria-hidden="true" />
      <div className="lavender-glow" aria-hidden="true" />
      <div className="blush-glow" aria-hidden="true" />

      <span className="micro-label micro-synthetic">Synthetic data only</span>
      <span className="micro-label micro-policy">Illustrative policy v3.2</span>
      <span className="micro-label micro-audit">Audit reference: CASE-2048</span>

      <ul className="evidence-layer" aria-label="Structured evidence facts">
        {evidenceSignals.map((signal, index) => (
          <li
            className={cx(
              'evidence-signal',
              signal.className,
              signalsVisible && 'signal-visible',
              signal.warning && docFailed && 'signal-warning',
              auditRecorded && signal.drift && 'signal-idle',
            )}
            key={signal.id}
            style={{ '--signal-delay': `${index * 110}ms` } as CSSProperties}
          >
            <span>{signal.label}</span>
            <strong>{signal.value}</strong>
          </li>
        ))}
      </ul>

      <article
        className={cx('central-case', centralVisible && 'central-visible')}
        aria-labelledby="orchestration-title"
      >
        <span className={cx('synthetic-pill', badgeVisible && 'pill-visible')}>
          Synthetic applicant
        </span>
        <img
          className="store-illustration"
          src="/assets/synthetic-store.svg"
          alt=""
          aria-hidden="true"
        />
        <p className="case-eyebrow">Small-business retail</p>
        <h2 id="orchestration-title">{caseData.applicant}</h2>
        <dl className="case-facts">
          <div>
            <dt>Requested</dt>
            <dd>{caseData.requestedAmount}</dd>
          </div>
          <div>
            <dt>Case</dt>
            <dd>{caseData.caseId}</dd>
          </div>
          <div>
            <dt>Workflow</dt>
            <dd>{caseData.workflow}</dd>
          </div>
        </dl>
        <div className="case-footer">
          <span>Applicant: {caseData.applicant}</span>
          <span>Workflow: {caseData.shortWorkflow}</span>
        </div>
      </article>

      <div className={cx('workflow-badge', badgeVisible && 'badge-visible')}>
        MSME Credit Decision
      </div>

      <aside
        className={cx(
          'understanding-panel',
          understandingVisible && 'understanding-visible',
        )}
        aria-label="Evidence Understanding"
      >
        <div className="panel-heading">
          <span className="icon-shell" aria-hidden="true">
            <ShieldCheck size={18} />
          </span>
          <div>
            <p>Evidence Understanding</p>
            <h3>{understandingStatus}</h3>
          </div>
        </div>
        <p className="panel-text">Messy evidence converted into policy-ready data.</p>
        <div className="status-region">
          <FileText size={16} aria-hidden="true" />
          <span>{understandingComplete ? 'Facts ready' : 'Evidence being structured'}</span>
        </div>
      </aside>

      <div
        className={cx('animation-connector', understandingComplete && 'connector-visible')}
        aria-hidden="true"
      >
        <span />
      </div>

      <aside
        className={cx('policy-panel', policyVisible && 'policy-visible')}
        aria-label="Client Policy"
      >
        <div className="panel-heading">
          <span className="icon-shell policy-icon" aria-hidden="true">
            <Landmark size={18} />
          </span>
          <div>
            <p>Client Policy</p>
            <h3>
              {docFailed
              ? 'DOC-006 — FAIL'
                : 'Evaluating illustrative client policy v3.2...'}
            </h3>
          </div>
        </div>

        <div className={cx('policy-rule', docFailed && 'rule-failed')}>
          <div>
            <strong>DOC-006</strong>
            <span>Six consecutive bank statements required</span>
          </div>
          <dl>
            <div>
              <dt>Observed</dt>
              <dd>4 of 6 supplied</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{docFailed ? 'FAIL' : 'Checking'}</dd>
            </div>
          </dl>
        </div>

        <div className={cx('trigger-row', humanTriggered && 'trigger-visible')}>
          <AlertTriangle size={15} aria-hidden="true" />
          <span>ESC-002 — TRIGGERED</span>
        </div>

        <p className={cx('policy-trust', humanTriggered && 'trust-visible')}>
          Client policy determined the route.
        </p>
      </aside>

      <div className={cx('outcome-badge', humanTriggered && 'outcome-visible')}>
        <ClipboardCheck size={18} aria-hidden="true" />
        <span>Human review required</span>
      </div>

      <div className={cx('audit-status', auditRecorded && 'audit-visible')}>
        <strong>Decision event recorded</strong>
        <span>Reference: CASE-2048</span>
      </div>

      <button
        className="replay-control"
        type="button"
        onClick={startSequence}
        aria-label="Replay decision orchestration animation"
      >
        <RefreshCcw size={14} aria-hidden="true" />
        Replay animation
      </button>
    </section>
  );
}

export default HeroAnimation;
