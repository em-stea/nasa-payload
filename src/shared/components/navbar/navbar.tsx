'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createContext, use } from 'react'
import type { ComponentProps, ReactNode } from 'react'
import type { VariantProps } from 'class-variance-authority'

import { Menu } from '@/shared/components/icons/other/menu'
import { User } from '@/shared/components/icons/other/user'
import {
  navbarContainerVariants,
  navbarDotVariants,
  navbarGroupVariants,
  navbarLinkVariants,
  navbarLogoImageVariants,
  navbarLogoVariants,
  navbarMenuIconVariants,
  navbarMenuVariants,
  navbarUserIconVariants,
  navbarUserVariants,
  navbarVariants,
} from '@/shared/styles/components/navbar'
import { cn } from '@/shared/utils/className-builder'

type LinkProps = ComponentProps<typeof Link>

export type NavbarLogoData = {
  src: string
  alt: string
  href?: string
}

/** Item de navegación; compartido por la barra y por el drawer de mobile. */
export type NavbarLinkItem = {
  href: string
  label: string
  showDot?: boolean
}

export type NavbarUserData = {
  name: string
  menuLabel?: string
}

export type NavbarData = {
  logo: NavbarLogoData
  user?: NavbarUserData
  /** Etiqueta accesible del <nav>. */
  label?: string
  /** Fuerza la ruta activa; por defecto se toma de usePathname(). */
  activePath?: string
}

type NavbarContextValue = {
  data: NavbarData
  activePath: string | null
  isActive: (href: LinkProps['href']) => boolean
}

const NavbarContext = createContext<NavbarContextValue | null>(null)

function useNavbarContext() {
  const context = use(NavbarContext)

  if (!context) {
    throw new Error('Navbar compound parts must be used within <Navbar data={...}>')
  }

  return context
}

function normalizePath(path: string) {
  return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path
}

type NavbarRootProps = Omit<ComponentProps<'header'>, 'children'> & {
  data: NavbarData
  children?: ReactNode
}

function NavbarRoot({ className, data, children, ...props }: NavbarRootProps) {
  const pathname = usePathname()
  const activePath = data.activePath ?? pathname

  const isActive = (href: LinkProps['href']) => {
    if (typeof href !== 'string' || !activePath) return false

    return normalizePath(href) === normalizePath(activePath)
  }

  return (
    <NavbarContext value={{ data, activePath, isActive }}>
      <header data-slot="navbar" className={cn(navbarVariants(), className)} {...props}>
        <nav aria-label={data.label ?? 'Principal'} className={navbarContainerVariants()}>
          {children}
        </nav>
      </header>
    </NavbarContext>
  )
}

type NavbarGroupProps = ComponentProps<'div'> & VariantProps<typeof navbarGroupVariants>

function NavbarGroup({ className, gap, visibility, children, ...props }: NavbarGroupProps) {
  return (
    <div
      data-slot="navbar-group"
      className={cn(navbarGroupVariants({ gap, visibility }), className)}
      {...props}
    >
      {children}
    </div>
  )
}

type NavbarLogoProps = Omit<LinkProps, 'href' | 'children'>

function NavbarLogo({ className, ...props }: NavbarLogoProps) {
  const { data } = useNavbarContext()
  const { logo } = data

  return (
    <Link
      {...props}
      data-slot="navbar-logo"
      href={logo.href ?? '/'}
      aria-label={logo.alt}
      className={cn(navbarLogoVariants(), className)}
    >
      <Image
        src={logo.src}
        alt={logo.alt}
        width={48}
        height={48}
        priority
        className={navbarLogoImageVariants()}
      />
    </Link>
  )
}

function NavbarDot() {
  return <span aria-hidden="true" data-slot="navbar-dot" className={navbarDotVariants()} />
}

type NavbarLinkProps = LinkProps & {
  /** Fuerza el estado activo en lugar de derivarlo de la ruta. */
  active?: boolean
  /** Antepone el punto indicador al contenido del link (ej. "Live"). */
  showDot?: boolean
}

function NavbarLink({ className, href, active, showDot, children, ...props }: NavbarLinkProps) {
  const { isActive } = useNavbarContext()
  const current = active ?? isActive(href)

  return (
    <Link
      {...props}
      data-slot="navbar-link"
      href={href}
      aria-current={current ? 'page' : undefined}
      className={cn(navbarLinkVariants({ active: current }), className)}
    >
      {showDot && <NavbarDot />}
      {children}
    </Link>
  )
}

type NavbarUserProps = Omit<ComponentProps<'button'>, 'children'>

function NavbarUser({ className, type = 'button', ...props }: NavbarUserProps) {
  const { data } = useNavbarContext()
  const { user } = data
  const label = user?.menuLabel ?? (user ? `Abrir menú de ${user.name}` : 'Abrir menú de usuario')

  return (
    <button
      {...props}
      type={type}
      data-slot="navbar-user"
      aria-label={label}
      className={cn(navbarUserVariants(), className)}
    >
      <User className={navbarUserIconVariants()} />
    </button>
  )
}

type NavbarMenuProps = Omit<ComponentProps<'button'>, 'children'>

/** Disparador del menú de navegación en mobile; se oculta a partir de `md`. */
function NavbarMenu({ className, type = 'button', ...props }: NavbarMenuProps) {
  return (
    <button
      {...props}
      type={type}
      data-slot="navbar-menu"
      aria-label={props['aria-label'] ?? 'Abrir menú de navegación'}
      className={cn(navbarMenuVariants(), className)}
    >
      <Menu className={navbarMenuIconVariants()} />
    </button>
  )
}

export const Navbar = Object.assign(NavbarRoot, {
  Group: NavbarGroup,
  Logo: NavbarLogo,
  Link: NavbarLink,
  Menu: NavbarMenu,
  User: NavbarUser,
})

export type NavbarProps = NavbarRootProps
