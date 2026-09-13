import { cn } from '@/shared/utils/className-builder'

/**
 * El "render de malla" de un objeto.
 *
 * NeoWs publica órbitas y magnitudes, no imágenes: de los ~38.000 objetos del
 * catálogo hay foto de un puñado. En vez de dejar la card vacía o repetir un
 * placeholder, se dibuja la silueta a partir del id —mismo id, mismo dibujo—
 * con la malla de wireframe que el diseño rotula como `VISUALIZATION: MESH
 * RENDER`.
 *
 * Todo el trazo sale del seed, así que el server y el cliente pintan lo mismo
 * y no hay nada que hidratar.
 */

/** Vértices de la silueta: menos deja un polígono, más lo redondea. */
const VERTICES = 16

/** Cuánto se aparta cada vértice del radio base, como fracción. */
const ROUGHNESS = 0.26

const CRATERS = 5

const VIEW_WIDTH = 400
const VIEW_HEIGHT = 260

/** Hash estable de un string a entero de 32 bits (FNV-1a). */
function hashSeed(value: string) {
  let hash = 0x811c9dc5

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 0x01000193)
  }

  return hash >>> 0
}

/** PRNG determinístico: mismo seed, misma secuencia. */
function createRandom(seed: number) {
  let state = seed || 1

  return () => {
    state |= 0
    state = (state + 0x6d2b79f5) | 0

    let result = Math.imul(state ^ (state >>> 15), 1 | state)
    result = (result + Math.imul(result ^ (result >>> 7), 61 | result)) ^ result

    return ((result ^ (result >>> 14)) >>> 0) / 4294967296
  }
}

type Point = { x: number; y: number }

function buildSilhouette(random: () => number, cx: number, cy: number, radius: number): Point[] {
  return Array.from({ length: VERTICES }, (_, index) => {
    const angle = (index / VERTICES) * Math.PI * 2
    const jitter = 1 + (random() - 0.5) * 2 * ROUGHNESS

    return {
      x: cx + Math.cos(angle) * radius * jitter,
      // Achatado en el eje vertical: el encuadre de la card es apaisado.
      y: cy + Math.sin(angle) * radius * jitter * 0.78,
    }
  })
}

/** Cierra los vértices con curvas suaves, para que no se lea como un polígono. */
function toSmoothPath(points: Point[]) {
  const segments = points.map((point, index) => {
    const next = points[(index + 1) % points.length]
    const midX = (point.x + next.x) / 2
    const midY = (point.y + next.y) / 2

    return `Q ${point.x.toFixed(1)} ${point.y.toFixed(1)} ${midX.toFixed(1)} ${midY.toFixed(1)}`
  })

  const start = {
    x: (points[points.length - 1].x + points[0].x) / 2,
    y: (points[points.length - 1].y + points[0].y) / 2,
  }

  return `M ${start.x.toFixed(1)} ${start.y.toFixed(1)} ${segments.join(' ')} Z`
}

type AsteroidMeshProps = {
  /** Seed del dibujo; en la práctica, el id de NeoWs. */
  seed: string
  className?: string
}

export function AsteroidMesh({ seed, className }: AsteroidMeshProps) {
  const random = createRandom(hashSeed(seed))

  const cx = VIEW_WIDTH / 2
  const cy = VIEW_HEIGHT / 2
  const radius = VIEW_HEIGHT * 0.34
  const silhouette = buildSilhouette(random, cx, cy, radius)
  const path = toSmoothPath(silhouette)

  // El id del clip y del gradiente tiene que ser único en el documento: en el
  // grid conviven nueve de estos.
  const uid = `mesh-${seed.replace(/[^a-zA-Z0-9]/g, '')}`

  const craters = Array.from({ length: CRATERS }, () => {
    const angle = random() * Math.PI * 2
    const distance = random() * radius * 0.62

    return {
      cx: cx + Math.cos(angle) * distance,
      cy: cy + Math.sin(angle) * distance * 0.78,
      r: radius * (0.07 + random() * 0.16),
    }
  })

  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      preserveAspectRatio="xMidYMid slice"
      role="presentation"
      aria-hidden="true"
      className={cn('size-full', className)}
    >
      <defs>
        <clipPath id={`${uid}-clip`}>
          <path d={path} />
        </clipPath>

        {/* La luz entra desde arriba a la izquierda, como en las fotos de sonda. */}
        <radialGradient id={`${uid}-body`} cx="34%" cy="28%" r="78%">
          <stop offset="0%" stopColor="var(--color-basic-300)" stopOpacity="0.55" />
          <stop offset="55%" stopColor="var(--color-basic-700)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="var(--color-basic-970)" stopOpacity="0.95" />
        </radialGradient>

        <pattern id={`${uid}-grid`} width="26" height="26" patternUnits="userSpaceOnUse">
          <path
            d="M 26 0 L 0 0 0 26"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.12"
          />
        </pattern>
      </defs>

      <rect width={VIEW_WIDTH} height={VIEW_HEIGHT} fill="var(--color-basic-970)" />
      <rect width={VIEW_WIDTH} height={VIEW_HEIGHT} fill={`url(#${uid}-grid)`} />

      <path
        d={path}
        fill={`url(#${uid}-body)`}
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.9"
      />

      <g clipPath={`url(#${uid}-clip)`} stroke="currentColor" fill="none" opacity="0.35">
        {/* Paralelos y meridianos de la malla. */}
        {[-0.6, -0.2, 0.2, 0.6].map((offset) => (
          <ellipse
            key={`lat-${offset}`}
            cx={cx}
            cy={cy + radius * offset * 0.78}
            rx={radius * 1.3}
            ry={radius * 0.3}
            strokeWidth="0.6"
          />
        ))}

        {[-0.6, -0.2, 0.2, 0.6].map((offset) => (
          <ellipse
            key={`lon-${offset}`}
            cx={cx + radius * offset}
            cy={cy}
            rx={radius * 0.3}
            ry={radius}
            strokeWidth="0.6"
          />
        ))}

        {craters.map((crater, index) => (
          <ellipse
            key={`crater-${index}`}
            cx={crater.cx}
            cy={crater.cy}
            rx={crater.r}
            ry={crater.r * 0.7}
            strokeWidth="0.8"
            opacity="0.7"
          />
        ))}
      </g>
    </svg>
  )
}
