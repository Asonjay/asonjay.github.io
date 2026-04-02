'use client'

import classNames from 'classnames'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ThemeToggle } from './themeToggle'
import { routes } from '../lib/route'

export function MobileNav() {
  const [navShow, setNavShow] = useState(false)
  const path = usePathname()

  useEffect(() => {
    const body = document.body
    if (typeof body !== 'undefined') {
      if (navShow) {
        body.style.setProperty('overflow', 'hidden')
      } else {
        body.style.removeProperty('overflow')
      }
    }
  }, [navShow])

  return (
    <>
      {/* Fixed menu button -- visible below lg */}
      <button
        type="button"
        className="fixed right-4 top-5 z-[9999] p-2.5 lg:hidden focus:outline-none border border-[var(--color-border)] rounded-xl backdrop-blur-xl"
        style={{
          background: 'var(--color-panel-bg)',
          transform: 'translate3d(0,0,0)',
          WebkitTransform: 'translate3d(0,0,0)',
        }}
        onClick={() => setNavShow(!navShow)}
      >
        {navShow ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        )}
      </button>

      {navShow && (
        <div className="fixed inset-0 z-[9998]">
          <div
            className="absolute inset-0 bg-[var(--color-back-primary)] backdrop-blur-xl"
            style={{ opacity: 0.95 }}
          ></div>
          <button
            type="button"
            className="absolute inset-0 cursor-auto"
            onClick={() => setNavShow(false)}
          ></button>
          <nav className="relative flex flex-col items-center justify-center h-full gap-8">
            {routes.map(route => {
              const isSelected = route.exact === true
                ? route.path === path
                : path.startsWith(route.path)
              return (
                <Link
                  key={route.path}
                  href={route.path}
                  onClick={() => setNavShow(false)}
                  className={classNames(
                    'font-mono-label text-sm uppercase tracking-[0.2em] transition-colors',
                    {
                      'text-accent': isSelected,
                      'text-fore-subtle hover:text-fore-primary': !isSelected,
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
              onClick={() => setNavShow(false)}
              className="font-mono-label text-sm uppercase tracking-[0.2em] text-fore-subtle hover:text-fore-primary transition-colors"
            >
              CV
            </a>
            <div className="mt-4">
              <ThemeToggle className="text-lg" />
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
