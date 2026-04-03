import { Metadata } from 'next'
import Link from 'next/link'
import PostList from '../../components/postList'

export const metadata: Metadata = {
  title: 'Blog',
}

export default async function Blog() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="glass-panel">
        <div className="flex items-center justify-between mb-2">
          <div className="section-label text-fore-subtle">Thoughts.Log</div>
          <Link href="/" className="shrink-icon" title="Back to home">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7" />
            </svg>
          </Link>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-fore-primary mb-4">
          Blog
        </h1>
        <p className="text-sm text-fore-subtle mb-6 max-w-3xl leading-relaxed">
          Welcome to my little corner of the internet! Here&apos;s where I dump my
          brain thoughts about research, random discoveries, and whatever else
          catches my attention.
        </p>
        <div className="h-px bg-[var(--color-border)] mb-4"></div>
        <PostList />
      </div>
    </div>
  )
}
