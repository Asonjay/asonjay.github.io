'use client'

import Link from 'next/link'
import {
  GitHub24,
  MailAt24,
  Twitter24,
  GoogleScholar24,
  LinkedIn24,
} from './icons'

const buildDate =
  process.env.NEXT_PUBLIC_BUILD_DATE ||
  new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

export function Footer() {
  return (
    <footer className="relative z-10 w-full border-t border-[var(--color-border)] mt-20">
      <div className="max-w-screen-xl mx-auto px-6 sm:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          {/* Credits */}
          <div className="font-mono-label text-xs text-fore-subtle tracking-wider text-center sm:text-left">
            <div className="hidden sm:block mb-1">
              Design inspired by{' '}
              <a className="text-accent hover:underline" href="https://variant.com/">
                Variant
              </a>
              . Implemented by{' '}
              <a className="text-accent hover:underline" href="https://claude.ai/code">
                Claude Code
              </a>
              .
            </div>
            <div>
              &copy; 2024 - present. Zexin (Jason) Xu.<br className="sm:hidden" /> Last updated: {buildDate}.
            </div>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-4">
            <a
              href="mailto:zexin.xu@utdallas.edu"
              aria-label="Email"
              title="Email"
              className="social-btn w-9 h-9"
            >
              <MailAt24 className="w-4 h-4" />
            </a>
            <a
              href="https://scholar.google.com/citations?user=NvnoD1kAAAAJ&hl=en"
              aria-label="Google Scholar"
              title="Google Scholar"
              target="_blank"
              rel="noopener noreferrer"
              className="social-btn w-9 h-9"
            >
              <GoogleScholar24 className="w-4 h-4" />
            </a>
            <a
              href="https://github.com/asonjay"
              aria-label="GitHub"
              title="GitHub"
              target="_blank"
              rel="noopener noreferrer"
              className="social-btn w-9 h-9"
            >
              <GitHub24 className="w-4 h-4" />
            </a>
            <a
              href="https://x.com/zexin_jason_xu"
              aria-label="Twitter/X"
              title="Twitter/X"
              target="_blank"
              rel="noopener noreferrer"
              className="social-btn w-9 h-9"
            >
              <Twitter24 className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/zexin-xu/"
              aria-label="LinkedIn"
              title="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
              className="social-btn w-9 h-9"
            >
              <LinkedIn24 className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
