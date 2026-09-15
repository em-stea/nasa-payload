import type {NavbarLogoData} from "@/shared/components/navbar/navbar";

import Image from "next/image";

import {cn} from "@/shared/utils/className-builder";

type SiteLogoProps = {
  logo: NavbarLogoData;
  /** Lado del asset en px; el contenedor es quien define el tamaño visual. */
  size: number;
  className?: string;
  priority?: boolean;
};

/**
 * El logo del sitio, con su variante por tema.
 *
 * El asset es un SVG servido como `<img>`, así que las letras no se pueden
 * recolorear por CSS: cuando hay `lightSrc` se renderizan las dos imágenes y
 * el swap lo hace el variante `dark`. Es CSS puro a propósito — con
 * `useTheme()` el primer render no sabe el tema y el logo parpadea.
 */
export function SiteLogo({logo, size, className, priority}: SiteLogoProps) {
  const common = {alt: logo.alt, height: size, priority, width: size};

  if (!logo.lightSrc) {
    return <Image {...common} className={className} src={logo.src} />;
  }

  return (
    <>
      <Image {...common} className={cn(className, "dark:hidden")} src={logo.lightSrc} />
      <Image {...common} className={cn(className, "hidden", "dark:block")} src={logo.src} />
    </>
  );
}
