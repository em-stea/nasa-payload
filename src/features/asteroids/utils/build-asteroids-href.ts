type AsteroidsHrefParams = {
  page?: number;
};

/**
 * URL canónica del listado. Omite `page=1` para que `/asteroids` y
 * `/asteroids?page=1` no sean dos entradas distintas del prefetch cache.
 */
export function buildAsteroidsHref({page = 1}: AsteroidsHrefParams = {}) {
  return page > 1 ? `/asteroids?page=${page}` : "/asteroids";
}

/** Ruta del detalle de un objeto dentro del sitio. */
export function buildAsteroidHref(id: string) {
  return `/asteroids/${id}`;
}

/**
 * Nombre de identidad compartido entre el render de la card y el del detalle,
 * para que React morphee uno en el otro con `ViewTransition`.
 */
export function buildAsteroidMeshTransitionName(id: string) {
  return `asteroid-mesh-${id}`;
}
