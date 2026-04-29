/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['i.scdn.co', 'a.ltrbxd.com', 'steamcdn-a.akamaihd.net'],
  },
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  experimental: {
    mdxRs: true,
  },
  basePath: '',
  env: {
    // Pinned at build time so server-rendered HTML and client JS agree.
    // Without this, header/footer call new Date() in both environments and
    // diverge once the build is older than the viewing date, which throws
    // React hydration errors (#418/#423/#425).
    NEXT_PUBLIC_BUILD_DATE: process.env.NEXT_PUBLIC_BUILD_DATE || new Date().toISOString(),
  },
}

module.exports = nextConfig
