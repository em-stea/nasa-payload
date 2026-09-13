'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

import {
  CELL,
  DIGIT_GAP,
  EYEPIECE_CENTER,
  EYEPIECE_RATIO,
  FOCUS_DURATION,
  FOUR_GLYPH,
  PLANET_SKINS,
  PLANET_STAGGER,
  PLANET_TRAVEL,
  SCENE_BOUNDS,
  ZERO,
} from '@/features/not-found/constants/scene'
import {
  createDisposer,
  createFlag,
  createPlanetMaterial,
  createRing,
  createSatellite,
  createSphereGeometry,
  createVegetation,
  placeOnSphere,
  plantVegetation,
} from '@/features/not-found/utils/bodies'
import {
  createHomeTexture,
  createNebulaTexture,
  createPlanetTexture,
  createRingTexture,
  createSoftDotTexture,
  createTrailTexture,
} from '@/features/not-found/utils/textures'

/** Cada planeta del glifo: dónde termina, de dónde viene y cómo se mueve. */
type GlyphPlanet = {
  mesh: THREE.Mesh
  target: THREE.Vector3
  origin: THREE.Vector3
  spin: number
  bobPhase: number
  bobAmplitude: number
  delay: number
}

function easeOutCubic(progress: number) {
  return 1 - (1 - progress) ** 3
}

/** Con overshoot: los planetas frenan pasándose apenas de su lugar. */
function easeOutBack(progress: number) {
  const overshoot = 1.35

  return 1 + (overshoot + 1) * (progress - 1) ** 3 + overshoot * (progress - 1) ** 2
}

/** Los lugares del 404, dígito por dígito, en coordenadas de mundo. */
function buildGlyphTargets() {
  const targets: THREE.Vector3[] = []
  const columns = FOUR_GLYPH[0].length
  const rows = FOUR_GLYPH.length

  const addFour = (offsetX: number) => {
    FOUR_GLYPH.forEach((row, rowIndex) => {
      Array.from(row).forEach((cell, columnIndex) => {
        if (cell !== '#') return

        targets.push(
          new THREE.Vector3(
            offsetX + (columnIndex - (columns - 1) / 2) * CELL,
            ((rows - 1) / 2 - rowIndex) * CELL,
            (Math.random() - 0.5) * 1.8,
          ),
        )
      })
    })
  }

  addFour(-DIGIT_GAP)

  // El 0 no sale de la grilla: sus planetas van sobre una elipse del alto del
  // dígito, que a este tamaño se lee mejor que un anillo de celdas.
  for (let index = 0; index < ZERO.count; index += 1) {
    const angle = (index / ZERO.count) * Math.PI * 2 - Math.PI / 2

    targets.push(
      new THREE.Vector3(
        Math.cos(angle) * ZERO.radiusX,
        Math.sin(angle) * ZERO.radiusY,
        (Math.random() - 0.5) * 1.8,
      ),
    )
  }

  addFour(DIGIT_GAP)

  return targets
}

function createStarfield(disposer: ReturnType<typeof createDisposer>, dot: THREE.Texture) {
  const count = window.innerWidth < 768 ? 900 : 1700
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const tint = new THREE.Color()

  for (let index = 0; index < count; index += 1) {
    // Repartidas sobre un cascarón lejano: el fondo del cielo, no una caja.
    const direction = new THREE.Vector3()
      .randomDirection()
      .multiplyScalar(140 + Math.random() * 160)
    positions.set([direction.x, direction.y, -Math.abs(direction.z)], index * 3)

    // Tres cuartos blancas, el resto azuladas o cálidas: así el campo no queda
    // monocromo ni parece una guirnalda de colores.
    const roll = Math.random()
    if (roll > 0.9) tint.set('#ffd9b0')
    else if (roll > 0.72) tint.set('#b7c6ff')
    else tint.set('#ffffff')

    const brightness = 0.45 + Math.random() * 0.55
    colors.set([tint.r * brightness, tint.g * brightness, tint.b * brightness], index * 3)
  }

  const geometry = disposer.track(new THREE.BufferGeometry())
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = disposer.track(
    new THREE.PointsMaterial({
      size: 1.6,
      map: dot,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    }),
  )

  return new THREE.Points(geometry, material)
}

/** Motas cerca de la cámara: el polvo que se ve flotar en un ocular real. */
function createDust(disposer: ReturnType<typeof createDisposer>, dot: THREE.Texture) {
  const count = 90
  const positions = new Float32Array(count * 3)

  for (let index = 0; index < count; index += 1) {
    positions.set(
      [(Math.random() - 0.5) * 34, (Math.random() - 0.5) * 24, 6 + Math.random() * 16],
      index * 3,
    )
  }

  const geometry = disposer.track(new THREE.BufferGeometry())
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const material = disposer.track(
    new THREE.PointsMaterial({
      size: 0.09,
      map: dot,
      color: '#b9c6f5',
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  )

  return new THREE.Points(geometry, material)
}

function createNebula(disposer: ReturnType<typeof createDisposer>) {
  const nebula = new THREE.Group()
  const clouds: { color: string; scale: number; position: [number, number, number] }[] = [
    { color: '#3a228a', scale: 120, position: [-40, 24, -120] },
    { color: '#1f4a8c', scale: 150, position: [55, -18, -140] },
    { color: '#6b2f6f', scale: 90, position: [10, 40, -110] },
  ]

  clouds.forEach(({ color, scale, position }) => {
    const material = disposer.track(
      new THREE.SpriteMaterial({
        map: disposer.track(createNebulaTexture(color)),
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    )

    const cloud = new THREE.Sprite(material)
    cloud.position.set(...position)
    cloud.scale.setScalar(scale)
    nebula.add(cloud)
  })

  return nebula
}

type TelescopeSceneProps = {
  /** Se enciende cuando la escena terminó de armarse y puede entrar en foco. */
  onReady: () => void
}

/**
 * La toma: el 404 armado con planetas, mirado desde el ocular.
 *
 * El canvas arranca borroso y desalineado —el telescopio todavía no enfocó— y
 * durante los primeros segundos los planetas se acomodan en el glifo mientras
 * la cámara retrocede hasta su encuadre. Después queda vivo: los planetas
 * giran, la vegetación pasa por el limbo y el pulso del que mira mueve apenas
 * el encuadre.
 */
export function TelescopeScene({ onReady }: TelescopeSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const readyRef = useRef(onReady)

  useEffect(() => {
    readyRef.current = onReady
  }, [onReady])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const disposer = createDisposer()
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
    } catch {
      // Sin WebGL no hay escena, pero la página tiene que seguir siendo una
      // página: se abre el ocular igual y queda el campo vacío con el texto.
      readyRef.current()

      return
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    renderer.setClearColor('#05060a', 1)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 600)
    const world = new THREE.Group()
    scene.add(world)

    /* ---------------------------------------------------------------- luces */

    // Sol de tres cuartos desde la izquierda, relleno frío del cielo y un
    // contraluz azul: el borde iluminado es lo que despega los planetas del fondo.
    scene.add(new THREE.HemisphereLight('#4b58a8', '#0a0c16', 0.75))

    const sun = new THREE.DirectionalLight('#fff1dd', 2.6)
    sun.position.set(-9, 6, 10)
    scene.add(sun)

    const rim = new THREE.PointLight('#5b7bff', 260, 120)
    rim.position.set(12, -6, -16)
    scene.add(rim)

    /* ----------------------------------------------------------------- cielo */

    const dotTexture = disposer.track(createSoftDotTexture())
    const sky = new THREE.Group()
    sky.add(createStarfield(disposer, dotTexture), createNebula(disposer))
    world.add(sky)

    const dust = createDust(disposer, dotTexture)
    world.add(dust)

    /* ---------------------------------------------------------------- el 404 */

    const sphereGeometry = disposer.track(createSphereGeometry())
    const skinTextures = PLANET_SKINS.map((skin) => disposer.track(createPlanetTexture(skin)))
    const skinMaterials = skinTextures.map((texture) =>
      disposer.track(createPlanetMaterial(texture)),
    )
    const vegetation = createVegetation(disposer)

    const glyph = new THREE.Group()
    world.add(glyph)

    const planets: GlyphPlanet[] = buildGlyphTargets().map((target, index) => {
      const mesh = new THREE.Mesh(sphereGeometry, skinMaterials[index % skinMaterials.length])
      mesh.scale.setScalar(CELL * (0.38 + Math.random() * 0.14))
      mesh.rotation.z = (Math.random() - 0.5) * 0.6

      // Uno de cada cuatro trae vegetación: a este tamaño son bultitos en el
      // limbo, y si los tuvieran todos el glifo se ensuciaría.
      if (Math.random() > 0.72) plantVegetation(mesh, vegetation, 1 + Math.floor(Math.random() * 2))

      // Entran desde más lejos y desde los costados, como si el telescopio los
      // fuera juntando.
      const origin = target
        .clone()
        .add(
          new THREE.Vector3(
            (Math.random() - 0.5) * 26,
            (Math.random() - 0.5) * 18,
            -20 - Math.random() * 30,
          ),
        )

      mesh.position.copy(origin)
      glyph.add(mesh)

      return {
        mesh,
        target,
        origin,
        spin: 0.04 + Math.random() * 0.12,
        bobPhase: Math.random() * Math.PI * 2,
        bobAmplitude: 0.05 + Math.random() * 0.07,
        delay: index * PLANET_STAGGER,
      }
    })

    /* ------------------------------------------------------------ decorados */

    const ringTexture = disposer.track(createRingTexture())

    // El gigante anillado del fondo, arriba a la derecha: escenografía, fuera
    // del glifo, para que el 404 no compita con nada.
    const giant = new THREE.Group()
    const giantBody = new THREE.Mesh(sphereGeometry, skinMaterials[1])
    giantBody.scale.setScalar(1.9)
    giant.add(giantBody, createRing(disposer, 2.6, 4.1, ringTexture))
    giant.rotation.set(0.38, 0, 0.22)
    world.add(giant)

    const satellite = createSatellite(disposer)
    giant.add(satellite)

    // Y el planeta de adelante, el único que se ve de cerca: acá viven los
    // arbolitos, la banderita y la luna.
    const home = new THREE.Group()
    const homeBody = new THREE.Mesh(
      sphereGeometry,
      disposer.track(createPlanetMaterial(disposer.track(createHomeTexture()))),
    )
    homeBody.scale.setScalar(1.7)
    plantVegetation(homeBody, vegetation, 22, 1.05)

    const { flag, cloth } = createFlag(disposer)
    flag.scale.setScalar(1.1)
    homeBody.add(flag)
    // La bandera arranca de frente al ocular: es el detalle que se mira, y el
    // giro lento del planeta la va llevando de paseo.
    placeOnSphere(flag, 0.42, 0.3)

    const moon = new THREE.Mesh(sphereGeometry, skinMaterials[2])
    moon.scale.setScalar(0.26)

    home.add(homeBody, moon)
    home.rotation.z = 0.28
    world.add(home)

    /* ------------------------------------------------------- estrella fugaz */

    const trailMaterial = disposer.track(
      new THREE.MeshBasicMaterial({
        map: disposer.track(createTrailTexture()),
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    )
    const trail = new THREE.Mesh(disposer.track(new THREE.PlaneGeometry(14, 0.16)), trailMaterial)
    trail.visible = false
    world.add(trail)

    const trailStart = new THREE.Vector3()
    const trailEnd = new THREE.Vector3()
    let nextTrailAt = 3.5
    let trailProgress = 1

    /* -------------------------------------------------------------- encuadre */

    let baseDistance = 40
    let opticalOffset = 0

    /**
     * Encuadra el 404 dentro del círculo del ocular —no del viewport—: el
     * recorte tapa las esquinas, así que la cámara tiene que retroceder lo que
     * haga falta para que los dígitos entren en el disco.
     */
    const fit = () => {
      const width = container.clientWidth
      const height = container.clientHeight
      if (!width || !height) return

      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()

      const eyepieceRadius = Math.min(width * EYEPIECE_RATIO.width, height * EYEPIECE_RATIO.height)
      const eyepieceDiameter = eyepieceRadius * 2
      const halfFov = THREE.MathUtils.degToRad(camera.fov) / 2

      const visibleWidth = SCENE_BOUNDS.width * (width / eyepieceDiameter)
      const visibleHeight = SCENE_BOUNDS.height * (height / eyepieceDiameter)
      baseDistance = Math.max(
        visibleHeight / 2 / Math.tan(halfFov),
        visibleWidth / 2 / Math.tan(halfFov) / camera.aspect,
      )

      // El ocular no está en el centro de la pantalla: la cámara baja lo justo
      // para que el glifo aparezca dentro del disco.
      opticalOffset = -(0.5 - EYEPIECE_CENTER) * 2 * Math.tan(halfFov) * baseDistance

      /**
       * Ubica un cuerpo en coordenadas del ocular: (0,0) es su centro y ±1, el
       * borde del disco. El eje óptico cae en el centro del viewport, no en el
       * del ocular, así que hay que subir la diferencia entre los dos —si no,
       * todo lo que se acomoda por acá aparece más abajo de lo pedido—.
       */
      const placeInView = (object: THREE.Object3D, x: number, y: number, depth: number) => {
        const halfHeight = Math.tan(halfFov) * (baseDistance - depth)
        const halfWidth = halfHeight * camera.aspect
        const centerY = opticalOffset + (0.5 - EYEPIECE_CENTER) * 2 * halfHeight

        object.position.set(
          x * halfWidth * (eyepieceRadius / (width / 2)),
          centerY + y * halfHeight * (eyepieceRadius / (height / 2)),
          depth,
        )
      }

      placeInView(giant, 0.56, 0.68, -26)
      placeInView(home, -0.7, -0.55, 13)
    }

    /* -------------------------------------------------------------- animación */

    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 }
    const handlePointerMove = (event: PointerEvent) => {
      pointer.targetX = (event.clientX / window.innerWidth) * 2 - 1
      pointer.targetY = (event.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', handlePointerMove)

    let lastFrameAt = performance.now()
    let elapsed = 0
    let frameId = 0

    const render = () => {
      const now = performance.now()
      // Tope al delta: al volver de una pestaña dormida, un salto de segundos
      // teletransportaría los planetas en vez de animarlos.
      const delta = Math.min((now - lastFrameAt) / 1000, 0.05)
      lastFrameAt = now
      elapsed += delta

      const focus = easeOutCubic(Math.min(1, elapsed / FOCUS_DURATION))

      planets.forEach((planet) => {
        const progress = Math.min(1, Math.max(0, (elapsed - planet.delay) / PLANET_TRAVEL))
        planet.mesh.position.lerpVectors(planet.origin, planet.target, easeOutBack(progress))
        planet.mesh.position.y +=
          Math.sin(elapsed * 0.6 + planet.bobPhase) * planet.bobAmplitude * progress
        planet.mesh.rotation.y += planet.spin * delta
      })

      giant.rotation.y += 0.03 * delta
      giantBody.rotation.y += 0.05 * delta
      satellite.position.set(Math.cos(elapsed * 0.35) * 3.4, 0, Math.sin(elapsed * 0.35) * 3.4)
      satellite.rotation.y = -elapsed * 0.35

      homeBody.rotation.y += 0.035 * delta
      cloth.rotation.y = Math.sin(elapsed * 2.2) * 0.25
      moon.position.set(
        Math.cos(elapsed * 0.22) * 2.6,
        Math.sin(elapsed * 0.22) * 0.6,
        Math.sin(elapsed * 0.22) * 2.6,
      )

      sky.rotation.y = elapsed * 0.004
      dust.rotation.z = elapsed * 0.012

      // La fugaz: cruza el campo cada tanto y se apaga sola.
      if (trailProgress >= 1 && elapsed > nextTrailAt) {
        const height = 4 + Math.random() * 16
        trailStart.set(52, height, -40)
        trailEnd.set(-52, height - 26, -40)
        trail.rotation.z = Math.atan2(trailEnd.y - trailStart.y, trailEnd.x - trailStart.x)
        trail.visible = true
        trailProgress = 0
      }

      if (trailProgress < 1) {
        trailProgress = Math.min(1, trailProgress + delta / 1.4)
        trail.position.lerpVectors(trailStart, trailEnd, trailProgress)
        trailMaterial.opacity = Math.sin(trailProgress * Math.PI)

        if (trailProgress >= 1) {
          trail.visible = false
          nextTrailAt = elapsed + 7 + Math.random() * 9
        }
      }

      // El pulso del que mira: el encuadre respira y sigue apenas al puntero.
      pointer.x += (pointer.targetX - pointer.x) * 0.045
      pointer.y += (pointer.targetY - pointer.y) * 0.045

      camera.position.set(
        pointer.x * 0.7,
        opticalOffset + Math.sin(elapsed * 0.55) * 0.08 - pointer.y * 0.45,
        baseDistance + (1 - focus) * 11,
      )
      camera.lookAt(0, opticalOffset, 0)
      world.rotation.y = pointer.x * 0.018
      world.rotation.x = pointer.y * 0.012

      renderer.render(scene, camera)
      frameId = requestAnimationFrame(render)
    }

    /**
     * Con `prefers-reduced-motion` no hay entrada ni deriva: la escena se
     * arma en su lugar y se dibuja sólo cuando cambia el tamaño.
     */
    const renderStill = () => {
      planets.forEach((planet) => planet.mesh.position.copy(planet.target))
      satellite.position.set(3.4, 0, 0)
      moon.position.set(3.1, 0.7, 0)
      camera.position.set(0, opticalOffset, baseDistance)
      camera.lookAt(0, opticalOffset, 0)
      renderer.render(scene, camera)
    }

    const resizeObserver = new ResizeObserver(() => {
      fit()
      if (prefersReducedMotion) renderStill()
    })
    resizeObserver.observe(container)
    fit()

    if (prefersReducedMotion) renderStill()
    else frameId = requestAnimationFrame(render)

    // Una pestaña en segundo plano no necesita seguir dibujando estrellas.
    const handleVisibilityChange = () => {
      if (prefersReducedMotion) return

      if (document.hidden) {
        cancelAnimationFrame(frameId)
      } else {
        lastFrameAt = performance.now()
        frameId = requestAnimationFrame(render)
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Dos frames: el primero dibuja, el segundo ya corre con la escena pintada.
    // Recién ahí el ocular abre y el enfoque deja de ser una pantalla negra.
    const readyFrame = requestAnimationFrame(() => requestAnimationFrame(() => readyRef.current()))

    return () => {
      cancelAnimationFrame(frameId)
      cancelAnimationFrame(readyFrame)
      resizeObserver.disconnect()
      window.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      disposer.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={containerRef} className="absolute inset-0" />
}
