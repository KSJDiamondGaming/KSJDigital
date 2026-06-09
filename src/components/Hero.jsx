export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <p className="eyebrow">Digital systems for modern brands</p>
        <h1>Websites, branding, communities & automation — built properly.</h1>
        <p className="hero-text">
          KSJ Digital builds clean websites, Discord communities, visual branding,
          and automation systems for creators, businesses, streamers, and online brands.
        </p>

        <div className="hero-actions">
          <a className="btn primary" href="#contact">Start a Project</a>
          <a className="btn secondary" href="#services">View Services</a>
        </div>
      </div>

      <div className="hero-panel">
        <div className="panel-top">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <h3>KSJ Digital</h3>
        <p>Websites · Bots · Branding · Discord · Hosting</p>

        <div className="status-card">
          <strong>Platform-ready setup</strong>
          <small>Built to scale from local projects to hosted systems.</small>
        </div>
      </div>
    </section>
  );
}