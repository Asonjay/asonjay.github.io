import GameLoader from 'components/game/GameLoader'
import { getWorldData } from 'lib/worldData'

// Crawlable, screen-reader-facing navigation for the 3D homepage. The visible
// experience is a WebGL room (canvas is aria-hidden); this list is the real
// content surface for crawlers, assistive tech and the JS-off fallback.
const SEO_LINKS: { href: string; label: string }[] = [
  { href: '/classic', label: 'Classic site' },
  { href: '/publications', label: 'Publications' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/life', label: 'Life' },
  { href: '/deadlines', label: 'Deadlines' },
]

// Server component: aggregates all content into a serializable WorldData object
// at build time and threads it into the client-only game. getWorldData (which
// does fs reads + MDX bundling) is imported ONLY here — it never enters the
// client bundle.
export default async function GamePage() {
  const worldData = await getWorldData()
  return (
    <>
      {/* Visually hidden, but present in the static HTML: the page's single <h1>,
          a plain-text synopsis, and links to every section. Gives crawlers and
          screen readers the actual content behind the 3D scene. */}
      <section className="sr-only">
        <h1>Zexin (Jason) Xu</h1>
        <p>{worldData.introPlainText}</p>
        <nav aria-label="Site sections">
          <ul>
            {SEO_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      <GameLoader data={worldData} />

      {/* JS-off fallback: a full-screen plain-HTML card with the same links. Uses
          the site CSS variables (Next inlines the stylesheet in <head>, so they
          resolve even without JS) rather than utility classes that a JS-off
          runtime can't guarantee. */}
      <noscript>
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 18,
            padding: 24,
            textAlign: 'center',
            background: 'var(--color-back-primary, #0b0e1a)',
            color: 'var(--color-fore-primary, #f2f4ff)',
            fontFamily: 'var(--font-barlow), ui-sans-serif, system-ui, sans-serif',
          }}
        >
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>Zexin (Jason) Xu</h1>
          <p style={{ fontSize: 15, lineHeight: 1.6, maxWidth: '34rem', margin: 0 }}>
            PhD student at The University of Texas at Dallas. This homepage is an
            interactive 3D room that needs JavaScript — use the links below to
            browse the site directly.
          </p>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 14,
              justifyContent: 'center',
            }}
          >
            {SEO_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} style={{ color: 'var(--color-accent, #7c9aff)' }}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </noscript>
    </>
  )
}
