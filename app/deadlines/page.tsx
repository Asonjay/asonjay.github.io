import { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { getAllConferences } from '../../lib/deadlines'
import DeadlinePageContent from './DeadlinePageContent'

export const metadata: Metadata = {
  title: 'Conference Deadlines',
  description: 'Upcoming ML and CV conference submission deadlines',
}

export default async function DeadlinesPage() {
  const conferences = await getAllConferences('all', true)

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="glass-panel">
        <div className="flex items-center justify-between mb-2">
          <div className="section-label text-fore-subtle">Deadlines.Log</div>
          <Link href="/" className="shrink-icon" title="Back to home">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7" />
            </svg>
          </Link>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-fore-primary mb-4">
          Conference Deadlines
        </h1>
        <p className="text-sm text-fore-subtle mb-6 max-w-3xl leading-relaxed">
          Upcoming submission deadlines for ML and CV conferences.
          Data sourced from the community-maintained{' '}
          <a
            href="https://github.com/abhshkdz/ai-deadlines"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            ai-deadlines
          </a>{' '}
          repository.
        </p>
        <div className="h-px bg-[var(--color-border)] mb-4"></div>
        <Suspense
          fallback={
            <div className="py-8 text-center text-fore-subtle font-mono-label text-sm">
              Loading deadlines...
            </div>
          }
        >
          <DeadlinePageContent conferences={conferences} />
        </Suspense>
      </div>
    </div>
  )
}
