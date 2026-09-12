'use client'

import Image from 'next/image'
import Link from 'next/link'
import { createContext, use } from 'react'
import type { ComponentProps, ReactNode } from 'react'
import type { VariantProps } from 'class-variance-authority'

import type { NavbarLogoData } from '@/shared/components/navbar/navbar'
import {
  footerContainerVariants,
  footerCopyrightVariants,
  footerGroupVariants,
  footerLinkVariants,
  footerLogoImageVariants,
  footerLogoVariants,
  footerVariants,
} from '@/shared/styles/components/footer'
import { cn } from '@/shared/utils/className-builder'

type LinkProps = ComponentProps<typeof Link>

/** El logo del footer comparte forma con el del navbar. */
export type FooterLogoData = NavbarLogoData

/** Item del footer; a diferencia del navbar puede apuntar fuera del sitio. */
export type FooterLinkItem = {
  href: string
  label: string
  /** Abre en una pestaña nueva (ej. nasa.gov). */
  external?: boolean
}

export type FooterData = {
  logo: FooterLogoData
  /** Etiqueta accesible del <footer>. */
  label?: string
}

type FooterContextValue = {
  data: FooterData
}

const FooterContext = createContext<FooterContextValue | null>(null)

function useFooterContext() {
  const context = use(FooterContext)

  if (!context) {
    throw new Error('Footer compound parts must be used within <Footer data={...}>')
  }

  return context
}

type FooterRootProps = Omit<ComponentProps<'footer'>, 'children'> & {
  data: FooterData
  children?: ReactNode
}

function FooterRoot({ className, data, children, ...props }: FooterRootProps) {
  return (
    <FooterContext value={{ data }}>
      <footer
        data-slot="footer"
        aria-label={data.label ?? 'Pie de página'}
        className={cn(footerVariants(), className)}
        {...props}
      >
        <div className={footerContainerVariants()}>{children}</div>
      </footer>
    </FooterContext>
  )
}

type FooterGroupProps = ComponentProps<'div'> & VariantProps<typeof footerGroupVariants>

function FooterGroup({ className, gap, wrap, children, ...props }: FooterGroupProps) {
  return (
    <div
      data-slot="footer-group"
      className={cn(footerGroupVariants({ gap, wrap }), className)}
      {...props}
    >
      {children}
    </div>
  )
}

type FooterLogoProps = Omit<LinkProps, 'href' | 'children'>

function FooterLogo({ className, ...props }: FooterLogoProps) {
  const { data } = useFooterContext()
  const { logo } = data

  return (
    <Link
      {...props}
      data-slot="footer-logo"
      href={logo.href ?? '/'}
      aria-label={logo.alt}
      className={cn(footerLogoVariants(), className)}
    >
      <Image
        src={logo.src}
        alt={logo.alt}
        width={48}
        height={48}
        className={footerLogoImageVariants()}
      />
    </Link>
  )
}

type FooterNavProps = ComponentProps<'nav'> & VariantProps<typeof footerGroupVariants>

/** Fila de links legales / externos; envuelve en mobile. */
function FooterNav({ className, gap = 'md', wrap = true, children, ...props }: FooterNavProps) {
  return (
    <nav
      {...props}
      data-slot="footer-nav"
      aria-label={props['aria-label'] ?? 'Enlaces del pie de página'}
      className={cn(footerGroupVariants({ gap, wrap }), className)}
    >
      {children}
    </nav>
  )
}

type FooterLinkProps = LinkProps & {
  /** Abre en una pestaña nueva y agrega el rel seguro. */
  external?: boolean
}

function FooterLink({ className, external, children, ...props }: FooterLinkProps) {
  return (
    <Link
      {...props}
      data-slot="footer-link"
      target={external ? '_blank' : props.target}
      rel={external ? 'noreferrer noopener' : props.rel}
      className={cn(footerLinkVariants(), className)}
    >
      {children}
    </Link>
  )
}

type FooterCopyrightProps = ComponentProps<'p'>

function FooterCopyright({ className, children, ...props }: FooterCopyrightProps) {
  return (
    <p data-slot="footer-copyright" className={cn(footerCopyrightVariants(), className)} {...props}>
      {children}
    </p>
  )
}

export const Footer = Object.assign(FooterRoot, {
  Group: FooterGroup,
  Logo: FooterLogo,
  Nav: FooterNav,
  Link: FooterLink,
  Copyright: FooterCopyright,
})

export type FooterProps = FooterRootProps
