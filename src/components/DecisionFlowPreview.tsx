import { AlertTriangle, CheckCircle2, FileText, RefreshCcw } from 'lucide-react';
import { type CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import { caseData } from '../data/caseData';

const FINAL_PHASE = 10;

const phaseSchedule = [
  { phase: 1, delay: 160 },
  { phase: 2, delay: 760 },
  { phase: 3, delay: 1180 },
  { phase: 4, delay: 1740 },
  { phase: 5, delay: 2200 },
  { phase: 6, delay: 2700 },
  { phase: 7, delay: 3180 },
  { phase: 8, delay: 3740 },
  { phase: 9, delay: 4240 },
  { phase: 10, delay: 4860 },
] as const;

const evidenceItems = [
  'Loan Application.pdf',
  'Sales Ledger.jpg',
  'Bank Statements - 4 of 6 supplied',
] as const;

const structuredFacts = [
  ['Revenue', '₹82,000'],
  ['Obligations', '₹24,000'],
  ['Statements supplied', '4 of 6'],
] as const;

const policyRules = [
  { label: 'Revenue rule', result: 'PASS', tone: 'pass', phase: 4 },
  { label: 'Debt-service rule', result: 'PASS', tone: 'pass', phase: 5 },
  { label: 'Required statements', result: 'FAIL', tone: 'fail', phase: 6 },
  { label: 'ESC-002', result: 'TRIGGERED', tone: 'warn', phase: 7 },
] as const;

function getPrefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function DecisionFlowPreview() {
  const [phase, setPhase] = useState(() =>
    getPrefersReducedMotion() ? FINAL_PHASE : 0,
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    getPrefersReducedMotion,
  );
  const previewRef = useRef<HTMLElement | null>(null);
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
    const preview = previewRef.current;

    if (!preview) {
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
          entry.intersectionRatio >= 0.2 &&
          !hasAutoPlayedRef.current
        ) {
          hasAutoPlayedRef.current = true;
          startSequence();
          observer.disconnect();
        }
      },
      { threshold: [0, 0.2, 0.45] },
    );

    observer.observe(preview);
    return () => observer.disconnect();
  }, [prefersReducedMotion, startSequence]);

  useEffect(() => clearTimers, [clearTimers]);

  return (
    <section
      className="decision-flow-preview"
      ref={previewRef}
      aria-labelledby="decision-flow-title"
      aria-describedby="decision-flow-summary"
    >
      <p className="sr-only" id="decision-flow-summary">
        Synthetic evidence becomes structured facts, client policy evaluates the
        facts, the incomplete statement package routes the case to human review,
        and an audit record is created.
      </p>

      <div className="flow-preview-header">
        <div>
          <span className="section-label">Synthetic example</span>
          <h2 id="decision-flow-title">
            {caseData.applicant} requests {caseData.requestedAmount}
          </h2>
        </div>
        <button
          className="flow-replay-button"
          type="button"
          onClick={startSequence}
          aria-label="Replay the decision flow preview"
        >
          <RefreshCcw size={14} aria-hidden="true" />
          Replay preview
        </button>
      </div>

      <div className="flow-modules" aria-label="Decision flow preview modules">
        <article className="flow-module" data-active={phase >= 1 ? 'true' : undefined}>
          <span className="flow-module-kicker">Input</span>
          <h3>Evidence</h3>
          <ul>
            {evidenceItems.map((item, index) => (
              <li
                key={item}
                style={{ '--item-delay': `${index * 100}ms` } as CSSProperties}
              >
                <FileText size={15} aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>

        <span className="flow-connector" data-active={phase >= 2 ? 'true' : undefined}>
          →
        </span>

        <article className="flow-module" data-active={phase >= 3 ? 'true' : undefined}>
          <span className="flow-module-kicker">Process</span>
          <h3>Facts</h3>
          <dl className="flow-facts">
            {structuredFacts.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </article>

        <span className="flow-connector" data-active={phase >= 4 ? 'true' : undefined}>
          →
        </span>

        <article className="flow-module" data-active={phase >= 4 ? 'true' : undefined}>
          <span className="flow-module-kicker">Control</span>
          <h3>Client Policy</h3>
          <ul className="flow-policy-list">
            {policyRules.map((rule) => (
              <li
                key={rule.label}
                data-visible={phase >= rule.phase ? 'true' : undefined}
                data-tone={rule.tone}
              >
                <span>{rule.label}</span>
                <strong>{rule.result}</strong>
              </li>
            ))}
          </ul>
        </article>

        <span className="flow-connector" data-active={phase >= 8 ? 'true' : undefined}>
          →
        </span>

        <article
          className="flow-module flow-outcome-module"
          data-active={phase >= 9 ? 'true' : undefined}
        >
          <span className="flow-module-kicker">Output</span>
          <h3>Human Review</h3>
          <div className="flow-outcome">
            <AlertTriangle size={18} aria-hidden="true" />
            <strong>Human review required</strong>
            <span>Only four of six required bank statements were supplied.</span>
          </div>
        </article>
      </div>

      <div className="flow-audit-strip" data-active={phase >= 10 ? 'true' : undefined}>
        <CheckCircle2 size={17} aria-hidden="true" />
        <strong>Audit record created:</strong>
        <span>Evidence → Facts → Policy → Route</span>
      </div>
    </section>
  );
}

export default DecisionFlowPreview;
