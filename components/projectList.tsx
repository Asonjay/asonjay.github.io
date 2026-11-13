import { getProjects } from '../lib/mdx'
import { Project } from '../types/project'
import { GitHub24 } from '../components/icons'

function ArrowUpRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17L17 7M8 7h9v9" />
    </svg>
  )
}

// Each tile is tinted with one of the backdrop's colours (see .project-tile in
// globals.css), so a row of projects doesn't read as identical boxes.
function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-tile h-full">
      <div className="flex items-start justify-between gap-3">
        <span className="project-year">{project.year}</span>
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap justify-end gap-1.5 pt-1">
            {project.tags.map(tag => (
              <span key={tag} className="tag-badge project-tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <h3 className="mt-4 text-lg font-semibold tracking-tight leading-snug text-fore-primary">
        {project.link ? (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline underline-offset-4 decoration-1"
          >
            {project.title}
          </a>
        ) : (
          project.title
        )}
      </h3>

      <p className="mt-2 mb-5 text-sm text-fore-secondary leading-relaxed">{project.description}</p>

      {(project.github || project.url) && (
        <div className="flex flex-wrap gap-2 mt-auto">
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-solid"
            >
              Demo
              <ArrowUpRight />
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              <GitHub24 className="w-3.5 h-3.5" />
              GitHub
            </a>
          )}
        </div>
      )}
    </article>
  )
}

interface Props {
  selectedOnly?: boolean
}

const ProjectList = async ({ selectedOnly = false }: Props) => {
  try {
    const projects = await getProjects()

    if (!projects || projects.length === 0) {
      return (
        <section>
          <p className="text-fore-subtle text-sm">No projects found.</p>
        </section>
      )
    }

    const filteredProjects = selectedOnly
      ? projects.filter(p => p.selected === true)
      : projects

    return (
      <section>
        <div className="project-grid grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredProjects.map(project => (
            <ProjectCard key={project.id || project.title} project={project} />
          ))}
        </div>
      </section>
    )
  } catch (error) {
    console.error('Error loading projects:', error)
    return (
      <section>
        <p className="text-fore-subtle text-sm">Error loading projects.</p>
      </section>
    )
  }
}

export default (ProjectList as unknown) as (props: Props) => JSX.Element
