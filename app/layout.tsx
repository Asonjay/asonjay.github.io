import { Metadata } from 'next'
import { Barlow, JetBrains_Mono, Manrope } from 'next/font/google'
import { Analytics } from '../components/analytics'
import { Footer } from '../components/footer'
import { Header } from '../components/header'
import { MiniPlayer } from '../components/miniPlayer'
import { FlutedBackdrop } from '../components/flutedBackdrop'
import './styles/codeblock.css'
import './styles/globals.css'

const fontBarlow = Barlow({
  subsets: ['latin'],
  variable: '--font-barlow',
  weight: ['400', '500', '600', '700'],
})

const fontManrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
})

const fontJetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://zexinxu.com'),
  title: {
    default: 'Zexin (Jason) Xu',
    template: '%s | Jason Xu',
  },
  description: 'PhD Student at The University of Texas at Dallas',
  openGraph: {
    title: 'Zexin (Jason) Xu',
    description: 'PhD Student at The University of Texas at Dallas',
    url: 'https://zexinxu.com',
    siteName: 'Zexin (Jason) Xu',
    images: [
      {
        url: 'https://zexinxu.com/images/JJ-icon.png',
        width: 512,
        height: 512,
      },
    ],
    locale: 'en-US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  twitter: {
    creator: '@zexin_jason_xu',
    title: 'Zexin (Jason) Xu',
    description: 'PhD Student at The University of Texas at Dallas',
    card: 'summary',
    images: ['https://zexinxu.com/images/JJ-icon.png'],
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
        className={`${fontManrope.variable} ${fontBarlow.variable} ${fontJetBrainsMono.variable} font-sans min-h-screen relative`}
      >
        <FlutedBackdrop />

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
