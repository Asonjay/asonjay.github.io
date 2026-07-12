'use client'
import dynamic from 'next/dynamic'
import { Component, useState } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import type { WorldData } from '../../types/world'
import { LoadingScreen } from './ui/LoadingScreen'
import { GameErrorCard } from './ui/GameErrorCard'

// The whole three.js scene is client-only; keep it out of the static export and
// show the loading screen while the chunk downloads. WorldData arrives as a
// plain prop from the server component — no fs/server code crosses into here.
const VoxelHome = dynamic(() => import('./VoxelHome'), {
  ssr: false,
  loading: () => <LoadingScreen />,
})

// Catches render/runtime errors thrown while mounting the 3D scene (e.g. WebGL
// unavailable, chunk-eval failure) and swaps in the fallback card instead of a
// blank page.
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    // The card is the user-facing signal; nothing else to do.
  }

  render() {
    if (this.state.hasError) return <GameErrorCard />
    return this.props.children
  }
}

export default function GameLoader({ data }: { data: WorldData }) {
  // Runtime WebGL context loss isn't a React error, so the boundary can't catch
  // it. VoxelHome reports it through this callback (wired on the Canvas) and we
  // show the same fallback card.
  const [contextLost, setContextLost] = useState(false)
  if (contextLost) return <GameErrorCard />

  return (
    <ErrorBoundary>
      <VoxelHome data={data} onContextLost={() => setContextLost(true)} />
    </ErrorBoundary>
  )
}
