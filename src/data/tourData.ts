export type MainTourStep = 'evidence' | 'understand' | 'decide' | 'route' | 'audit';

export type TourScreen =
  | 'evidence'
  | 'document-workbench'
  | 'policy'
  | 'route'
  | 'audit';

export type TourPlacement = 'top' | 'right' | 'bottom' | 'left';

export type TourExpectedAction =
  | 'click'
  | 'select'
  | 'run'
  | 'inspect'
  | 'continue';

export type TourScene = {
  id: string;
  mainStep: MainTourStep;
  subStep: number;
  screen: TourScreen;
  targetId: string;
  tooltipTitle: string;
  tooltipBody: string;
  placement: TourPlacement;
  expectedAction: TourExpectedAction;
};

export const mainTourSteps: Array<{ id: MainTourStep; label: string }> = [
  { id: 'evidence', label: 'Evidence' },
  { id: 'understand', label: 'Understand' },
  { id: 'decide', label: 'Decide' },
  { id: 'route', label: 'Route' },
  { id: 'audit', label: 'Audit' },
];

export const tourScenes: TourScene[] = [
  {
    id: 'select-synthetic-case',
    mainStep: 'evidence',
    subStep: 0,
    screen: 'evidence',
    targetId: 'case-select',
    tooltipTitle: 'Select synthetic case',
    tooltipBody:
      'This replay uses a fixed synthetic application. No real customer data is uploaded or processed.',
    placement: 'right',
    expectedAction: 'click',
  },
  {
    id: 'load-evidence',
    mainStep: 'evidence',
    subStep: 1,
    screen: 'evidence',
    targetId: 'evidence-load',
    tooltipTitle: 'Load evidence',
    tooltipBody:
      'Load three fixed evidence items: a loan application, sales ledger, and incomplete bank-statement package.',
    placement: 'left',
    expectedAction: 'click',
  },
  {
    id: 'parse-document',
    mainStep: 'understand',
    subStep: 0,
    screen: 'document-workbench',
    targetId: 'document-parse',
    tooltipTitle: 'Parse document',
    tooltipBody:
      'The workbench identifies sections, fields, and tables before decision facts are extracted.',
    placement: 'bottom',
    expectedAction: 'run',
  },
  {
    id: 'extract-structured-facts',
    mainStep: 'understand',
    subStep: 1,
    screen: 'document-workbench',
    targetId: 'facts-extract',
    tooltipTitle: 'Extract structured facts',
    tooltipBody:
      'Five decision facts are extracted and remain linked to their synthetic source references.',
    placement: 'bottom',
    expectedAction: 'run',
  },
  {
    id: 'select-revenue-fact',
    mainStep: 'understand',
    subStep: 2,
    screen: 'document-workbench',
    targetId: 'fact-revenue',
    tooltipTitle: 'Verify the ₹82,000 source',
    tooltipBody:
      'Selecting the revenue fact highlights the related synthetic source region instead of asking the reviewer to trust an unexplained value.',
    placement: 'top',
    expectedAction: 'select',
  },
  {
    id: 'run-policy',
    mainStep: 'decide',
    subStep: 0,
    screen: 'policy',
    targetId: 'policy-run',
    tooltipTitle: 'Run client policy',
    tooltipBody:
      'The same evidence and the same deterministic client policy produce the same route.',
    placement: 'bottom',
    expectedAction: 'run',
  },
  {
    id: 'inspect-failed-rule',
    mainStep: 'decide',
    subStep: 1,
    screen: 'policy',
    targetId: 'failed-rule',
    tooltipTitle: 'Inspect DOC-006 failure',
    tooltipBody:
      'Only four of six required bank statements were supplied, triggering the client-owned human-review policy.',
    placement: 'left',
    expectedAction: 'inspect',
  },
  {
    id: 'route-human-review',
    mainStep: 'route',
    subStep: 0,
    screen: 'route',
    targetId: 'route-human',
    tooltipTitle: 'Route to human review',
    tooltipBody:
      'The exception is routed with its evidence and policy context attached.',
    placement: 'top',
    expectedAction: 'click',
  },
  {
    id: 'open-failed-rule-detail',
    mainStep: 'audit',
    subStep: 0,
    screen: 'audit',
    targetId: 'audit-doc-rule',
    tooltipTitle: 'Inspect failed audit event',
    tooltipBody:
      'The reviewer can inspect the rule, observed evidence, and resulting route.',
    placement: 'left',
    expectedAction: 'inspect',
  },
  {
    id: 'complete-tour',
    mainStep: 'audit',
    subStep: 1,
    screen: 'audit',
    targetId: 'complete-tour',
    tooltipTitle: 'Complete replay',
    tooltipBody:
      'The full synthetic decision now links evidence, facts, policy, route, and audit events.',
    placement: 'left',
    expectedAction: 'continue',
  },
];

export function getSubstepCount(mainStep: MainTourStep) {
  return tourScenes.filter((scene) => scene.mainStep === mainStep).length;
}
