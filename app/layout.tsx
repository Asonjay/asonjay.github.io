import { Metadata } from 'next'
import { Fira_Code, Inter, Space_Grotesk, Space_Mono } from 'next/font/google'
import { Analytics } from '../components/analytics'
import { Footer } from '../components/footer'
import { Header } from '../components/header'
import { MiniPlayer } from '../components/miniPlayer'
import './styles/codeblock.css'
import './styles/globals.css'

const fontInter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const fontSpaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['700'],
})

const fontSpaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-space-mono',
  weight: ['400', '700'],
})

const fontFiraCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://asonjay.github.io'),
  title: {
    default: 'Zexin (Jason) Xu',
    template: '%s | Jason Xu',
  },
  description: 'PhD Student at UTD',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  twitter: {
    creator: '@',
    title: 'Jason Xu',
    card: 'summary_large_image',
  },
  icons: {
    shortcut: '/static/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${fontInter.variable} ${fontSpaceGrotesk.variable} ${fontSpaceMono.variable} ${fontFiraCode.variable} font-sans min-h-screen relative`}
      >
        {/* Ambient Background */}
        <div className="ambient-bg">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
        <div className="tech-grid"></div>


        {/* Content */}
        <div className="page-content flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
        <MiniPlayer />
        <Analytics />
      </body>
    </html>
  )
}
