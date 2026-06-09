const services = [
  ['Website Design and Development', 'Fast, responsive websites for businesses, creators, communities, and growing online brands.'],
  ['Discord Systems and Bots', 'Custom Discord bots, moderation tools, ticket systems, forms, panels, and automation flows.'],
  ['Dashboards and Portals', 'Clean admin panels, client portals, internal tools, and hosted management systems.'],
  ['Branding and Digital Assets', 'Logo direction, visual identity, creator graphics, banners, icons, and web-ready assets.'],
  ['Hosting and Infrastructure', 'VPS-ready deployment workflows, HTTPS setup, GitHub updates, and scalable foundations.'],
  ['Creator and Community Tools', 'Streaming pages, community hubs, media sections, link hubs, and content integrations.'],
];

const projects = [
  ['KSJ Goliath', 'Discord bot and dashboard', 'Moderation, tickets, forms, security, embeds, backups, analytics, and admin tools.'],
  ['TwoToneTaj', 'Creator website', 'A branded creator website with custom pages, media features, community links, and future shop direction.'],
  ['KSJ Digital', 'Business platform', 'The parent brand for websites, hosting, automation, dashboards, support, and future client systems.'],
];

const trustPoints = ['UK Based', 'VPS Hosted', 'GitHub Managed', 'HTTPS Ready', 'Custom Built', 'Support Focused'];

export default function Home() {
  return (
    <>
      <section className="home-hero">
        <div className="home-hero-content">
          <p className="eyebrow">Build. Automate. Scale.</p>
          <h1>Digital solutions built properly for brands, creators, and communities.</h1>
          <p>
            KSJ Digital builds websites, Discord systems, dashboards, branding assets,
            automation tools, and hosted platforms with a clean professional foundation.
          </p>
          <div className="hero-actions">
            <a className="btn primary" href="#contact">Start a Project</a>
            <a className="btn secondary" href="#projects">View Projects</a>
          </div>
        </div>

        <aside className="home-hero-card">
          <span>KSJ Digital</span>
          <h2>Websites · Bots · Dashboards · Hosting</h2>
          <p>Built as the centre of the KSJ ecosystem and future client platform.</p>
        </aside>
      </section>

      <section className="trust-strip" aria-label="KSJ Digital trust points">
        {trustPoints.map((point) => (
          <span key={point}>{point}</span>
        ))}
      </section>

      <section id="services" className="section">
        <div className="section-heading">
          <p className="eyebrow">What we build</p>
          <h2>Services</h2>
        </div>
        <div className="card-grid three">
          {services.map(([title, description]) => (
            <article className="glass-card" key={title}>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="projects" className="section">
        <div className="section-heading">
          <p className="eyebrow">Proof of work</p>
          <h2>Featured Projects</h2>
        </div>
        <div className="card-grid three">
          {projects.map(([title, type, description]) => (
            <article className="project-card" key={title}>
              <span>{type}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="goliath" className="section split-section">
        <div>
          <p className="eyebrow">Flagship system</p>
          <h2>KSJ Goliath</h2>
          <p>
            Goliath is the long-term Discord bot and dashboard platform under KSJ Digital,
            covering moderation, tickets, forms, security tools, server recovery, analytics,
            and client-controlled community systems.
          </p>
        </div>
        <div className="feature-panel">
          <span>Planned platform</span>
          <strong>goliath.ksjdigital.co.uk</strong>
          <small>Dashboard · Bot · API · Community tools</small>
        </div>
      </section>

      <section id="contact" className="section contact-panel">
        <p className="eyebrow">Next step</p>
        <h2>Ready to build something properly?</h2>
        <p>KSJ Digital is currently being shaped into a professional services hub and client platform.</p>
        <a className="btn primary" href="mailto:ksj@ksjdigital.co.uk">Contact KSJ Digital</a>
      </section>
    </>
  );
}
