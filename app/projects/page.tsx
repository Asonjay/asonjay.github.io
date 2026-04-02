// app/projects/page.tsx
import { Metadata } from 'next'
import ProjectList from '../../components/projectList'

export const metadata: Metadata = {
  title: 'Projects',
}

export default async function Projects() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="glass-panel">
        <div className="section-label text-fore-subtle mb-2">Open_Source.Log</div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-fore-primary mb-4">
          Projects
        </h1>
        <div className="h-px bg-[var(--color-border)] mb-4"></div>
        <ProjectList selectedOnly={false} />
      </div>
    </div>
  )
}
