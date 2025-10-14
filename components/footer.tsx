'use client'
import { routes } from '../lib/route'
import { NavLink } from './atoms'
import {
  GitHub24,
  MailAt24,
  Twitter24,
  GoogleScholar24,
  LinkedIn24,
} from './icons'

// Create a new constant that will be set at build time
const buildDate =
  process.env.NEXT_PUBLIC_BUILD_DATE ||
  new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

export function Footer() {
  return (
    <footer className="relative w-full h-28 overflow-hidden bg-back-secondary text-secondary">
      <div className="container h-full px-5 pt-8 m-auto max-w-screen-xl md:px-20">
        <div className="container flex-col justify-between md:space-y-4">
          <nav className="flex-row items-center justify-center hidden space-x-6 text-sm lg:flex md:justify-end">
            {routes.map(route => (
              <NavLink key={route.path} to={route.path} title={route.label}>
                {route.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex flex-col md:flex-row md:justify-between md:items-end">
            <div className="text-xs tracking-wider md:max-w-[70%] order-2 md:order-1">
              <div className="hidden md:block">
                Built with{' '}
                <a className="underline" href="https://nextjs.org/">
                  Next.js
                </a>
                . Inspired by{' '}
                <a className="underline" href="https://jeffjadulco.com/">
                  Jeff Jadulco
                </a>{' '}
                and{' '}
                <a className="underline" href="https://victordibia.com/">
                  Victor Dibia
                </a>
                .
              </div>
              <div>
                © 2024 - present. Zexin (Jason) Xu. All Rights Reserved. Last
                updated: {buildDate}.
              </div>
            </div>
            <div className="flex flex-row items-center justify-center space-x-6 md:justify-end order-1 md:order-2">
              <span>
                <a
                  href="mailto:zexin.xu@utdallas.edu"
                  aria-label="Email zexin.xu@utdallas.edu"
                  title="Email"
                  className="focus:text-accent"
                >
                  <MailAt24 className="transition-transform ease-in-out hover:-translate-y-1 hover:text-accent" />
                </a>
              </span>
              <span>
                <a
                  href="https://scholar.google.com/citations?user=NvnoD1kAAAAJ&hl=en"
                  aria-label="Visit Google Scholar Profile"
                  title="Visit Google Scholar Profile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus:text-accent"
                >
                  <GoogleScholar24 className="transition-transform ease-in-out hover:-translate-y-1 hover:text-accent" />
                </a>
              </span>
              <span>
                <a
                  href="https://github.com/asonjay"
                  aria-label="Visit GitHub profile"
                  title="Visit GitHub profile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus:text-accent"
                >
                  <GitHub24 className="transition-transform ease-in-out hover:-translate-y-1 hover:text-accent" />
                </a>
              </span>
              <span>
                <a
                  href="https://x.com/zexin_jason_xu"
                  aria-label="Visit Twitter profile"
                  title="Visit Twitter profile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus:text-accent"
                >
                  <Twitter24 className="transition-transform ease-in-out hover:-translate-y-1 hover:text-accent" />
                </a>
              </span>
              <span>
                <a
                  href="https://www.linkedin.com/in/zexin-xu/"
                  aria-label="Visit LinkedIn Profile"
                  title="Visit LinkedIn Profile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus:text-accent"
                >
                  <LinkedIn24 className="transition-transform ease-in-out hover:-translate-y-1 hover:text-accent" />
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
