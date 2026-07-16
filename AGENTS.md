# BPOptima GroundSet Decision Replay

## Project goal

Build a small, high-trust, interactive website prototype for the BPOptima
FDE Trainee take-home assignment.

This is not a complete redesign of bpoptima.com and it is not a recreation
of BPOptima's production software.

The prototype should demonstrate one focused idea:

A visitor can replay one synthetic MSME loan decision from evidence
ingestion to structured facts, deterministic policy execution, human
routing, and an inspectable audit trail.

## Product truth

Use only the following BPOptima product story:

1. GroundSet receives unstructured evidence such as documents, images,
   logs, audio, or video.
2. It converts relevant evidence into structured facts.
3. The client's deterministic policy and business rules control the outcome.
4. A case may be approved, rejected, or escalated to a human.
5. The system records a complete, inspectable audit trail.
6. BPOptima positions the system for regulated enterprise operations.
7. Sensitive processing can occur inside the client's controlled environment.

Do not invent additional production features.

## Prototype positioning

Primary stakeholder:
- Chief Risk Officer

Secondary stakeholder:
- CTO

The prototype must communicate:
- Control
- Determinism
- Evidence traceability
- Human oversight
- Auditability
- Data sensitivity

The prototype must not feel:
- Playful
- Consumer-like
- Experimental
- Magical
- Black-box
- Like a generic AI chatbot

## Reference files

Use these files as visual references only:

- references/01_landing_page.png
- references/02_evidence_and_understand.png
- references/03_decide_policy_execution.png
- references/04_route_human_review.png
- references/05_audit_trail.png

Do not embed these screenshots into the final interface.
Rebuild the interface as accessible HTML, CSS, and React components.

## Technical stack

Use:

- Vite
- React
- TypeScript
- Plain CSS or CSS Modules
- lucide-react for icons if icons are needed
- npm as the package manager

Do not use:

- A backend
- A database
- An AI API
- Real OCR
- Real document upload
- Tailwind
- A full UI component library
- Chart libraries
- Three.js
- WebGL
- Unnecessary dependencies

Use static, synthetic data stored in typed TypeScript objects.

## Page structure

The application has two top-level views:

1. Landing page
2. GroundSet Decision Replay

The Replay contains five visible steps:

1. Evidence
2. Understand
3. Decide
4. Route
5. Audit

The app may use React state instead of a routing library.
Avoid adding React Router unless it is genuinely necessary.

## Landing page requirements

Keep the landing page short.

Include:

- BPOptima text wordmark
- Minimal navigation
- Headline:
  "From evidence to accountable decisions."
- Supporting sentence:
  "GroundSet turns messy evidence into structured facts, applies
  client-owned policy, routes decisions, and records a full audit trail."
- Primary CTA:
  "Replay a synthetic decision"
- Secondary CTA:
  "See how GroundSet works"
- Small five-step Decision Replay preview
- Three trust principles:
  - Deterministic policy execution
  - Human-in-the-loop routing
  - Private deployment inside the client environment
- Clear "Synthetic demo" label

Do not build a long marketing homepage.
Do not add fake customer logos, testimonials, metrics, pricing, blog cards,
or feature bento grids.

## Synthetic case data

Use exactly one case:

Case ID:
MSME-2048

Applicant:
Asha Stores

Workflow:
MSME Working-Capital Loan

Requested amount:
₹5,00,000

Received:
10:42 AM, 12 Jun 2024

Evidence:

1. Loan Application.pdf
   - 2 pages
   - Complete

2. Sales Ledger.jpg
   - 1 page
   - Complete

3. Bank Statements
   - Only 4 of 6 required months supplied
   - Incomplete

Do not add a missing ITR document.
The only missing-evidence issue must be the incomplete bank-statement set.

## Structured facts

Show these facts:

1. Average monthly revenue
   - ₹82,000
   - Source: Sales Ledger.jpg, Page 1
   - Evidence reference: R-03

2. Existing monthly obligations
   - ₹24,000
   - Source: Loan Application.pdf, Page 1
   - Evidence reference: R-04

3. Requested loan amount
   - ₹5,00,000
   - Source: Loan Application.pdf, Page 1

4. Business type
   - Retail — General Stores
   - Source: Loan Application.pdf, Page 1

5. Bank statements provided
   - 4 of 6 months
   - Source: Bank Statements package

The source-highlight interaction is illustrative.
Display the label:
"Illustrative evidence reference"

## Policy data

Display:
"Illustrative client policy v3.2"

Rules:

CR-001
- Average monthly revenue ≥ ₹60,000
- Result: PASS

CR-008
- Debt-service ratio ≤ 40%
- Observed result: 29.3%
- Result: PASS

DOC-006
- Six consecutive bank statements required
- Observed result: 4 of 6 supplied
- Result: FAIL

ESC-002
- Missing mandatory evidence → Human review
- Result: TRIGGERED

Display the message:
"Same evidence + same policy = same route."

The visitor must not be able to edit production-looking rules.
This is a replay, not a rules-builder product.

## Routing result

Final route:
ESCALATE

Supporting text:
"Human review required"

Reason:
"Mandatory evidence is incomplete. The illustrative client policy requires
six consecutive bank statements. Only four were supplied."

Assignment:
- Senior Credit Reviewer
- Queue: Missing Evidence
- Priority: Standard

Do not include an SLA unless it is explicitly labelled synthetic.

Always display this statement:

"GroundSet did not independently approve or reject this application.
Illustrative client policy ESC-002 determined the route."

## Audit data

Use this chronological audit trail:

10:42:01
- Evidence package received
- Reference: CASE-2048

10:42:02
- Three evidence items classified
- Reference: E-01–E-03

10:42:03
- Five structured facts recorded
- Reference: F-01–F-05

10:42:04
- Illustrative client policy v3.2 executed
- Reference: P-3.2

10:42:04
- Rule DOC-006 failed
- Reference: DOC-006

10:42:05
- Case routed to human review
- Reference: ESC-002

When the user selects "Rule DOC-006 failed", show:

- Rule:
  Six consecutive bank statements are required.
- Observed evidence:
  4 of 6 months supplied.
- Effect:
  Triggered human review.
- Related evidence:
  Bank Statements package · E-03
- Related policy:
  ESC-002

## Required interactions

Landing:
- Primary CTA starts the Decision Replay.

Evidence:
- Display three evidence items.
- Button: "Extract structured facts"

Understand:
- After the extraction action, transition to the Understand step.
- Reveal the facts progressively.
- Selecting a fact highlights its corresponding synthetic document region.
- Show a source explanation.

Decide:
- Display a simple three-node flow:
  Structured Facts → Client Policy → Route Pending
- Reveal the four policy results in order.
- Button: "Route decision"

Route:
- Show the escalation result and reason.
- Show the human-review assignment.
- Button: "View audit trail"

Audit:
- Display the event table.
- Selecting DOC-006 displays its detailed explanation.
- Button: "Replay decision"
- Replaying resets all application state.

## Animation principles

Use motion only to explain state changes.

Allowed animations:

1. Evidence cards entering
2. Facts appearing after extraction
3. Selected source region being highlighted
4. Connector line drawing between decision nodes
5. Rules revealing sequentially
6. Route moving toward the human-review queue

Rules:

- Duration: approximately 180–350 ms
- One meaningful animation at a time
- No infinite animation
- No particles
- No 3D
- No floating objects
- No decorative loading sequence
- Respect prefers-reduced-motion

## Visual system

Aim for the restraint of GoRules and the focused motion of the Vercel
product tour.

Use:

- White or warm off-white background
- Dark navy text
- One controlled violet accent
- Light grey borders
- Muted green for PASS
- Muted amber/orange for escalation
- Small red accent only for a failed rule
- 8–10 px corner radii
- Very subtle shadows
- Generous whitespace
- One clear primary action per screen
- System sans-serif or Inter-style font stack

Suggested tokens:

--color-background: #F8F9FC
--color-surface: #FFFFFF
--color-text: #11172F
--color-muted: #667085
--color-border: #E4E7EF
--color-accent: #4938E8
--color-pass: #178A57
--color-warning: #D96816
--color-fail: #D84B3E

Do not use:

- Glassmorphism
- Neon colours
- Large gradients
- Giant rounded cards
- Heavy shadows
- Busy dashboards
- Decorative AI orbs
- Fake graphs
- Fake confidence scores
- Confetti
- Stock photographs

## Functional honesty

Remove or do not include controls that do nothing.

Do not show:

- Download Summary, unless it actually downloads a simple generated text file
- Privacy dropdown, unless it opens useful content
- View Case Info, unless it opens a real panel
- Search
- Notifications
- Profile menus
- Upload controls
- Chatbot controls

Every visible button must perform a meaningful action.

## Accessibility

- Use semantic buttons and headings.
- Support keyboard interaction.
- Provide visible focus states.
- Use aria-current for the active step.
- Ensure status is not communicated by colour alone.
- Use accessible labels for icons.
- Keep contrast suitable for enterprise use.
- Respect prefers-reduced-motion.

## Responsiveness

Priority:
- Desktop width around 1440 px

Also ensure:
- The experience remains usable on tablet.
- On mobile, the two-column layouts stack vertically.
- The stepper may become horizontally scrollable or compact.
- No content should overflow at 390 px width.

## Required documentation

Create:

1. README.md
   - Project purpose
   - Setup commands
   - Build commands
   - Prototype limitations
   - Deployment instructions

2. DESIGN_RATIONALE.md
   - The three researched ideas
   - Selected idea
   - Primary stakeholder
   - Secondary stakeholder
   - Trust rationale
   - Sacrifices
   - Rejected concepts
   - Reference websites

3. LOOM_SCRIPT.md
   - A structured 5–7 minute walkthrough

## Quality checks

Before declaring the task complete:

- Run npm install
- Run npm run build
- Run the linter if configured
- Verify there are no TypeScript errors
- Verify there are no browser-console errors
- Verify every visible button works
- Verify all screens use consistent synthetic data
- Verify no real upload or external API call exists
- Verify mobile layout at approximately 390 px
- Verify desktop layout at approximately 1440 px
- Compare the implementation against all five reference images
- Fix content inconsistencies rather than copying them

## Definition of done

The project is done when:

- The visitor can complete the full replay without explanation.
- The outcome can be traced to evidence and policy.
- The design feels restrained and enterprise-grade.
- The prototype clearly identifies synthetic and illustrative content.
- The experience does not imply unsupported BPOptima capabilities.
- The build passes.
- The README, design rationale and Loom script are complete.