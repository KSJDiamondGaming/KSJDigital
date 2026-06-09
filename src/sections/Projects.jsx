import { urlFor } from '../lib/imageUrl';

export default function Projects({ projects }) {
  return (
    <section id="projects" className="section">
      <div className="section-heading">
        <p className="eyebrow">Proof of work</p>
        <h2>Projects & Systems</h2>
      </div>

      <div className="project-grid">
        {projects.map((project) => (
          <article className="project-card" key={project._id || project.title}>
            {project.image && (
              <img
                className="project-image"
                src={urlFor(project.image).width(900).height(520).fit('crop').url()}
                alt={project.title}
              />
            )}

            <span>{project.type}</span>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
