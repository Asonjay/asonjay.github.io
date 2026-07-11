import { Metadata } from 'next'
import { Barlow, Fira_Code, Space_Grotesk, Space_Mono } from 'next/font/google'
import { Analytics } from '../components/analytics'
import { pixelFont } from './fonts'
import './styles/codeblock.css'
import './styles/globals.css'

const fontBarlow = Barlow({
  subsets: ['latin'],
  variable: '--font-barlow',
  weight: ['400', '500', '600', '700'],
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
        className={`${fontBarlow.variable} ${fontSpaceGrotesk.variable} ${fontSpaceMono.variable} ${fontFiraCode.variable} ${pixelFont.variable} font-sans min-h-screen relative`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  )
}
