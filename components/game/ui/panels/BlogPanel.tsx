'use client'
import { format, parseISO } from 'date-fns'
import type { WorldData } from '../../../../types/world'
import { PixelButton } from '../kit/PixelButton'
import { PixelDivider } from '../kit/PixelDivider'

export function BlogPanel({ data }: { data: WorldData }) {
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {data.posts.map(post => (
          <a
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="gp-corners"
            style={{
              display: 'block',
              padding: '10px 12px',
              textDecoration: 'none',
              color: 'var(--gp-text)',
              background: 'var(--gp-bg)',
              boxShadow: 'inset 0 0 0 2px var(--gp-border)',
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
      <PixelDivider />
      <PixelButton href="/blog" variant="solid">
        All posts
      </PixelButton>
    </div>
  )
}
