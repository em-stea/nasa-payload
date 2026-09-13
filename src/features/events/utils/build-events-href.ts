import type {EventCategorySlug} from "@/features/events/constants/categories";

type EventsHrefParams = {
  page?: number;
  category?: EventCategorySlug;
};

/**
 * URL canónica de la sección. Omite los valores por defecto para que
 * `/events`, `/events?page=1` y `/events?category=` no sean tres entradas
 * distintas del prefetch cache.
 */
export function buildEventsHref({page = 1, category}: EventsHrefParams = {}) {
  const params = new URLSearchParams();

  if (category) params.set("category", category);
  if (page > 1) params.set("page", String(page));

  const query = params.toString();

  return query ? `/events?${query}` : "/events";
}
