/**
 * Fechas en el formato del diseño: `2042.11.04_1800Z`.
 *
 * Se formatea sobre el string ISO, sin pasar por `Date` ni por `Intl`: el WP de
 * nasa.gov publica la fecha sin offset y el server y el browser están en zonas
 * distintas, así que convertir movería el día en el cliente y rompería la
 * hidratación. Acá lo que se ve es literalmente lo que publicó la fuente.
 */

const ISO_PATTERN = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/;

/** `2042.11.04` */
export function toMissionDate(iso: string) {
  const match = iso.match(ISO_PATTERN);

  if (!match) return iso;

  const [, year, month, day] = match;

  return `${year}.${month}.${day}`;
}

/** `2042.11.04_1800Z` */
export function toMissionTimestamp(iso: string) {
  const match = iso.match(ISO_PATTERN);

  if (!match) return iso;

  const [, year, month, day, hours, minutes] = match;
  const time = hours && minutes ? `_${hours}${minutes}Z` : "";

  return `${year}.${month}.${day}${time}`;
}
