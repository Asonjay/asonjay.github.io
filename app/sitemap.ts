import type { MetadataRoute } from 'next'

const BASE_URL = 'https://zexinxu.com'

// Every indexable route in the static export, listed explicitly because the
// export has no filesystem crawl step. `/` is the content homepage and `/study`
// is the interactive voxel study (the game, formerly served at `/`); the rest
// are the classic content pages.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const routes: {
    path: string
    changeFrequency: 'yearly' | 'monthly' | 'weekly'
    priority: number
  }[] = [
    { path: '/', changeFrequency: 'monthly', priority: 1 },
    { path: '/study', changeFrequency: 'yearly', priority: 0.6 },
    { path: '/classic', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/publications', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/projects', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/blog', changeFrequency: 'weekly', priority: 0.6 },
    { path: '/life', changeFrequency: 'monthly', priority: 0.4 },
    { path: '/deadlines', changeFrequency: 'weekly', priority: 0.4 },
  ]

  return routes.map((r) => ({
    url: `${BASE_URL}${r.path}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))
}
