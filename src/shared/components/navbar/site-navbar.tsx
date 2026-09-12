'use client'

import { NavDrawer } from '@/shared/components/drawer/nav-drawer'
import { UserDrawer } from '@/shared/components/drawer/user-drawer'

import { Navbar, type NavbarData, type NavbarLinkItem } from './navbar'

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
    src: '/images/dscovr-logo.jpg',
    alt: 'DSCOVR',
    href: '/',
  },
}

const NAVBAR_LINKS: NavbarLinkItem[] = [
  { href: '/news', label: 'News' },
  { href: '/asteroids', label: 'Asteroids' },
  { href: '/events', label: 'Events' },
  { href: '/live', label: 'Live', showDot: true },
]

export function SiteNavbar() {
  return (
    <Navbar data={NAVBAR_DATA}>
      <Navbar.Group>
        <Navbar.Logo />
      </Navbar.Group>

      <Navbar.Group gap="md" visibility="desktop">
        {NAVBAR_LINKS.map(({ href, label, showDot }) => (
          <Navbar.Link key={href} href={href} showDot={showDot}>
            {label}
          </Navbar.Link>
        ))}
      </Navbar.Group>

      <Navbar.Group gap="sm">
        <UserDrawer logo={NAVBAR_DATA.logo}>
          <Navbar.User />
        </UserDrawer>

        <NavDrawer logo={NAVBAR_DATA.logo} links={NAVBAR_LINKS}>
          <Navbar.Menu />
        </NavDrawer>
      </Navbar.Group>
    </Navbar>
  )
}
