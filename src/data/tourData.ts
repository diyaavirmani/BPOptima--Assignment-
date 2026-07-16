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
    tooltipTitle: 'Start with safe sample evidence',
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
    tooltipTitle: 'Load synthetic evidence package',
    tooltipBody:
      'Load three fixed synthetic evidence items into the queue. This is a simulated package, not a real upload.',
    placement: 'left',
    expectedAction: 'click',
  },
  {
    id: 'open-document-workbench',
    mainStep: 'evidence',
    subStep: 2,
    screen: 'evidence',
    targetId: 'open-workbench',
    tooltipTitle: 'Open the document workbench',
    tooltipBody:
      'Move from evidence intake into a controlled review surface before structured facts are extracted.',
    placement: 'top',
    expectedAction: 'click',
  },
  {
    id: 'parse-document',
    mainStep: 'understand',
    subStep: 0,
    screen: 'document-workbench',
    targetId: 'document-parse',
    tooltipTitle: 'Turn the document into inspectable structure',
    tooltipBody:
      'BPOptima identifies sections, fields, and tables before decision facts are used by policy.',
    placement: 'bottom',
    expectedAction: 'run',
  },
  {
    id: 'extract-structured-facts',
    mainStep: 'understand',
    subStep: 1,
    screen: 'document-workbench',
    targetId: 'facts-extract',
    tooltipTitle: 'Convert document structure into decision facts',
    tooltipBody:
      'The extracted values remain linked to their synthetic source references.',
    placement: 'bottom',
    expectedAction: 'run',
  },
  {
    id: 'select-revenue-fact',
    mainStep: 'understand',
    subStep: 2,
    screen: 'document-workbench',
    targetId: 'fact-revenue',
    tooltipTitle: 'Inspect where a fact came from',
    tooltipBody:
      'Selecting a fact reveals the related synthetic source region rather than asking the reviewer to trust an unexplained value.',
    placement: 'top',
    expectedAction: 'select',
  },
  {
    id: 'continue-to-policy',
    mainStep: 'understand',
    subStep: 3,
    screen: 'document-workbench',
    targetId: 'continue-policy',
    tooltipTitle: 'Continue to policy',
    tooltipBody:
      'Once evidence and facts are linked, the same tour engine advances into the policy stage.',
    placement: 'left',
    expectedAction: 'continue',
  },
  {
    id: 'review-policy-graph',
    mainStep: 'decide',
    subStep: 0,
    screen: 'policy',
    targetId: 'policy-input-facts',
    tooltipTitle: 'Policy receives structured facts, not raw documents',
    tooltipBody:
      'BPOptima prepares evidence for the client’s deterministic policy layer.',
    placement: 'bottom',
    expectedAction: 'click',
  },
  {
    id: 'run-policy',
    mainStep: 'decide',
    subStep: 1,
    screen: 'policy',
    targetId: 'policy-run',
    tooltipTitle: 'Execute the client-owned policy',
    tooltipBody:
      'The same evidence and the same policy produce the same route.',
    placement: 'bottom',
    expectedAction: 'run',
  },
  {
    id: 'inspect-failed-rule',
    mainStep: 'decide',
    subStep: 2,
    screen: 'policy',
    targetId: 'failed-rule',
    tooltipTitle: 'The route is traceable to one failed requirement',
    tooltipBody:
      'Only four of six required bank statements were supplied, triggering the client’s human-review policy.',
    placement: 'left',
    expectedAction: 'inspect',
  },
  {
    id: 'inspect-escalation-policy',
    mainStep: 'decide',
    subStep: 3,
    screen: 'policy',
    targetId: 'escalation-rule',
    tooltipTitle: 'Inspect the triggered route policy',
    tooltipBody:
      'The failed evidence requirement activates the illustrative client policy for human review.',
    placement: 'left',
    expectedAction: 'inspect',
  },
  {
    id: 'continue-to-route',
    mainStep: 'decide',
    subStep: 4,
    screen: 'policy',
    targetId: 'policy-continue-route',
    tooltipTitle: 'Continue to route',
    tooltipBody:
      'The route can now be inspected with its reviewer assignment and rationale.',
    placement: 'left',
    expectedAction: 'continue',
  },
  {
    id: 'review-escalation',
    mainStep: 'route',
    subStep: 0,
    screen: 'route',
    targetId: 'escalate-result',
    tooltipTitle: 'An exception becomes a human task',
    tooltipBody:
      'The policy does not force an automated answer when mandatory evidence is missing.',
    placement: 'top',
    expectedAction: 'click',
  },
  {
    id: 'route-human-review',
    mainStep: 'route',
    subStep: 1,
    screen: 'route',
    targetId: 'route-human',
    tooltipTitle: 'Preserve human judgment where policy requires it',
    tooltipBody:
      'The system routes the exception with its evidence and policy context attached.',
    placement: 'top',
    expectedAction: 'click',
  },
  {
    id: 'inspect-audit-trail',
    mainStep: 'audit',
    subStep: 0,
    screen: 'audit',
    targetId: 'audit-table',
    tooltipTitle: 'Every step remains inspectable',
    tooltipBody:
      'The record links evidence, structured facts, policy execution, and routing.',
    placement: 'right',
    expectedAction: 'inspect',
  },
  {
    id: 'open-failed-rule-detail',
    mainStep: 'audit',
    subStep: 1,
    screen: 'audit',
    targetId: 'audit-doc-rule',
    tooltipTitle: 'Follow the route back to its cause',
    tooltipBody:
      'The reviewer can inspect the rule, observed evidence, and resulting route.',
    placement: 'left',
    expectedAction: 'inspect',
  },
  {
    id: 'complete-tour',
    mainStep: 'audit',
    subStep: 2,
    screen: 'audit',
    targetId: 'complete-tour',
    tooltipTitle: 'Decision replay complete',
    tooltipBody:
      'The full synthetic decision now links evidence, facts, policy, route, and audit events.',
    placement: 'left',
    expectedAction: 'continue',
  },
];

export function getSubstepCount(mainStep: MainTourStep) {
  return tourScenes.filter((scene) => scene.mainStep === mainStep).length;
}
