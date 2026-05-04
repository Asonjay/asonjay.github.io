'use client'

import { useEffect, useRef } from 'react'

interface Props {
  src: string
  speed?: number
}

export function BackgroundVideo({ src, speed = 0.7 }: Props) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.defaultPlaybackRate = speed
      ref.current.playbackRate = speed
    }
  }, [speed])

  return (
    <video
      ref={ref}
      className="bg-video"
      src={src}
      muted
      playsInline
      autoPlay
      loop
      aria-hidden="true"
    />
  )
}
