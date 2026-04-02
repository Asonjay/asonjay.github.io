import { Metadata } from 'next'
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
        <div className="section-label text-fore-subtle mb-2">Deadlines.Log</div>
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
