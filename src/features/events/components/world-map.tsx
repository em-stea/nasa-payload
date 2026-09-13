import Image from 'next/image'
import Link from 'next/link'

import type { EventTone } from '@/features/events/constants/categories'
import type { NaturalEvent } from '@/features/events/types/events'
import { toMapPosition } from '@/features/events/utils/geo'
import { cn } from '@/shared/utils/className-builder'

/**
 * Planisferio con un marcador por evento abierto.
 *
 * La textura es la misma que usa el globo de la home, en proyección
 * equirectangular: eso es justamente lo que permite ubicar cada evento con una
 * regla de tres sobre latitud y longitud (ver `toMapPosition`), sin traer una
 * librería de mapas ni un dataset de fronteras.
 *
 * Va en escala de grises y bajada de brillo para que quede el relieve apagado
 * del diseño y los marcadores sean lo único con color. En claro se invierte:
 * sin eso la textura —oscura de origen— se lava contra el fondo blanco y el
 * mapa desaparece.
 */

const EARTH_TEXTURE = 'https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg'

/**
 * Hasta qué latitud se muestra.
 *
 * El mapa completo es 2:1 y a lo ancho de la pantalla queda altísimo, así que
 * se recortan los casquetes: la textura se agranda dentro de una caja más baja
 * y sobresale arriba y abajo. 72° deja afuera el hielo permanente pero entra
 * todo lo que EONET reporta, incluidos los témpanos del mar de Weddell.
 *
 * Los marcadores viven dentro de la misma caja agrandada, así que siguen
 * alineados con el mapa sin tener que corregirlos por el recorte.
 */
const LAT_LIMIT = 72

/** Alto de la textura como porcentaje de la caja, y cuánto sobresale arriba. */
const INNER_HEIGHT = (180 / (2 * LAT_LIMIT)) * 100
const INNER_TOP = -((90 - LAT_LIMIT) / 180) * INNER_HEIGHT

/** Meridianos y paralelos cada 30°, como la grilla del diseño. */
function Graticule() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 360 180"
      preserveAspectRatio="none"
      className="absolute inset-0 size-full text-basic-500/15"
    >
      {[30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((x) => (
        <line key={x} x1={x} y1="0" x2={x} y2="180" stroke="currentColor" strokeWidth="0.3" />
      ))}
      {[30, 60, 90, 120, 150].map((y) => (
        <line key={y} x1="0" y1={y} x2="360" y2={y} stroke="currentColor" strokeWidth="0.3" />
      ))}
      {/* El ecuador, un punto más marcado que el resto. */}
      <line x1="0" y1="90" x2="360" y2="90" stroke="currentColor" strokeWidth="0.7" />
    </svg>
  )
}

const MARKER_TONE = {
  orange: 'bg-orange-200',
  blue: 'bg-foreground',
  neutral: 'bg-basic-300',
} as const satisfies Record<EventTone, string>

function Marker({ event }: { event: NaturalEvent }) {
  const { left, top } = toMapPosition(event.position.lat, event.position.lng)
  const tone = MARKER_TONE[event.category.tone]

  return (
    <Link
      href={event.href}
      style={{ left: `${left}%`, top: `${top}%` }}
      className="group absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-200"
      title={`${event.title} — ${event.coords}`}
    >
      <span className="sr-only">{event.title}</span>

      {/* Halo: marca la posición sin tapar el mapa. */}
      <span aria-hidden="true" className={cn('absolute inset-0 rounded-full opacity-25', tone)} />
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-1 rounded-full transition-transform duration-200 group-hover:scale-150',
          tone,
        )}
      />
    </Link>
  )
}

export function WorldMap({ events }: { events: NaturalEvent[] }) {
  return (
    <div className="relative aspect-5/2 w-full overflow-hidden border-b border-border bg-background">
      <div
        className="absolute inset-x-0"
        style={{ height: `${INNER_HEIGHT}%`, top: `${INNER_TOP}%` }}
      >
        <Image
          src={EARTH_TEXTURE}
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-fill opacity-25 grayscale contrast-125 invert dark:opacity-30 dark:brightness-75 dark:invert-0"
        />

        <Graticule />

        {events.map((event) => (
          <Marker key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}
