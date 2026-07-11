'use client'
import dynamic from 'next/dynamic'
import { LoadingScreen } from './ui/LoadingScreen'

// The whole three.js scene is client-only; keep it out of the static export and
// show the loading screen while the chunk downloads.
const VoxelHome = dynamic(() => import('./VoxelHome'), {
  ssr: false,
  loading: () => <LoadingScreen />,
})

export default function GameLoader() {
  return <VoxelHome />
}
