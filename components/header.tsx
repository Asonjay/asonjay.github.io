'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ThemeToggle } from './themeToggle'
import { routes } from '../lib/route'
import classNames from 'classnames'
import JJIcon from '../public/images/JJ-icon.png'
import JJIconLight from '../public/images/JJ-icon-light.png'

const buildDate = (() => {
  const raw = process.env.NEXT_PUBLIC_BUILD_DATE
  if (!raw) {
    const d = new Date()
    return `${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}${String(d.getFullYear()).slice(2)}`
  }
  try {
    const d = new Date(raw)
    return `${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}${String(d.getFullYear()).slice(2)}`
  } catch {
    return raw
  }
})()

export function Header() {
  const path = usePathname()
  const [musicPlaying, setMusicPlaying] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => setMusicPlaying((e as CustomEvent).detail)
    window.addEventListener('music-state', handler)
    return () => window.removeEventListener('music-state', handler)
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
    <header className="sticky top-0 z-50 w-full">
      {/* Blur backdrop */}
      <div className="absolute inset-0 h-[calc(100%+20px)] backdrop-blur-md bg-[var(--color-back-primary)]/80 [mask-image:linear-gradient(black_70%,transparent)] [-webkit-mask-image:linear-gradient(black_70%,transparent)] pointer-events-none" />
      {/* Fake dot grid to match background */}
      <div className="header-dots absolute inset-0 h-[calc(100%+20px)] pointer-events-none [mask-image:linear-gradient(black_70%,transparent)] [-webkit-mask-image:linear-gradient(black_70%,transparent)]" />
      <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <nav
          className="glass-panel !py-3 !px-4 lg:!px-5 !rounded-xl flex items-center justify-between font-mono-label text-xs text-fore-subtle uppercase tracking-widest !transform-none hover:!transform-none hover:!shadow-none hover:!border-[var(--color-border)]"
          aria-label="Main Navigation"
        >
          {/* Left: Icon + Name (always visible) */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:text-accent transition-colors flex-shrink-0"
          >
            <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 relative">
              <Image
                src={JJIcon}
                alt="JJ Logo"
                width={28}
                height={28}
                priority={true}
                className="absolute inset-0 transition-opacity duration-300 icon-dark"
              />
              <Image
                src={JJIconLight}
                alt="JJ Logo"
                width={28}
                height={28}
                priority={true}
                className="absolute inset-0 transition-opacity duration-300 icon-light"
              />
            </div>
            <span>@ZEXIN_XU</span>
          </Link>

          {/* Center: Nav links (large screens only) */}
          <div className="hidden lg:flex items-center gap-2">
            {routes.map(route => {
              const isActive = route.exact === true
                ? route.path === path
                : path.startsWith(route.path)
              return (
                <Link
                  key={route.path}
                  href={route.path}
                  className={classNames(
                    'transition-all duration-200 text-xs tracking-widest px-3 py-1.5 rounded-lg',
                    {
                      'text-accent bg-[rgba(255,255,255,0.08)] backdrop-blur-sm border border-[var(--color-border)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]': isActive,
                      'text-fore-subtle hover:text-accent hover:bg-[rgba(255,255,255,0.12)] border border-transparent hover:border-[var(--color-border)]': !isActive,
                    }
                  )}
                >
                  {route.label}
                </Link>
              )
            })}
            <a
              href="https://docs.google.com/viewer?url=https://raw.githubusercontent.com/asonjay/asonjay.github.io/master/public/cv/Zexin_Xu_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-all duration-200 text-xs tracking-widest px-3 py-1.5 rounded-lg text-fore-subtle hover:text-accent hover:bg-[rgba(255,255,255,0.12)] border border-transparent hover:border-[var(--color-border)] flex items-center gap-1.5"
            >
              CV <span className="text-[0.55rem] opacity-50 normal-case tracking-normal">(03.26)</span>
            </a>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Status (hidden on small) */}
            <span className={`w-1.5 h-1.5 rounded-full animate-[blink_2s_ease-in-out_infinite] transition-colors duration-300 hidden md:block ${musicPlaying ? 'bg-[#ff0044] shadow-[0_0_8px_#ff0044]' : 'bg-accent shadow-[0_0_8px_var(--color-accent)]'}`}></span>
            <span className="hidden md:inline text-fore-subtle transition-all duration-300">
              {musicPlaying ? 'VIBING_' : 'ONLINE_'} (VER.{buildDate})
            </span>
            <ThemeToggle />
            {/* Hamburger menu button (below lg) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.1)] transition-colors"
            >
              <span className="text-[0.65rem]">{mobileMenuOpen ? 'CLOSE' : 'MENU'}</span>
              {mobileMenuOpen ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden mt-2 rounded-xl border border-[var(--color-border)] backdrop-blur-xl overflow-hidden"
            style={{ background: 'var(--color-panel-bg)' }}
          >
            <div className="flex flex-col py-2">
              {routes.map(route => {
                const isActive = route.exact === true
                  ? route.path === path
                  : path.startsWith(route.path)
                return (
                  <Link
                    key={route.path}
                    href={route.path}
                    className={classNames(
                      'px-5 py-3 font-mono-label text-xs uppercase tracking-widest transition-colors',
                      {
                        'text-accent bg-[rgba(255,255,255,0.06)]': isActive,
                        'text-fore-subtle hover:text-accent hover:bg-[rgba(255,255,255,0.04)]': !isActive,
                      }
                    )}
                  >
                    {route.label}
                  </Link>
                )
              })}
              <a
                href="https://docs.google.com/viewer?url=https://raw.githubusercontent.com/asonjay/asonjay.github.io/master/public/cv/Zexin_Xu_CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 font-mono-label text-xs uppercase tracking-widest text-fore-subtle hover:text-accent hover:bg-[rgba(255,255,255,0.04)] transition-colors flex items-center gap-1.5"
              >
                CV <span className="text-[0.55rem] opacity-50 normal-case tracking-normal">(03.26)</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
