# BPOptima Decision Replay

A focused, interactive frontend prototype created for the BPOptima FDE Trainee take-home assignment.

The experience demonstrates how one synthetic MSME loan application moves from unstructured evidence to structured facts, deterministic client policy, human review, and a complete audit trail.

Important: this is a conceptual prototype based on BPOptima's publicly described product story. It is not BPOptima's production interface and does not process real customer data.

## Live Links

- Live prototype: https://bpoptima-assignment.onrender.com
- Walkthrough: https://youtu.be/Z4nPt4dgIas

## The Problem

Enterprise systems record transactions, customers, and money, but the reasoning behind important operational decisions is often fragmented or difficult to audit.

BPOptima's product story describes infrastructure that:

1. Reads evidence such as documents, images, audio, and video.
2. Converts evidence into structured facts.
3. Applies the client's deterministic business rules.
4. Routes a case to approve, reject, or human review.
5. Records a complete audit trail.

The assignment asks how an AI-era website can make that invisible workflow tangible without weakening a risk officer's trust.

## What I Built

### 1. BPOptima Decision Replay

A Vercel-inspired, self-guided product tour following one synthetic case:

```text
Evidence received
  -> Facts extracted
  -> Client-owned policy executed
  -> Case routed to human review
  -> Complete audit trail displayed
```

### 2. Evidence and Parsing Workbench

- Synthetic evidence package
- Parse before Extract
- Document regions highlighted
- Five structured decision facts
- Fact-to-source verification
- No real document upload

### 3. Read-Only Policy Execution

- `CR-001` - Revenue rule - `PASS`
- `CR-008` - Debt-service rule - `PASS`
- `DOC-006` - Required evidence rule - `FAIL`
- `ESC-002` - Human-review policy - `TRIGGERED`

The interface does not allow unrestricted production-rule editing.

### 4. Human Routing and Audit Trail

The case is routed to a human because mandatory evidence is incomplete. The final record connects:

```text
Evidence -> Fact -> Policy -> Route -> Audit
```

### 5. Decision Control Center

A compact synthetic dashboard showing processed cases, routing rates, human-review queue, outcome mix, escalation triggers, and decision records with audit status.

## Synthetic Case

| Field | Value |
|---|---|
| Applicant | Asha Stores |
| Case ID | MSME-2048 |
| Workflow | MSME Working-Capital Loan |
| Requested amount | INR 5,00,000 |
| Average monthly revenue | INR 82,000 |
| Existing monthly obligations | INR 24,000 |
| Bank statements supplied | 4 of 6 |
| Final route | Human review required |

### Policy Result

| Rule | Condition | Result |
|---|---|---|
| CR-001 | Revenue >= INR 60,000 | PASS |
| CR-008 | Debt-service ratio <= 40% | PASS - 29.3% |
| DOC-006 | Six consecutive bank statements required | FAIL - 4 of 6 |
| ESC-002 | Missing mandatory evidence -> Human review | TRIGGERED |

## Research Directions

### Idea 1 - BPOptima Decision Replay

Reference: Rossum Interactive Demo

Why it fits: a guided product-like experience makes the evidence-to-audit story visible instead of relying only on static marketing text.

Decision: selected as the primary prototype.

### Idea 2 - Grounded Evidence Explorer

Reference: LandingAI Visual Grounding

Why it fits: a reviewer can inspect where an extracted fact came from rather than trusting an unexplained value.

Decision: its strongest interaction was included inside Decision Replay.

### Idea 3 - Policy Visibility

Reference: GoRules JDM Editor

Why it fits: it makes deterministic, client-controlled decision logic visible.

Decision: a safer read-only execution view was used instead of a full editable rules builder.

Supporting references:

- Vercel Product Tour: guided hotspot, tooltip, progress, and user-paced interaction mechanics.
- Taktile Decision Engine: restrained enterprise decision-orchestration presentation.

## Stakeholder Focus

Primary stakeholder: Chief Risk Officer.

The prototype emphasizes evidence traceability, deterministic policy, human oversight, explainable routing, auditability, and controlled synthetic data.

Secondary stakeholder: CTO.

The experience communicates separation between evidence processing, structured facts, policy execution, human routing, and audit records.

## Trust Guardrails

- Synthetic data only
- Illustrative client policy
- No real customer document upload
- No live OCR or underwriting
- No open-ended AI decision
- No unsupported model-accuracy claim
- No claim that AI independently approved or rejected the application
- Human review remains visible
- Every route is linked to evidence and policy

## What This Prototype Intentionally Does Not Prove

- BPOptima production extraction accuracy
- BPOptima's real production interface
- Live integrations
- Client deployment architecture
- Model performance or latency
- Real underwriting outcomes
- Production security controls
- Actual customer volumes or business KPIs

## Tech Stack

- React
- TypeScript
- Vite
- CSS
- Static typed synthetic data
- Vercel for deployment

No backend, database, authentication, AI API, or real document upload is required.

## Project Structure

```text
src/
  components/
    Header.tsx
    HeroAnimation.tsx
    ProductTour.tsx
    TourTooltip.tsx
    DecisionDashboard.tsx
    DecisionDetailDrawer.tsx
  data/
    caseData.ts
    dashboardData.ts
    tourData.ts
  App.tsx
  main.tsx
  styles.css
public/
  assets/
    synthetic-store.svg
```

## Run Locally

Prerequisites:

- Node.js
- npm

Install dependencies:

```bash
npm ci
```

Development:

```bash
npm run dev
```

Open the local URL shown by Vite.

Type check:

```bash
npm run typecheck
```

Production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Note: this project does not currently configure a `lint` script.

## Deploy to Vercel

1. Push the repository to GitHub.
2. Open Vercel and select Add New -> Project.
3. Import the GitHub repository.
4. Confirm the detected framework is Vite.
5. Use:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: default or `npm ci`
6. Deploy the project.
7. Open the generated URL in an incognito window and test the complete flow.

The app currently uses React state on `/`, so a Vercel rewrite is not required unless route-based URLs are added later.

## Final Verification Checklist

Before submission:

- [ ] Production build succeeds
- [ ] Landing page opens without console errors
- [ ] Replay CTA opens the product-tour gate
- [ ] Start Product Demo works
- [ ] Parse occurs before Extract
- [ ] INR 82,000 source verification works
- [ ] Policy executes in the correct order
- [ ] DOC-006 triggers ESC-002
- [ ] Final route is Human review required
- [ ] Audit trail contains six consistent events
- [ ] Dashboard filters and decision drawer work
- [ ] MSME-2048 can reopen the existing replay
- [ ] Back, Restart, Exit, and Escape work
- [ ] No dead navigation link remains
- [ ] No debug widget or Codex overlay is visible
- [ ] No mojibake or corrupted currency symbols appear
- [ ] No reference screenshot is bundled in production
- [ ] Mobile layout works around 390 px
- [ ] Public Vercel URL opens without authentication

## Assignment Deliverables

- Prototype: Add Vercel URL
- Screen recording: Add Loom or Vimeo URL
- Email subject: `FDE Assignment, Diya Virmani`

## Author

Diya Virmani

Built as an FDE Trainee take-home prototype for BPOptima.
