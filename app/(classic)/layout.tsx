import { Footer } from 'components/footer'
import { Header } from 'components/header'
import { MiniPlayer } from 'components/miniPlayer'
import { MouseTracker } from 'components/mouseTracker'
import { BackgroundVideo } from 'components/backgroundVideo'

export default function ClassicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Background video */}
      <BackgroundVideo src="/videos/background.mp4" speed={0.5} />
      <div className="bg-video-overlay" aria-hidden="true" />
      {/* Ambient Background */}
      <MouseTracker />
      <div className="ambient-bg">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>
      <div className="tech-grid"></div>

      {/* Content */}
      <div className="page-content flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
      <MiniPlayer />
    </>
  )
}
