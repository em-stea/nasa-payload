"use client";

import type {NavbarLinkItem, NavbarLogoData} from "@/shared/components/navbar/navbar";
import type {ReactNode} from "react";

import Image from "next/image";
import Link from "next/link";
import {Dialog} from "radix-ui";

import {Cross} from "@/shared/components/icons/feedback/cross";
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
  /** Disparador del drawer (se renderiza con asChild). */
  children: ReactNode;
  logo: NavbarLogoData;
  links: NavbarLinkItem[];
  /** Ruta activa; la resuelve `SiteNavbar`, ver el comentario en `Navbar`. */
  activePath?: string | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

/**
 * Menú de navegación para mobile: replica los links del TopNavBar dentro del
 * mismo lenguaje visual del drawer de usuario.
 */
export function NavDrawer({children, logo, links, activePath, open, onOpenChange}: NavDrawerProps) {
  const isActive = (href: string) =>
    !!activePath && normalizePath(href) === normalizePath(activePath);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className={drawerOverlayVariants()} />

        <Dialog.Content className={drawerContentVariants()} data-slot="nav-drawer">
          <Dialog.Description className="sr-only">
            Navegación principal del sitio.
          </Dialog.Description>

          <div className={drawerHeaderVariants()} data-slot="nav-drawer-header">
            <div className={drawerIdentityVariants()}>
              <span className={drawerLogoVariants()}>
                <Image
                  alt={logo.alt}
                  className={drawerLogoImageVariants()}
                  height={40}
                  src={logo.src}
                  width={40}
                />
              </span>
            </div>

            <Dialog.Close aria-label="Cerrar" className={drawerCloseVariants()}>
              <Cross className={drawerCloseIconVariants()} />
            </Dialog.Close>
          </div>

          <div className={drawerBodyVariants()} data-slot="nav-drawer-body">
            <section className={drawerSectionVariants()}>
              <h4 className={drawerSectionTitleVariants()}>Explore</h4>
              <nav aria-label="Principal" className={drawerNavVariants()}>
                {links.map(({href, label, showDot}) => {
                  const current = isActive(href);

                  return (
                    <Dialog.Close asChild key={href}>
                      <Link
                        aria-current={current ? "page" : undefined}
                        className={drawerNavLinkVariants({active: current})}
                        href={href}
                      >
                        {showDot && <span aria-hidden="true" className={navbarDotVariants()} />}
                        {label}
                      </Link>
                    </Dialog.Close>
                  );
                })}
              </nav>
            </section>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
