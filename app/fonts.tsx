import localFont from 'next/font/local'
import { Press_Start_2P } from 'next/font/google'

export const wenKai = localFont({
  src: '../public/fonts/LXGWWenKaiTC-Regular.ttf',
  display: 'swap',
})

export const pixelFont = Press_Start_2P({
  subsets: ['latin'],
  variable: '--font-pixel',
  weight: '400',
})
