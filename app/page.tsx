import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import {
  MailAt24,
  GitHub24,
  Twitter24,
  GoogleScholar24,
  LinkedIn24,
} from '../components/icons'
import PostList from 'components/postList'
import NewsList from 'components/newsList'
import PublicationList from 'components/publicationList'
import ProjectList from 'components/projectList'
import { DeadlineSection } from 'components/deadlineSection'
import { getAllConferences } from '../lib/deadlines'
import Introduction from '../components/introduction'
import avatar from '../public/images/profile-img.jpeg'
import { wenKai } from './fonts'

export default async function Page() {
  const conferences = await getAllConferences('all', true)
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* ─── Top Row: Identity + Profile ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bio Panel */}
        <div className="lg:col-span-9 glass-panel flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="section-label text-fore-subtle">Identity</div>
          </div>
          <h1 className="font-heading text-4xl sm:text-[2.75rem] font-bold tracking-tight mb-2 text-fore-primary">
            Hi there, I&apos;m Zexin Xu (<span className={wenKai.className}>徐泽鑫</span>)! 👋
          </h1>
          <div className="font-mono-label text-xs text-fore-subtle mb-4 flex items-center gap-2 bg-[var(--color-back-accent)] border border-[var(--color-border)] rounded-md px-3 py-2 w-fit">
            <span>💡</span>
            <span>My name is pronounced as &quot;Zeh-Shin She&quot;, and I also go by <strong className="text-accent">Jason</strong>.</span>
          </div>
          <div className="text-fore-primary text-sm sm:text-base leading-relaxed">
            <Introduction />
          </div>
        </div>

        {/* Right column: Profile + Deadlines */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Profile Panel: Avatar + Social */}
          <div className="glass-panel flex flex-col items-center gap-5">
            <div className="section-label text-fore-subtle w-full">Profile</div>
            <div className="relative w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-2xl avatar-border">
              <Image
                src={avatar}
                alt="Zexin (Jason) Xu"
                width={256}
                height={256}
                quality={100}
                priority={true}
                placeholder="blur"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            {/* Social links bar */}
            <div className="social-group flex items-center rounded-xl overflow-hidden max-w-full">
              <a href="mailto:zexin.xu@utdallas.edu" aria-label="Email" title="Email" className="social-group-item">
                <MailAt24 className="w-4 h-4" />
              </a>
              <a href="https://scholar.google.com/citations?user=NvnoD1kAAAAJ&hl=en" aria-label="Google Scholar" title="Google Scholar" target="_blank" rel="noopener noreferrer" className="social-group-item">
                <GoogleScholar24 className="w-4 h-4" />
              </a>
              <a href="https://github.com/asonjay" aria-label="GitHub" title="GitHub" target="_blank" rel="noopener noreferrer" className="social-group-item">
                <GitHub24 className="w-4 h-4" />
              </a>
              <a href="https://x.com/zexin_jason_xu" aria-label="Twitter/X" title="Twitter/X" target="_blank" rel="noopener noreferrer" className="social-group-item">
                <Twitter24 className="w-4 h-4" />
              </a>
              <a href="https://www.linkedin.com/in/zexin-xu/" aria-label="LinkedIn" title="LinkedIn" target="_blank" rel="noopener noreferrer" className="social-group-item">
                <LinkedIn24 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Deadlines Panel */}
          <div className="glass-panel flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="section-label text-fore-subtle">Deadlines</div>
              <Link href="/deadlines" className="expand-icon" title="View all deadlines">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              </Link>
            </div>
            <DeadlineSection conferences={conferences} limit={50} />
          </div>
        </div>
      </div>

      {/* ─── Middle Row: News + Publications ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* News Panel */}
        <div className="lg:col-span-5 glass-panel">
          <div className="flex items-center justify-between mb-4">
            <div className="section-label text-fore-subtle">Latest_News</div>
          </div>
          <NewsList />
        </div>

        {/* Publications Panel */}
        <div className="lg:col-span-7 glass-panel">
          <div className="flex items-center justify-between mb-4">
            <div className="section-label text-fore-subtle">Selected_Publications</div>
            <Link href="/publications" className="expand-icon" title="View all publications">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </Link>
          </div>
          <PublicationList selectedOnly={true} />
        </div>
      </div>

      {/* ─── Bottom Row: Projects + Blog ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Projects Panel */}
        <div className="lg:col-span-7 glass-panel">
          <div className="flex items-center justify-between mb-4">
            <div className="section-label text-fore-subtle">Projects</div>
            <Link href="/projects" className="expand-icon" title="View all projects">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </Link>
          </div>
          <ProjectList selectedOnly={true} />
        </div>

        {/* Blog Panel */}
        <div className="lg:col-span-5 glass-panel">
          <div className="flex items-center justify-between mb-4">
            <div className="section-label text-fore-subtle">Blog</div>
            <Link href="/blog" className="expand-icon" title="View all blog posts">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </Link>
          </div>
          <PostList />
        </div>
      </div>

    </div>
  )
}
