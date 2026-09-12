'use client'

import Image from 'next/image'
import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'
import { useState, type ComponentProps, type ReactNode } from 'react'
import { Dialog } from 'radix-ui'

import { AUTH_PROVIDERS, type AuthProviderId } from '@/features/auth/providers'
import { UnreadNotificationsBadge } from '@/features/notifications/components/unread-badge'
import { Account } from '@/shared/components/icons/other/account'
import { Bell } from '@/shared/components/icons/other/bell'
import { Comments } from '@/shared/components/icons/other/comments'
import { Cross } from '@/shared/components/icons/feedback/cross'
import { Heart } from '@/shared/components/icons/other/heart'
import { Logout } from '@/shared/components/icons/other/logout'
import { Moon } from '@/shared/components/icons/other/moon'
import { Settings } from '@/shared/components/icons/other/settings'
import { User } from '@/shared/components/icons/other/user'
import type { NavbarLogoData } from '@/shared/components/navbar/navbar'
import { Switch } from '@/shared/components/switch'
import {
  drawerActionIconVariants,
  drawerAvatarIconVariants,
  drawerAvatarImageVariants,
  drawerAvatarVariants,
  drawerBodyVariants,
  drawerCloseIconVariants,
  drawerCloseVariants,
  drawerContentVariants,
  drawerFooterVariants,
  drawerHeaderVariants,
  drawerIdentityVariants,
  drawerLoginVariants,
  drawerLoginWrapperVariants,
  drawerLogoImageVariants,
  drawerLogoutVariants,
  drawerLogoVariants,
  drawerNavLinkIconVariants,
  drawerNavLinkVariants,
  drawerNavVariants,
  drawerOverlayVariants,
  drawerSectionTitleVariants,
  drawerSectionVariants,
  drawerSwitchThumbVariants,
  drawerSwitchVariants,
  drawerThemeIconVariants,
  drawerThemeLabelVariants,
  drawerThemeRowVariants,
  drawerTitleVariants,
  drawerUserEmailVariants,
  drawerUserMetaVariants,
  drawerUserNameVariants,
} from '@/shared/styles/components/drawer'
import { cn } from '@/shared/utils/className-builder'

type IconComponent = (props: ComponentProps<'svg'>) => ReactNode

type PreferenceLink = {
  href: string
  label: string
  icon: IconComponent
  /** Muestra el contador de avisos sin leer al final de la fila. */
  showUnread?: boolean
}

/** Acciones de cuenta: sólo visibles con sesión iniciada. */
const PREFERENCE_LINKS: PreferenceLink[] = [
  { href: '/favorites', label: 'Favorites', icon: Heart },
  { href: '/comments', label: 'My Comments', icon: Comments },
  { href: '/notifications', label: 'Notifications', icon: Bell, showUnread: true },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/account', label: 'Account', icon: Account },
]

function DarkModeSwitch() {
  const { resolvedTheme, setTheme } = useTheme()

  // Sin guard de hidratación a propósito: Dialog.Portal no renderiza nada
  // mientras el drawer está cerrado, así que esto monta recién al abrirlo,
  // siempre después de hidratar y con el tema ya resuelto.
  const isDark = resolvedTheme === 'dark'

  return (
    <div className={drawerThemeRowVariants()}>
      <label className={drawerThemeLabelVariants()} htmlFor="drawer-dark-mode">
        <Moon className={drawerThemeIconVariants()} />
        Dark Mode
      </label>
      <Switch
        id="drawer-dark-mode"
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
        className={drawerSwitchVariants()}
        thumbClassName={drawerSwitchThumbVariants()}
      />
    </div>
  )
}

/** Botones de OAuth. `pending` bloquea la lista mientras se abre el redirect. */
function LoginActions({ disabled }: { disabled: boolean }) {
  const [pending, setPending] = useState<AuthProviderId | null>(null)

  return (
    <div className={drawerLoginWrapperVariants()}>
      {AUTH_PROVIDERS.map(({ id, label, icon: Icon }, index) => (
        <button
          key={id}
          type="button"
          disabled={disabled || pending !== null}
          onClick={() => {
            setPending(id)
            // signIn navega fuera del sitio; si el usuario vuelve con el botón
            // atrás el componente se remonta y `pending` arranca en null.
            void signIn(id)
          }}
          className={drawerLoginVariants({ intent: index === 0 ? 'primary' : 'secondary' })}
        >
          <Icon className={drawerActionIconVariants()} />
          {pending === id ? 'Redirecting…' : label}
        </button>
      ))}
    </div>
  )
}

export type UserDrawerProps = {
  /** Disparador del drawer (se renderiza con asChild). */
  children: ReactNode
  logo: NavbarLogoData
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

/**
 * Drawer de usuario. El contenido depende de la sesión de Auth.js:
 * deslogueado sólo ofrece los providers de OAuth (más el tema, que es una
 * preferencia del dispositivo); logueado muestra perfil, preferencias y logout.
 */
export function UserDrawer({ children, logo, open, onOpenChange }: UserDrawerProps) {
  const { data: session, status } = useSession()

  const isLoading = status === 'loading'
  const user = session?.user
  const isAuthenticated = status === 'authenticated' && Boolean(user)

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className={drawerOverlayVariants()} />

        <Dialog.Content data-slot="user-drawer" className={drawerContentVariants()}>
          <Dialog.Description className="sr-only">
            {isAuthenticated
              ? 'Perfil, tema y preferencias de la cuenta.'
              : 'Iniciá sesión para acceder a tu cuenta.'}
          </Dialog.Description>

          <div data-slot="user-drawer-header" className={drawerHeaderVariants()}>
            <div className={drawerIdentityVariants()}>
              {isAuthenticated ? (
                <>
                  <span className={drawerAvatarVariants()}>
                    {user?.image ? (
                      <Image
                        src={user.image}
                        alt={user.name ?? 'Avatar'}
                        width={40}
                        height={40}
                        className={drawerAvatarImageVariants()}
                      />
                    ) : (
                      <User className={drawerAvatarIconVariants()} />
                    )}
                  </span>
                  <span className={drawerUserMetaVariants()}>
                    <Dialog.Title className={drawerUserNameVariants()}>
                      {user?.name ?? 'Astronaut'}
                    </Dialog.Title>
                    {user?.email && <span className={drawerUserEmailVariants()}>{user.email}</span>}
                  </span>
                </>
              ) : (
                <>
                  <span className={drawerLogoVariants()}>
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      width={40}
                      height={40}
                      className={drawerLogoImageVariants()}
                    />
                  </span>
                  <Dialog.Title className={drawerTitleVariants()}>User Profile</Dialog.Title>
                </>
              )}
            </div>

            <Dialog.Close aria-label="Cerrar" className={drawerCloseVariants()}>
              <Cross className={drawerCloseIconVariants()} />
            </Dialog.Close>
          </div>

          <div data-slot="user-drawer-body" className={drawerBodyVariants()}>
            {!isAuthenticated && <LoginActions disabled={isLoading} />}

            <section className={drawerSectionVariants()}>
              <h4 className={drawerSectionTitleVariants()}>Theme</h4>
              <DarkModeSwitch />
            </section>

            {isAuthenticated && (
              <section className={drawerSectionVariants()}>
                <h4 className={drawerSectionTitleVariants()}>Preferences</h4>
                <nav className={drawerNavVariants()}>
                  {PREFERENCE_LINKS.map(({ href, label, icon: Icon, showUnread }) => (
                    <Dialog.Close key={href} asChild>
                      <Link href={href} className={cn(drawerNavLinkVariants())}>
                        <Icon className={drawerNavLinkIconVariants()} />
                        {label}
                        {showUnread && <UnreadNotificationsBadge />}
                      </Link>
                    </Dialog.Close>
                  ))}
                </nav>
              </section>
            )}
          </div>

          {isAuthenticated && (
            <div data-slot="user-drawer-footer" className={drawerFooterVariants()}>
              <button
                type="button"
                onClick={() => void signOut()}
                className={drawerLogoutVariants()}
              >
                <Logout className={drawerActionIconVariants()} />
                Logout
              </button>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
