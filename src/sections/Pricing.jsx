const pricingTiers = [
  {
    title: 'Starter Site',
    price: 'From 150 GBP',
    items: ['One-page landing site', 'Responsive design', 'Basic contact links'],
  },
  {
    title: 'Creator Setup',
    price: 'From 250 GBP',
    items: ['Creator website', 'Social links', 'Stream-ready branding blocks'],
  },
  {
    title: 'Custom System',
    price: 'Quoted',
    items: ['Discord bots', 'Dashboards', 'Automation and hosted tools'],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="section">
      <div className="section-heading">
        <p className="eyebrow">Simple starting points</p>
        <h2>Service Packages</h2>
      </div>

      <div className="pricing-grid">
        {pricingTiers.map((tier) => (
          <article className="price-card" key={tier.title}>
            <h3>{tier.title}</h3>
            <strong>{tier.price}</strong>
            <ul>
              {tier.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
