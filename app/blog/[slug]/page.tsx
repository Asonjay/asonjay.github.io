import classNames from 'classnames'
import { format, parseISO } from 'date-fns'
import { getMDXComponent } from 'mdx-bundler/client'
import { Metadata } from 'next'
import Link from 'next/link'
import { Fragment } from 'react'
import { components } from '../../../components/mdxComponents'
import { QuickNav } from '../../../components/quickNav'
import { getAllFrontMatters, getMdxBySlug } from '../../../lib/mdx'

export async function generateStaticParams() {
  const posts = await getAllFrontMatters()
  return posts.map(post => ({
    slug: post.slug
  }))
}

export async function generateMetadata({ params }): Promise<Metadata> {
  const { frontmatter } = await getMdxBySlug(params.slug)
  return {
    title: frontmatter.title,
    description: frontmatter.description,
  }
}

export default async function BlogPost({ params }) {
  const { code, frontmatter } = await getMdxBySlug(params.slug)
  const Component = getMDXComponent(code)

  const publishedAt = parseISO(frontmatter.publishedAt)
  const updatedAt = frontmatter.updatedAt
    ? parseISO(frontmatter.updatedAt)
    : undefined

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="glass-panel">
        <div
          className={classNames(
            'relative flex justify-between',
            {
              'flex-row-reverse': Boolean(frontmatter.toc),
            }
          )}
        >
          {frontmatter.toc && (
            <aside className="sticky hidden h-screen max-w-xs mt-8 ml-6 top-16 xl:block">
              <QuickNav />
            </aside>
          )}
          <article className="max-w-3xl min-w-0 text-base lg:text-lg text-fore-subtle">
            <div className="section-label text-fore-subtle mb-4">Blog Post</div>
            <div className="font-mono-label text-xs text-fore-subtle mb-2 flex flex-wrap items-center gap-2">
              <time dateTime={publishedAt.toISOString()}>
                {format(publishedAt, 'MMMM dd yyyy')}
              </time>
              <span className="w-1 h-1 rounded-full bg-fore-subtle"></span>
              <span>{frontmatter.readingTime?.text}</span>
              {updatedAt && (
                <>
                  <span className="w-1 h-1 rounded-full bg-fore-subtle"></span>
                  <span className="italic">
                    Updated:{' '}
                    <time dateTime={updatedAt.toISOString()}>
                      {format(updatedAt, 'MMMM dd yyyy')}
                    </time>
                  </span>
                </>
              )}
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-fore-primary mb-8 tracking-tight">
              {frontmatter.title}
            </h1>
            <Component components={components} />
          </article>
        </div>
        <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 font-mono-label text-xs text-fore-subtle hover:text-accent transition-colors"
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" /><polyline points="12 19 5 12 12 5" />
            </svg>
            BACK TO BLOG
          </Link>
        </div>
      </div>
    </div>
  )
}
