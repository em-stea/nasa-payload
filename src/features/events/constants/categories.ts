/**
 * Categorías de EONET que ofrece la sección.
 *
 * EONET tiene trece categorías, pero el diseño muestra cinco chips y son las
 * únicas con eventos: incendios, inundaciones, tormentas, volcanes y hielo.
 * Las otras ocho (sequía, terremotos, deslizamientos…) están declaradas en la
 * API pero hoy no publican nada, ni reciente ni abierto, así que no se
 * consultan; `EVENT_FALLBACK_CATEGORY` queda igual por si vuelven a poblarse.
 *
 * `code` es el sufijo del identificador del diseño (`EVT.ID.24184.WF`) y
 * `tone` el color con el que se pintan el ícono, la magnitud y el marcador del
 * mapa: lo "caliente" —fuego y lava— en naranja, lo atmosférico y acuático en
 * azul, y el hielo en el gris neutro del tema.
 */

export type EventTone = 'orange' | 'blue' | 'neutral'

/**
 * Qué se muestra en la cuarta fila de la card. Cada categoría destaca el dato
 * que EONET publica para ella; `updated` es el que sirve para todas.
 */
export type EventMetricKind = 'wind' | 'area' | 'status' | 'drift' | 'updated'

/**
 * Cómo hay que pedirle a EONET los eventos de cada categoría.
 *
 * El catálogo no es homogéneo y esto no es un detalle de implementación: es la
 * diferencia entre un mapa global y uno que muestra solo Estados Unidos.
 *
 * - `recent`: la fuente cierra los eventos a los pocos días (GDACS reporta y
 *   da por terminado cada foco). Pedir `status=open` deja afuera todo lo que
 *   publica —o sea, casi todo el planeta— y solo sobreviven los incendios de
 *   IRWIN, que es el sistema interagencial estadounidense y únicamente cubre
 *   ese país. Se consultan entonces por ventana de días, sin filtrar estado.
 * - `open`: la fuente mantiene el evento abierto durante meses (un volcán en
 *   erupción, un témpano a la deriva) y actualiza la traza de a saltos. Estos
 *   se caen de cualquier ventana de días, así que van por `status=open`.
 */
export type EventFeed = 'recent' | 'open'

export type EventCategory = {
  /** Id de la categoría en EONET; es el valor de `?category=` en la URL. */
  id: string
  label: string
  code: string
  tone: EventTone
  metric: EventMetricKind
  feed: EventFeed
}

export const EVENT_CATEGORIES = {
  wildfires: {
    id: 'wildfires',
    label: 'Wildfires',
    code: 'WF',
    tone: 'orange',
    metric: 'area',
    feed: 'recent',
  },
  floods: {
    id: 'floods',
    label: 'Floods',
    code: 'FL',
    tone: 'blue',
    metric: 'updated',
    feed: 'recent',
  },
  severeStorms: {
    id: 'severeStorms',
    label: 'Severe Storms',
    code: 'ST',
    tone: 'blue',
    metric: 'wind',
    feed: 'recent',
  },
  volcanoes: {
    id: 'volcanoes',
    label: 'Volcanoes',
    code: 'VL',
    tone: 'orange',
    metric: 'status',
    feed: 'open',
  },
  seaLakeIce: {
    id: 'seaLakeIce',
    label: 'Ice/Snow',
    code: 'IC',
    tone: 'neutral',
    metric: 'drift',
    feed: 'open',
  },
} as const satisfies Record<string, EventCategory>

export type EventCategorySlug = keyof typeof EVENT_CATEGORIES

/** Chips de la barra de filtros, en el orden del diseño. */
export const EVENT_FILTER_SLUGS = [
  'wildfires',
  'floods',
  'severeStorms',
  'volcanoes',
  'seaLakeIce',
] as const satisfies readonly EventCategorySlug[]

/** Categoría de los eventos que no caen en ninguno de los cinco chips. */
export const EVENT_FALLBACK_CATEGORY: EventCategory = {
  id: 'other',
  label: 'Event',
  code: 'EV',
  tone: 'blue',
  metric: 'updated',
  feed: 'recent',
}

export function isEventCategorySlug(value: string | null | undefined): value is EventCategorySlug {
  return value != null && value in EVENT_CATEGORIES
}

/**
 * Primera categoría conocida del evento. EONET puede taxonomizar uno con más
 * de una (un volcán que además genera humo), y solo una nos sirve de tag.
 */
export function resolveEventCategory(ids: readonly string[]): EventCategory {
  const match = ids.find(isEventCategorySlug)

  return match ? EVENT_CATEGORIES[match] : EVENT_FALLBACK_CATEGORY
}

/** Clases del color de cada tono, para texto, borde e ícono. */
export const TONE_TEXT = {
  orange: 'text-orange-200',
  blue: 'text-foreground',
  neutral: 'text-primary-foreground',
} as const satisfies Record<EventTone, string>

export const TONE_BORDER = {
  orange: 'border-orange-200',
  blue: 'border-foreground',
  neutral: 'border-border',
} as const satisfies Record<EventTone, string>
