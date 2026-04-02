import { getProjects } from '../lib/mdx'
import { Project } from '../types/project'
import { GitHub24, External24 } from '../components/icons'

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="panel-list-item h-full">
      {/* Title and Year */}
      <div className="flex justify-between items-start mb-1">
        <h3 className="text-base font-medium text-fore-primary leading-snug">
          {project.link ? (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              {project.title}
            </a>
          ) : (
            project.title
          )}
        </h3>
        <span className="font-mono-label text-xs text-fore-subtle ml-2 flex-shrink-0">
          {project.year}
        </span>
      </div>

      {/* Tags */}
      {project.tags && project.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {project.tags.map(tag => (
            <span key={tag} className="tag-badge tag-badge-accent">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Description */}
      <p className="text-sm text-fore-subtle mb-3 leading-relaxed">{project.description}</p>

      {/* Links */}
      <div className="flex flex-wrap gap-2 mt-auto">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            <GitHub24 className="w-3.5 h-3.5" />
            GITHUB
          </a>
        )}
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            <External24 className="w-3.5 h-3.5" />
            DEMO
          </a>
        )}
      </div>
    </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
