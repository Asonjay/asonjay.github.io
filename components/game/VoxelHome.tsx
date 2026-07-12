'use client'
import { Canvas } from '@react-three/fiber'
import type { WorldData } from '../../types/world'
import { World } from './scene/World'
import { Player } from './scene/Player'
import { CameraRig } from './scene/CameraRig'
import { Systems } from './scene/Systems'
import { FootstepDust } from './scene/FootstepDust'
import { StaticMerge } from './scene/StaticMerge'
import { NameplateBubble } from './ui/NameplateBubble'
import { PanelHost } from './ui/PanelHost'
import { useInput } from './systems/useInput'

export default function VoxelHome({ data }: { data: WorldData }) {
  useInput()
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Canvas
        orthographic
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        shadows
      >
        <color attach="background" args={['#0b0e1a']} />
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[12, 20, 8]}
          intensity={0.8}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
          shadow-camera-near={0.5}
          shadow-camera-far={80}
        />
        <World />
        <Player />
        <Systems />
        <FootstepDust />
        <CameraRig />
        {/* Runs last so its effect fires after furniture has mounted. */}
        <StaticMerge />
      </Canvas>
      <NameplateBubble />
      <PanelHost data={data} />
    </div>
  )
}
