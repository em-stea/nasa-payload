'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

import { TelemetrySection } from '@/features/asteroids/components/telemetry-section'
import type { Asteroid } from '@/features/asteroids/types/asteroid'
import {
  formatDiameterRange,
  formatInteger,
  formatLunar,
  formatMissAu,
  formatVelocity,
} from '@/features/asteroids/utils/format-asteroid'
import {
  BEARING_TICKS,
  buildRadarContacts,
  CENTER_X,
  CENTER_Y,
  MAX_AU,
  OUTER_RING,
  PLOT_RX,
  PLOT_RY,
  RANGE_RINGS,
  type RadarContact,
  SWEEP_EDGE,
  SWEEP_PATH,
  toPoint,
  toRatio,
  VIEW_HEIGHT,
  VIEW_WIDTH,
} from '@/features/asteroids/utils/radar'
import { Text } from '@/shared/components/text/text'
import { cn } from '@/shared/utils/className-builder'

/**
 * La pantalla de radar del diseño.
 *
 * Los contactos son los objetos de la página, ubicados por `utils/radar`: el
 * ángulo sale del id y el radio, de la distancia de su aproximación.
 *
 * Cada contacto es un link al detalle y se identifica al pasarle el cursor o
 * al tabular hasta él: sale su nombre al lado del blip y el panel de abajo a
 * la izquierda pasa a leer ese objeto. Antes el radar era decoración —los
 * mismos datos que las cards, pero anónimos—; ahora nombra lo que dibuja, así
 * que los blips son navegación de verdad y no se esconden del lector de
 * pantalla. El resto de la pantalla —anillos, rumbos, barrido— sigue siendo
 * adorno y va en una capa aparte, marcada como tal.
 */

const ORIGIN = `${CENTER_X}px ${CENTER_Y}px`

/** Radio del área sensible de cada contacto; el blip dibujado es mucho menor. */
const HIT_RADIUS = 24

/** Media caja del cerco de enganche. */
const LOCK_SIZE = 15

/** Largo de cada gancho del cerco. */
const LOCK_HOOK = 5

/** Distancia del rótulo al centro del blip. */
const LABEL_OFFSET = 26

/**
 * Ancho de caracter de JetBrains Mono, en los dos cuerpos del rótulo.
 *
 * El SVG se arma en el server y no hay forma de medir el texto, pero la
 * tipografía es monoespaciada: el ancho de la caja sale de contar caracteres.
 */
const NAME_CHAR = 6.6
const META_CHAR = 5.4

/** A partir de acá el nombre se corta: la caja no puede crecer para siempre. */
const MAX_NAME = 20

function toneOf(hazardous: boolean) {
  return hazardous ? 'var(--color-destructive)' : 'var(--color-foreground)'
}

/** Cerco de enganche: cuatro escuadras alrededor del contacto activo. */
function buildLockPath(x: number, y: number) {
  const left = x - LOCK_SIZE
  const right = x + LOCK_SIZE
  const top = y - LOCK_SIZE
  const bottom = y + LOCK_SIZE

  return [
    `M ${left} ${top + LOCK_HOOK} L ${left} ${top} L ${left + LOCK_HOOK} ${top}`,
    `M ${right - LOCK_HOOK} ${top} L ${right} ${top} L ${right} ${top + LOCK_HOOK}`,
    `M ${right} ${bottom - LOCK_HOOK} L ${right} ${bottom} L ${right - LOCK_HOOK} ${bottom}`,
    `M ${left + LOCK_HOOK} ${bottom} L ${left} ${bottom} L ${left} ${bottom - LOCK_HOOK}`,
  ].join(' ')
}

/** Rótulo del contacto activo, del lado que no se sale del marco. */
function ContactLabel({ contact }: { contact: RadarContact }) {
  const name =
    contact.asteroid.name.length > MAX_NAME
      ? `${contact.asteroid.name.slice(0, MAX_NAME - 1)}…`
      : contact.asteroid.name

  const meta = `${formatMissAu(contact.approach.missAu)} AU · ${formatVelocity(contact.approach.velocityKmS)}`

  // Del lado de adentro: en la mitad derecha de la pantalla, un rótulo hacia
  // afuera se iría contra el borde recortado.
  const flip = contact.x > CENTER_X
  const width = Math.max(name.length * NAME_CHAR, meta.length * META_CHAR) + 14
  const anchorX = flip ? contact.x - LABEL_OFFSET : contact.x + LABEL_OFFSET
  const boxX = flip ? anchorX - width : anchorX
  const textX = flip ? anchorX - 7 : anchorX + 7
  const tone = toneOf(contact.asteroid.hazardous)

  return (
    <g className="pointer-events-none">
      <line
        x1={flip ? contact.x - LOCK_SIZE - 1 : contact.x + LOCK_SIZE + 1}
        y1={contact.y}
        x2={anchorX}
        y2={contact.y}
        stroke={tone}
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        opacity="0.6"
      />

      <rect
        x={boxX}
        y={contact.y - 16}
        width={width}
        height={32}
        rx="5"
        fill="var(--color-background)"
        fillOpacity="0.92"
        stroke={tone}
        strokeOpacity="0.45"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />

      <text
        x={textX}
        y={contact.y - 4}
        textAnchor={flip ? 'end' : 'start'}
        className="font-jetbrains-mono"
        fontSize="11"
        letterSpacing="0.4"
        fill="var(--color-primary-foreground)"
      >
        {name.toUpperCase()}
      </text>

      <text
        x={textX}
        y={contact.y + 9}
        textAnchor={flip ? 'end' : 'start'}
        className="font-jetbrains-mono"
        fontSize="9"
        fill="var(--color-muted-foreground)"
      >
        {meta}
      </text>
    </g>
  )
}

type BlipProps = {
  contact: RadarContact
  active: boolean
  dimmed: boolean
  onActivate: (id: string | null) => void
}

function Blip({ contact, active, dimmed, onActivate }: BlipProps) {
  const { asteroid, approach, x, y } = contact
  const tone = toneOf(asteroid.hazardous)

  return (
    <Link
      href={asteroid.href}
      aria-label={`${asteroid.name} — ${formatMissAu(approach.missAu)} AU`}
      onPointerEnter={() => onActivate(asteroid.id)}
      onPointerLeave={() => onActivate(null)}
      onFocus={() => onActivate(asteroid.id)}
      onBlur={() => onActivate(null)}
      className={cn(
        'pointer-events-auto outline-none transition-opacity duration-300',
        dimmed && 'opacity-35',
      )}
    >
      {/* El área sensible: sin esto habría que acertarle a un punto de 3.5. */}
      <circle cx={x} cy={y} r={HIT_RADIUS} fill="transparent" />

      {asteroid.hazardous && (
        <circle
          cx={x}
          cy={y}
          r="9"
          fill={tone}
          opacity="0.35"
          style={{ transformOrigin: `${x}px ${y}px` }}
          className="animate-ping [animation-duration:3.2s] motion-reduce:animate-none"
        />
      )}

      <circle
        cx={x}
        cy={y}
        r={active ? 11 : 9}
        fill={tone}
        opacity={active ? 0.35 : 0.2}
        className="transition-all duration-200"
      />

      <circle cx={x} cy={y} r="3.5" fill={tone} />

      {active && (
        <>
          {/* Vector de alcance: de la Tierra al contacto. */}
          <line
            x1={CENTER_X}
            y1={CENTER_Y}
            x2={x}
            y2={y}
            stroke={tone}
            strokeWidth="1"
            strokeDasharray="3 4"
            vectorEffect="non-scaling-stroke"
            opacity="0.45"
          />

          <path
            d={buildLockPath(x, y)}
            fill="none"
            stroke={tone}
            strokeWidth="1.4"
            vectorEffect="non-scaling-stroke"
          />

          <ContactLabel contact={contact} />
        </>
      )}
    </Link>
  )
}

/** Fila del panel de lectura. */
function ReadoutRow({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div className={cn('flex items-baseline gap-2', className)}>
      <dt className="shrink-0">
        <Text variant="meta.1" className="text-muted-foreground">
          {label}
        </Text>
      </dt>
      <dd className="min-w-0">
        <Text variant="meta.1" className="truncate text-primary-foreground">
          {value}
        </Text>
      </dd>
    </div>
  )
}

export function RadarAperture({ asteroids }: { asteroids: Asteroid[] }) {
  const contacts = useMemo(() => buildRadarContacts(asteroids), [asteroids])
  const [activeId, setActiveId] = useState<string | null>(null)

  const hazardous = asteroids.filter((asteroid) => asteroid.hazardous).length

  /**
   * Sin nada apuntado, el panel lee el contacto más cercano: deja la lectura
   * en pantalla —que es la que explica para qué sirve pasar el cursor— en vez
   * de un hueco.
   */
  const nearest = contacts.reduce<RadarContact | undefined>(
    (closest, contact) =>
      closest === undefined || contact.approach.missAu < closest.approach.missAu
        ? contact
        : closest,
    undefined,
  )

  const locked = contacts.find((contact) => contact.asteroid.id === activeId)
  const readout = locked ?? nearest

  /**
   * El contacto apuntado se pinta último: su rótulo se come a los blips que
   * tenga al lado, y no al revés.
   */
  const painted = [...contacts].sort(
    (first, second) =>
      Number(first.asteroid.id === activeId) - Number(second.asteroid.id === activeId),
  )

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

            <radialGradient id="radar-screen" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--color-blue-700)" stopOpacity="0.16" />
              <stop offset="70%" stopColor="var(--color-blue-700)" stopOpacity="0.05" />
              <stop offset="100%" stopColor="var(--color-blue-700)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* El fósforo de la pantalla: un tinte que se apaga hacia el borde. */}
          <ellipse
            cx={CENTER_X}
            cy={CENTER_Y}
            rx={PLOT_RX * OUTER_RING}
            ry={PLOT_RY * OUTER_RING}
            fill="url(#radar-screen)"
          />

          {/* El haz gira en el espacio circular y recién después se achata: al
              revés, la rotación deformaría el sector en cada cuadrante. El
              filo que va adelante en el giro va adentro del mismo grupo —es lo
              que hace leer el barrido como un barrido— y con el trazo sin
              escalar, que si no el escorzo lo adelgaza. */}
          <g style={{ transform: `scaleY(${PLOT_RY / PLOT_RX})`, transformOrigin: ORIGIN }}>
            <g
              className="animate-[spin_9s_linear_infinite] motion-reduce:animate-none"
              style={{ transformOrigin: ORIGIN }}
            >
              <path d={SWEEP_PATH} fill="url(#radar-sweep)" />

              <line
                x1={CENTER_X}
                y1={CENTER_Y}
                x2={SWEEP_EDGE.x}
                y2={SWEEP_EDGE.y}
                stroke="var(--color-foreground)"
                strokeWidth="1.2"
                vectorEffect="non-scaling-stroke"
                opacity="0.35"
              />
            </g>
          </g>

          <g fill="none" stroke="var(--color-muted-foreground)" opacity="0.22">
            {RANGE_RINGS.map((ring) => (
              <ellipse
                key={ring.au}
                cx={CENTER_X}
                cy={CENTER_Y}
                rx={PLOT_RX * toRatio(ring.au)}
                ry={PLOT_RY * toRatio(ring.au)}
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            ))}

            <ellipse
              cx={CENTER_X}
              cy={CENTER_Y}
              rx={PLOT_RX * OUTER_RING}
              ry={PLOT_RY * OUTER_RING}
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />

            <line
              x1="0"
              y1={CENTER_Y}
              x2={VIEW_WIDTH}
              y2={CENTER_Y}
              strokeWidth="0.8"
              strokeDasharray="6 6"
            />
            <line
              x1={CENTER_X}
              y1="0"
              x2={CENTER_X}
              y2={VIEW_HEIGHT}
              strokeWidth="0.8"
              strokeDasharray="6 6"
            />
          </g>

          {/* Marcas de rumbo sobre el borde del plano. */}
          <g stroke="var(--color-muted-foreground)" opacity="0.35">
            {BEARING_TICKS.map((angle, index) => {
              const from = toPoint(angle, 1)
              const to = toPoint(angle, index % 6 === 0 ? 1.08 : 1.04)

              return (
                <line
                  key={angle}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  strokeWidth={index % 6 === 0 ? 1.6 : 1}
                  vectorEffect="non-scaling-stroke"
                />
              )
            })}
          </g>

          {/* El alcance de cada anillo; en mobile el panel no da para leerlos. */}
          <g className="hidden sm:block">
            {RANGE_RINGS.map((ring) => (
              <text
                key={ring.au}
                x={CENTER_X + PLOT_RX * toRatio(ring.au)}
                y={CENTER_Y - 7}
                textAnchor="middle"
                className="font-jetbrains-mono"
                fontSize="9"
                letterSpacing="0.5"
                fill="var(--color-muted-foreground)"
                opacity="0.7"
              >
                {ring.label}
              </text>
            ))}
          </g>

          {/* La Tierra, en el centro del barrido. */}
          <circle cx={CENTER_X} cy={CENTER_Y} r="26" fill="url(#radar-screen)" />
          <circle cx={CENTER_X} cy={CENTER_Y} r="13" fill="var(--color-blue-700)" opacity="0.6" />
          <circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r="13"
            fill="none"
            stroke="var(--color-foreground)"
            strokeWidth="1.5"
          />
        </svg>

        {/* Viñeta: apaga los bordes para que la pantalla no termine en un corte
            seco contra el marco. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_50%,transparent_45%,var(--color-muted)_100%)]"
        />

        {/* Los contactos van en su propia capa: mismo `viewBox` y mismo
            recorte, así que caen exactamente sobre la pantalla de atrás, pero
            sin heredar el `aria-hidden` del adorno. */}
        <svg
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          preserveAspectRatio="xMidYMid slice"
          className="pointer-events-none absolute inset-0 size-full"
        >
          {painted.map((contact) => (
            <Blip
              key={contact.asteroid.id}
              contact={contact}
              active={contact.asteroid.id === activeId}
              dimmed={activeId !== null && contact.asteroid.id !== activeId}
              onActivate={setActiveId}
            />
          ))}
        </svg>

        {/* Cuentas y referencia de color, en la misma lectura. */}
        <div className="absolute top-3 left-3 flex flex-col gap-0.5 sm:top-4 sm:left-4">
          <div className="flex items-center gap-1.5">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-foreground" />
            <Text variant="meta.1" className="text-muted-foreground">
              Tracked: {formatInteger(contacts.length).padStart(2, '0')}
            </Text>
          </div>

          <div className="flex items-center gap-1.5">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-destructive" />
            <Text variant="meta.1" className="text-muted-foreground">
              Hazardous: {formatInteger(hazardous).padStart(2, '0')}
            </Text>
          </div>
        </div>

        {/* La pista del hover no va en mobile: no hay hover y se le encima a
            las cuentas de la esquina de enfrente. */}
        <Text
          variant="meta.1"
          className="absolute top-4 right-4 hidden text-muted-foreground sm:block"
        >
          [pick a contact]
        </Text>

        {/* La lectura del contacto apuntado. Va en un lugar fijo del panel: el
            rótulo del blip se mueve con el cursor, esto no. */}
        {readout && (
          <div className="absolute bottom-3 left-3 w-fit max-w-[calc(100%-1.5rem)] sm:bottom-4 sm:left-4 sm:max-w-64">
            <div className="flex flex-col gap-1 rounded-lg border border-border bg-background/85 px-3 py-2 backdrop-blur-sm">
              <div className="flex items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className={cn(
                    'size-1.5 rounded-full',
                    readout.asteroid.hazardous ? 'bg-destructive' : 'bg-foreground',
                  )}
                />
                <Text variant="meta.1" className="whitespace-nowrap text-muted-foreground">
                  [{locked ? 'contact lock' : 'nearest contact'}]
                </Text>
              </div>

              <Text variant="meta.2" className="truncate text-primary-foreground">
                {readout.asteroid.name}
              </Text>

              <dl className="flex flex-col gap-0.5">
                <ReadoutRow
                  label="Rng"
                  value={`${formatMissAu(readout.approach.missAu)} AU · ${formatLunar(readout.approach.missLunar)}`}
                />
                <ReadoutRow label="Vel" value={formatVelocity(readout.approach.velocityKmS)} />

                {/* En mobile el panel es chico y la ficha entera se le come
                    media pantalla: quedan la distancia y la velocidad. */}
                <ReadoutRow
                  className="hidden sm:flex"
                  label="Dia"
                  value={formatDiameterRange(
                    readout.asteroid.diameterMinM,
                    readout.asteroid.diameterMaxM,
                  )}
                />
                <ReadoutRow
                  className="hidden sm:flex"
                  label="Cpa"
                  value={readout.approach.dateLabel}
                />
              </dl>
            </div>
          </div>
        )}

        <div className="absolute right-4 bottom-4 hidden flex-col items-end gap-0.5 sm:flex">
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
