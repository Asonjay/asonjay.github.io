// app/projects/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import ProjectList from '../../components/projectList'

export const metadata: Metadata = {
  title: 'Projects',
}

export default async function Projects() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="glass-panel">
        <div className="flex items-center justify-between mb-2">
          <div className="section-label text-fore-subtle">Open_Source.Log</div>
          <Link href="/" className="shrink-icon" title="Back to home">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7" />
            </svg>
          </Link>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-fore-primary mb-4">
          Projects
        </h1>
        <div className="h-px bg-[var(--color-border)] mb-4"></div>
        <ProjectList selectedOnly={false} />
      </div>
    </div>
  )
}
