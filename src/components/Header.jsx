import GlobeLogo from '../assets/logos/GlobeLogo.png';

export default function Header() {
  return (
    <header className="header">
      <div className="container header-inner">

        <a
          className="brand"
          href="#top"
          aria-label="KSJ Digital home"
        >
          <img
            src={GlobeLogo}
            alt="KSJ Digital"
            className="header-logo"
          />

          <div className="brand-divider" />

          <div className="brand-text">
            <strong>KSJ Digital</strong>
            <small>Websites • Discord • Automation</small>
          </div>
        </a>

        <nav
          className="nav"
          aria-label="Main navigation"
        >
          <a href="#services">Services</a>
          <a href="#projects">Projects</a>
          <a href="#goliath">Goliath</a>
          <a href="#contact">Contact</a>
        </nav>

      </div>
    </header>
  );
}