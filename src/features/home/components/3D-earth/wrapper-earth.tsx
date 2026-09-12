'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function GlobeEarth() {
  const worldRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!worldRef.current) return

    let animationFrameId: number

    // Import dinámico dentro de useEffect: se ejecuta SOLO en el navegador
    import('globe.gl').then((GlobeModule) => {
      const Globe = GlobeModule.default

      if (!worldRef.current) return

      const world = new Globe(worldRef.current, {
        animateIn: false,
      })
        .globeImageUrl('//cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg')
        .bumpImageUrl('//cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png')

      // Transparencia de fondo
      world.renderer().setClearColor(0x000000, 0)
      world.scene().background = null

      // Auto-rotate
      world.controls().autoRotate = true
      world.controls().autoRotateSpeed = 0.35

      // Capa de nubes
      const CLOUDS_IMG_URL =
        'https://raw.githubusercontent.com/vasturiano/globe.gl/master/example/clouds/clouds.png'
      const CLOUDS_ALT = 0.004
      const CLOUDS_ROTATION_SPEED = -0.006 // deg/frame

      new THREE.TextureLoader().load(CLOUDS_IMG_URL, (cloudsTexture) => {
        const clouds = new THREE.Mesh(
          new THREE.SphereGeometry(world.getGlobeRadius() * (1 + CLOUDS_ALT), 75, 75),
          new THREE.MeshPhongMaterial({ map: cloudsTexture, transparent: true }),
        )
        world.scene().add(clouds)

        const rotateClouds = () => {
          clouds.rotation.y += (CLOUDS_ROTATION_SPEED * Math.PI) / 180
          animationFrameId = requestAnimationFrame(rotateClouds)
        }
        rotateClouds()
      })
    })

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      if (worldRef.current) worldRef.current.innerHTML = ''
    }
  }, [])

  return <div ref={worldRef} className="h-125 w-full" />
}
