import { TelemetrySection } from '@/features/asteroids/components/telemetry-section'
import type { Asteroid } from '@/features/asteroids/types/asteroid'
import { formatInteger } from '@/features/asteroids/utils/format-asteroid'
import { Text } from '@/shared/components/text/text'

/**
 * La pantalla de radar del diseño.
 *
 * Los puntos son los objetos de la página: el ángulo sale del id —para que
 * cada objeto caiga siempre en el mismo lugar— y el radio, de la distancia de
 * su aproximación de referencia, en escala logarítmica. Sin log, todo lo que
 * pasa a menos de 0.05 AU se amontona contra el centro y el resto se pega al
 * borde: la escala real abarca cuatro órdenes de magnitud.
 *
 * Es una lectura del mismo dato que ya está en las cards, así que va como
 * decoración: quien navegue con lector de pantalla lee el grid, no el radar.
 */

/** Distancias que definen el rango del barrido, en AU. */
const MIN_AU = 0.0005
const MAX_AU = 1.5

const VIEW_WIDTH = 800
const VIEW_HEIGHT = 400
const CENTER_X = VIEW_WIDTH / 2
const CENTER_Y = VIEW_HEIGHT / 2

/**
 * El plano del radar se ve en escorzo, como en el diseño: es una elipse, no un
 * círculo. Los semiejes son deliberadamente chicos contra el `viewBox` porque
 * el SVG se recorta con `slice` para llenar el panel —ancho en desktop, casi
 * cuadrado en mobile— y estas medidas son las que sobreviven al recorte en
 * las dos puntas. Los anillos sí se salen: recortarse es lo que los hace leer
 * como una pantalla más grande que su marco.
 */
const PLOT_RX = 230
const PLOT_RY = 115

/** Anillos concéntricos, como múltiplo del semieje de los puntos. */
const RINGS = [0.35, 0.7, 1.05, 1.4]

/** Radio del barrido en el espacio circular, antes de achatarlo. */
const SWEEP_RADIUS = 340

/** Apertura del haz, en grados. */
const SWEEP_DEGREES = 62

/**
 * Ángulo del punto en la pantalla, a partir del id.
 *
 * Usa FNV-1a y no una suma ponderada: los ids de NeoWs de una misma página son
 * casi consecutivos (2000433, 2000719, 2000887…) y con un hash lineal caen en
 * ángulos casi consecutivos, así que los puntos se apilan en un mismo sector
 * en vez de repartirse por el barrido.
 */
function hashAngle(id: string) {
  let hash = 0x811c9dc5

  for (let index = 0; index < id.length; index += 1) {
    hash ^= id.charCodeAt(index)
    hash = Math.imul(hash, 0x01000193)
  }

  return ((hash >>> 0) / 4294967296) * Math.PI * 2
}

/** Distancia → fracción del semieje, en log y dejando libre el centro. */
function toRatio(au: number) {
  const clamped = Math.min(Math.max(au, MIN_AU), MAX_AU)
  const ratio = Math.log10(clamped / MIN_AU) / Math.log10(MAX_AU / MIN_AU)

  // El 14% del centro queda para la Tierra.
  return 0.14 + ratio * 0.86
}

/** Sector circular con el vértice en el centro, para el haz. */
function buildSweepPath() {
  const radians = (SWEEP_DEGREES * Math.PI) / 180
  const endX = CENTER_X + Math.cos(radians) * SWEEP_RADIUS
  const endY = CENTER_Y + Math.sin(radians) * SWEEP_RADIUS

  return [
    `M ${CENTER_X} ${CENTER_Y}`,
    `L ${CENTER_X + SWEEP_RADIUS} ${CENTER_Y}`,
    `A ${SWEEP_RADIUS} ${SWEEP_RADIUS} 0 0 1 ${endX.toFixed(1)} ${endY.toFixed(1)}`,
    'Z',
  ].join(' ')
}

const SWEEP_PATH = buildSweepPath()
const ORIGIN = `${CENTER_X}px ${CENTER_Y}px`

export function RadarAperture({ asteroids }: { asteroids: Asteroid[] }) {
  const plotted = asteroids
    .filter((asteroid) => asteroid.approach !== undefined)
    .map((asteroid) => {
      const angle = hashAngle(asteroid.id)
      const ratio = toRatio(asteroid.approach?.missAu ?? MAX_AU)

      return {
        id: asteroid.id,
        hazardous: asteroid.hazardous,
        x: CENTER_X + Math.cos(angle) * PLOT_RX * ratio,
        y: CENTER_Y + Math.sin(angle) * PLOT_RY * ratio,
      }
    })

  const hazardous = asteroids.filter((asteroid) => asteroid.hazardous).length

  return (
    <TelemetrySection title="Radar aperture" readout="[360° sweep active]">
      <div className="relative h-72 w-full overflow-hidden rounded-2xl border border-border bg-muted sm:h-96 lg:h-104">
        <svg
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          preserveAspectRatio="xMidYMid slice"
          role="presentation"
          aria-hidden="true"
          className="absolute inset-0 size-full"
        >
          <defs>
            <radialGradient id="radar-sweep" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--color-foreground)" stopOpacity="0.32" />
              <stop offset="100%" stopColor="var(--color-foreground)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* El haz gira en el espacio circular y recién después se achata: al
              revés, la rotación deformaría el sector en cada cuadrante. */}
          <g style={{ transform: `scaleY(${PLOT_RY / PLOT_RX})`, transformOrigin: ORIGIN }}>
            <g
              className="animate-[spin_9s_linear_infinite] motion-reduce:animate-none"
              style={{ transformOrigin: ORIGIN }}
            >
              <path d={SWEEP_PATH} fill="url(#radar-sweep)" />
            </g>
          </g>

          <g fill="none" stroke="var(--color-muted-foreground)" opacity="0.22">
            {RINGS.map((ring) => (
              <ellipse
                key={ring}
                cx={CENTER_X}
                cy={CENTER_Y}
                rx={PLOT_RX * ring}
                ry={PLOT_RY * ring}
                strokeWidth="1"
              />
            ))}

            <line x1="0" y1={CENTER_Y} x2={VIEW_WIDTH} y2={CENTER_Y} strokeWidth="0.8" />
            <line x1={CENTER_X} y1="0" x2={CENTER_X} y2={VIEW_HEIGHT} strokeWidth="0.8" />
          </g>

          {/* La Tierra, en el centro del barrido. */}
          <circle cx={CENTER_X} cy={CENTER_Y} r="13" fill="var(--color-blue-700)" opacity="0.6" />
          <circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r="13"
            fill="none"
            stroke="var(--color-foreground)"
            strokeWidth="1.5"
          />

          {plotted.map((dot) => (
            <g key={dot.id}>
              <circle
                cx={dot.x}
                cy={dot.y}
                r="9"
                fill={dot.hazardous ? 'var(--color-destructive)' : 'var(--color-foreground)'}
                opacity="0.2"
              />
              <circle
                cx={dot.x}
                cy={dot.y}
                r="3.5"
                fill={dot.hazardous ? 'var(--color-destructive)' : 'var(--color-foreground)'}
              />
            </g>
          ))}
        </svg>

        <div className="absolute top-4 left-4 flex flex-col gap-0.5">
          <Text variant="meta.1" className="text-muted-foreground">
            Tracked: {formatInteger(plotted.length).padStart(2, '0')}
          </Text>
          <Text variant="meta.1" className="text-muted-foreground">
            Hazardous: {formatInteger(hazardous).padStart(2, '0')}
          </Text>
        </div>

        <div className="absolute right-4 bottom-4 flex flex-col items-end gap-0.5">
          <Text variant="meta.1" className="text-muted-foreground">
            Rng: {MAX_AU} AU
          </Text>
          <Text variant="meta.1" className="text-muted-foreground">
            Freq: X-band
          </Text>
        </div>
      </div>
    </TelemetrySection>
  )
}
