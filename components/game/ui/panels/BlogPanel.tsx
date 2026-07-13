'use client'
import { format, parseISO } from 'date-fns'
import type { WorldData } from '../../../../types/world'
import { UiButton } from '../kit/UiButton'
import { UiDivider } from '../kit/UiDivider'

export function BlogPanel({ data }: { data: WorldData }) {
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {data.posts.map(post => (
          <a
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="gp-corners gp-lift"
            style={{
              display: 'block',
              padding: '10px 12px',
              textDecoration: 'none',
              color: 'var(--gp-text)',
              background: 'var(--gp-bg)',
              border: '1px solid var(--gp-border)',
            }}
          >
            <div style={{ fontSize: 14.5, fontWeight: 600 }}>{post.title}</div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 10,
                fontSize: 12,
                opacity: 0.7,
                marginTop: 4,
              }}
            >
              {post.publishedAt && (
                <span>{format(parseISO(post.publishedAt), 'MMM d, yyyy')}</span>
              )}
              {post.readingTimeText && <span>{post.readingTimeText}</span>}
            </div>
          </a>
        ))}
      </div>
      <UiDivider />
      <UiButton href="/blog" variant="solid">
        All posts
      </UiButton>
    </div>
  )
}
