import type {NextConfig} from "next";

import {withPayload} from "@payloadcms/next/withPayload";

import {FRONT_ENV} from "@/shared/config/front-config";
import {withTailwindMergeConfig} from "@/shared/utils/tw-merge/helpers/helpers";

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    // Los dos root layouts (sitio y Payload) dejan sin lugar al `not-found`
    // global: sin esto, una URL que no matchea ninguna ruta cae en el 404 por
    // defecto de Next en vez de en `app/global-not-found.tsx`.
    globalNotFound: true,
  },
  partialPrefetching: true,
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
      // Avatares de los providers de OAuth (Auth.js).
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "science.nasa.gov",
        port: "",
        pathname: "/**",
      },
      // `**` y no `*`: las imágenes del cuerpo de las notas también salen de
      // subdominios anidados como assets.science.nasa.gov.
      {
        protocol: "https",
        hostname: "**.nasa.gov",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
      // Texturas de la Tierra: las mismas que ya carga el globo de la home,
      // reusadas como planisferio en el hero de eventos.
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
        pathname: "/npm/**",
      },
    ],
  },
  ...(FRONT_ENV.NEXT_PUBLIC_ENVIRONMENT === "local" && {
    onDemandEntries: {
      maxInactiveAge: 60 * 1000,
      pagesBufferLength: 2,
    },
  }),
};

export default withTailwindMergeConfig(withPayload(nextConfig, {devBundleServerPackages: false}));
