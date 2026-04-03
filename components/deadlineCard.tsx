'use client'

import { useState, useEffect } from 'react'
import { Conference } from '../types/deadline'
import { External24 } from './icons'

interface DeadlineCardProps {
  conference: Conference
  compact?: boolean
  featured?: boolean
}

function parseDeadline(deadline: string, timezone: string): Date {
  const date = new Date(deadline)
  if (timezone === 'UTC-12' || timezone === 'AoE') {
    date.setHours(date.getHours() + 12)
  }
  return date
}

function getTimeRemaining(deadline: Date): {
  days: number
  hours: number
  minutes: number
  total: number
} {
  const now = new Date()
  const total = deadline.getTime() - now.getTime()
  const days = Math.floor(total / (1000 * 60 * 60 * 24))
  const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60))

  return { days, hours, minutes, total }
}

function getUrgencyColor(days: number): string {
  if (days < 0) return 'from-gray-400 to-gray-500'
  if (days <= 7) return 'from-red-500 to-red-600'
  if (days <= 30) return 'from-yellow-500 to-orange-500'
  return 'from-green-500 to-teal-500'
}

function getUrgencyTextColor(days: number): string {
  if (days < 0) return 'text-gray-500'
  if (days <= 7) return 'text-red-500'
  if (days <= 30) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-green-600 dark:text-green-400'
}

export function DeadlineCard({ conference, compact = false, featured = false }: DeadlineCardProps) {
  const deadline = parseDeadline(conference.deadline, conference.timezone)
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(deadline))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(getTimeRemaining(deadline))
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [deadline])

  const formattedDate = deadline.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  const urgencyColor = getUrgencyColor(timeRemaining.days)
  const urgencyTextColor = getUrgencyTextColor(timeRemaining.days)

  if (featured) {
    // Featured/first item - larger with detailed countdown
    const fullDate = deadline.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

    // Border color based on urgency
    const borderColorClass = timeRemaining.days <= 7
      ? 'border-t-red-500'
      : timeRemaining.days <= 30
        ? 'border-t-yellow-500'
        : 'border-t-green-500'

    return (
      <a
        href={conference.link}
        target="_blank"
        rel="noopener noreferrer"
        className={`group inline-flex flex-col items-center px-8 py-5 rounded-lg bg-back-secondary transition-all hover:-translate-y-1 hover:shadow-lg border-t-4 ${borderColorClass} min-w-[200px]`}
      >
        <span className="text-lg font-bold text-fore-primary group-hover:text-accent transition-colors">
          {conference.title} {conference.year}
        </span>
        <div className={`text-3xl font-bold ${urgencyTextColor} my-2`}>
          {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m
        </div>
        <span className="text-sm text-fore-subtle">
          {fullDate}
        </span>
        {conference.place && (
          <span className="text-sm text-fore-subtle mt-1 opacity-70">
            {conference.place}
          </span>
        )}
      </a>
    )
  }

  if (compact) {
    const fullDate = deadline.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })

    const isExpired = timeRemaining.total < 0

    const dotColor = isExpired
      ? 'bg-gray-400'
      : timeRemaining.days <= 7
        ? 'bg-red-500'
        : timeRemaining.days <= 30
          ? 'bg-yellow-500'
          : 'bg-green-500'

    return (
      <a
        href={conference.link}
        target="_blank"
        rel="noopener noreferrer"
        className={`group flex flex-col items-center justify-center rounded-lg border border-[var(--color-border)] transition-colors hover:border-accent px-4 py-3 text-center flex-shrink-0 min-w-[80px] h-full ${isExpired ? 'opacity-40' : ''}`}
        style={{ background: 'rgba(255,255,255,0.03)' }}
      >
        <span className="text-xs font-bold text-fore-primary group-hover:text-accent transition-colors leading-tight">
          {conference.title}
        </span>
        <span className="font-mono-label text-[0.6rem] text-fore-subtle">{conference.year}</span>
        <span className={`font-heading text-xl font-bold mt-1 leading-none ${urgencyTextColor} ${!isExpired ? 'deadline-glow' : ''}`}>
          {isExpired ? '--' : `${timeRemaining.days}d`}
        </span>
      </a>
    )
  }

  const isExpiredFull = timeRemaining.total < 0

  return (
    <div className={`relative p-5 transition-all group ${isExpiredFull ? 'opacity-50' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="tag-badge tag-badge-accent !text-[0.65rem]">
            {conference.title} {conference.year}
          </span>
        </div>
        <div className="text-right">
          {isExpiredFull ? (
            <span className="font-mono-label text-xs text-fore-subtle">PASSED</span>
          ) : (
            <>
              <span className={`font-heading text-2xl font-bold ${urgencyTextColor}`}>
                {timeRemaining.days}
              </span>
              <span className="font-mono-label text-[0.6rem] text-fore-subtle ml-1">days</span>
            </>
          )}
        </div>
      </div>

      {/* Full name */}
      <h3 className="mb-2 text-base font-semibold text-fore-primary group-hover:text-accent transition-colors">
        {conference.full_name || conference.title}
      </h3>

      {/* Details */}
      <div className="mb-3 space-y-1 font-mono-label text-[0.7rem] text-fore-subtle">
        <div className="flex items-center gap-1.5">
          <span className="text-accent">@</span>
          <span>{formattedDate}</span>
        </div>
        {conference.place && (
          <div className="flex items-center gap-1.5">
            <span className="text-accent">@</span>
            <span>{conference.place}</span>
          </div>
        )}
      </div>

      {/* Countdown detail */}
      {!isExpiredFull && (
        <div className="flex items-center gap-3 mb-3">
          <span className={`font-mono-label text-xs font-bold ${urgencyTextColor}`}>
            {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m
          </span>
          {conference.hindex && (
            <span className="tag-badge tag-badge-accent !text-[0.55rem]">
              h-index: {conference.hindex}
            </span>
          )}
        </div>
      )}

      {/* Progress bar */}
      {!isExpiredFull && (
        <div className="w-full h-0.5 mb-3 overflow-hidden rounded-full bg-[var(--color-border)]">
          <div
            className={`h-full bg-gradient-to-r ${urgencyColor} transition-all`}
            style={{
              width: `${Math.max(0, Math.min(100, (1 - timeRemaining.days / 90) * 100))}%`,
            }}
          />
        </div>
      )}

      {/* Link */}
      <a
        href={conference.link}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-outline"
      >
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
        </svg>
        SITE
      </a>

      {/* Note */}
      {conference.note && (
        <p className="mt-2 font-mono-label text-[0.65rem] text-fore-subtle italic">{conference.note}</p>
      )}
    </div>
  )
}

export default DeadlineCard
