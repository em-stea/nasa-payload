"use client";

import {useSearchParams} from "next/navigation";

import {EventsFilterBar} from "@/features/events/components/events-filter-bar";
import {isEventCategorySlug} from "@/features/events/constants/categories";

/**
 * La barra de filtros conectada a la URL.
 *
 * Lee la categoría del cliente a propósito: en una navegación entre filtros el
 * router ya tiene los search params, así que `useSearchParams` resuelve
 * sincrónico y el chip activo se mueve en el mismo frame del click, sin
 * esperar al server.
 *
 * En una carga directa el hook suspende, y ahí entra el fallback: la misma
 * barra sin chip activo, con las mismas medidas.
 */
export function EventsFilterBarLive() {
  const category = useSearchParams().get("category");

  return <EventsFilterBar active={isEventCategorySlug(category) ? category : undefined} />;
}
