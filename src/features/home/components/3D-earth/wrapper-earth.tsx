'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function GlobeEarth() {
  const worldRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!worldRef.current) return

    let animationFrameId: number

    import('globe.gl').then((GlobeModule) => {
      const Globe = GlobeModule.default

      if (!worldRef.current) return

      const width = worldRef.current.clientWidth
      const height = worldRef.current.clientHeight

      const world = new Globe(worldRef.current, {
        animateIn: false,
        rendererConfig: { alpha: true, antialias: true },
      })
        .width(width)
        .height(height)
        .globeImageUrl('//cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg')
        .bumpImageUrl('//cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png')
        .backgroundImageUrl('')
        .showAtmosphere(true)
        .atmosphereColor('#3a228a')
        .atmosphereAltitude(0.15)

      // ⬇️ Aleja la cámara para encuadrar la Tierra completa (aumenta o disminuye la altitud si querés alejarla más)
      world.pointOfView({ lat: 0, lng: 0, altitude: 1.9 }, 0)

      // Transparencia del canvas de Three.js
      const renderer = world.renderer()
      renderer.setClearColor(0x000000, 0)
      world.scene().background = null

      // Auto-rotate
      world.controls().autoRotate = true
      world.controls().autoRotateSpeed = 0.35

      // Capa de nubes
      const CLOUDS_IMG_URL =
        'https://raw.githubusercontent.com/vasturiano/globe.gl/master/example/clouds/clouds.png'
      const CLOUDS_ALT = 0.004
      const CLOUDS_ROTATION_SPEED = -0.006

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

  return <div ref={worldRef} className="w-full h-full flex items-center justify-center" />
}
