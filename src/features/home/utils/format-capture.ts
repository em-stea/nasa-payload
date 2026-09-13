import type {EpicCapture} from "@/features/home/types/epic";

/**
 * Formateo de la telemetría de una toma.
 *
 * Sobre el string ISO y sin `Date` ni `Intl`, por lo mismo que en
 * `mission-date`: la hora del EPIC ya viene en UTC y pasarla por el huso del
 * browser movería el valor entre server y cliente, rompiendo la hidratación.
 */

/** `0050Z`, para el tooltip del pin. */
export function toCaptureTime(iso: string) {
  return `${iso.slice(11, 13)}${iso.slice(14, 16)}Z`;
}

/** `7.5512° N` */
export function toLatitudeLabel({lat}: Pick<EpicCapture, "lat">) {
  return `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}`;
}

/** `169.9877° E` */
export function toLongitudeLabel({lng}: Pick<EpicCapture, "lng">) {
  return `${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? "E" : "W"}`;
}

/** `2026-09-07 00:50:27 UTC` */
export function toCaptureTimestamp(iso: string) {
  return `${iso.slice(0, 10)} ${iso.slice(11, 19)} UTC`;
}
