/** Ruta del detalle de un item del catálogo dentro del sitio. */
export function buildLatestFrontierHref(id: string) {
  return `/latest-frontiers/${id}`;
}

/**
 * Nombre de identidad compartido entre la card del grid y el hero del
 * detalle, para que React morphee una imagen en la otra con `ViewTransition`.
 */
export function buildLatestFrontierPhotoTransitionName(id: string) {
  return `latest-frontier-photo-${id}`;
}
