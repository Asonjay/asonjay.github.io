import type { Metadata } from 'next'
import { getWorldData } from 'lib/worldData'
import { HomeShell } from 'components/home/HomeShell'
import type { HomePayload, HomePub } from 'components/home/types'
import 'components/home/home-tokens.css'

// Full academic metadata for the landing page. `absolute` title avoids the root
// layout's "%s | Jason Xu" template doubling. OpenGraph is intentionally NOT
// redefined here: Next shallow-merges the top-level `openGraph` key, so a
// partial override would drop the root layout's OG image/siteName/locale. The
// layout's OpenGraph block was written for this landing page (title "Zexin
// (Jason) Xu", the UT Dallas summary, the JJ icon), so it is exactly right as-is.
export const metadata: Metadata = {
  title: { absolute: 'Zexin (Jason) Xu' },
  description:
    'Zexin (Jason) Xu — PhD student at The University of Texas at Dallas, ' +
    'researching multimodal agents and multimodal human state understanding.',
}

// Pull a short bio (first N sentences) from the plain-text intro. Abbreviations
// like "Ph.D." carry internal periods, so mask those before splitting on
// sentence terminators, then restore. The sentinel is built from a char code so
// no literal control character lives in the source.
function firstSentences(text: string, count: number): string {
  const trimmed = text.trim()
  if (!trimmed) return ''
  const mark = String.fromCharCode(1)
  const abbrs = ['Ph.D.', 'M.S.', 'B.S.', 'Dr.', 'Prof.', 'e.g.', 'i.e.', 'vs.', 'St.', 'U.S.']
  let masked = trimmed
  for (const a of abbrs) {
    masked = masked.split(a).join(a.split('.').join(mark))
  }
  const restore = (s: string) => s.split(mark).join('.')
  const matches = masked.match(/[^.!?]+[.!?]+(?:\s|$)/g)
  if (!matches) return restore(masked)
  return restore(matches.slice(0, count).join('').trim())
}

// Server component: reads the aggregated WorldData at build time and hands the
// client grid ONLY the slices each tile renders — the full world object (every
// publication, all news, projects, posts, deadlines, intro code) never
// serializes into the static HTML.
export default async function HomePage() {
  const world = await getWorldData()

  const selectedPublications: HomePub[] = world.publications
    .filter((p) => p.selected)
    .slice(0, 5)
    .map((p) => ({
      title: p.title,
      venue: p.venue,
      year: p.year,
      pdf: p.pdf,
      doi: p.doi,
      code: p.code,
      url: p.url,
    }))

  const email =
    world.social.find((s) => s.icon === 'email')?.url ?? 'mailto:zexin.xu@utdallas.edu'

  const payload: HomePayload = {
    bio:
      firstSentences(world.introPlainText, 2) ||
      'PhD student at The University of Texas at Dallas, researching multimodal agents and multimodal human state understanding.',
    cvUrl: world.cvUrl,
    email,
    selectedPublications,
    news: world.news.slice(0, 4),
    projectCount: world.projects.length,
    postCount: world.posts.length,
    playlist: world.playlist.slice(0, 3),
    social: world.social,
  }

  return <HomeShell payload={payload} />
}
