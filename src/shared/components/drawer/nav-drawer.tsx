"use client";

import type {NavbarLinkItem, NavbarLogoData} from "@/shared/components/navbar/navbar";
import type {ReactNode} from "react";

import Link from "next/link";
import {Drawer} from "vaul";

import {Cross} from "@/shared/components/icons/feedback/cross";
import {SiteLogo} from "@/shared/components/logo/site-logo";
import {
  drawerBodyVariants,
  drawerCloseIconVariants,
  drawerCloseVariants,
  drawerContentVariants,
  drawerHeaderVariants,
  drawerIdentityVariants,
  drawerLogoImageVariants,
  drawerLogoVariants,
  drawerNavLinkVariants,
  drawerNavVariants,
  drawerOverlayVariants,
  drawerSectionTitleVariants,
  drawerSectionVariants,
} from "@/shared/styles/components/drawer";
import {navbarDotVariants} from "@/shared/styles/components/navbar";

function normalizePath(path: string) {
  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
}

export type NavDrawerProps = {
  children: ReactNode;
  logo: NavbarLogoData;
  links: NavbarLinkItem[];
  activePath?: string | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function NavDrawer({children, logo, links, activePath, open, onOpenChange}: NavDrawerProps) {
  const isActive = (href: string) =>
    !!activePath && normalizePath(href) === normalizePath(activePath);

  return (
    <Drawer.Root direction="right" open={open} onOpenChange={onOpenChange}>
      <Drawer.Trigger asChild>{children}</Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Overlay className={drawerOverlayVariants()} />

        <Drawer.Content className={drawerContentVariants()} data-slot="nav-drawer">
          <Drawer.Description className="sr-only">
            Navegación principal del sitio.
          </Drawer.Description>

          <div className={drawerHeaderVariants()} data-slot="nav-drawer-header">
            <div className={drawerIdentityVariants()}>
              <span className={drawerLogoVariants()}>
                <SiteLogo className={drawerLogoImageVariants()} logo={logo} size={40} />
              </span>
            </div>

            <Drawer.Close aria-label="Cerrar" className={drawerCloseVariants()}>
              <Cross className={drawerCloseIconVariants()} />
            </Drawer.Close>
          </div>

          <div className={drawerBodyVariants()} data-slot="nav-drawer-body">
            <section className={drawerSectionVariants()}>
              <h4 className={drawerSectionTitleVariants()}>Explore</h4>
              <nav aria-label="Principal" className={drawerNavVariants()}>
                {links.map(({href, label, showDot}) => {
                  const current = isActive(href);

                  return (
                    <Drawer.Close asChild key={href}>
                      <Link
                        aria-current={current ? "page" : undefined}
                        className={drawerNavLinkVariants({active: current})}
                        href={href}
                      >
                        {showDot && <span aria-hidden="true" className={navbarDotVariants()} />}
                        {label}
                      </Link>
                    </Drawer.Close>
                  );
                })}
              </nav>
            </section>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
