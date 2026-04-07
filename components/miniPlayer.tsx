'use client'

import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    SC: any
    __sc_api_loaded?: boolean
  }
}

const tracks = [
  { title: 'Dose', artist: 'Teddy Swims', url: 'https://soundcloud.com/teddyswims/dose' },
  { title: 'Bad Dream', artist: 'Teddy Swims', url: 'https://soundcloud.com/teddyswims/bad-dream' },
  { title: 'Less Than Zero', artist: 'The Weeknd', url: 'https://soundcloud.com/theweeknd/the-weeknd-less-than-zero' },
  { title: "Halley's Comet", artist: 'Billie Eilish', url: 'https://soundcloud.com/billieeilish/halleys-comet' },
  { title: 'Evangeline', artist: 'Stephen Sanchez', url: 'https://soundcloud.com/stephensanchezofficial/evangeline' },
  { title: 'Jupiter to Mars', artist: 'Rocco', url: 'https://soundcloud.com/rocco-george-261635892/jupiter-to-mars' },
  { title: '是你', artist: '张靓颖 ft. 王赫野', url: 'https://soundcloud.com/mtmercury2/itsyou' },
]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const playlist = shuffle(tracks)

function loadSCApi(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.SC?.Widget) { resolve(); return }
    if (window.__sc_api_loaded) {
      const check = setInterval(() => {
        if (window.SC?.Widget) { clearInterval(check); resolve() }
      }, 100)
      setTimeout(() => { clearInterval(check); reject() }, 10000)
      return
    }
    window.__sc_api_loaded = true
    const script = document.createElement('script')
    script.src = 'https://w.soundcloud.com/player/api.js'
    script.onload = () => {
      const check = setInterval(() => {
        if (window.SC?.Widget) { clearInterval(check); resolve() }
      }, 50)
      setTimeout(() => { clearInterval(check); reject() }, 10000)
    }
    script.onerror = reject
    document.head.appendChild(script)
  })
}

export function MiniPlayer() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const widgetRef = useRef<any>(null)
  const initedRef = useRef(false)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [artworkUrl, setArtworkUrl] = useState('')
  const [duration, setDuration] = useState(0)
  const [position, setPosition] = useState(0)
  const [progress, setProgress] = useState(0)
  const durationRef = useRef(0)
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [collapsing, setCollapsing] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [hasVisited, setHasVisited] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)
  const [navRight, setNavRight] = useState(0)

  const track = playlist[currentIndex]

  const measureNav = () => {
    const nav = document.querySelector('nav[aria-label="Main Navigation"]')
    if (nav) {
      const rect = nav.getBoundingClientRect()
      setNavRight(Math.round(document.documentElement.clientWidth - rect.right))
    }
  }

  useEffect(() => {
    setMounted(true)
    const visited = sessionStorage.getItem('musicPlayerVisited') === 'true'
    setHasVisited(visited)

    // Show prompt for first-time visitors after a delay
    let promptTimer: ReturnType<typeof setTimeout>
    if (!visited) {
      promptTimer = setTimeout(() => {
        setShowPrompt(true)
      }, 1000)
    }

    const handleToggle = () => {
      measureNav()
      setExpanded(prev => !prev)
    }
    window.addEventListener('toggle-player', handleToggle)
    measureNav()
    window.addEventListener('resize', measureNav)

    return () => {
      window.removeEventListener('toggle-player', handleToggle)
      window.removeEventListener('resize', measureNav)
      if (promptTimer) clearTimeout(promptTimer)
    }
  }, [])

  useEffect(() => {
    if (initedRef.current) return
    initedRef.current = true

    const onReady = (widget: any) => {
      setIsReady(true)
      setIsLoading(false)
      widget.setVolume(80)
      widget.getCurrentSound((sound: any) => {
        if (sound?.artwork_url) setArtworkUrl(sound.artwork_url.replace('-large', '-t300x300'))
      })
      widget.getDuration((ms: number) => { setDuration(ms); durationRef.current = ms })
    }

    const tryConnect = async () => {
      try { await loadSCApi() } catch { setError(true); return }
      if (!iframeRef.current) return

      const widget = window.SC.Widget(iframeRef.current)
      widgetRef.current = widget

      widget.bind(window.SC.Widget.Events.READY, () => onReady(widget))
      // Fallback probe in case READY already fired
      setTimeout(() => {
        widget.getVolume(() => onReady(widget))
      }, 1500)

      widget.bind(window.SC.Widget.Events.PLAY, () => {
        setIsPlaying(true)
        setIsLoading(false)
        window.dispatchEvent(new CustomEvent('music-state', { detail: true }))
      })
      widget.bind(window.SC.Widget.Events.PAUSE, () => {
        setIsPlaying(false)
        window.dispatchEvent(new CustomEvent('music-state', { detail: false }))
      })
      widget.bind(window.SC.Widget.Events.PLAY_PROGRESS, (e: any) => {
        setPosition(e.currentPosition)
        setProgress(e.relativePosition * 100)
        if (durationRef.current === 0) {
          widget.getDuration((ms: number) => { if (ms > 0) { setDuration(ms); durationRef.current = ms } })
        }
      })
      widget.bind(window.SC.Widget.Events.FINISH, () => {
        setIsPlaying(false)
        window.dispatchEvent(new CustomEvent('music-state', { detail: false }))
        setPosition(0)
        setCurrentIndex(prev => (prev + 1) % playlist.length)
      })
      widget.bind(window.SC.Widget.Events.ERROR, () => setError(true))
    }

    tryConnect()
    // No cleanup — widget and iframe persist for the lifetime of the app
  }, [])

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('music-track', { detail: playlist[currentIndex].title }))
    if (!widgetRef.current || !isReady) return
    setPosition(0)
    setDuration(0)
    setProgress(0)
    durationRef.current = 0
    setArtworkUrl('')
    setError(false)
    setIsLoading(true)

    const w = widgetRef.current
    w.load(playlist[currentIndex].url, {
      auto_play: true,
      callback: () => {
        w.setVolume(80)
        w.getCurrentSound((sound: any) => {
          if (sound?.artwork_url) setArtworkUrl(sound.artwork_url.replace('-large', '-t300x300'))
        })
        w.getDuration((ms: number) => { if (ms > 0) { setDuration(ms); durationRef.current = ms } })

        // Re-bind events since widget.load() destroys them
        w.bind(window.SC.Widget.Events.PLAY, () => {
          setIsPlaying(true)
          setIsLoading(false)
          window.dispatchEvent(new CustomEvent('music-state', { detail: true }))
        })
        w.bind(window.SC.Widget.Events.PAUSE, () => {
          setIsPlaying(false)
          window.dispatchEvent(new CustomEvent('music-state', { detail: false }))
        })
        w.bind(window.SC.Widget.Events.PLAY_PROGRESS, (e: any) => {
          setPosition(e.currentPosition)
          setProgress(e.relativePosition * 100)
          if (durationRef.current === 0) {
            w.getDuration((ms: number) => { if (ms > 0) { setDuration(ms); durationRef.current = ms } })
          }
        })
        w.bind(window.SC.Widget.Events.FINISH, () => {
          setIsPlaying(false)
          window.dispatchEvent(new CustomEvent('music-state', { detail: false }))
          setPosition(0)
          setCurrentIndex(prev => (prev + 1) % playlist.length)
        })
        w.bind(window.SC.Widget.Events.ERROR, () => { setError(true); setIsLoading(false) })
      },
    })
  }, [currentIndex])

  const handleCollapse = () => {
    setCollapsing(true)
    setTimeout(() => {
      setExpanded(false)
      setCollapsing(false)
    }, 300)
  }
  const handleToggle = () => {
    if (!isPlaying) setIsLoading(true)
    widgetRef.current?.toggle()
  }
  const handlePrev = () => setCurrentIndex((currentIndex - 1 + playlist.length) % playlist.length)
  const handleNext = () => setCurrentIndex((currentIndex + 1) % playlist.length)
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!widgetRef.current || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    widgetRef.current.seekTo(((e.clientX - rect.left) / rect.width) * duration)
  }

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000)
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  }

  if (!mounted) return null

  // On homepage: don't render floating player (it's inline in the profile card via HomeMusicPlayer)
  // On other pages: show floating player
  return (
    <>
      {/* Hidden iframe -- always rendered */}
      <iframe
        ref={iframeRef}
        src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(playlist[0].url)}&auto_play=false`}
        style={{ position: 'fixed', width: 1, height: 1, opacity: 0, top: 0, left: 0, pointerEvents: 'none' }}
        allow="autoplay"
      />

      {/* First-visit music prompt */}
      {showPrompt && !expanded && (
        <div className="fixed top-20 z-[200] animate-[playerExpand_0.35s_ease-out_both] origin-top-right" style={{ right: `${navRight}px` }}>
          <div
            className="music-prompt rounded-2xl border border-[var(--color-border)] p-4 flex items-center gap-3"
          >
            <svg className="w-5 h-5 text-accent animate-[musicNote_3s_ease-in-out_infinite] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
            </svg>
            <span className="font-mono-label text-xs text-fore-primary tracking-wider">Want some music?</span>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={() => {
                  setShowPrompt(false)
                  sessionStorage.setItem('musicPlayerVisited', 'true')
                  setHasVisited(true)
                  measureNav()
                  setExpanded(true)
                }}
                className="w-7 h-7 rounded-lg border border-[var(--color-border)] flex items-center justify-center text-green-500 hover:border-green-500 hover:bg-green-500/10 transition-all"
                title="Yes"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </button>
              <button
                onClick={() => {
                  setShowPrompt(false)
                  sessionStorage.setItem('musicPlayerVisited', 'true')
                  setHasVisited(true)
                }}
                className="w-7 h-7 rounded-lg border border-[var(--color-border)] flex items-center justify-center text-fore-subtle hover:border-[#ff0044] hover:text-[#ff0044] hover:bg-[rgba(255,0,68,0.1)] transition-all"
                title="No"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Player dropdown -- anchored below nav */}
      {expanded && (
        <div className="fixed top-20 z-50" style={{ right: `${navRight}px` }}>
          <div
            className={`w-80 rounded-2xl border border-[var(--color-border)] backdrop-blur-xl p-4 origin-top-right ${collapsing ? 'animate-[playerCollapse_0.3s_ease-in_both]' : 'animate-[playerExpand_0.35s_ease-out_both]'}`}
            style={{ background: 'var(--color-panel-bg)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3 animate-[playerFadeIn_0.3s_ease-out_0.1s_both]">
              <div className="section-label text-fore-subtle text-[0.65rem]">Now Playing</div>
              <button onClick={handleCollapse} className="shrink-icon !w-6 !h-6" title="Collapse player">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7" />
                </svg>
              </button>
            </div>

            {/* Current track */}
            <div className="flex items-center gap-3 mb-3 animate-[playerFadeIn_0.3s_ease-out_0.15s_both]">
              {artworkUrl ? (
                <img src={artworkUrl} alt={track.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-[var(--color-back-accent)] flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                  </svg>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-fore-primary truncate">{error ? 'Stream unavailable' : track.title}</div>
                <div className="font-mono-label text-[0.65rem] text-fore-subtle truncate">{track.artist}</div>
              </div>
            </div>

            {/* Progress bar */}
            <div onClick={handleSeek} className="relative py-1.5 cursor-pointer group animate-[playerFadeIn_0.3s_ease-out_0.2s_both]">
              <div className="h-1 rounded-full bg-[var(--color-border)] overflow-hidden">
                {isLoading && !isPlaying ? (
                  <div className="h-full w-1/3 rounded-full bg-accent/60 animate-[progressIndeterminate_1.2s_ease-in-out_infinite]" />
                ) : (
                  <div className="h-full rounded-full bg-accent transition-[width] duration-75 relative" style={{ width: `${progress}%` }}>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-between mb-3">
              <span className="font-mono-label text-[0.55rem] text-fore-subtle">{formatTime(position)}</span>
              <span className="font-mono-label text-[0.55rem] text-fore-subtle">{formatTime(duration)}</span>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mb-3 animate-[playerFadeIn_0.3s_ease-out_0.25s_both]">
              <button onClick={handlePrev} className="w-7 h-7 flex items-center justify-center text-fore-subtle hover:text-accent transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg>
              </button>
              <button onClick={handleToggle} disabled={!isReady || error || isLoading} className="w-10 h-10 rounded-full border border-[var(--color-border)] flex items-center justify-center hover:border-accent hover:text-accent transition-colors disabled:opacity-30">
                {isLoading && !isPlaying ? (
                  <svg className="w-4 h-4 animate-spin text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                  </svg>
                ) : isPlaying ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                ) : (
                  <svg className="w-4 h-4 ml-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                )}
              </button>
              <button onClick={handleNext} className="w-7 h-7 flex items-center justify-center text-fore-subtle hover:text-accent transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>
              </button>
            </div>

            {/* Track list */}
            <div className="space-y-0.5 max-h-[120px] overflow-y-auto custom-scrollbar animate-[playerFadeIn_0.3s_ease-out_0.3s_both]">
              {playlist.map((t, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors ${
                    i === currentIndex
                      ? 'bg-[var(--color-back-accent)] text-accent'
                      : 'hover:bg-[rgba(255,255,255,0.05)] text-fore-subtle'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {i === currentIndex && isLoading && !isPlaying ? (
                      <svg className="w-3 h-3 animate-spin text-accent flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                      </svg>
                    ) : i === currentIndex && isPlaying ? (
                      <span className="flex items-end gap-[2px] w-3 h-3 flex-shrink-0">
                        <span className="w-[2px] h-full bg-accent animate-[barBounce_0.4s_ease-in-out_infinite_alternate]" />
                        <span className="w-[2px] h-2/3 bg-accent animate-[barBounce_0.4s_ease-in-out_infinite_alternate_0.15s]" />
                        <span className="w-[2px] h-1/3 bg-accent animate-[barBounce_0.4s_ease-in-out_infinite_alternate_0.3s]" />
                      </span>
                    ) : (
                      <span className="font-mono-label text-[0.6rem] w-3 text-center flex-shrink-0">{i + 1}</span>
                    )}
                    <span className="text-xs truncate">{t.title}</span>
                  </div>
                  <span className="font-mono-label text-[0.55rem] flex-shrink-0 ml-2">{t.artist}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
