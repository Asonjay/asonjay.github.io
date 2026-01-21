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
    // Small button/chip style for homepage
    const fullDate = deadline.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

    // Border color based on urgency (matches the countdown text color)
    const borderColor = timeRemaining.total < 0
      ? 'hover:border-t-gray-400'
      : timeRemaining.days <= 7
        ? 'hover:border-t-red-500'
        : timeRemaining.days <= 30
          ? 'hover:border-t-yellow-500'
          : 'hover:border-t-green-500'

    const isExpired = timeRemaining.total < 0

    return (
      <a
        href={conference.link}
        target="_blank"
        rel="noopener noreferrer"
        className={`group inline-flex flex-col items-center px-4 py-2 rounded-lg bg-back-secondary transition-all hover:-translate-y-1 hover:shadow-md border-2 border-transparent border-t-4 ${borderColor} w-[140px] ${isExpired ? 'opacity-60' : ''}`}
      >
        <span className="text-base font-bold text-fore-primary group-hover:text-accent transition-colors">
          {conference.title} {conference.year}
        </span>

        {/* Separator */}
        <div className="w-full border-t border-fore-subtle opacity-40 my-2" />

        {isExpired ? (
          <div className={`flex items-baseline gap-1 ${urgencyTextColor}`}>
            <span className="text-2xl font-bold">--</span>
          </div>
        ) : (
          <div className={`flex items-baseline gap-1 ${urgencyTextColor}`}>
            <span className="text-2xl font-bold">{timeRemaining.days}d</span>
            <span className="text-sm font-medium">{timeRemaining.hours}h {timeRemaining.minutes}m</span>
          </div>
        )}
        <span className="text-xs text-fore-subtle mt-1 text-center">
          {fullDate}
        </span>
        {conference.place && (
          <span className="text-xs text-fore-subtle mt-1 opacity-70 text-center">
            {conference.place}
          </span>
        )}
      </a>
    )
  }

  return (
    <div className="relative p-5 transition-all bg-back-secondary hover:shadow-lg group">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <span
          className={`px-2.5 py-1 text-xs font-semibold text-white rounded bg-gradient-to-r ${urgencyColor}`}
        >
          {conference.title}
        </span>
        <div className="text-right">
          <span className={`text-2xl font-bold ${urgencyTextColor}`}>
            {timeRemaining.days}
          </span>
          <span className="text-xs text-fore-subtle ml-1">days</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="mb-2 text-lg font-medium text-fore-primary group-hover:text-accent transition-colors">
        {conference.full_name || conference.title}
      </h3>

      {/* Details */}
      <div className="mb-3 text-sm text-fore-subtle">
        <p>{formattedDate}</p>
        <p>{conference.place}</p>
      </div>

      {/* Countdown detail */}
      <div className="flex items-center gap-4 mb-4 text-xs text-fore-subtle">
        <span>{timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m</span>
        {conference.hindex && (
          <span className="px-1.5 py-0.5 rounded bg-back-subtle">
            h-index: {conference.hindex}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 mb-4 overflow-hidden rounded-full bg-back-subtle">
        <div
          className={`h-full bg-gradient-to-r ${urgencyColor} transition-all`}
          style={{
            width: `${Math.max(0, Math.min(100, (1 - timeRemaining.days / 90) * 100))}%`,
          }}
        />
      </div>

      {/* Link */}
      <a
        href={conference.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded bg-back-subtle hover:bg-accent hover:text-white transition-colors"
      >
        <External24 className="w-4 h-4" />
        Conference Site
      </a>

      {/* Note */}
      {conference.note && (
        <p className="mt-3 text-xs text-fore-subtle italic">{conference.note}</p>
      )}
    </div>
  )
}

export default DeadlineCard
