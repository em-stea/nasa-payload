"use client";

import {usePathname} from "next/navigation";
import {Suspense} from "react";

import {NavDrawer} from "@/shared/components/drawer/nav-drawer";
import {UserDrawer} from "@/shared/components/drawer/user-drawer";

import {Navbar, type NavbarData, type NavbarLinkItem} from "./navbar";

const NAVBAR_DATA: NavbarData = {
  logo: {
    src: "/images/dscovr-site-logo.svg",
    lightSrc: "/images/dscovr-site-logo-light.svg",
    alt: "DSCOVR",
    href: "/",
  },
};

const NAVBAR_LINKS: NavbarLinkItem[] = [
  {href: "/news", label: "News"},
  {href: "/asteroids", label: "Asteroids"},
  {href: "/events", label: "Critical Events"},
  {href: "/live", label: "Live", showDot: true},
];

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
