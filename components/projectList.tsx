import React from 'react'
import { getProjects } from '../lib/mdx'
import { Project } from '../types/project'
import { GitHub24 } from '../components/icons'

// Same icon, size and stroke as the "Link" button on publications.
function ExternalLink() {
  return (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

const TAG_HUES = ['warm', 'cool', 'rose', 'mint', 'violet', 'amber', 'teal', 'lime']

// Hand each distinct tag the next hue, in the order tags first appear across
// all projects. "React" is then the same colour on every project, and tags
// sharing a card differ until there are more tags than hues.
function assignTagHues(projects: Project[]) {
  const hues = new Map<string, string>()
  for (const project of projects) {
    for (const tag of project.tags ?? []) {
      if (!hues.has(tag)) hues.set(tag, `var(--hue-${TAG_HUES[hues.size % TAG_HUES.length]})`)
    }
  }
  return hues
}

function ProjectCard({ project, hues }: { project: Project; hues: Map<string, string> }) {
  return (
    <article className="project-tile h-full">
      <div className="flex items-start justify-between gap-3">
        <span className="project-year">{project.year}</span>
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap justify-end gap-1.5 pt-1">
            {project.tags.map(tag => (
              <span
                key={tag}
                className="tag-badge project-tag"
                style={{ '--tag-hue': hues.get(tag) } as React.CSSProperties}
              >
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
              className="btn-outline"
            >
              <ExternalLink />
              Demo
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

    // From the full list, so the home page and the projects page agree.
    const hues = assignTagHues(projects)

    const filteredProjects = selectedOnly
      ? projects.filter(p => p.selected === true)
      : projects

    return (
      <section>
        <div className="project-grid grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredProjects.map(project => (
            <ProjectCard key={project.id || project.title} project={project} hues={hues} />
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
