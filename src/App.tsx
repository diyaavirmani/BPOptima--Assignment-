import { ArrowRight, ClipboardCheck, Landmark, ShieldCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import DecisionDashboard from './components/DecisionDashboard';
import Header from './components/Header';
import HeroAnimation from './components/HeroAnimation';
import ProductTour from './components/ProductTour';

type Theme = 'light' | 'dark';
type View = 'landing' | 'tour' | 'dashboard';

const useCaseCards = [
  {
    title: 'Credit Decisions',
    body: 'Assess risk, apply policy, and document rationales with a complete audit trail.',
    icon: Landmark,
  },
  {
    title: 'Claims Review',
    body: 'Standardize intake, evaluate coverage, and route exceptions with transparency.',
    icon: ShieldCheck,
  },
  {
    title: 'Compliance Checks',
    body: 'Run consistent checks, capture evidence, and prove compliance with ease.',
    icon: ClipboardCheck,
  },
];

const heroMetrics = [
  {
    value: '~99%',
    label: 'Decision Accuracy',
  },
  {
    value: '<100ms',
    label: 'End-to-End Latency',
  },
  {
    value: 'Zero',
    label: 'Data Leakage',
  },
];

const replayStages = [
  {
    number: '01',
    title: 'Evidence received',
    description:
      'A loan application, sales ledger, and four of six required bank statements enter the workflow.',
  },
  {
    number: '02',
    title: 'Facts extracted',
    description:
      'Revenue, obligations, requested amount, and missing evidence become structured decision facts.',
  },
  {
    number: '03',
    title: 'Policy executed',
    description:
      'Illustrative client-owned rules evaluate the same facts consistently and return PASS, FAIL, or TRIGGERED.',
  },
  {
    number: '04',
    title: 'Human review',
    description:
      'Incomplete mandatory evidence routes the case to a Senior Credit Reviewer.',
  },
  {
    number: '05',
    title: 'Audit recorded',
    description:
      'Every evidence item, extracted fact, policy rule, and route remains inspectable.',
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
        onOpenDashboard={openDashboard}
        onScrollToHow={scrollToHowItWorks}
      />

      <main id="top">
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-copy">
            <h1 id="hero-title">
              <span>From evidence to</span>
              <span className="headline-accent">accountable decisions.</span>
            </h1>
            <p>
              BPOptima uses GroundSet to structure evidence, apply
              client-owned policy, route exceptions to people, and record every
              step.
            </p>
            <dl className="hero-metrics" aria-label="BPOptima performance highlights">
              {heroMetrics.map((metric) => (
                <div className="hero-metric" key={metric.label}>
                  <dt>{metric.label}</dt>
                  <dd>{metric.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <HeroAnimation />
        </section>

        <section className="use-case-section" aria-labelledby="use-case-title">
          <h2 id="use-case-title">Why teams use BPOptima</h2>
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

        <HowItWorksSection onReplay={openProductTour} />
      </main>
    </div>
  );
}

export default App;
