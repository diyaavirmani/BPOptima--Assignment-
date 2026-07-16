import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { caseData } from '../data/caseData';
import type { DecisionRecord } from '../data/dashboardData';

type DecisionDetailDrawerProps = {
  record: DecisionRecord;
  onClose: () => void;
  onReplayDecision: () => void;
};

const auditSummary = [
  'Evidence received',
  'Five structured facts recorded',
  'Policy v3.2 executed',
  'DOC-006 failed',
  'Case routed to Senior Credit Reviewer',
];

function getFocusableElements(root: HTMLElement) {
  return Array.from(
    root.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => !element.hasAttribute('disabled'));
}

function DecisionDetailDrawer({
  record,
  onClose,
  onReplayDecision,
}: DecisionDetailDrawerProps) {
  const drawerRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const [showFullAudit, setShowFullAudit] = useState(false);

  useEffect(() => {
    setShowFullAudit(false);
  }, [record.id]);

  useEffect(() => {
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      const drawer = drawerRef.current;

      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !drawer) {
        return;
      }

      const focusable = getFocusableElements(drawer);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!first || !last) {
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
        return;
      }

      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, record.id]);

  const isMsmeCase = record.id === caseData.caseId;

  return (
    <div className="dashboard-drawer-backdrop" onMouseDown={onClose}>
      <aside
        className="dashboard-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dashboard-drawer-title"
        ref={drawerRef}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="dashboard-drawer-header">
          <div>
            <span className="dashboard-panel-kicker">Decision detail</span>
            <h2 id="dashboard-drawer-title">{record.id}</h2>
            <p>{record.workflow} · {record.outcome}</p>
          </div>
          <button
            className="dashboard-icon-button"
            type="button"
            onClick={onClose}
            ref={closeButtonRef}
            aria-label="Close decision detail"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {isMsmeCase ? (
          <div className="dashboard-detail-content">
            <section className="dashboard-detail-section" aria-labelledby="msme-case-title">
              <h3 id="msme-case-title">Case</h3>
              <dl className="dashboard-detail-list">
                <div>
                  <dt>Case</dt>
                  <dd>{caseData.caseId}</dd>
                </div>
                <div>
                  <dt>Applicant</dt>
                  <dd>{caseData.applicant}</dd>
                </div>
                <div>
                  <dt>Workflow</dt>
                  <dd>{caseData.workflow}</dd>
                </div>
                <div>
                  <dt>Requested</dt>
                  <dd>{caseData.requestedAmount}</dd>
                </div>
              </dl>
            </section>

            <section className="dashboard-detail-section" aria-labelledby="msme-evidence-title">
              <h3 id="msme-evidence-title">Evidence</h3>
              <ul className="dashboard-detail-bullets">
                {caseData.evidence.map((item) => (
                  <li key={item.id}>
                    <span>{item.name}</span>
                    <strong>
                      {item.status === 'Incomplete' ? '4 of 6 supplied' : item.status}
                    </strong>
                  </li>
                ))}
              </ul>
            </section>

            <section className="dashboard-detail-section" aria-labelledby="msme-facts-title">
              <h3 id="msme-facts-title">Structured facts</h3>
              <ul className="dashboard-detail-bullets">
                <li>
                  <span>Revenue</span>
                  <strong>{caseData.facts[0].value}</strong>
                </li>
                <li>
                  <span>Obligations</span>
                  <strong>{caseData.facts[1].value}</strong>
                </li>
                <li>
                  <span>Requested amount</span>
                  <strong>{caseData.facts[2].value}</strong>
                </li>
              </ul>
            </section>

            <section className="dashboard-detail-section" aria-labelledby="msme-policy-title">
              <h3 id="msme-policy-title">Policy</h3>
              <dl className="dashboard-detail-list">
                <div>
                  <dt>Rule</dt>
                  <dd>DOC-006 · Six consecutive bank statements required</dd>
                </div>
                <div>
                  <dt>Observed</dt>
                  <dd>4 of 6 supplied</dd>
                </div>
                <div>
                  <dt>Result</dt>
                  <dd>
                    <span className="dashboard-status-pill dashboard-status-pill-fail">
                      FAIL
                    </span>
                  </dd>
                </div>
                <div>
                  <dt>Related route</dt>
                  <dd>ESC-002 triggered</dd>
                </div>
                <div>
                  <dt>Final route</dt>
                  <dd>Human review required</dd>
                </div>
              </dl>
            </section>

            <section className="dashboard-detail-section" aria-labelledby="msme-audit-title">
              <h3 id="msme-audit-title">Audit summary</h3>
              <ul className="dashboard-detail-bullets">
                {auditSummary.map((item) => (
                  <li key={item}>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {showFullAudit && (
                <ol className="dashboard-audit-list" aria-label="Full audit trail">
                  {caseData.auditEvents.map((event) => (
                    <li key={`${event.time}-${event.reference}`}>
                      <time>{event.time}</time>
                      <span>{event.event}</span>
                      <strong>{event.reference}</strong>
                    </li>
                  ))}
                </ol>
              )}
            </section>

            <div className="dashboard-drawer-actions">
              <button
                className="secondary-button"
                type="button"
                onClick={() => setShowFullAudit((current) => !current)}
                aria-expanded={showFullAudit}
              >
                {showFullAudit ? 'Hide full audit trail' : 'View full audit trail'}
              </button>
              <button className="primary-button" type="button" onClick={onReplayDecision}>
                Replay this decision
              </button>
            </div>
          </div>
        ) : (
          <SyntheticWorkflowDetail record={record} />
        )}
      </aside>
    </div>
  );
}

function SyntheticWorkflowDetail({ record }: { record: DecisionRecord }) {
  const detail =
    record.id === 'CLM-7812'
      ? {
          label: 'Illustrative claims workflow',
          workflow: 'Claims Review',
          evidence: ['Claim form', 'Damage images', 'Policy schedule'],
          rule: 'COV-004',
          observed: 'Submitted loss requires coverage clarification',
          route: 'Claims Adjuster review',
        }
      : record.id === 'AML-3309'
        ? {
            label: 'Illustrative compliance workflow',
            workflow: 'Compliance Check',
            evidence: ['KYC documents', 'Screening result', 'Customer profile'],
            rule: 'AML-017',
            observed: 'Potential watchlist match requires analyst confirmation',
            route: 'Compliance Analyst review',
          }
        : {
            label: 'Synthetic policy-routed decision',
            workflow: `${record.workflow} workflow`,
            evidence: ['Evidence references recorded', 'Policy version recorded'],
            rule: record.trigger,
            observed: 'Policy conditions evaluated against structured facts',
            route: record.outcome,
          };

  return (
    <div className="dashboard-detail-content">
      <span className="dashboard-detail-label">{detail.label}</span>
      <section className="dashboard-detail-section" aria-labelledby="synthetic-workflow-title">
        <h3 id="synthetic-workflow-title">Workflow</h3>
        <p>{detail.workflow}</p>
      </section>

      <section className="dashboard-detail-section" aria-labelledby="synthetic-evidence-title">
        <h3 id="synthetic-evidence-title">Evidence</h3>
        <ul className="dashboard-detail-bullets">
          {detail.evidence.map((item) => (
            <li key={item}>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="dashboard-detail-section" aria-labelledby="synthetic-policy-title">
        <h3 id="synthetic-policy-title">Policy route</h3>
        <dl className="dashboard-detail-list">
          <div>
            <dt>Rule</dt>
            <dd>{detail.rule}</dd>
          </div>
          <div>
            <dt>Observed</dt>
            <dd>{detail.observed}</dd>
          </div>
          <div>
            <dt>Route</dt>
            <dd>{detail.route}</dd>
          </div>
          <div>
            <dt>Audit</dt>
            <dd>{record.audit}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}

export default DecisionDetailDrawer;
