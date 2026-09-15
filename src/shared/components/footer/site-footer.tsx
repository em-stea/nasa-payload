"use client";

import {Footer, type FooterData, type FooterLinkItem} from "./footer";

/**
 * Composición del footer del sitio, espejo de `SiteNavbar`: mismo contenedor
 * (max-w 1920 + px responsivo), mismo logo y la misma tipografía de links.
 *
 * Client Component por el mismo motivo que el navbar: las partes compuestas se
 * cuelgan de `Footer` con Object.assign y no cruzan el borde RSC.
 *
 * En mobile la fila se apila (logo / links / copyright) en lugar de desbordar.
 *
 * El año del copyright llega por prop: `new Date()` acá lo bloquea el
 * prerender de `cacheComponents`, así que lo resuelve el layout con
 * `getCurrentYear()`.
 */

const FOOTER_DATA: FooterData = {
  logo: {
    src: "/images/dscovr-site-logo.svg",
    lightSrc: "/images/dscovr-site-logo-light.svg",
    alt: "DSCOVR",
    href: "/",
  },
};

const FOOTER_LINKS: FooterLinkItem[] = [
  {href: "/documentation", label: "Documentation"},
  {href: "https://www.nasa.gov", label: "NASA.gov", external: true},
  {href: "/privacy-policy", label: "Privacy Policy"},
  {href: "/terms-of-service", label: "Terms of Service"},
];

interface SiteFooterProps {
  year: number;
}

export function SiteFooter({year}: SiteFooterProps) {
  return (
    <Footer data={FOOTER_DATA}>
      <Footer.Group>
        <Footer.Logo />
      </Footer.Group>

      <Footer.Nav>
        {FOOTER_LINKS.map(({href, label, external}) => (
          <Footer.Link external={external} href={href} key={href}>
            {label}
          </Footer.Link>
        ))}
      </Footer.Nav>

      <Footer.Group>
        <Footer.Copyright>© {year} DSCOVR. Powered by NASA Open APIs.</Footer.Copyright>
      </Footer.Group>
    </Footer>
  );
}
