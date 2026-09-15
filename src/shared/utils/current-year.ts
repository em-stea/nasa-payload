import {cacheLife} from "next/cache";

/**
 * Año actual para el copyright del footer.
 *
 * Con `cacheComponents` activo, Next bloquea `new Date()` durante el prerender
 * (sería el año del build, congelado en el HTML estático). Detrás de
 * `use cache` el valor es explícitamente compartido y se revalida a diario, que
 * es de sobra para algo que cambia una vez al año.
 */
export async function getCurrentYear(): Promise<number> {
  "use cache";
  cacheLife("days");

  return new Date().getFullYear();
}
