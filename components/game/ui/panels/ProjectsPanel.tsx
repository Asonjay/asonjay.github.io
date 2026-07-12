'use client'
import type { WorldData } from '../../../../types/world'
import { PixelButton } from '../kit/PixelButton'
import { PixelDivider } from '../kit/PixelDivider'

export function ProjectsPanel({ data }: { data: WorldData }) {
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {data.projects.map((project, i) => (
          <article
            key={`${project.title}-${i}`}
            className="gp-corners"
            style={{
              padding: '12px 14px',
              background: 'var(--gp-bg)',
              boxShadow: 'inset 0 0 0 2px var(--gp-border)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'baseline' }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--gp-text)' }}>
                {project.title}
              </h3>
              <span
                style={{
                  flexShrink: 0,
                  fontFamily: 'var(--font-pixel), monospace',
                  fontSize: 9,
                  color: 'var(--gp-accent)',
                }}
              >
                {project.year}
              </span>
            </div>
            {project.description && (
              <p style={{ margin: '6px 0 0', fontSize: 13.5, lineHeight: 1.55, opacity: 0.85 }}>
                {project.description}
              </p>
            )}
          </article>
        ))}
      </div>
      <PixelDivider />
      <PixelButton href="/projects" variant="solid">
        All projects
      </PixelButton>
    </div>
  )
}
