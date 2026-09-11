'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createContext, use } from 'react'
import type { ComponentProps, ReactNode } from 'react'
import type { VariantProps } from 'class-variance-authority'

import { User } from '@/shared/components/icons/other/user'
import {
  navbarContainerVariants,
  navbarDotVariants,
  navbarGroupVariants,
  navbarLinkVariants,
  navbarLogoImageVariants,
  navbarLogoVariants,
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

function NavbarGroup({ className, gap, children, ...props }: NavbarGroupProps) {
  return (
    <div
      data-slot="navbar-group"
      className={cn(navbarGroupVariants({ gap }), className)}
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

type NavbarLinkProps = LinkProps & {
  /** Fuerza el estado activo en lugar de derivarlo de la ruta. */
  active?: boolean
}

function NavbarLink({ className, href, active, children, ...props }: NavbarLinkProps) {
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
      {children}
    </Link>
  )
}

type NavbarDotProps = Omit<ComponentProps<'span'>, 'children'>

function NavbarDot({ className, ...props }: NavbarDotProps) {
  return (
    <span
      {...props}
      aria-hidden="true"
      data-slot="navbar-dot"
      className={cn(navbarDotVariants(), className)}
    />
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

export const Navbar = Object.assign(NavbarRoot, {
  Group: NavbarGroup,
  Logo: NavbarLogo,
  Link: NavbarLink,
  Dot: NavbarDot,
  User: NavbarUser,
})

export type NavbarProps = NavbarRootProps
