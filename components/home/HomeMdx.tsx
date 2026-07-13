'use client'
import { useMemo } from 'react'
import type { ReactNode } from 'react'
import { getMDXComponent } from 'mdx-bundler/client'

// Home-scoped MDX renderer for authored news bodies. The classic
// components/mdxComponents.tsx maps to classic theme classes and the game's
// panelMdx maps to .game-ui — both are off-limits here, so news renders through
// this minimal set styled entirely from home tokens. Same client-side
// getMDXComponent mechanism the game's NewsPanel uses.
type P = { children?: ReactNode; href?: string; [key: string]: unknown }

const link = ({ href = '', children, ...rest }: P) => {
  const external = /^(https?:|mailto:)/.test(href)
  return (
    <a
      {...rest}
      href={href}
      className="home-link"
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  )
}

const homeMdxComponents = {
  a: link,
  p: (props: P) => <p style={{ margin: 0 }} {...props} />,
  strong: (props: P) => (
    <strong style={{ fontWeight: 600, color: 'var(--home-text)' }} {...props} />
  ),
  em: (props: P) => <em style={{ fontStyle: 'italic' }} {...props} />,
}

export function HomeMdx({ code }: { code: string }) {
  const Component = useMemo(() => getMDXComponent(code), [code])
  return <Component components={homeMdxComponents} />
}
