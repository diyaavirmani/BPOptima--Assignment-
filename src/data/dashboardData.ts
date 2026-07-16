export type DashboardWorkflow = 'all' | 'credit' | 'claims' | 'compliance';

export type DecisionRecord = {
  id: string;
  workflow: 'Credit' | 'Claims' | 'Compliance';
  workflowKey: Exclude<DashboardWorkflow, 'all'>;
  outcome: 'Human review' | 'Approved' | 'Declined';
  trigger: string;
  owner: string;
  age: string;
  audit: 'Complete';
};

export type DashboardSummary = {
  label: string;
  casesProcessed: string;
  automatedRoutingRate: string;
  humanReviewQueue: string;
  humanReviewSupport?: string;
  medianDecisionTime: string;
  auditCount: string;
  outcomeMix: Array<{
    label: string;
    value: number;
    tone: 'positive' | 'negative' | 'review';
  }>;
  escalationTriggers: Array<{
    label: string;
    value: number;
  }>;
};

export const workflowOptions: Array<{ id: DashboardWorkflow; label: string }> = [
  { id: 'all', label: 'All Workflows' },
  { id: 'credit', label: 'Credit Decisions' },
  { id: 'claims', label: 'Claims Review' },
  { id: 'compliance', label: 'Compliance Checks' },
];

const baseOutcomeValues = [61, 21, 18] as const;

export const dashboardSummaries: Record<DashboardWorkflow, DashboardSummary> = {
  all: {
    label: 'All Workflows',
    casesProcessed: '1,248',
    automatedRoutingRate: '82%',
    humanReviewQueue: '24 open',
    humanReviewSupport: '7 due soon',
    medianDecisionTime: '42 sec',
    auditCount: '1,248',
    outcomeMix: [
      { label: 'Automated positive', value: baseOutcomeValues[0], tone: 'positive' },
      { label: 'Automated negative', value: baseOutcomeValues[1], tone: 'negative' },
      { label: 'Human review', value: baseOutcomeValues[2], tone: 'review' },
    ],
    escalationTriggers: [
      { label: 'Missing mandatory evidence', value: 39 },
      { label: 'Coverage or eligibility conflict', value: 23 },
      { label: 'Identity or watchlist match', value: 21 },
      { label: 'Policy threshold exception', value: 17 },
    ],
  },
  credit: {
    label: 'Credit Decisions',
    casesProcessed: '524',
    automatedRoutingRate: '79%',
    humanReviewQueue: '12 open',
    medianDecisionTime: '51 sec',
    auditCount: '524',
    outcomeMix: [
      { label: 'Approve', value: baseOutcomeValues[0], tone: 'positive' },
      { label: 'Reject', value: baseOutcomeValues[1], tone: 'negative' },
      { label: 'Credit review', value: baseOutcomeValues[2], tone: 'review' },
    ],
    escalationTriggers: [
      { label: 'DOC-006 · Missing bank statements', value: 41 },
      { label: 'CR-008 · Debt-service exception', value: 27 },
      { label: 'KYC-012 · Identity mismatch', value: 19 },
      { label: 'ESC-019 · Manual policy exception', value: 13 },
    ],
  },
  claims: {
    label: 'Claims Review',
    casesProcessed: '438',
    automatedRoutingRate: '84%',
    humanReviewQueue: '8 open',
    medianDecisionTime: '38 sec',
    auditCount: '438',
    outcomeMix: [
      { label: 'Straight-through', value: baseOutcomeValues[0], tone: 'positive' },
      { label: 'Decline', value: baseOutcomeValues[1], tone: 'negative' },
      { label: 'Adjuster review', value: baseOutcomeValues[2], tone: 'review' },
    ],
    escalationTriggers: [
      { label: 'COV-004 · Coverage conflict', value: 35 },
      { label: 'DOC-021 · Medical evidence incomplete', value: 29 },
      { label: 'FRD-009 · Anomaly requires review', value: 21 },
      { label: 'POL-015 · Policy exclusion', value: 15 },
    ],
  },
  compliance: {
    label: 'Compliance Checks',
    casesProcessed: '286',
    automatedRoutingRate: '85%',
    humanReviewQueue: '4 open',
    medianDecisionTime: '31 sec',
    auditCount: '286',
    outcomeMix: [
      { label: 'Clear', value: baseOutcomeValues[0], tone: 'positive' },
      { label: 'Flag', value: baseOutcomeValues[1], tone: 'negative' },
      { label: 'Analyst review', value: baseOutcomeValues[2], tone: 'review' },
    ],
    escalationTriggers: [
      { label: 'AML-017 · Potential watchlist match', value: 38 },
      { label: 'PEP-003 · PEP review required', value: 26 },
      { label: 'KYC-012 · Identity evidence incomplete', value: 21 },
      { label: 'ADV-006 · Adverse-media exception', value: 15 },
    ],
  },
};

export const decisionRecords: DecisionRecord[] = [
  {
    id: 'MSME-2048',
    workflow: 'Credit',
    workflowKey: 'credit',
    outcome: 'Human review',
    trigger: 'DOC-006',
    owner: 'Senior Credit Reviewer',
    age: '12m',
    audit: 'Complete',
  },
  {
    id: 'CLM-7812',
    workflow: 'Claims',
    workflowKey: 'claims',
    outcome: 'Human review',
    trigger: 'COV-004',
    owner: 'Claims Adjuster',
    age: '19m',
    audit: 'Complete',
  },
  {
    id: 'AML-3309',
    workflow: 'Compliance',
    workflowKey: 'compliance',
    outcome: 'Human review',
    trigger: 'AML-017',
    owner: 'Compliance Analyst',
    age: '7m',
    audit: 'Complete',
  },
  {
    id: 'CRD-2174',
    workflow: 'Credit',
    workflowKey: 'credit',
    outcome: 'Approved',
    trigger: 'CR-001',
    owner: 'Policy-routed',
    age: '5s',
    audit: 'Complete',
  },
  {
    id: 'CLM-7804',
    workflow: 'Claims',
    workflowKey: 'claims',
    outcome: 'Declined',
    trigger: 'COV-011',
    owner: 'Policy-routed',
    age: '8s',
    audit: 'Complete',
  },
];
