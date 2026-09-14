"use client";

import {usePathname} from "next/navigation";
import {Suspense} from "react";

import {NavDrawer} from "@/shared/components/drawer/nav-drawer";
import {UserDrawer} from "@/shared/components/drawer/user-drawer";

import {Navbar, type NavbarData, type NavbarLinkItem} from "./navbar";

/**
 * Composición del TopNavBar del sitio.
 *
 * Vive en un Client Component porque las partes compuestas se cuelgan de
 * `Navbar` con Object.assign, y esas propiedades estáticas no cruzan el borde
 * RSC: desde un Server Component `Navbar.Group` llegaría como undefined.
 *
 * En mobile los links del centro se esconden y pasan al `NavDrawer`, que se
 * abre desde la hamburguesa; el logo y el acceso de usuario se mantienen.
 */

const NAVBAR_DATA: NavbarData = {
  logo: {
    src: '/images/dscovr-site-logo.svg',
    alt: 'DSCOVR',
    href: '/',
  },
};

const NAVBAR_LINKS: NavbarLinkItem[] = [
  {href: "/news", label: "News"},
  {href: "/asteroids", label: "Asteroids"},
  {href: "/events", label: "Events"},
  {href: "/live", label: "Live", showDot: true},
];

/**
 * La barra entera se pinta sin saber la ruta y el `<Suspense>` la reemplaza por
 * la versión con el link activo marcado.
 *
 * Hace falta porque la barra está en el layout, arriba de todas las rutas, y
 * `usePathname` suspende en las que tienen params dinámicos —`/news/[id]`, sin
 * ir más lejos—: sin el boundary, el shell estático de esas rutas no se puede
 * prerenderizar. Como el fallback es la misma barra, lo único que aparece
 * después es el resaltado.
 */
export function SiteNavbar() {
  return (
    <Suspense fallback={<NavbarShell />}>
      <ActiveNavbar />
    </Suspense>
  );
}

function ActiveNavbar() {
  return <NavbarShell activePath={usePathname()} />;
}

function NavbarShell({activePath = null}: {activePath?: string | null}) {
  return (
    <Navbar data={{...NAVBAR_DATA, activePath}}>
      <Navbar.Group>
        <Navbar.Logo />
      </Navbar.Group>

      <Navbar.Group gap="md" visibility="desktop">
        {NAVBAR_LINKS.map(({href, label, showDot}) => (
          <Navbar.Link href={href} key={href} showDot={showDot}>
            {label}
          </Navbar.Link>
        ))}
      </Navbar.Group>

      <Navbar.Group gap="sm">
        <UserDrawer logo={NAVBAR_DATA.logo}>
          <Navbar.User />
        </UserDrawer>

        <NavDrawer activePath={activePath} links={NAVBAR_LINKS} logo={NAVBAR_DATA.logo}>
          <Navbar.Menu />
        </NavDrawer>
      </Navbar.Group>
    </Navbar>
  );
}
