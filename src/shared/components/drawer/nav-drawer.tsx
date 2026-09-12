'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { Dialog } from 'radix-ui'

import { Cross } from '@/shared/components/icons/feedback/cross'
import type { NavbarLinkItem, NavbarLogoData } from '@/shared/components/navbar/navbar'
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
} from '@/shared/styles/components/drawer'
import { navbarDotVariants } from '@/shared/styles/components/navbar'

function normalizePath(path: string) {
  return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path
}

export type NavDrawerProps = {
  /** Disparador del drawer (se renderiza con asChild). */
  children: ReactNode
  logo: NavbarLogoData
  links: NavbarLinkItem[]
  /** Título del drawer; por defecto el alt del logo. */
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

/**
 * Menú de navegación para mobile: replica los links del TopNavBar dentro del
 * mismo lenguaje visual del drawer de usuario.
 */
export function NavDrawer({ children, logo, links, open, onOpenChange }: NavDrawerProps) {
  const pathname = usePathname()

  const isActive = (href: string) =>
    Boolean(pathname) && normalizePath(href) === normalizePath(pathname)

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className={drawerOverlayVariants()} />

        <Dialog.Content data-slot="nav-drawer" className={drawerContentVariants()}>
          <Dialog.Description className="sr-only">
            Navegación principal del sitio.
          </Dialog.Description>

          <div data-slot="nav-drawer-header" className={drawerHeaderVariants()}>
            <div className={drawerIdentityVariants()}>
              <span className={drawerLogoVariants()}>
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={40}
                  height={40}
                  className={drawerLogoImageVariants()}
                />
              </span>
            </div>

            <Dialog.Close aria-label="Cerrar" className={drawerCloseVariants()}>
              <Cross className={drawerCloseIconVariants()} />
            </Dialog.Close>
          </div>

          <div data-slot="nav-drawer-body" className={drawerBodyVariants()}>
            <section className={drawerSectionVariants()}>
              <h4 className={drawerSectionTitleVariants()}>Explore</h4>
              <nav className={drawerNavVariants()} aria-label="Principal">
                {links.map(({ href, label, showDot }) => {
                  const current = isActive(href)

                  return (
                    <Dialog.Close key={href} asChild>
                      <Link
                        href={href}
                        aria-current={current ? 'page' : undefined}
                        className={drawerNavLinkVariants({ active: current })}
                      >
                        {showDot && <span aria-hidden="true" className={navbarDotVariants()} />}
                        {label}
                      </Link>
                    </Dialog.Close>
                  )
                })}
              </nav>
            </section>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
