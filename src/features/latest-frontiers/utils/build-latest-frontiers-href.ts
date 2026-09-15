type LatestFrontiersHrefParams = {
  page?: number;
};

/**
 * URL canónica de la sección. Omite `page=1` para que `/latest-frontiers` y
 * `/latest-frontiers?page=1` no sean dos entradas distintas del prefetch cache.
 */
export function buildLatestFrontiersHref({page = 1}: LatestFrontiersHrefParams = {}) {
  const params = new URLSearchParams();

  if (page > 1) params.set("page", String(page));

  const query = params.toString();

  return query ? `/latest-frontiers?${query}` : "/latest-frontiers";
}
