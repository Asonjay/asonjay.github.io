'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import JJIcon from '../public/images/JJ-icon.png'
import { NavLink } from './atoms'
import { ThemeToggle } from './themeToggle'
import { routes } from '../lib/route'

export function Header() {
  const path = usePathname()
  return (
    <header className="container h-32 max-w-screen-xl px-5 m-auto overflow-hidden sm:px-12 md:px-20">
      <nav
        className="flex items-center justify-start h-full mt-auto space-x-6 text-sm md:justify-start"
        aria-label="Main Navigation"
      >
        <Link
          href="/"
          aria-label="Website logo, go back to homepage."
          className="flex items-center border-white group"
        >
          <div className="flex items-center">
            <div className="overflow-hidden transition-transform ease-in-out border-3 rounded-full w-9 h-9 group-hover:-translate-y-1">
              <Image
                src={JJIcon}
                alt="My avatar"
                width={36}
                height={36}
                priority={true}
              />
            </div>
            <div className="inline ml-3 text-base font-semibold sm:hidden">
              <span className="group-hover:text-accent text-fore-subtle">
                zexinxu
              </span>
              <span className="text-accent">.com</span>
            </div>
          </div>
        </Link>
        <div className="flex-col items-left flex-grow hidden sm:flex">
          <div className="flex space-x-6">
            {routes.map(route => (
              <NavLink
                key={route.path}
                to={route.path}
                title={route.label}
                selected={
                  route.exact === true
                    ? route.path === path
                    : path.startsWith(route.path)
                }
              />
            ))}
            <div className="w-full h-[1.5px] bg-back-subtle mt-2.5" />
          </div>
        </div>
        <ThemeToggle className="hidden mt-1 transition-transform ease-in-out focus:outline-none sm:block hover:text-accent hover:-translate-y-1 " />
      </nav>
    </header>
  )
}
