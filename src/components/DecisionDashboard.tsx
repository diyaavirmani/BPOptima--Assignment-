import { useCallback, useMemo, useRef, useState } from 'react';
import DecisionDetailDrawer from './DecisionDetailDrawer';
import {
  dashboardSummaries,
  decisionRecords,
  workflowOptions,
  type DashboardWorkflow,
  type DecisionRecord,
} from '../data/dashboardData';

type RecordTab = 'attention' | 'all';

type DecisionDashboardProps = {
  onBackToLanding: () => void;
  onReplayDecision: () => void;
};

const kpiDefinitions = {
  cases:
    'Total decision records in the selected synthetic period.',
  automated:
    'Cases routed without human review divided by total cases.',
  queue:
    'Cases currently awaiting reviewer judgment.',
  decisionTime:
    'Median time from evidence receipt to automated route.',
};

function DecisionDashboard({
  onBackToLanding,
  onReplayDecision,
}: DecisionDashboardProps) {
  const [workflow, setWorkflow] = useState<DashboardWorkflow>('all');
  const [recordTab, setRecordTab] = useState<RecordTab>('attention');
  const [selectedRecord, setSelectedRecord] = useState<DecisionRecord | null>(null);
  const lastFocusedRowRef = useRef<HTMLElement | null>(null);
  const summary = dashboardSummaries[workflow];

  const visibleRecords = useMemo(
    () =>
      decisionRecords.filter((record) => {
        const matchesWorkflow = workflow === 'all' || record.workflowKey === workflow;
        const matchesTab = recordTab === 'all' || record.outcome === 'Human review';
        return matchesWorkflow && matchesTab;
      }),
    [recordTab, workflow],
  );

  const openRecord = useCallback((record: DecisionRecord, trigger: HTMLElement) => {
    lastFocusedRowRef.current = trigger;
    setSelectedRecord(record);
  }, []);

  const closeDrawer = useCallback(() => {
    setSelectedRecord(null);
    window.requestAnimationFrame(() => lastFocusedRowRef.current?.focus());
  }, []);

  const replaySelectedDecision = useCallback(() => {
    setSelectedRecord(null);
    onReplayDecision();
  }, [onReplayDecision]);

  return (
    <main className="dashboard-shell" aria-labelledby="dashboard-title">
      <header className="dashboard-topbar">
        <a className="brand" href="#top" aria-label="BPOptima home" onClick={onBackToLanding}>
          <span className="brand-mark" aria-hidden="true">
            <span className="brand-dot brand-dot-one" />
            <span className="brand-dot brand-dot-two" />
            <span className="brand-dot brand-dot-three" />
            <span className="brand-core" />
          </span>
          <span>BPOptima</span>
        </a>
        <div className="dashboard-topbar-actions">
          <button className="secondary-button" type="button" onClick={onBackToLanding}>
            Landing page
          </button>
          <button className="primary-button" type="button" onClick={onReplayDecision}>
            Replay a synthetic decision
          </button>
        </div>
      </header>

      <section className="dashboard-hero">
        <div>
          <h1 id="dashboard-title">Decision Control Center</h1>
          <p>
            Monitor policy-routed decisions, human exceptions, and audit
            coverage.
          </p>
        </div>
        <ul className="dashboard-labels" aria-label="Dashboard labels">
          <li>Synthetic portfolio</li>
          <li>Illustrative client policies</li>
          <li>No real customer data</li>
        </ul>
      </section>

      <section className="dashboard-filter-panel" aria-label="Dashboard filters">
        <div>
          <span className="dashboard-filter-label">Workflow</span>
          <div className="dashboard-workflow-tabs" role="tablist" aria-label="Workflow">
            {workflowOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                role="tab"
                aria-selected={workflow === option.id}
                className="dashboard-tab-button"
                onClick={() => setWorkflow(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <div className="dashboard-period" aria-label="Selected period">
          <span>Period</span>
          <strong>Last 30 days</strong>
        </div>
      </section>

      <section className="dashboard-kpi-grid" aria-label={`${summary.label} metrics`}>
        <KpiCard
          label="Cases processed"
          value={summary.casesProcessed}
          definition={kpiDefinitions.cases}
        />
        <KpiCard
          label="Automated routing rate"
          value={summary.automatedRoutingRate}
          support="Routed without manual review"
          definition={kpiDefinitions.automated}
        />
        <KpiCard
          label="Human-review queue"
          value={summary.humanReviewQueue}
          support={summary.humanReviewSupport}
          definition={kpiDefinitions.queue}
        />
        <KpiCard
          label="Median automated decision time"
          value={summary.medianDecisionTime}
          definition={kpiDefinitions.decisionTime}
        />
      </section>

      <section className="dashboard-audit-strip" aria-label="Audit integrity">
        <div>
          <h2>Audit integrity</h2>
          <p>
            {summary.auditCount} of {summary.auditCount} displayed decisions include:
            Evidence references · Policy version · Route · Timestamps
          </p>
        </div>
        <span>Synthetic demonstration data</span>
      </section>

      <section className="dashboard-analytics-grid" aria-label="Portfolio analytics">
        <article className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <span className="dashboard-panel-kicker">Outcome mix</span>
              <h2>{summary.label}</h2>
            </div>
          </div>
          <div className="dashboard-outcome-bar" aria-label="Outcome mix stacked bar">
            {summary.outcomeMix.map((item) => (
              <span
                key={item.label}
                className={`dashboard-outcome-segment dashboard-outcome-${item.tone}`}
                style={{ width: `${item.value}%` }}
              />
            ))}
          </div>
          <ul className="dashboard-outcome-legend">
            {summary.outcomeMix.map((item) => (
              <li key={item.label}>
                <span className={`dashboard-legend-dot dashboard-legend-${item.tone}`} />
                <strong>{item.label}</strong>
                <span>{item.value}%</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <span className="dashboard-panel-kicker">Top escalation triggers</span>
              <h2>{summary.label}</h2>
            </div>
            <span className="dashboard-panel-note">Illustrative policy data</span>
          </div>
          <ol className="dashboard-trigger-list">
            {summary.escalationTriggers.map((trigger) => (
              <li key={trigger.label} className="dashboard-trigger-row">
                <div>
                  <span>{trigger.label}</span>
                  <strong>{trigger.value}%</strong>
                </div>
                <span className="dashboard-trigger-track" aria-hidden="true">
                  <span style={{ width: `${trigger.value}%` }} />
                </span>
              </li>
            ))}
          </ol>
        </article>
      </section>

      <section className="dashboard-records-panel" aria-labelledby="records-title">
        <div className="dashboard-panel-header">
          <div>
            <span className="dashboard-panel-kicker">Decision records</span>
            <h2 id="records-title">Traceable decisions</h2>
          </div>
          <div className="dashboard-record-tabs" role="tablist" aria-label="Decision record view">
            <button
              type="button"
              role="tab"
              aria-selected={recordTab === 'attention'}
              className="dashboard-tab-button"
              onClick={() => setRecordTab('attention')}
            >
              Needs attention
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={recordTab === 'all'}
              className="dashboard-tab-button"
              onClick={() => setRecordTab('all')}
            >
              All decisions
            </button>
          </div>
        </div>

        <div className="dashboard-table-wrapper">
          <table className="dashboard-records-table">
            <thead>
              <tr>
                <th scope="col">Case</th>
                <th scope="col">Workflow</th>
                <th scope="col">Outcome</th>
                <th scope="col">Trigger</th>
                <th scope="col">Owner</th>
                <th scope="col">Age</th>
                <th scope="col">Audit</th>
              </tr>
            </thead>
            <tbody>
              {visibleRecords.map((record) => (
                <DecisionTableRow
                  key={record.id}
                  record={record}
                  onOpen={openRecord}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className="dashboard-record-cards" aria-label="Decision records">
          {visibleRecords.map((record) => (
            <button
              key={record.id}
              type="button"
              className="dashboard-record-card"
              onClick={(event) => openRecord(record, event.currentTarget)}
            >
              <span>
                <strong>{record.id}</strong>
                <small>{record.workflow}</small>
              </span>
              <span className="dashboard-record-card-meta">
                <StatusPill outcome={record.outcome} />
                <small>{record.trigger} · {record.owner}</small>
                <small>{record.age} · Audit {record.audit}</small>
              </span>
            </button>
          ))}
        </div>
      </section>

      {selectedRecord && (
        <DecisionDetailDrawer
          record={selectedRecord}
          onClose={closeDrawer}
          onReplayDecision={replaySelectedDecision}
        />
      )}
    </main>
  );
}

function KpiCard({
  label,
  value,
  support,
  definition,
}: {
  label: string;
  value: string;
  support?: string;
  definition: string;
}) {
  return (
    <article className="dashboard-kpi-card">
      <span>{label}</span>
      <strong>{value}</strong>
      {support && <p>{support}</p>}
      <small>{definition}</small>
    </article>
  );
}

function DecisionTableRow({
  record,
  onOpen,
}: {
  record: DecisionRecord;
  onOpen: (record: DecisionRecord, trigger: HTMLElement) => void;
}) {
  return (
    <tr
      className="dashboard-record-row"
      onClick={(event) => onOpen(record, event.currentTarget)}
    >
      <td>
        <button
          type="button"
          className="dashboard-row-action"
          aria-label={`Open ${record.id} decision detail`}
          onClick={(event) => {
            event.stopPropagation();
            onOpen(record, event.currentTarget);
          }}
        >
          <strong>{record.id}</strong>
        </button>
      </td>
      <td>{record.workflow}</td>
      <td>
        <StatusPill outcome={record.outcome} />
      </td>
      <td>{record.trigger}</td>
      <td>{record.owner}</td>
      <td>{record.age}</td>
      <td>{record.audit}</td>
    </tr>
  );
}

function StatusPill({ outcome }: { outcome: DecisionRecord['outcome'] }) {
  const tone =
    outcome === 'Approved'
      ? 'pass'
      : outcome === 'Declined'
        ? 'fail'
        : 'warn';

  return (
    <span className={`dashboard-status-pill dashboard-status-pill-${tone}`}>
      {outcome}
    </span>
  );
}

export default DecisionDashboard;
