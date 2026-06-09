export default function ServiceCard({ icon, title, text }) {
  return (
    <article className="card service-card">
      <span className="service-icon">{icon}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}
