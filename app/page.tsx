import type { Metadata } from 'next'
import Link from 'next/link'

// Minimal bridge homepage. Task 13 replaces this with the bento content page;
// for now `/` just names the site and points at its two real destinations — the
// interactive voxel study and the classic site. This renders on the bare root
// layout only: no `.game-ui` scope, no classic chrome (Header/Footer/etc.).
export const metadata: Metadata = {
  title: { absolute: 'Zexin (Jason) Xu' },
  description: 'PhD student at The University of Texas at Dallas.',
}

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        padding: 24,
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>
        Zexin (Jason) Xu
      </h1>
      <p
        style={{
          fontSize: 16,
          lineHeight: 1.6,
          maxWidth: '34rem',
          margin: 0,
          color: 'var(--color-fore-subtle)',
        }}
      >
        PhD student at The University of Texas at Dallas.
      </p>
      <nav style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
        <Link href="/study" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>
          Explore the voxel study
        </Link>
        <Link href="/classic" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>
          Classic site
        </Link>
      </nav>
    </main>
  )
}
