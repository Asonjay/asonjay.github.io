'use client'
import { Canvas } from '@react-three/fiber'
import { World } from './scene/World'
import { Player } from './scene/Player'
import { CameraRig } from './scene/CameraRig'
import { useInput } from './systems/useInput'

export default function VoxelHome() {
  useInput()
  return (
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
      <CameraRig />
    </Canvas>
  )
}
