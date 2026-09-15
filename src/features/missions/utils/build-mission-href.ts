/** Ruta del detalle de un proyecto de TechPort dentro del sitio. */
export function buildMissionHref(id: string) {
  return `/missions/${id}`;
}

/**
 * Nombre de identidad compartido entre la card de Featured Missions y el hero
 * del detalle, para que React morphee una imagen en la otra con `ViewTransition`.
 */
export function buildMissionPhotoTransitionName(id: string) {
  return `mission-photo-${id}`;
}
