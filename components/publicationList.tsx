// components/PublicationList.tsx
import React, { use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getAllPublications } from '../lib/publications'
import { Publication } from '../types/publication'

interface PublicationListProps {
  selectedOnly?: boolean
}

export function PublicationList({
  selectedOnly = false,
}: PublicationListProps) {
  const publications = use(getAllPublications())

  const filteredPubs = selectedOnly
    ? publications.filter(pub => pub.selected)
    : publications

  const groupedPubs = filteredPubs.reduce((acc, pub) => {
    if (!acc[pub.year]) {
      acc[pub.year] = []
    }
    acc[pub.year].push(pub)
    return acc
  }, {} as Record<number, Publication[]>)

  const years = Object.keys(groupedPubs)
    .map(Number)
    .sort((a, b) => b - a)

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
    <section>
      <div className="space-y-4">
        {years.map((year) => (
          <div key={year}>
            {/* Year separator */}
            <div className="flex items-center gap-3 mb-4 mt-6 first:mt-0">
              <span className="font-mono-label text-xs text-fore-subtle tracking-wider">{year}</span>
              <div className="flex-1 h-px bg-[var(--color-border)]"></div>
            </div>

            <div className="space-y-3">
              {groupedPubs[year].map((pub, index) => (
                <div
                  key={index}
                  className="panel-list-item !p-4 group/pub"
                >
                  <div className="flex gap-4">
                    {/* Thumbnail */}
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
                      {/* Title + badge row */}
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
                          <Link href={pub.pdf} target="_blank" className="btn-outline">
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                            </svg>
                            PDF
                          </Link>
                        )}
                        {pub.code && (
                          <Link href={pub.code} target="_blank" className="btn-outline">
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
                            </svg>
                            CODE
                          </Link>
                        )}
                        {pub.url && !pub.pdf && (
                          <Link href={pub.url} target="_blank" className="btn-outline">
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                            LINK
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default PublicationList
