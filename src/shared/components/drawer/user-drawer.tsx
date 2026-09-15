"use client";

import type {NavbarLogoData} from "@/shared/components/navbar/navbar";

import {signIn, signOut, useSession} from "next-auth/react";
import {useTheme} from "next-themes";
import Image from "next/image";
import Link from "next/link";
import {Dialog} from "radix-ui";
import {type ComponentProps, type ReactNode, useState} from "react";

import {AUTH_PROVIDERS, type AuthProviderId} from "@/features/auth/providers";
import {UnreadNotificationsBadge} from "@/features/notifications/components/unread-badge";
import {Cross} from "@/shared/components/icons/feedback/cross";
import {Account} from "@/shared/components/icons/other/account";
import {Bell} from "@/shared/components/icons/other/bell";
import {Comments} from "@/shared/components/icons/other/comments";
import {Heart} from "@/shared/components/icons/other/heart";
import {Logout} from "@/shared/components/icons/other/logout";
import {Settings} from "@/shared/components/icons/other/settings";
import {User} from "@/shared/components/icons/other/user";
import {Switch} from "@/shared/components/switch/switch";
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
  drawerThemeLabelVariants,
  drawerThemeRowVariants,
  drawerTitleVariants,
  drawerUserEmailVariants,
  drawerUserMetaVariants,
  drawerUserNameVariants,
} from "@/shared/styles/components/drawer";
import {cn} from "@/shared/utils/className-builder";

type IconComponent = (props: ComponentProps<"svg">) => ReactNode;

type PreferenceLink = {
  href: string;
  label: string;
  icon: IconComponent;
  showUnread?: boolean;
};

const PREFERENCE_LINKS: PreferenceLink[] = [
  {href: "/favorites", label: "Favorites", icon: Heart},
  {href: "/comments", label: "My Comments", icon: Comments},
  {href: "/notifications", label: "Notifications", icon: Bell, showUnread: true},
  {href: "/settings", label: "Settings", icon: Settings},
  {href: "/account", label: "Account", icon: Account},
];

function DarkModeSwitch() {
  const {resolvedTheme, setTheme} = useTheme();

  const isDark = resolvedTheme === "dark";

  return (
    <div className={drawerThemeRowVariants()}>
      <label className={drawerThemeLabelVariants()} htmlFor="drawer-dark-mode">
        Dark Mode
      </label>
      <Switch
        checked={isDark}
        className={drawerSwitchVariants()}
        id="drawer-dark-mode"
        thumbClassName={drawerSwitchThumbVariants()}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      />
    </div>
  );
}

/** Botones de OAuth. `pending` bloquea la lista mientras se abre el redirect. */
function LoginActions({disabled}: {disabled: boolean}) {
  const [pending, setPending] = useState<AuthProviderId | null>(null);

  return (
    <div className={drawerLoginWrapperVariants()}>
      {AUTH_PROVIDERS.map(({id, label, icon: Icon}, index) => (
        <button
          className={drawerLoginVariants({intent: index === 0 ? "primary" : "secondary"})}
          disabled={disabled || pending !== null}
          key={id}
          type="button"
          onClick={() => {
            setPending(id);

            void signIn(id);
          }}
        >
          <Icon className={drawerActionIconVariants()} />
          {pending === id ? "Redirecting…" : label}
        </button>
      ))}
    </div>
  );
}

export type UserDrawerProps = {
  /** Disparador del drawer (se renderiza con asChild). */
  children: ReactNode;
  logo: NavbarLogoData;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function UserDrawer({children, open, onOpenChange}: UserDrawerProps) {
  const {data: session, status} = useSession();

  const isLoading = status === "loading";
  const user = session?.user;
  const isAuthenticated = status === "authenticated" && Boolean(user);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className={drawerOverlayVariants()} />

        <Dialog.Content className={drawerContentVariants()} data-slot="user-drawer">
          <Dialog.Description className="sr-only">
            {isAuthenticated
              ? "Perfil, tema y preferencias de la cuenta."
              : "Iniciá sesión para acceder a tu cuenta."}
          </Dialog.Description>

          <div className={drawerHeaderVariants()} data-slot="user-drawer-header">
            <div className={drawerIdentityVariants()}>
              {isAuthenticated ? (
                <>
                  <span className={drawerAvatarVariants()}>
                    {user?.image ? (
                      <Image
                        alt={user.name ?? "Avatar"}
                        className={drawerAvatarImageVariants()}
                        height={40}
                        src={user.image}
                        width={40}
                      />
                    ) : (
                      <User className={drawerAvatarIconVariants()} />
                    )}
                  </span>
                  <span className={drawerUserMetaVariants()}>
                    <Dialog.Title className={drawerUserNameVariants()}>
                      {user?.name ?? "Astronaut"}
                    </Dialog.Title>
                    {user?.email && <span className={drawerUserEmailVariants()}>{user.email}</span>}
                  </span>
                </>
              ) : (
                <>
                  <span className="flex size-10 items-center justify-center rounded-full bg-blue-700-20">
                    <User />
                  </span>
                  <Dialog.Title className={drawerTitleVariants()}>User Profile</Dialog.Title>
                </>
              )}
            </div>

            <Dialog.Close aria-label="Cerrar" className={drawerCloseVariants()}>
              <Cross className={drawerCloseIconVariants()} />
            </Dialog.Close>
          </div>

          <div className={drawerBodyVariants()} data-slot="user-drawer-body">
            {!isAuthenticated && <LoginActions disabled={isLoading} />}

            <section className={drawerSectionVariants()}>
              <h4 className={drawerSectionTitleVariants()}>Theme</h4>
              <DarkModeSwitch />
            </section>

            {isAuthenticated && (
              <section className={drawerSectionVariants()}>
                <h4 className={drawerSectionTitleVariants()}>Preferences</h4>
                <nav className={drawerNavVariants()}>
                  {PREFERENCE_LINKS.map(({href, label, icon: Icon, showUnread}) => (
                    <Dialog.Close asChild key={href}>
                      <Link className={cn(drawerNavLinkVariants())} href={href}>
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
            <div className={drawerFooterVariants()} data-slot="user-drawer-footer">
              <button
                className={drawerLogoutVariants()}
                type="button"
                onClick={() => void signOut()}
              >
                <Logout className={drawerActionIconVariants()} />
                Logout
              </button>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
