const infrastructurePoints = [
  'Live VPS hosting foundation',
  'HTTPS-ready deployment flow',
  'GitHub based update workflow',
  'Scalable structure for future client systems',
];

export default function Infrastructure() {
  return (
    <section id="infrastructure" className="section split">
      <div>
        <p className="eyebrow">Professional foundation</p>
        <h2>Built on real infrastructure.</h2>
        <p>
          KSJ Digital is being built around live hosting, clean deployment habits,
          scalable project structure, and systems that can grow from simple sites
          into dashboards, portals, and automation platforms.
        </p>
      </div>

      <div className="system-box">
        <span>Infrastructure ready</span>
        <strong>Hosting · Deployments · Systems</strong>
        <small>Designed for websites, bots, dashboards, and client-facing tools.</small>
        <ul className="system-list">
          {infrastructurePoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
