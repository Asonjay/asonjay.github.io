// components/PublicationList.tsx
import React, { use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FileText, ExternalLink, ChevronRight } from 'lucide-react'
import { getAllPublications } from '../lib/publications'
import { Publication } from '../types/publication'

interface PublicationListProps {
  selectedOnly?: boolean
}

// Note: removed async keyword from component function
export function PublicationList({
  selectedOnly = false,
}: PublicationListProps) {
  // Move the async operation outside the component
  const publications = use(getAllPublications())

  // Filter publications if selectedOnly is true
  const filteredPubs = selectedOnly
    ? publications.filter(pub => pub.selected)
    : publications

  // Group publications by year
  const groupedPubs = filteredPubs.reduce((acc, pub) => {
    if (!acc[pub.year]) {
      acc[pub.year] = []
    }
    acc[pub.year].push(pub)
    return acc
  }, {} as Record<number, Publication[]>)

  // Sort years in descending order
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
            <span className="underline font-bold hover:text-accent transition-colors">
              {author}
            </span>
          ) : (
            <span>{author}</span>
          )}
        </React.Fragment>
      )
    })
  }

  return (
    <section>
      <div className="mt-3">
        {years.map((year, yearIndex) => (
          <div key={year}>
            {yearIndex !== 0 && <hr className="border-back-subtle my-2" />}
            <div className="grid grid-cols-[1fr_80px] gap-8">
              <div className="border-back-subtle pb overflow-hidden">
                {groupedPubs[year].map((pub, index) => (
                  <li
                    key={index}
                    className="group list-none relative overflow-hidden mb-1"
                  >
                    <div className="pl-2 pb-4 pr-4 pt-4 transition-all duration-300 group-hover:translate-x-20 relative z-10 bg-back-primary">
                      <div className="flex gap-4">
                        {pub.thumbnail && (
                          <div className="flex-shrink-0 w-[240px] h-[160px]">
                            <Image
                              src={pub.thumbnail}
                              alt={pub.title}
                              width={400}
                              height={300}
                              className="object-fill w-full h-full"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4 mb-1">
                            <span className="text-lg font-semibold leading-tight block cursor-default group-hover:text-accent transition-colors">
                              {pub.title}
                            </span>
                            {pub.abbr && (
                              <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-gradient-to-r from-accent to-teal-600 text-white rounded-full shadow-sm flex-shrink-0">
                                {pub.abbr}
                              </span>
                            )}
                          </div>
                          <div className="space-y-1 mb-2">
                            <p className="text-sm text-fore-subtle">
                              {formatAuthors(pub.authors)}
                            </p>
                            <p className="text-sm italic text-fore-subtle font-medium">
                              {pub.venue}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Hidden action panel revealed on hover */}
                    <div className="absolute left-0 top-0 bottom-0 w-20 flex">
                      {pub.pdf && (
                        <Link
                          href={pub.pdf}
                          className="relative flex flex-col items-center justify-center gap-1 w-full bg-accent text-white hover:bg-accent/90 transition-colors"
                          target="_blank"
                          style={{
                            clipPath:
                              'polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)',
                          }}
                        >
                          <FileText size={20} />
                          <span className="text-xs font-semibold">PDF</span>
                        </Link>
                      )}
                      {pub.url && !pub.pdf && (
                        <Link
                          href={pub.url}
                          className="relative flex flex-col items-center justify-center gap-1 w-full bg-accent text-white hover:bg-accent/90 transition-colors"
                          target="_blank"
                          style={{
                            clipPath:
                              'polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)',
                          }}
                        >
                          <ExternalLink size={20} />
                          <span className="text-xs font-semibold">Link</span>
                        </Link>
                      )}
                    </div>
                  </li>
                ))}
              </div>
              <div className="text-3xl text-fore-subtle text-right opacity-20 sticky top-4">
                {year}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default PublicationList
