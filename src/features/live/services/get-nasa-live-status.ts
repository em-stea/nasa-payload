import type {NasaLiveStatus} from "@/features/live/types/live";

import {cacheLife, cacheTag} from "next/cache";

import {NASA_YOUTUBE_LIVE_URL} from "@/features/live/constants/live";

/**
 * Cuando el canal está en vivo, el canonical de `/live` apunta a
 * `watch?v=<id>`; si no, apunta al canal. No hace falta parsear más que eso.
 */
const CANONICAL_WATCH_URL_PATTERN =
  /<link rel="canonical" href="https:\/\/www\.youtube\.com\/watch\?v=([\w-]{11})"/;

/**
 * Si NASA está transmitiendo en vivo ahora mismo, y con qué video.
 *
 * No usa `http.get` (que sólo sabe parsear JSON) porque esto no es un
 * endpoint: es HTML de YouTube. Cachear por minutos evita golpear esa página
 * en cada request sin dejar el botón "EN VIVO" desactualizado por mucho rato.
 */
export async function getNasaLiveStatus(): Promise<NasaLiveStatus> {
  "use cache";
  cacheLife("minutes");
  cacheTag("nasa-live-status");

  try {
    const response = await fetch(NASA_YOUTUBE_LIVE_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(8_000),
    });

    if (!response.ok) {
      return {isLive: false, videoId: null};
    }

    const html = await response.text();
    const videoId = html.match(CANONICAL_WATCH_URL_PATTERN)?.[1] ?? null;

    return {isLive: videoId !== null, videoId};
  } catch {
    return {isLive: false, videoId: null};
  }
}
