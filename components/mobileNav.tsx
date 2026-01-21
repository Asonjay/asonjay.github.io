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
      {/* Fixed menu button - outside main container to avoid layout issues */}
      <button
        type="button"
        className="fixed right-4 top-4 z-[9999] p-3 sm:hidden focus:outline-none bg-back-secondary rounded-lg shadow-md"
        style={{
          transform: 'translate3d(0,0,0)',
          WebkitTransform: 'translate3d(0,0,0)',
        }}
        onClick={_ => {
          setNavShow(!navShow)
        }}
      >
        {navShow ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8h16M4 16h16"
            />
          </svg>
        )}
      </button>

      {navShow && (
        <div className="relative z-50">
          <div className="fixed w-full h-screen bg-back-primary"></div>
          <button
            type="button"
            className="fixed w-full h-screen cursor-auto"
            onClick={e => {
              setNavShow(!navShow)
            }}
          ></button>
          <nav className="fixed flex flex-col items-center w-full h-screen px-6 py-48 mt-auto text-base tracking-widest text-fore-primary">
            {routes.map(route => (
              <MobileNavLink
                key={route.path}
                to={route.path}
                title={route.label}
                selected={
                  route.exact === true
                    ? route.path === path
                    : path.startsWith(route.path)
                }
                hide={() => setNavShow(false)}
              />
            ))}
            <ThemeToggle />
          </nav>
        </div>
      )}
    </>
  )
}

function MobileNavLink({ to, title, selected, hide }) {
  return (
    <div className="flex-grow">
      <Link
        href={to}
        className={classNames({
          'text-accent': !!selected,
        })}
        onClick={_ => hide()}
      >
        {title}
      </Link>
    </div>
  )
}
