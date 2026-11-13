// app/publications/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { getAllPublications } from '../../lib/publications'
import PublicationFilter from '../../components/publicationFilter'

export const metadata: Metadata = {
  title: 'Publications',
}

export default async function Publications() {
  const publications = await getAllPublications()
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="glass-panel">
        <div className="flex items-center justify-between mb-2">
          <div className="crumb"><Link href="/">Home</Link> / Publications</div>
          <Link href="/" className="shrink-icon" title="Back to home">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7" />
            </svg>
          </Link>
        </div>
        <h1 className="page-title text-fore-primary mb-4">
          Publications
        </h1>
        <p className="text-sm text-fore-subtle mb-6 max-w-3xl leading-relaxed">
          My research interests lie in multimodal learning and AI agents. I
          currently focus on egocentric multimodal agents that understand what a
          user is doing from first-person video and audio and offer help
          proactively. My publications also span embodied agents, the security
          and alignment of large language models, and learning technology.
        </p>
        <div className="h-px bg-[var(--color-border)] mb-4"></div>
        <PublicationFilter publications={publications} />
      </div>
    </div>
  )
}
