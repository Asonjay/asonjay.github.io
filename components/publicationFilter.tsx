'use client'

import React, { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Publication } from '../types/publication'
import CiteButton from './citeButton'

const FILTER_TYPES = [
  { key: 'all', label: 'All' },
  { key: 'Security', label: 'Security' },
  { key: 'Embodied AI', label: 'Embodied AI' },
  { key: 'Alignment', label: 'Alignment' },
  { key: 'Learning Technologies', label: 'Learning Tech' },
] as const

type FilterKey = (typeof FILTER_TYPES)[number]['key']

function groupByYear(pubs: Publication[]) {
  const grouped = pubs.reduce((acc, pub) => {
    if (!acc[pub.year]) acc[pub.year] = []
    acc[pub.year].push(pub)
    return acc
  }, {} as Record<number, Publication[]>)

  const years = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => b - a)

  return { grouped, years }
}

export default function PublicationFilter({
  publications,
}: {
  publications: Publication[]
}) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all')
  const [animating, setAnimating] = useState(false)
  const [displayed, setDisplayed] = useState(publications)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

  const handleFilter = useCallback(
    (key: FilterKey) => {
      if (key === activeFilter) return

      setAnimating(true)

      if (timeoutRef.current) clearTimeout(timeoutRef.current)

      timeoutRef.current = setTimeout(() => {
        setActiveFilter(key)
        const next =
          key === 'all'
            ? publications
            : publications.filter((p) => p.field === key)
        setDisplayed(next)

        requestAnimationFrame(() => {
          setAnimating(false)
        })
      }, 150)
    },
    [activeFilter, publications]
  )

  const counts = FILTER_TYPES.reduce((acc, { key }) => {
    acc[key] =
      key === 'all'
        ? publications.length
        : publications.filter((p) => p.field === key).length
    return acc
  }, {} as Record<string, number>)

  const { grouped, years } = groupByYear(displayed)

  const formatAuthors = (authors: string[]) => {
    return authors.map((author, index) => {
      const isMe = author.includes('Zexin Xu')
      return (
        <React.Fragment key={index}>
          {index > 0 && ', '}
          {isMe ? (
            <span className="font-bold text-accent">{author}</span>
          ) : (
            <span>{author}</span>
          )}
        </React.Fragment>
      )
    })
  }

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 mb-8">
        {FILTER_TYPES.map(({ key, label }) =>
          counts[key] > 0 ? (
            <button
              key={key}
              onClick={() => handleFilter(key)}
              className={`btn-outline ${
                activeFilter === key
                  ? '!bg-accent !text-[var(--color-back-primary)] !border-accent'
                  : ''
              }`}
            >
              {label}{' '}
              <span className="ml-1.5 opacity-60">{counts[key]}</span>
            </button>
          ) : null
        )}
      </div>

      {/* Animated content */}
      <div
        className={`space-y-6 transition-all duration-300 ease-in-out ${
          animating
            ? 'opacity-0 translate-y-2'
            : 'opacity-100 translate-y-0'
        }`}
      >
        {years.map((year) => (
          <div key={year}>
            {/* Year separator */}
            <div className="flex items-center gap-3 mb-4 mt-6 first:mt-0">
              <span className="font-mono-label text-xs text-fore-subtle tracking-wider">
                {year}
              </span>
              <div className="flex-1 h-px bg-[var(--color-border)]"></div>
            </div>

            {/* Two-column grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {grouped[year].map((pub, index) => (
                <div key={index} className="panel-list-item !p-4 group/pub">
                  <div className="flex gap-4">
                    {pub.thumbnail && (
                      <div className="flex-shrink-0 w-[100px] h-[70px] rounded-md overflow-hidden hidden sm:block">
                        <Image
                          src={pub.thumbnail}
                          alt={pub.title}
                          width={200}
                          height={140}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      {/* Title + badges */}
                      <div className="mb-1.5">
                        <span className="text-base font-semibold text-fore-primary leading-snug group-hover/pub:text-accent transition-colors">
                          {pub.title}
                        </span>
                        {pub.abbr && (
                          <span className="tag-badge tag-badge-accent whitespace-nowrap !text-[0.65rem] !px-2.5 !py-0.5 ml-2 inline-flex align-middle">
                            {pub.abbr}
                          </span>
                        )}
                      </div>

                      {/* Authors */}
                      <div className="text-xs text-fore-subtle mb-1 leading-relaxed">
                        {formatAuthors(pub.authors)}
                      </div>

                      {/* Venue */}
                      <div className="font-mono-label text-[0.7rem] text-fore-subtle mb-2.5 flex items-center gap-1">
                        <span className="text-accent font-bold">@</span>
                        <span className="italic">{pub.venue}</span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap gap-2">
                        {pub.pdf && (
                          <Link
                            href={pub.pdf}
                            target="_blank"
                            className="btn-outline"
                          >
                            <svg
                              className="w-3 h-3"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                            </svg>
                            PDF
                          </Link>
                        )}
                        {pub.code && (
                          <Link
                            href={pub.code}
                            target="_blank"
                            className="btn-outline"
                          >
                            <svg
                              className="w-3 h-3"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="16 18 22 12 16 6" />
                              <polyline points="8 6 2 12 8 18" />
                            </svg>
                            CODE
                          </Link>
                        )}
                        {pub.url && !pub.pdf && (
                          <Link
                            href={pub.url}
                            target="_blank"
                            className="btn-outline"
                          >
                            <svg
                              className="w-3 h-3"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                              <polyline points="15 3 21 3 21 9" />
                              <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                            LINK
                          </Link>
                        )}
                        <CiteButton publication={pub} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
