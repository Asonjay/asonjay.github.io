'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ThemeToggle } from './themeToggle'
import { CV_URL, routes } from '../lib/route'
import JJIcon from '../public/images/JJ-icon.png'
import JJIconLight from '../public/images/JJ-icon-light.png'

function isCurrent(route: { path: string; exact?: boolean }, path: string) {
  return route.exact === true ? route.path === path : path.startsWith(route.path)
}

export function Header() {
  const path = usePathname()
  const [musicPlaying, setMusicPlaying] = useState(false)
  const [musicTrack, setMusicTrack] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const stateHandler = (e: Event) => setMusicPlaying((e as CustomEvent).detail)
    const trackHandler = (e: Event) => setMusicTrack((e as CustomEvent).detail)
    window.addEventListener('music-state', stateHandler)
    window.addEventListener('music-track', trackHandler)
    return () => {
      window.removeEventListener('music-state', stateHandler)
      window.removeEventListener('music-track', trackHandler)
    }
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [path])

  // Lock body scroll when menu open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.removeProperty('overflow')
    }
  }, [mobileMenuOpen])

  return (
    // The header itself lets clicks through; only the three pills catch them.
    <header className="sticky top-0 z-50 w-full pointer-events-none">
      <div className="nav-haze" aria-hidden="true" />
      <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <nav
          className="flex items-center justify-between gap-2 lg:grid lg:grid-cols-[1fr_auto_1fr]"
          aria-label="Main Navigation"
        >
          {/* Left: name mark */}
          <Link
            href="/"
            className="nav-pill flex gap-2.5 !pl-3 !pr-[1.125rem] lg:justify-self-start min-w-0"
          >
            <span className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 relative">
              <Image
                src={JJIcon}
                alt=""
                width={36}
                height={36}
                priority={true}
                className="absolute inset-0 transition-opacity duration-300 icon-dark"
              />
              <Image
                src={JJIconLight}
                alt=""
                width={36}
                height={36}
                priority={true}
                className="absolute inset-0 transition-opacity duration-300 icon-light"
              />
            </span>
            <span className="font-brand font-semibold text-[1.0625rem] tracking-tight text-fore-primary whitespace-nowrap">
              Zexin Xu
            </span>
          </Link>

          {/* Centre: page links (large screens only) */}
          <div className="nav-pill hidden lg:flex gap-0.5">
            {routes.map(route => (
              <Link
                key={route.path}
                href={route.path}
                className="nav-link"
                aria-current={isCurrent(route, path) ? 'page' : undefined}
              >
                {route.label}
              </Link>
            ))}
            <a href={CV_URL} target="_blank" rel="noopener noreferrer" className="nav-link">
              CV <span className="text-[0.6875rem] font-normal text-fore-subtle">03.26</span>
            </a>
          </div>

          {/* Right: now playing, music, theme, menu */}
          <div className="nav-pill flex gap-0.5 lg:justify-self-end">
            {musicPlaying && (
              <span className="hidden md:inline-block w-[14ch] overflow-hidden ml-3 mr-1 text-[0.8125rem] font-medium text-fore-secondary">
                <span className="inline-block animate-[marqueeScroll_12s_linear_infinite] whitespace-nowrap">
                  Vibing: {musicTrack}
                </span>
              </span>
            )}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('toggle-player'))}
              className="icon-btn"
              aria-label="Toggle music player"
              title="Toggle music player"
            >
              {musicPlaying ? (
                <span className="flex items-end justify-center gap-[2px] w-3.5 h-3.5">
                  <span className="w-[2px] h-full bg-current rounded-sm animate-[barBounce_0.4s_ease-in-out_infinite_alternate]" />
                  <span className="w-[2px] h-2/3 bg-current rounded-sm animate-[barBounce_0.4s_ease-in-out_infinite_alternate_0.15s]" />
                  <span className="w-[2px] h-1/3 bg-current rounded-sm animate-[barBounce_0.4s_ease-in-out_infinite_alternate_0.3s]" />
                </span>
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                </svg>
              )}
            </button>
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="icon-btn lg:hidden"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile dropdown menu */}
        <div
          id="mobile-menu"
          className={`lg:hidden mt-2 nav-menu overflow-hidden grid transition-all duration-300 ease-out border ${
            mobileMenuOpen
              ? 'grid-rows-[1fr] opacity-100 border-[var(--color-panel-border)]'
              : 'grid-rows-[0fr] opacity-0 border-transparent !pointer-events-none'
          }`}
        >
          <div className="overflow-hidden" {...(mobileMenuOpen ? {} : { inert: '' })}>
            <div className="flex flex-col p-2">
              {routes.map(route => (
                <Link
                  key={route.path}
                  href={route.path}
                  className="nav-menu-link"
                  aria-current={isCurrent(route, path) ? 'page' : undefined}
                >
                  {route.label}
                </Link>
              ))}
              <a href={CV_URL} target="_blank" rel="noopener noreferrer" className="nav-menu-link">
                CV <span className="text-xs font-normal text-fore-subtle">03.26</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
