/**
 * Categorías de EONET que ofrece la sección.
 *
 * EONET tiene trece categorías, pero el diseño muestra cinco chips y son las
 * que tienen masa crítica de eventos abiertos: incendios, inundaciones,
 * tormentas, volcanes y hielo. El resto (sequía, terremotos, deslizamientos…)
 * entra igual al listado sin filtro, con el color y el ícono neutros.
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

export type EventCategory = {
  /** Id de la categoría en EONET; es el valor de `?category=` en la URL. */
  id: string
  label: string
  code: string
  tone: EventTone
  metric: EventMetricKind
}

export const EVENT_CATEGORIES = {
  wildfires: {
    id: 'wildfires',
    label: 'Wildfires',
    code: 'WF',
    tone: 'orange',
    metric: 'area',
  },
  floods: {
    id: 'floods',
    label: 'Floods',
    code: 'FL',
    tone: 'blue',
    metric: 'updated',
  },
  severeStorms: {
    id: 'severeStorms',
    label: 'Severe Storms',
    code: 'ST',
    tone: 'blue',
    metric: 'wind',
  },
  volcanoes: {
    id: 'volcanoes',
    label: 'Volcanoes',
    code: 'VL',
    tone: 'orange',
    metric: 'status',
  },
  seaLakeIce: {
    id: 'seaLakeIce',
    label: 'Ice/Snow',
    code: 'IC',
    tone: 'neutral',
    metric: 'drift',
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
