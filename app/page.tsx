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
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 space-y-5 sm:space-y-6">
      {/* ─── Hero: the glass gets the room; name bottom-left, profile top-right ─── */}
      <section className="flex flex-col lg:flex-col-reverse lg:justify-between gap-8 pt-[16svh] pb-4 sm:pt-[20svh] lg:pt-6 lg:pb-8 lg:min-h-[calc(100svh-11.5rem)]">
        <div>
          <h1 className="on-glass text-fore-primary">
            <span className="hero-greeting">Hi there, I&apos;m</span>
            <span className="hero-name">
              Zexin Xu
              <span className={`hero-name-cjk ${wenKai.className}`}>徐泽鑫</span>
            </span>
          </h1>
          <ul className="flex flex-wrap gap-2 mt-6 sm:mt-8">
            <li className="chip">
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M11 5L6 9H3v6h3l5 4V5z" /><path d="M15.5 8.5a5 5 0 010 7" /><path d="M18.5 5.5a9 9 0 010 13" />
              </svg>
              <span>
                Pronounced <strong>&quot;Zeh-Shin She&quot;</strong>
              </span>
            </li>
            <li className="chip">
              <span>
                I also go by <strong>Jason</strong>
              </span>
            </li>
          </ul>
        </div>

        <aside className="glass-panel !p-4 w-full sm:w-[22rem] lg:self-end lg:mt-16">
          <div className="flex items-center gap-4">
            <div className="relative w-[5.5rem] h-[5.5rem] flex-shrink-0 avatar-border">
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
            <div className="min-w-0">
              <div className="text-lg font-medium tracking-tight text-fore-primary leading-tight">
                Zexin (Jason) Xu
              </div>
              <div className="text-sm text-fore-secondary mt-1.5">PhD Student</div>
              <div className="text-sm text-fore-subtle">University of Texas at Dallas</div>
            </div>
          </div>
          <div className="social-group flex items-stretch rounded-full overflow-hidden mt-4">
            <a href="mailto:zexin.xu@utdallas.edu" aria-label="Email" title="Email" className="social-group-item flex-1">
              <MailAt24 className="w-5 h-5" />
            </a>
            <a href="https://scholar.google.com/citations?user=NvnoD1kAAAAJ&hl=en" aria-label="Google Scholar" title="Google Scholar" target="_blank" rel="noopener noreferrer" className="social-group-item flex-1">
              <GoogleScholar24 className="w-5 h-5" />
            </a>
            <a href="https://github.com/asonjay" aria-label="GitHub" title="GitHub" target="_blank" rel="noopener noreferrer" className="social-group-item flex-1">
              <GitHub24 className="w-5 h-5" />
            </a>
            <a href="https://x.com/zexin_jason_xu" aria-label="Twitter/X" title="Twitter/X" target="_blank" rel="noopener noreferrer" className="social-group-item flex-1">
              <Twitter24 className="w-5 h-5" />
            </a>
            <a href="https://www.linkedin.com/in/zexin-xu/" aria-label="LinkedIn" title="LinkedIn" target="_blank" rel="noopener noreferrer" className="social-group-item flex-1">
              <LinkedIn24 className="w-5 h-5" />
            </a>
          </div>
        </aside>
      </section>

      {/* ─── About ─── */}
      <section className="glass-panel" aria-labelledby="about-title">
        <h2 id="about-title" className="section-label mb-4">About</h2>
        <div className="intro-copy text-fore-secondary text-base leading-relaxed lg:columns-2 lg:gap-12">
          <Introduction />
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
            <h2 id="publications-title" className="section-label">Selected publications</h2>
            <ViewAll href="/publications" label="View all publications" />
          </div>
          <PublicationList selectedOnly={true} />
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
