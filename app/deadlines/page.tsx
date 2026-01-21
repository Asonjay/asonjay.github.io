import { Metadata } from 'next'
import { Fragment, Suspense } from 'react'
import { getAllConferences } from '../../lib/deadlines'
import DeadlinePageContent from './DeadlinePageContent'

export const metadata: Metadata = {
  title: 'Conference Deadlines',
  description: 'Upcoming ML, CV, and Robotics conference submission deadlines',
}

export default async function DeadlinesPage() {
  // Fetch all relevant conferences at build time
  const conferences = await getAllConferences('all')

  return (
    <Fragment>
      <span className="inline-flex p-3 rounded-full bg-back-subtle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </span>
      <h1 className="mt-3 mb-2 text-2xl font-bold tracking-tight text-accent">
        Conference Deadlines
      </h1>

      <p className="mb-4 text-fore-subtle">
        Upcoming submission deadlines for ML, CV, and Robotics conferences.
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

      <div className="border-t-2 border-dotted border-back-subtle"></div>

      <Suspense
        fallback={
          <div className="py-8 text-center text-fore-subtle">
            Loading deadlines...
          </div>
        }
      >
        <DeadlinePageContent conferences={conferences} />
      </Suspense>
    </Fragment>
  )
}
