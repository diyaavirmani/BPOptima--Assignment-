import { ArrowRight, ClipboardCheck, Landmark, ShieldCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import DecisionDashboard from './components/DecisionDashboard';
import DecisionFlowPreview from './components/DecisionFlowPreview';
import Header from './components/Header';
import ProductTour from './components/ProductTour';

type Theme = 'light' | 'dark';
type View = 'landing' | 'tour' | 'dashboard';

const useCaseCards = [
  {
    title: 'Credit Decisions',
    body:
      'Convert application evidence into policy-controlled approval, rejection, or human review.',
    icon: Landmark,
  },
  {
    title: 'Claims Review',
    body:
      'Check submitted evidence and route coverage or fraud exceptions to adjusters.',
    icon: ShieldCheck,
  },
  {
    title: 'Compliance Checks',
    body:
      'Apply consistent screening rules and send true exceptions to analysts.',
    icon: ClipboardCheck,
  },
];

const trustPrinciples = [
  {
    title: 'Client-owned rules',
    body: 'The policy controls the route, not an open-ended AI response.',
  },
  {
    title: 'Human judgment',
    body: 'Exceptions remain with qualified reviewers.',
  },
  {
    title: 'Complete traceability',
    body: 'Evidence, facts, rules and routes stay connected.',
  },
];

const replayStages = [
  {
    number: '01',
    title: 'Evidence received',
    description:
      'A loan application, ledger and incomplete statement package enter the workflow.',
  },
  {
    number: '02',
    title: 'Facts extracted',
    description:
      'Relevant information becomes structured decision facts.',
  },
  {
    number: '03',
    title: 'Policy executed',
    description:
      'Client-owned rules evaluate the same facts consistently.',
  },
  {
    number: '04',
    title: 'Human review',
    description:
      'Missing mandatory evidence sends the case to a qualified reviewer.',
  },
  {
    number: '05',
    title: 'Audit recorded',
    description:
      'Evidence, facts, rules and routes remain connected.',
  },
];

function getInitialTheme(): Theme {
  const storedTheme = window.localStorage.getItem('bpoptima-theme');

  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

type HowItWorksSectionProps = {
  onReplay: () => void;
};

function HowItWorksSection({ onReplay }: HowItWorksSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return undefined;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: [0, 0.2, 0.4] },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={`how-section ${isVisible ? 'is-visible' : ''}`}
      id="how-it-works"
      ref={sectionRef}
      aria-labelledby="how-title"
    >
      <div className="how-inner">
        <div className="how-intro">
          <div className="how-heading-group">
            <span className="section-label">HOW IT WORKS</span>
            <h2 id="how-title">
              See how evidence becomes an accountable decision.
            </h2>
          </div>
          <p className="how-intro-text">
            GroundSet structures the evidence; the client's deterministic
            policy controls the route.
          </p>
        </div>

        <ol className="how-steps" aria-label="Decision Replay stages">
          {replayStages.map((stage) => (
            <li className="how-step" key={stage.number}>
              <span className="how-step-number" aria-label={`Step ${stage.number}`}>
                {stage.number}
              </span>
              <div>
                <h3>{stage.title}</h3>
                <p>{stage.description}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="how-actions">
          <button className="primary-button how-cta" type="button" onClick={onReplay}>
            Replay the decision
          </button>
          <p>
            Synthetic data only · Illustrative client policy · No real customer
            information
          </p>
        </div>
      </div>
    </section>
  );
}

function UseCasesSection() {
  return (
    <section className="use-case-section" id="use-cases" aria-labelledby="use-case-title">
      <h2 id="use-case-title">One decision system. Different client policies.</h2>
      <div className="use-case-grid">
        {useCaseCards.map(({ title, body, icon: Icon }) => (
          <article className="use-case-card" key={title}>
            <span className="use-case-icon" aria-hidden="true">
              <Icon size={34} strokeWidth={1.8} />
            </span>
            <div>
              <h3>{title}</h3>
              <p>{body}</p>
              <a href="#how-it-works">
                Learn more
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section className="trust-section" aria-labelledby="trust-title">
      <div className="trust-inner">
        <span className="section-label">TRUST PRINCIPLES</span>
        <h2 id="trust-title">Designed for decisions that need a record.</h2>
        <div className="trust-grid">
          {trustPrinciples.map((principle) => (
            <article className="trust-card" key={principle.title}>
              <h3>{principle.title}</h3>
              <p>{principle.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalReplayCta({ onReplay }: { onReplay: () => void }) {
  return (
    <section className="final-replay-section" aria-labelledby="final-replay-title">
      <div className="final-replay-inner">
        <span className="section-label">DECISION REPLAY</span>
        <h2 id="final-replay-title">Replay the synthetic decision end to end.</h2>
        <p>
          Follow Asha Stores from evidence intake through facts, client policy,
          human review and audit.
        </p>
        <button className="primary-button" type="button" onClick={onReplay}>
          Replay a synthetic decision
        </button>
      </div>
    </section>
  );
}

function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [view, setView] = useState<View>('landing');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('bpoptima-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
  };

  const showLanding = () => {
    setView('landing');
  };

  const openProductTour = () => {
    setView('tour');
  };

  const openDashboard = () => {
    setView('dashboard');
  };

  const scrollToHowItWorks = () => {
    const target = document.getElementById('how-it-works');
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    target?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  const scrollToUseCases = () => {
    const target = document.getElementById('use-cases');
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    target?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  if (view === 'tour') {
    return <ProductTour onExit={showLanding} onOpenDashboard={openDashboard} />;
  }

  if (view === 'dashboard') {
    return (
      <DecisionDashboard
        onBackToLanding={showLanding}
        onReplayDecision={openProductTour}
      />
    );
  }

  return (
    <div className="app-shell">
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenTour={openProductTour}
        onScrollToHow={scrollToHowItWorks}
        onScrollToUseCases={scrollToUseCases}
      />

      <main id="top">
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-copy">
            <span className="hero-eyebrow">DECISION INFRASTRUCTURE FOR REGULATED OPERATIONS</span>
            <h1 id="hero-title">
              Turn messy evidence into decisions you can defend.
            </h1>
            <p>
              BPOptima reads documents and images, converts them into structured
              facts, applies your deterministic rules, routes exceptions to
              people, and records every step.
            </p>
            <div className="hero-actions">
              <button className="primary-button" type="button" onClick={openProductTour}>
                Replay a synthetic decision
              </button>
              <button className="secondary-button" type="button" onClick={scrollToHowItWorks}>
                See the 5-step flow
              </button>
            </div>
            <p className="hero-trust-line">
              Synthetic demo · Client-owned policy · Human review · Full audit trail
            </p>
          </div>
        </section>

        <DecisionFlowPreview />
        <HowItWorksSection onReplay={openProductTour} />
        <UseCasesSection />
        <TrustSection />
        <FinalReplayCta onReplay={openProductTour} />
      </main>
    </div>
  );
}

export default App;
