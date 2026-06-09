export default function Services({ services }) {
  return (
    <section id="services" className="section">
      <div className="section-heading">
        <p className="eyebrow">What we build</p>
        <h2>Services</h2>
      </div>

      <div className="grid">
        {services.map((service) => (
          <article className="card" key={service._id || service.title}>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}