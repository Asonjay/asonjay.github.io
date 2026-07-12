'use client'
import dynamic from 'next/dynamic'
import type { WorldData } from '../../types/world'
import { LoadingScreen } from './ui/LoadingScreen'

// The whole three.js scene is client-only; keep it out of the static export and
// show the loading screen while the chunk downloads. WorldData arrives as a
// plain prop from the server component — no fs/server code crosses into here.
const VoxelHome = dynamic(() => import('./VoxelHome'), {
  ssr: false,
  loading: () => <LoadingScreen />,
})

export default function GameLoader({ data }: { data: WorldData }) {
  return <VoxelHome data={data} />
}
