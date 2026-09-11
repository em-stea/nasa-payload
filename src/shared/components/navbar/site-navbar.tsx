'use client'

import { Navbar, type NavbarData } from './navbar'

/**
 * Composición del TopNavBar del sitio.
 *
 * Vive en un Client Component porque las partes compuestas se cuelgan de
 * `Navbar` con Object.assign, y esas propiedades estáticas no cruzan el borde
 * RSC: desde un Server Component `Navbar.Group` llegaría como undefined.
 */

const NAVBAR_DATA: NavbarData = {
  logo: {
    src: '/images/dscovr-logo.jpg',
    alt: 'DSCOVR',
    href: '/',
  },
}

const NAVBAR_LINKS = [
  { href: '/news', label: 'News' },
  { href: '/asteroids', label: 'Asteroids' },
  { href: '/events', label: 'Events' },
] as const

export function SiteNavbar() {
  return (
    <Navbar data={NAVBAR_DATA}>
      <Navbar.Group>
        <Navbar.Logo />
      </Navbar.Group>

      <Navbar.Group gap="md">
        {NAVBAR_LINKS.map(({ href, label }) => (
          <Navbar.Link key={href} href={href}>
            {label}
          </Navbar.Link>
        ))}
        <Navbar.Link href="/live">
          <Navbar.Dot />
          Live
        </Navbar.Link>
      </Navbar.Group>

      <Navbar.Group>
        <Navbar.User />
      </Navbar.Group>
    </Navbar>
  )
}
