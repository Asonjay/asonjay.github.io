import Link from 'next/link'

// Year pinned to the build date (same source the classic header/footer use) so
// the server HTML and client render agree — a live new Date() would diverge once
// the build outlives the calendar year and throw a hydration error.
const BUILD_YEAR =
  new Date(process.env.NEXT_PUBLIC_BUILD_DATE || '').getFullYear() ||
  new Date().getFullYear()

export function HomeFooter() {
  return (
    <footer style={{ borderTop: '1px solid var(--home-border)', marginTop: 24 }}>
      <div
        className="mx-auto"
        style={{
          maxWidth: 1100,
          padding: '14px 16px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          fontSize: 12.5,
        }}
      >
        <span className="home-muted">© {BUILD_YEAR} Zexin (Jason) Xu</span>
        <Link href="/classic" className="home-link" style={{ fontWeight: 600 }}>
          Classic archive →
        </Link>
      </div>
    </footer>
  )
}
