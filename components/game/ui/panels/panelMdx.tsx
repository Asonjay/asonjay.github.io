'use client'
import { useMemo } from 'react'
import type { ReactNode } from 'react'
import { getMDXComponent } from 'mdx-bundler/client'

// Game-scoped MDX renderer. The classic site's components/mdxComponents.tsx maps
// to classic theme classes (text-accent, glass blockquotes, ...), which are
// banned inside the game, so the panels render authored MDX (intro, news)
// through this minimal set styled entirely from kit tokens. Same client-side
// getMDXComponent mechanism components/newsList.tsx uses.

type P = { children?: ReactNode; href?: string; [key: string]: unknown }

const link = ({ href = '', children, ...rest }: P) => {
  const external = /^(https?:|mailto:)/.test(href)
  return (
    <a
      {...rest}
      href={href}
      className="gp-link"
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  )
}

export const panelMdxComponents = {
  a: link,
  p: (props: P) => <p style={{ margin: '0 0 0.75em' }} {...props} />,
  strong: (props: P) => (
    <strong style={{ fontWeight: 600, color: 'var(--gp-text)' }} {...props} />
  ),
  em: (props: P) => <em style={{ fontStyle: 'italic' }} {...props} />,
  ul: (props: P) => (
    <ul
      style={{ margin: '0 0 0.75em', paddingLeft: '1.2em', listStyle: 'square' }}
      {...props}
    />
  ),
  ol: (props: P) => (
    <ol style={{ margin: '0 0 0.75em', paddingLeft: '1.2em' }} {...props} />
  ),
  li: (props: P) => <li style={{ marginTop: '0.25em' }} {...props} />,
  h2: (props: P) => (
    <h2
      style={{
        fontFamily: 'var(--font-pixel), monospace',
        fontSize: 12,
        lineHeight: 1.4,
        color: 'var(--gp-accent)',
        margin: '1.2em 0 0.6em',
      }}
      {...props}
    />
  ),
  h3: (props: P) => (
    <h3
      style={{
        fontWeight: 700,
        fontSize: 15,
        color: 'var(--gp-text)',
        margin: '1em 0 0.5em',
      }}
      {...props}
    />
  ),
  hr: () => (
    <hr
      style={{
        border: 'none',
        height: 2,
        margin: '1em 0',
        background:
          'repeating-linear-gradient(90deg, var(--gp-border) 0 6px, transparent 6px 10px)',
        opacity: 0.5,
      }}
    />
  ),
}

export function PanelMdx({ code }: { code: string }) {
  const Component = useMemo(() => getMDXComponent(code), [code])
  return <Component components={panelMdxComponents} />
}
