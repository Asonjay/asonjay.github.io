'use client'

import { useState, useRef, useEffect } from 'react'
import { Publication } from '../types/publication'

function generateAPA(pub: Publication): string {
  const authors = pub.authors
    .map((a) => {
      const parts = a.trim().split(/\s+/)
      if (parts.length === 1) return parts[0]
      const last = parts[parts.length - 1]
      const initials = parts
        .slice(0, -1)
        .map((p) => p[0]?.toUpperCase() + '.')
        .join(' ')
      return `${last}, ${initials}`
    })
    .join(', ')
    .replace(/, ([^,]+)$/, ', & $1')

  let citation = `${authors} (${pub.year}). ${pub.title}.`
  if (pub.venue) citation += ` ${pub.venue}.`
  if (pub.doi) citation += ` https://doi.org/${pub.doi}`

  return citation
}

export default function CiteButton({ publication }: { publication: Publication }) {
  const [open, setOpen] = useState(false)
  const [format, setFormat] = useState<'apa' | 'bibtex'>('bibtex')
  const [copied, setCopied] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current) {
      setHeight(open ? contentRef.current.scrollHeight : 0)
    }
  }, [open, format])

  const text = format === 'apa' ? generateAPA(publication) : (publication.bibtex || '')

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className={`btn-outline ${open ? '!bg-accent !text-[var(--color-back-primary)] !border-accent' : ''}`}
      >
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9h6V5l7 7-7 7v-4H6V9z" />
        </svg>
        CITE
      </button>

      <div
        style={{ maxHeight: height }}
        className="w-full overflow-hidden transition-all duration-300 ease-in-out"
      >
        <div ref={contentRef} className="pt-2">
          <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-back-secondary)] p-3">
            {/* Toggle */}
            <div className="flex items-center gap-1 mb-2">
              <button
                onClick={() => setFormat('apa')}
                className={`font-mono-label text-[0.65rem] px-2 py-0.5 rounded transition-colors ${
                  format === 'apa'
                    ? 'bg-accent text-[var(--color-back-primary)]'
                    : 'text-fore-subtle hover:text-fore-primary'
                }`}
              >
                APA
              </button>
              <button
                onClick={() => setFormat('bibtex')}
                className={`font-mono-label text-[0.65rem] px-2 py-0.5 rounded transition-colors ${
                  format === 'bibtex'
                    ? 'bg-accent text-[var(--color-back-primary)]'
                    : 'text-fore-subtle hover:text-fore-primary'
                }`}
              >
                BibTeX
              </button>
              <button
                onClick={handleCopy}
                className="ml-auto font-mono-label text-[0.65rem] px-2 py-0.5 rounded text-fore-subtle hover:text-accent transition-colors"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            {/* Content */}
            <div className="text-xs text-fore-secondary leading-relaxed">
              {format === 'apa' ? (
                <p>
                  {generateAPA(publication).split(publication.venue).map((part, i, arr) =>
                    i < arr.length - 1 ? (
                      <span key={i}>
                        {part}
                        <em>{publication.venue}</em>
                      </span>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
                </p>
              ) : (
                <pre className="whitespace-pre-wrap font-mono text-[0.65rem] leading-relaxed">
                  {publication.bibtex}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
