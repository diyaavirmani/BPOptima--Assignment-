export type ReplayStepId = 'evidence' | 'understand' | 'decide' | 'route' | 'audit';

export type EvidenceItem = {
  id: string;
  name: string;
  detail: string;
  status: 'Complete' | 'Incomplete';
};

export type StructuredFact = {
  id: string;
  label: string;
  value: string;
  source: string;
  reference?: string;
};

export type PolicyRule = {
  id: string;
  rule: string;
  observed?: string;
  result: 'PASS' | 'FAIL' | 'TRIGGERED';
};

export const replaySteps: Array<{ id: ReplayStepId; label: string }> = [
  { id: 'evidence', label: 'Evidence' },
  { id: 'understand', label: 'Understand' },
  { id: 'decide', label: 'Decide' },
  { id: 'route', label: 'Route' },
  { id: 'audit', label: 'Audit' },
];

export const caseData = {
  caseId: 'MSME-2048',
  applicant: 'Asha Stores',
  workflow: 'MSME Working-Capital Loan',
  shortWorkflow: 'MSME Lending',
  requestedAmount: '₹5,00,000',
  received: '10:42 AM, 12 Jun 2024',
  evidence: [
    {
      id: 'E-01',
      name: 'Loan Application.pdf',
      detail: '2 pages',
      status: 'Complete',
    },
    {
      id: 'E-02',
      name: 'Sales Ledger.jpg',
      detail: '1 page',
      status: 'Complete',
    },
    {
      id: 'E-03',
      name: 'Bank Statements',
      detail: 'Only 4 of 6 required months supplied',
      status: 'Incomplete',
    },
  ] satisfies EvidenceItem[],
  facts: [
    {
      id: 'F-01',
      label: 'Average monthly revenue',
      value: '₹82,000',
      source: 'Sales Ledger.jpg, Page 1',
      reference: 'R-03',
    },
    {
      id: 'F-02',
      label: 'Existing monthly obligations',
      value: '₹24,000',
      source: 'Loan Application.pdf, Page 1',
      reference: 'R-04',
    },
    {
      id: 'F-03',
      label: 'Requested amount',
      value: '₹5,00,000',
      source: 'Loan Application.pdf, Page 1',
      reference: 'R-05',
    },
    {
      id: 'F-04',
      label: 'Business type',
      value: 'Retail — General Stores',
      source: 'Loan Application.pdf, Page 1',
      reference: 'R-02',
    },
    {
      id: 'F-05',
      label: 'Bank statements supplied',
      value: '4 of 6',
      source: 'Bank Statements package',
      reference: 'E-03',
    },
  ] satisfies StructuredFact[],
  policyName: 'Illustrative client policy v3.2',
  policyRules: [
    {
      id: 'CR-001',
      rule: 'Revenue ≥ ₹60,000',
      result: 'PASS',
    },
    {
      id: 'CR-008',
      rule: 'Debt-service ratio ≤ 40%',
      observed: '29.3%',
      result: 'PASS',
    },
    {
      id: 'DOC-006',
      rule: 'Six consecutive bank statements required',
      observed: '4 of 6 supplied',
      result: 'FAIL',
    },
    {
      id: 'ESC-002',
      rule: 'Missing mandatory evidence → Human review',
      result: 'TRIGGERED',
    },
  ] satisfies PolicyRule[],
  route: {
    finalRoute: 'ESCALATE',
    supportingText: 'Human review required',
    reason:
      'Mandatory evidence is incomplete. The illustrative client policy requires six consecutive bank statements. Only four were supplied.',
    assignment: 'Senior Credit Reviewer',
    queue: 'Missing Evidence',
    priority: 'Standard',
    statement:
      'No automated approval or rejection was made. Illustrative client policy ESC-002 determined the route.',
  },
  auditEvents: [
    { time: '10:42:01', event: 'Evidence package received', reference: 'CASE-2048' },
    { time: '10:42:02', event: 'Three evidence items classified', reference: 'E-01–E-03' },
    { time: '10:42:03', event: 'Five structured facts recorded', reference: 'F-01–F-05' },
    {
      time: '10:42:04',
      event: 'Illustrative client policy v3.2 executed',
      reference: 'P-3.2',
    },
    { time: '10:42:04', event: 'Rule DOC-006 failed', reference: 'DOC-006' },
    { time: '10:42:05', event: 'Case routed to human review', reference: 'ESC-002' },
  ],
  auditDetail: {
    rule: 'Six consecutive bank statements are required.',
    observedEvidence: '4 of 6 months supplied.',
    effect: 'Triggered human review.',
    relatedEvidence: 'Bank Statements package · E-03',
    relatedPolicy: 'ESC-002',
  },
};
