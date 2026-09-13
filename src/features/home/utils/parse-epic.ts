import type {EpicCapture, EpicImageResponse} from "@/features/home/types/epic";

/**
 * Las fotos no vienen en el JSON: la API devuelve el nombre del archivo y el
 * archivo histórico se ordena por la fecha de la toma. Armar la URL es
 * concatenar `/YYYY/MM/DD/` con el tamaño que necesitemos.
 */
const EPIC_ARCHIVE_URL = "https://epic.gsfc.nasa.gov/archive/enhanced";

/** `2026-09-07 00:50:27` → `2026-09-07T00:50:27Z`. La API publica en UTC. */
function toIsoDate(date: string) {
  return `${date.replace(" ", "T")}Z`;
}

/** `2026-09-07 00:50:27` → `2026/09/07`, la carpeta del archivo. */
function toArchivePath(date: string) {
  return date.slice(0, 10).replace(/-/g, "/");
}

export function parseEpicImage(image: EpicImageResponse): EpicCapture {
  const archivePath = toArchivePath(image.date);

  return {
    id: image.identifier,
    caption: image.caption,
    date: toIsoDate(image.date),
    lat: image.centroid_coordinates.lat,
    lng: image.centroid_coordinates.lon,
    thumbnailUrl: `${EPIC_ARCHIVE_URL}/${archivePath}/thumbs/${image.image}.jpg`,
    imageUrl: `${EPIC_ARCHIVE_URL}/${archivePath}/jpg/${image.image}.jpg`,
  };
}
