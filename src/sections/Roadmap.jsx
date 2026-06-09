const roadmapItems = [
  'KSJ Digital business website',
  'Client portal foundation',
  'Goliath dashboard integration',
  'Support centre and knowledge base',
];

export default function Roadmap() {
  return (
    <section id="roadmap" className="section">
      <div className="section-heading">
        <p className="eyebrow">Development roadmap</p>
        <h2>The KSJ ecosystem is being built in stages.</h2>
      </div>

      <div className="grid">
        {roadmapItems.map((item) => (
          <article className="card" key={item}>
            <h3>{item}</h3>
            <p>Planned as part of the wider KSJ Digital platform.</p>
          </article>
        ))}
      </div>
    </section>
  );
}
