import { Metadata } from 'next'
import PostList from '../../components/postList'

export const metadata: Metadata = {
  title: 'Blog',
}

export default async function Blog() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="glass-panel">
        <div className="section-label text-fore-subtle mb-2">Thoughts.Log</div>
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
