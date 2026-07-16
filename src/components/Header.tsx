import { Moon, Sun } from 'lucide-react';

type Theme = 'light' | 'dark';

type HeaderProps = {
  theme: Theme;
  onToggleTheme: () => void;
  onOpenTour: () => void;
  onOpenDashboard: () => void;
  onScrollToHow: () => void;
};

function Header({
  theme,
  onToggleTheme,
  onOpenTour,
  onOpenDashboard,
  onScrollToHow,
}: HeaderProps) {
  const isDark = theme === 'dark';

  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="BPOptima home">
          <span className="brand-mark" aria-hidden="true">
            <span className="brand-dot brand-dot-one" />
            <span className="brand-dot brand-dot-two" />
            <span className="brand-dot brand-dot-three" />
            <span className="brand-core" />
          </span>
          <span>BPOptima</span>
        </a>

        <div className="nav-links">
          <button className="nav-link-button" type="button" onClick={onScrollToHow}>
            How it works
          </button>
          <button className="nav-link-button" type="button" onClick={onOpenTour}>
            Decision replay
          </button>
          <button className="nav-link-button" type="button" onClick={onOpenDashboard}>
            Decision dashboard
          </button>
        </div>

        <div className="nav-actions">
          <button
            className="theme-toggle"
            type="button"
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            onClick={onToggleTheme}
            title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button className="demo-button" type="button" onClick={onOpenTour}>
            Replay demo
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Header;
