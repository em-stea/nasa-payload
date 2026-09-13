/**
 * EPIC: la cámara del DSCOVR, parada en el Lagrange 1, saca una docena de
 * fotos de disco completo por día mientras la Tierra gira debajo. La API
 * devuelve esa tanda entera —la del último día disponible— y no una sola foto,
 * así que el shape crudo es una lista.
 */

/** El EPIC usa `lon`; el globo espera `lng`. La traducción la hace el parser. */
type EpicCoordinates = {
  lat: number
  lon: number
}

/** Una toma tal como la publica `epic.gsfc.nasa.gov/api/enhanced`. */
export type EpicImageResponse = {
  identifier: string
  caption: string
  /** Nombre del archivo sin extensión: `epic_RGB_20260907005515`. */
  image: string
  version: string
  /** Punto de la Tierra que quedó en el centro del cuadro. */
  centroid_coordinates: EpicCoordinates
  /** `YYYY-MM-DD HH:mm:ss` en UTC, sin sufijo de zona. */
  date: string
}

/** Una toma lista para pintar: coordenadas del globo y URLs ya armadas. */
export type EpicCapture = {
  id: string
  caption: string
  /** ISO en UTC (`2026-09-07T00:50:27Z`). */
  date: string
  /** Punto sub-satelital: dónde clavamos el pin sobre el globo. */
  lat: number
  lng: number
  /** 120px: la miniatura del pin sobre el globo. */
  thumbnailUrl: string
  /** 2048px: el disco completo que se funde con el globo. */
  imageUrl: string
}
