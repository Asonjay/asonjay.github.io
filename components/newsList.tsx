import { format, parseISO } from 'date-fns'
import { Props } from 'next/script'
import React from 'react'
import { getAllNews } from '../lib/mdx'
import { getMDXComponent } from 'mdx-bundler/client'
import { components } from './mdxComponents'

export async function NewsList({
  showHeading = false,
}: {
  showHeading?: boolean
}) {
  const news = await getAllNews()

  // Group news by year
  const grouped: Record<string, typeof news> = {}
  for (const item of news) {
    const year = format(parseISO(item.frontmatter.publishedAt), 'yyyy')
    if (!grouped[year]) grouped[year] = []
    grouped[year].push(item)
  }
  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a))

  return (
    <section>
      {showHeading && (
        <h2 className="section-label text-fore-subtle mb-4">News</h2>
      )}
      <div className="space-y-2">
        {years.map(year => (
          <div key={year}>
            {/* Year separator */}
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono-label text-xs text-fore-subtle tracking-wider">{year}</span>
              <div className="flex-1 h-px bg-[var(--color-border)]"></div>
            </div>

            <div className="space-y-1">
              {grouped[year].map(item => {
                const Content = getMDXComponent(item.code)
                return (
                  <div key={item.slug} className="panel-list-item">
                    <div className="flex flex-row justify-between items-start gap-3">
                      <div className="text-sm text-fore-secondary flex-1 min-w-0 [&_p]:my-0 [&_a]:text-accent [&_a]:hover:underline">
                        <Content
                          components={{
                            ...components,
                            p: props => <p {...props} className="my-0" />,
                            a: props => (
                              <a {...props} className="text-accent hover:underline" />
                            ),
                          }}
                        />
                      </div>
                      <span className="font-mono-label whitespace-nowrap flex-shrink-0 text-center leading-tight">
                        <span className="block text-accent font-bold text-xs">{format(parseISO(item.frontmatter.publishedAt), 'MMM')}</span>
                        <span className="block text-fore-primary text-lg font-bold leading-none">{format(parseISO(item.frontmatter.publishedAt), 'dd')}</span>
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default (NewsList as unknown) as (props: Props) => JSX.Element
