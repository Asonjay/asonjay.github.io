'use client'

import { useState } from 'react'
import { Conference, SubjectFilter } from '../../types/deadline'
import { DeadlineCard } from '../../components/deadlineCard'

interface DeadlinePageContentProps {
  conferences: Conference[]
}

const FILTERS: { label: string; value: SubjectFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Machine Learning', value: 'ML' },
  { label: 'Computer Vision', value: 'CV' },
  { label: 'Robotics', value: 'RO' },
]

function matchesSubject(conference: Conference, filter: SubjectFilter): boolean {
  if (filter === 'all') return true

  const sub = conference.sub
  if (Array.isArray(sub)) {
    return sub.includes(filter)
  }
  return sub === filter
}

export default function DeadlinePageContent({
  conferences,
}: DeadlinePageContentProps) {
  const [activeFilter, setActiveFilter] = useState<SubjectFilter>('all')

  const filteredConferences = conferences.filter(conf =>
    matchesSubject(conf, activeFilter)
  )

  return (
    <div className="mt-6">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map(filter => (
          <button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeFilter === filter.value
                ? 'bg-accent text-white'
                : 'bg-back-subtle text-fore-subtle hover:bg-back-secondary hover:text-fore-primary'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <p className="mb-4 text-sm text-fore-subtle">
        {filteredConferences.length} upcoming deadline
        {filteredConferences.length !== 1 ? 's' : ''}
      </p>

      {/* Conference Grid */}
      {filteredConferences.length === 0 ? (
        <div className="py-8 text-center text-fore-subtle">
          No upcoming deadlines found for this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredConferences.map(conference => (
            <DeadlineCard key={conference.id} conference={conference} />
          ))}
        </div>
      )}
    </div>
  )
}
