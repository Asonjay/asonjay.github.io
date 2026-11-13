import { format, parseISO } from 'date-fns'
import Link from 'next/link'
import { Props } from 'next/script'
import React from 'react'
import { getAllFrontMatters } from '../lib/mdx'

export async function PostList({
  showHeading = false,
}: {
  showHeading?: boolean
}) {
  const posts = await getAllFrontMatters()

  // Group by year
  const grouped: Record<string, typeof posts> = {}
  for (const post of posts) {
    const year = format(parseISO(post.publishedAt), 'yyyy')
    if (!grouped[year]) grouped[year] = []
    grouped[year].push(post)
  }
  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a))

  return (
    <section>
      {showHeading && (
        <h2 className="section-label mb-4">Writings</h2>
      )}
      <div>
        {years.map(year => (
          <div key={year}>
            {/* Year separator */}
            <div className="flex items-center gap-3 mt-5 first:mt-0">
              <span className="text-xs font-medium text-fore-subtle">{year}</span>
              <div className="flex-1 h-px bg-[var(--color-border)]"></div>
            </div>

            {/* Posts read as an index of writing: date-led rows, not boxes. */}
            <div>
              {grouped[year].map(post => {
                const date = parseISO(post.publishedAt)
                return (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="post-row group">
                    <span className="post-date" aria-hidden="true">
                      <span className="post-day">{format(date, 'dd')}</span>
                      <span className="post-month">{format(date, 'MMM')}</span>
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="post-title">{post.title}</span>
                      <span className="block mt-1.5 text-sm text-fore-subtle leading-snug">
                        {post.description}
                        {post.readingTime?.text && (
                          <span className="whitespace-nowrap"> ({post.readingTime.text})</span>
                        )}
                      </span>
                      <span className="sr-only">, published {format(date, 'MMMM d, yyyy')}</span>
                    </span>
                    <span className="post-arrow" aria-hidden="true">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17L17 7M8 7h9v9" />
                      </svg>
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default (PostList as unknown) as (props: Props) => JSX.Element
