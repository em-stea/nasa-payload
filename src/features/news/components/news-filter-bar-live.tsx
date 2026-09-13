"use client";

import {useSearchParams} from "next/navigation";

import {NewsFilterBar} from "@/features/news/components/news-filter-bar";
import {isNewsCategorySlug} from "@/features/news/constants/categories";

/**
 * La barra de filtros conectada a la URL.
 *
 * Lee la categoría del cliente a propósito: en una navegación entre filtros el
 * router ya tiene los search params, así que `useSearchParams` resuelve sincrónico
 * y el chip activo se mueve en el mismo frame del click, sin esperar al server.
 *
 * En una carga directa el hook suspende, y ahí entra el fallback: la misma barra
 * sin chip activo, con las mismas medidas.
 */
export function NewsFilterBarLive() {
  const category = useSearchParams().get("category");

  return <NewsFilterBar active={isNewsCategorySlug(category) ? category : undefined} />;
}
