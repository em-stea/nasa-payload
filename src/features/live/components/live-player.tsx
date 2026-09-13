"use client";

import {useEffect} from "react";

import "lite-youtube-embed/src/lite-yt-embed.css";

type LivePlayerProps = {
  videoId: string;
  title: string;
};

/**
 * `lite-youtube-embed` registra un custom element que asume que existe
 * `HTMLElement`; importarlo top-level rompería el render en el servidor, así
 * que se carga sólo del lado del cliente. El browser lo upgradea solo una vez
 * que el módulo define el elemento, aunque el nodo ya esté en el DOM.
 */
export function LivePlayer({videoId, title}: LivePlayerProps) {
  useEffect(() => {
    import("lite-youtube-embed");
  }, []);

  return (
    <lite-youtube
      key={videoId}
      playlabel={title}
      // `lite-yt-embed.css` no está en un @layer de Tailwind, así que gana por
      // encima de cualquier utility (incluso `max-w-none`); sólo un inline
      // style puede pisar su `max-width: 720px`.
      style={{width: "100%", maxWidth: "none"}}
      videoid={videoId}
    />
  );
}
