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
import Introduction from '../components/introduction'
import avatar from '../public/images/profile-img.jpeg'
import { wenKai } from './fonts'

// Follows the Research Interests paragraph of the CV, in the field's own terms.
const RESEARCH_INTERESTS = [
  'Egocentric multimodal agents',
  'Embodied agents',
  'Multimodal learning',
  'Proactive AI assistants',
  'AI in education',
]

function SocialLinks() {
  const icon = 'w-[1.125rem] h-[1.125rem]'
  return (
    <>
      <a href="mailto:zexin.xu@utdallas.edu" aria-label="Email" title="Email" className="social-group-item flex-1">
        <MailAt24 className={icon} />
      </a>
      <a href="https://scholar.google.com/citations?user=NvnoD1kAAAAJ&hl=en" aria-label="Google Scholar" title="Google Scholar" target="_blank" rel="noopener noreferrer" className="social-group-item flex-1">
        <GoogleScholar24 className={icon} />
      </a>
      <a href="https://github.com/asonjay" aria-label="GitHub" title="GitHub" target="_blank" rel="noopener noreferrer" className="social-group-item flex-1">
        <GitHub24 className={icon} />
      </a>
      <a href="https://x.com/zexin_jason_xu" aria-label="Twitter/X" title="Twitter/X" target="_blank" rel="noopener noreferrer" className="social-group-item flex-1">
        <Twitter24 className={icon} />
      </a>
      <a href="https://www.linkedin.com/in/zexin-xu/" aria-label="LinkedIn" title="LinkedIn" target="_blank" rel="noopener noreferrer" className="social-group-item flex-1">
        <LinkedIn24 className={icon} />
      </a>
    </>
  )
}

function ViewAll({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="expand-icon" title={label} aria-label={label}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 17L17 7M8 7h9v9" />
      </svg>
    </Link>
  )
}

export default async function Page() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5 sm:space-y-6">
      {/* ─── Identity: greeting, introduction and profile in one glass panel ─── */}
      <section className="glass-panel grid gap-y-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-x-10" aria-labelledby="identity-title">
        <div className="lg:col-start-1 lg:row-start-1">
          <h1 id="identity-title" className="identity-title name-sheen w-fit max-w-full">
            Hi there, I&apos;m Zexin Xu{' '}
            <span className="whitespace-nowrap">
              (<span className={wenKai.className}>徐泽鑫</span>)
            </span>
          </h1>
          <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-fore-subtle">
            My full name is pronounced as{' '}
            <span className="ipa" lang="en-fonipa">/zɛˈʃɪn ʃiː/</span>, with the &quot;X&quot; sounding
            like &quot;sh&quot;.
          </p>
        </div>

        <aside
          className="flex items-center gap-4 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:flex-col lg:justify-center lg:gap-4 lg:border-l lg:border-[var(--color-border)] lg:pl-10"
          aria-label="Profile"
        >
          <div className="relative w-24 h-24 lg:w-44 lg:h-44 flex-shrink-0 avatar-border">
            <Image
              src={avatar}
              alt="Zexin (Jason) Xu"
              width={256}
              height={256}
              quality={100}
              priority={true}
              placeholder="blur"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 lg:text-center">
            <div className="text-[1.0625rem] font-semibold tracking-tight text-fore-primary leading-tight">
              Zexin (Jason) Xu
            </div>
            <div className="text-[0.8125rem] text-fore-secondary mt-1.5">PhD Candidate</div>
            <div className="text-[0.8125rem] text-fore-subtle">University of Texas at Dallas</div>
          </div>
          <div className="social-group hidden lg:flex items-stretch rounded-full overflow-hidden w-full">
            <SocialLinks />
          </div>
        </aside>

        {/* On phones the social links sit under the photo row, full width. */}
        <div className="social-group flex lg:hidden items-stretch rounded-full overflow-hidden -mt-1">
          <SocialLinks />
        </div>

        <div className="lg:col-start-1 lg:row-start-2">
          <div className="intro-copy text-fore-secondary text-[0.9375rem] leading-relaxed xl:columns-2 xl:gap-10">
            <Introduction />
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-3 pt-5 border-t border-[var(--color-border)] sm:flex-row sm:items-baseline sm:gap-5">
          <h2 className="flex-shrink-0 text-[0.8125rem] font-semibold text-accent-secondary">Research interests</h2>
          <ul className="flex flex-wrap gap-2">
            {RESEARCH_INTERESTS.map(topic => (
              <li key={topic} className="focus-tag">
                {topic}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── News + Publications ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        <section className="lg:col-span-5 glass-panel" aria-labelledby="news-title">
          <div className="flex items-center justify-between mb-4">
            <h2 id="news-title" className="section-label">Latest news</h2>
          </div>
          <NewsList />
        </section>
        <section className="lg:col-span-7 glass-panel" aria-labelledby="publications-title">
          <div className="flex items-center justify-between mb-4">
            <h2 id="publications-title" className="section-label">Recent publications</h2>
            <ViewAll href="/publications" label="View all publications" />
          </div>
          <PublicationList limit={6} />
        </section>
      </div>

      {/* ─── Projects + Blog ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        <section className="lg:col-span-7 glass-panel" aria-labelledby="projects-title">
          <div className="flex items-center justify-between mb-4">
            <h2 id="projects-title" className="section-label">Projects</h2>
            <ViewAll href="/projects" label="View all projects" />
          </div>
          <ProjectList selectedOnly={true} />
        </section>
        <section className="lg:col-span-5 glass-panel" aria-labelledby="blog-title">
          <div className="flex items-center justify-between mb-4">
            <h2 id="blog-title" className="section-label">Blog</h2>
            <ViewAll href="/blog" label="View all blog posts" />
          </div>
          <PostList />
        </section>
      </div>
    </div>
  )
}
