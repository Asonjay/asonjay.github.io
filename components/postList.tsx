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
        <h2 className="section-label text-fore-subtle mb-4">Writings</h2>
      )}
      <div className="space-y-2">
        {years.map(year => (
          <div key={year}>
            {/* Year separator */}
            <div className="flex items-center gap-3 mb-2 mt-4 first:mt-0">
              <span className="font-mono-label text-xs text-fore-subtle tracking-wider">{year}</span>
              <div className="flex-1 h-px bg-[var(--color-border)]"></div>
            </div>

            <div className="space-y-2">
              {grouped[year].map(post => (
                <Link key={post.slug} href={`blog/${post.slug}`} className="block">
                  <div className="panel-list-item">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-fore-primary">
                          {post.title}
                        </span>
                        <p className="text-xs text-fore-subtle mt-0.5">
                          {post.description}
                        </p>
                      </div>
                      <span className="font-mono-label whitespace-nowrap flex-shrink-0 text-center leading-tight">
                        <span className="block text-accent font-bold text-xs">{format(parseISO(post.publishedAt), 'MMM')}</span>
                        <span className="block text-fore-primary text-lg font-bold leading-none">{format(parseISO(post.publishedAt), 'dd')}</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default (PostList as unknown) as (props: Props) => JSX.Element
