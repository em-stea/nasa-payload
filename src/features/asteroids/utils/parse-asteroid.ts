import {
  CRITICAL_LUNAR_DISTANCE,
  HISTORIC_OBJECT_YEAR,
  NEW_OBJECT_YEARS,
} from '@/features/asteroids/constants/asteroid-status'
import type {
  Asteroid,
  AsteroidApproach,
  AsteroidDetail,
  AsteroidFact,
  AsteroidStatus,
  NeoCloseApproach,
  NeoObject,
} from '@/features/asteroids/types/asteroid'
import {
  formatDegrees,
  formatDiameterRange,
  formatLunar,
  formatOrbitAu,
  formatPeriod,
  formatRatio,
} from '@/features/asteroids/utils/format-asteroid'
import { buildAsteroidHref } from '@/features/asteroids/utils/build-asteroids-href'

/** NeoWs manda todos los números como string, y a veces vacíos. */
function toNumber(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === '') return null

  const parsed = typeof value === 'number' ? value : Number.parseFloat(value)

  return Number.isFinite(parsed) ? parsed : null
}

/**
 * `101955 Bennu (1999 RQ36)` → `101955 Bennu`.
 *
 * El paréntesis lleva la designación provisional, que repite información que
 * ya está en el número y el nombre, y es lo que hace que el titular no entre
 * en una línea de la card.
 */
export function cleanAsteroidName(name: string) {
  const cleaned = name.replace(/\s*\([^)]*\)\s*/g, ' ').trim()

  return cleaned || name.trim()
}

function parseApproach(approach: NeoCloseApproach, nowMs: number): AsteroidApproach | null {
  const velocity = toNumber(approach.relative_velocity?.kilometers_per_second)
  const missAu = toNumber(approach.miss_distance?.astronomical)
  const missLunar = toNumber(approach.miss_distance?.lunar)
  const missKm = toNumber(approach.miss_distance?.kilometers)

  if (velocity === null || missAu === null || missLunar === null || missKm === null) return null

  const epoch = approach.epoch_date_close_approach

  return {
    date: approach.close_approach_date,
    dateLabel: approach.close_approach_date_full ?? approach.close_approach_date,
    epoch,
    velocityKmS: velocity,
    missAu,
    missLunar,
    missKm,
    upcoming: epoch >= nowMs,
  }
}

/**
 * Aproximación de referencia: la próxima que viene, y si ya pasaron todas, la
 * última.
 *
 * NeoWs devuelve el historial completo —de 1900 a 2200 en los objetos más
 * observados— ordenado por fecha, así que alcanza con buscar el primer epoch
 * que todavía no ocurrió.
 */
export function pickApproach(
  approaches: NeoCloseApproach[],
  nowMs: number,
): AsteroidApproach | undefined {
  const parsed = approaches
    .map((approach) => parseApproach(approach, nowMs))
    .filter((approach): approach is AsteroidApproach => approach !== null)
    .sort((a, b) => a.epoch - b.epoch)

  return parsed.find((approach) => approach.upcoming) ?? parsed.at(-1)
}

function readYear(date: string | null | undefined) {
  const year = Number.parseInt(date?.slice(0, 4) ?? '', 10)

  return Number.isFinite(year) ? year : null
}

/**
 * El rótulo de la card, por orden de precedencia: primero lo que implica
 * riesgo, después lo que dice algo del objeto en el catálogo.
 */
export function resolveAsteroidStatus(
  neo: NeoObject,
  approach: AsteroidApproach | undefined,
  nowMs: number,
): AsteroidStatus {
  const hazardous = neo.is_potentially_hazardous_asteroid

  if (hazardous && approach && approach.upcoming && approach.missLunar <= CRITICAL_LUNAR_DISTANCE) {
    return 'critical'
  }

  if (hazardous) return 'pha'

  const firstSeen = readYear(neo.orbital_data?.first_observation_date)
  const currentYear = new Date(nowMs).getUTCFullYear()

  if (firstSeen !== null && currentYear - firstSeen <= NEW_OBJECT_YEARS) return 'new'
  if (firstSeen !== null && firstSeen < HISTORIC_OBJECT_YEAR) return 'hist'

  return approach?.upcoming ? 'actv' : 'trk'
}

export function parseAsteroid(neo: NeoObject, nowMs: number): Asteroid {
  const approach = pickApproach(neo.close_approach_data ?? [], nowMs)
  const diameter = neo.estimated_diameter?.meters

  return {
    id: neo.id,
    name: cleanAsteroidName(neo.name),
    href: buildAsteroidHref(neo.id),
    status: resolveAsteroidStatus(neo, approach, nowMs),
    hazardous: neo.is_potentially_hazardous_asteroid,
    magnitude: neo.absolute_magnitude_h,
    diameterMinM: diameter?.estimated_diameter_min ?? 0,
    diameterMaxM: diameter?.estimated_diameter_max ?? 0,
    approach,
  }
}

/** Las seis celdas de ORBITAL PARAMETERS, salteando lo que NeoWs no publique. */
function buildOrbitalFacts(neo: NeoObject): AsteroidFact[] {
  const orbital = neo.orbital_data
  if (!orbital) return []

  const entries: Array<[string, number | null, (value: number) => string]> = [
    ['Perihelion', toNumber(orbital.perihelion_distance), formatOrbitAu],
    ['Aphelion', toNumber(orbital.aphelion_distance), formatOrbitAu],
    ['Orbital period', toNumber(orbital.orbital_period), formatPeriod],
    ['Inclination', toNumber(orbital.inclination), formatDegrees],
    ['Eccentricity', toNumber(orbital.eccentricity), formatRatio],
    ['Semi-major axis', toNumber(orbital.semi_major_axis), formatOrbitAu],
  ]

  return entries
    .filter((entry): entry is [string, number, (value: number) => string] => entry[1] !== null)
    .map(([label, value, format]) => ({ label, value: format(value) }))
}

/**
 * NeoWs no publica prosa, así que el párrafo del detalle se arma con lo que sí
 * publica: la clase orbital, el arco de observación, el tamaño estimado y la
 * próxima aproximación. Cada oración se agrega sólo si su dato llegó.
 */
function buildSummary(neo: NeoObject, asteroid: Asteroid): string {
  const orbital = neo.orbital_data
  const sentences: string[] = []

  const orbitClass = orbital?.orbit_class?.orbit_class_description

  sentences.push(
    orbitClass
      ? `${asteroid.name} is a near-Earth object of the ${orbital?.orbit_class?.orbit_class_type ?? 'NEO'} orbit class — ${orbitClass.replace(/\.$/, '')}.`
      : `${asteroid.name} is a near-Earth object tracked by NASA's Center for Near-Earth Object Studies.`,
  )

  if (asteroid.diameterMinM > 0) {
    sentences.push(
      `Radar and photometric estimates put it between ${formatDiameterRange(asteroid.diameterMinM, asteroid.diameterMaxM)} across.`,
    )
  }

  if (orbital?.first_observation_date && orbital.observations_used) {
    sentences.push(
      `It has been followed since ${orbital.first_observation_date} across ${orbital.observations_used} recorded observations.`,
    )
  }

  const approach = asteroid.approach

  if (approach?.upcoming) {
    sentences.push(
      `Its next approach to Earth is ${approach.dateLabel}, passing at ${formatLunar(approach.missLunar)}.`,
    )
  } else if (approach) {
    sentences.push(`Its last recorded approach to Earth was ${approach.dateLabel}.`)
  }

  sentences.push(
    asteroid.hazardous
      ? 'JPL classifies it as a potentially hazardous asteroid, a label driven by its size and how close its orbit comes to ours — not by a predicted impact.'
      : 'It is not classified as a potentially hazardous asteroid.',
  )

  return sentences.join(' ')
}

export function parseAsteroidDetail(neo: NeoObject, nowMs: number): AsteroidDetail {
  const asteroid = parseAsteroid(neo, nowMs)
  const orbital = neo.orbital_data

  return {
    ...asteroid,
    summary: buildSummary(neo, asteroid),
    jplUrl: neo.nasa_jpl_url,
    sentry: neo.is_sentry_object,
    orbitClass: orbital?.orbit_class?.orbit_class_type ?? undefined,
    orbitUncertainty: toNumber(orbital?.orbit_uncertainty),
    minimumOrbitIntersection: toNumber(orbital?.minimum_orbit_intersection),
    orbital: buildOrbitalFacts(neo),
    observations: {
      first: orbital?.first_observation_date ?? undefined,
      last: orbital?.last_observation_date ?? undefined,
      used: orbital?.observations_used ?? null,
    },
  }
}
