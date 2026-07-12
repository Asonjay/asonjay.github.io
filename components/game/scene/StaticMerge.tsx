'use client'
import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

// Batches static furniture into one mesh per material to keep draw calls down.
// A mesh merges iff it (or an ancestor) is flagged static and neither it nor any
// ancestor is flagged dynamic — so animated parts (screens, flags, lids,
// reactive props) are left untouched. Originals are hidden rather than removed
// so React keeps ownership; the merged meshes are added and torn down here.
function ancestorHas(o: THREE.Object3D, flag: 'static' | 'dynamic'): boolean {
  let cur: THREE.Object3D | null = o
  while (cur) {
    if (cur.userData && cur.userData[flag]) return true
    cur = cur.parent
  }
  return false
}

export function StaticMerge() {
  const scene = useThree((s) => s.scene)
  const gl = useThree((s) => s.gl)

  useEffect(() => {
    scene.updateMatrixWorld(true)

    const groups = new Map<THREE.Material, THREE.Mesh[]>()
    const originals: THREE.Mesh[] = []
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh
      if (!mesh.isMesh || (mesh as THREE.InstancedMesh).isInstancedMesh) return
      if (Array.isArray(mesh.material)) return
      if (ancestorHas(mesh, 'dynamic') || !ancestorHas(mesh, 'static')) return
      const mat = mesh.material as THREE.Material
      const arr = groups.get(mat)
      if (arr) arr.push(mesh)
      else groups.set(mat, [mesh])
      originals.push(mesh)
    })

    const merged: THREE.Mesh[] = []
    groups.forEach((meshes, mat) => {
      const geos = meshes.map((m) => m.geometry.clone().applyMatrix4(m.matrixWorld))
      const mergedGeo = mergeGeometries(geos, false)
      geos.forEach((g) => g.dispose())
      if (!mergedGeo) return
      const mesh = new THREE.Mesh(mergedGeo, mat)
      mesh.castShadow = true
      mesh.receiveShadow = true
      mesh.matrixAutoUpdate = false
      mesh.userData.merged = true
      scene.add(mesh)
      merged.push(mesh)
    })

    for (const m of originals) m.visible = false

    let raf = 0
    if (process.env.NODE_ENV !== 'production') {
      raf = requestAnimationFrame(() => {
        // eslint-disable-next-line no-console
        console.info(
          `[voxel] StaticMerge: ${originals.length} meshes -> ${merged.length} batches | draw calls: ${gl.info.render.calls}`
        )
      })
    }

    return () => {
      if (raf) cancelAnimationFrame(raf)
      for (const m of merged) {
        scene.remove(m)
        m.geometry.dispose()
      }
      for (const m of originals) (m.visible = true)
    }
  }, [scene, gl])

  return null
}
