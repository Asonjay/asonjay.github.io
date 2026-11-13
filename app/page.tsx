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
import { CV_URL } from '../lib/route'

function ArrowUpRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17L17 7M8 7h9v9" />
    </svg>
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
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 space-y-5 sm:space-y-6">
      {/* ─── Hero: greeting on the glass at the left, profile panel at the right,
          both resting on the same line above the first content panel ─── */}
      <section className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-12 pt-[11svh] pb-2 sm:pt-[14svh] lg:pt-6 lg:pb-8 lg:min-h-[calc(100svh-11.5rem)]">
        <div className="lg:pb-2">
          <h1 className="hero-title on-glass text-fore-primary">
            <span className="block text-fore-secondary">Hi there, I&apos;m</span>
            <span className="block">
              Zexin Xu
              <span className={`hero-name-cjk ${wenKai.className}`}>徐泽鑫</span>
            </span>
          </h1>
          <p className="on-glass mt-5 max-w-[42ch] text-[0.9375rem] sm:text-base leading-relaxed text-fore-secondary">
            My name is pronounced as &quot;Zeh-Shin She&quot;, and I also go by{' '}
            <strong className="font-semibold text-fore-primary">Jason</strong>.
          </p>
          <div className="flex flex-wrap gap-2.5 mt-7">
            <a href={CV_URL} target="_blank" rel="noopener noreferrer" className="btn-solid btn-lg">
              View CV
              <ArrowUpRight />
            </a>
            <Link href="/publications" className="btn-glass btn-lg">
              Publications
              <ArrowUpRight />
            </Link>
          </div>
        </div>

        <aside className="glass-panel !p-4 sm:!p-5 w-full lg:w-[23.5rem] flex-shrink-0" aria-label="Profile">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 flex-shrink-0 avatar-border">
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
              <div className="text-[1.0625rem] font-semibold tracking-tight text-fore-primary leading-tight">
                Zexin (Jason) Xu
              </div>
              <div className="text-[0.8125rem] text-fore-subtle mt-1">PhD Student, Computer Science</div>
            </div>
          </div>

          <dl className="mt-4 space-y-2">
            <div className="panel-list-item">
              <dt className="profile-label">Affiliation</dt>
              <dd className="mt-1 text-[0.9375rem] font-medium text-fore-primary leading-snug">
                University of Texas at Dallas
              </dd>
              <dd className="mt-0.5 text-[0.8125rem] text-fore-subtle leading-snug">
                Co-advised by Dr. Yapeng Tian and Dr. Wei Yang
              </dd>
            </div>
            <div className="panel-list-item">
              <dt className="profile-label">Research focus</dt>
              <dd className="mt-1 text-[0.9375rem] font-medium text-fore-primary leading-snug">
                Egocentric multimodal agents
              </dd>
              <dd className="mt-0.5 text-[0.9375rem] font-medium text-fore-primary leading-snug">
                Multimodal human state understanding
              </dd>
            </div>
          </dl>

          <div className="social-group flex items-stretch rounded-full overflow-hidden mt-3">
            <a href="mailto:zexin.xu@utdallas.edu" aria-label="Email" title="Email" className="social-group-item flex-1">
              <MailAt24 className="w-[1.125rem] h-[1.125rem]" />
            </a>
            <a href="https://scholar.google.com/citations?user=NvnoD1kAAAAJ&hl=en" aria-label="Google Scholar" title="Google Scholar" target="_blank" rel="noopener noreferrer" className="social-group-item flex-1">
              <GoogleScholar24 className="w-[1.125rem] h-[1.125rem]" />
            </a>
            <a href="https://github.com/asonjay" aria-label="GitHub" title="GitHub" target="_blank" rel="noopener noreferrer" className="social-group-item flex-1">
              <GitHub24 className="w-[1.125rem] h-[1.125rem]" />
            </a>
            <a href="https://x.com/zexin_jason_xu" aria-label="Twitter/X" title="Twitter/X" target="_blank" rel="noopener noreferrer" className="social-group-item flex-1">
              <Twitter24 className="w-[1.125rem] h-[1.125rem]" />
            </a>
            <a href="https://www.linkedin.com/in/zexin-xu/" aria-label="LinkedIn" title="LinkedIn" target="_blank" rel="noopener noreferrer" className="social-group-item flex-1">
              <LinkedIn24 className="w-[1.125rem] h-[1.125rem]" />
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
