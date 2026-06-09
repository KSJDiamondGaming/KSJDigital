export default function ServiceCard({ title, text }) {
  return (
    <article className="card service-card">
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}
