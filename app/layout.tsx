import { Metadata } from 'next'
import { Fira_Code, Inter_Tight } from 'next/font/google'
import { Analytics } from '../components/analytics'
import { Footer } from '../components/footer'
import { Header } from '../components/header'
import { Contact } from '../components/contact'
import { MobileNav } from '../components/mobileNav'
import './styles/codeblock.css'
import './styles/globals.css'

const FontInterTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-inter',
})

const FontFiraCode = Fira_Code({
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
  // openGraph: {
  //   title: 'Zexin (Jason) Xu',
  //   description: 'PhD Student at UTD',
  //   url: 'https://asonjay.github.io',
  //   siteName: 'Zexin (Jason) Xu',
  //   images: [
  //     {
  //       url: 'https://asonjay.github.io/static/og/default.png',
  //       width: 1280,
  //       height: 675,
  //     },
  //   ],
  //   locale: 'en-US',
  //   type: 'website',
  // },
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
    <html lang="en">
      <body
        className={`${FontInterTight.variable} ${FontFiraCode.variable} font-sans flex flex-col min-h-screen relative`}
      >
        <MobileNav />
        <Header />
        <main className="container flex-grow max-w-screen-xl px-5 m-auto mt-6 sm:px-12 md:px-20">
          {children}
        </main>
        <Contact />
        <Footer />
        <Analytics />
        <BackgroundNoise />
      </body>
    </html>
  )
}

function BackgroundNoise() {
  return (
    <div className="absolute inset-0 -z-20 opacity-80 h-full mix-blend-overlay noise-bg"></div>
  )
}
