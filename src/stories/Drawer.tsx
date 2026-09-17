import { NavDrawer } from "@/shared/components/drawer/nav-drawer";
import { Github, Google } from "@/shared/components/icons";
import { Cross } from "@/shared/components/icons/feedback/cross";
import { Account } from "@/shared/components/icons/other/account";
import { Bell } from "@/shared/components/icons/other/bell";
import { Comments } from "@/shared/components/icons/other/comments";
import { Heart } from "@/shared/components/icons/other/heart";
import { Logout } from "@/shared/components/icons/other/logout";
import { Settings } from "@/shared/components/icons/other/settings";
import { User } from "@/shared/components/icons/other/user";
import { type NavbarLinkItem, type NavbarLogoData } from "@/shared/components/navbar/navbar";
import { Switch } from "@/shared/components/switch/switch";
import {
    drawerActionIconVariants,
    drawerBodyVariants,
    drawerCloseIconVariants,
    drawerCloseVariants,
    drawerContentVariants,
    drawerFooterVariants,
    drawerHeaderVariants,
    drawerIdentityVariants,
    drawerLoginVariants,
    drawerLoginWrapperVariants,
    drawerLogoutVariants,
    drawerNavLinkIconVariants,
    drawerNavLinkVariants,
    drawerNavVariants,
    drawerOverlayVariants,
    drawerSectionTitleVariants,
    drawerSectionVariants,
    drawerSwitchThumbVariants,
    drawerSwitchVariants,
    drawerThemeLabelVariants,
    drawerUserMetaVariants,
    drawerUserNameVariants
} from "@/shared/styles/components/drawer";
import { useState } from "react";
import { Drawer as VaulDrawer } from "vaul";

function MockUserDrawer({
  children,
  open,
  onOpenChange,
  isAuthenticated = false,
  isDarkMode = true,
  onDarkModeChange,
}: {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isAuthenticated?: boolean;
  isDarkMode?: boolean;
  onDarkModeChange?: (checked: boolean) => void;
}) {
  return (
    <VaulDrawer.Root direction="right" open={open} onOpenChange={onOpenChange}>
      <VaulDrawer.Trigger asChild>{children}</VaulDrawer.Trigger>
      <VaulDrawer.Portal>
        <VaulDrawer.Overlay className={drawerOverlayVariants()} />
        <VaulDrawer.Content
          className={`${drawerContentVariants()} ${
            isDarkMode
              ? "dark bg-[#12141F] text-[#E1E2ED]"
              : "bg-white text-gray-900 light"
          }`}
          data-slot="user-drawer"
        >
          <VaulDrawer.Description className="sr-only">
            User Profile Drawer
          </VaulDrawer.Description>

          <div className={drawerHeaderVariants()} data-slot="user-drawer-header">
            <div className={drawerIdentityVariants()}>
              <span
                className={`flex size-10 items-center justify-center rounded-full ${
                  isDarkMode
                    ? "bg-blue-700/20 text-indigo-500"
                    : "bg-blue-100 text-blue-900"
                }`}
              >
                <User className={isDarkMode ? "text-blue-200" : "text-blue-900"} />
              </span>
              <span className={drawerUserMetaVariants()}>
                <VaulDrawer.Title className={`${drawerUserNameVariants()} ${isDarkMode ? "text-blue-200" : "text-blue-900"}`}>
                  {isAuthenticated ? "Jane Doe" : "User Profile"}
                </VaulDrawer.Title>
              </span>
            </div>
            <VaulDrawer.Close aria-label="Close" className={drawerCloseVariants()}>
              <Cross className={drawerCloseIconVariants()} />
            </VaulDrawer.Close>
          </div>

          <div className={drawerBodyVariants()} data-slot="user-drawer-body">
            {!isAuthenticated && (
              <div className={drawerLoginWrapperVariants()}>
                <button
                  type="button"
                  onClick={() => {}}
                  className={`${drawerLoginVariants({ intent: "primary" })} ${
                    !isDarkMode
                      ? "bg-[#002B7F]! text-white! hover:bg-[#002060]! font-semibold shadow-md"
                      : ""
                  }`}
                >
                  <Google />
                  Continue with Google
                </button>
                <button
                  type="button"
                  onClick={() => {}}
                  className={`${drawerLoginVariants({ intent: "secondary" })} ${
                    !isDarkMode
                      ? "bg-[#E2E7F4]! text-[#1E293B]! hover:bg-[#D5DCEE]! border-none font-semibold shadow-sm"
                      : ""
                  }`}
                >
                  <Github />
                  Continue with GitHub
                </button>
              </div>
            )}

            <section className={drawerSectionVariants()}>
              <h4 className={drawerSectionTitleVariants()}>THEME</h4>
              <div
                className={`flex items-center justify-between p-3.5 rounded-xl border ${
                  isDarkMode
                    ? "bg-[#1F222E]/60 border-[#2A2E3D]/80"
                    : "bg-[#F0F3F9] border-transparent"
                }`}
              >
                <span
                  className={`${drawerThemeLabelVariants()} ${
                    !isDarkMode ? "text-slate-700 font-medium" : ""
                  }`}
                >
                  Dark Mode
                </span>
                <Switch
                  id="mock-dark-mode"
                  checked={isDarkMode}
                  className={drawerSwitchVariants()}
                  thumbClassName={drawerSwitchThumbVariants()}
                  onCheckedChange={onDarkModeChange}
                />
              </div>
            </section>

            {isAuthenticated && (
              <section className={drawerSectionVariants()}>
                <h4 className={drawerSectionTitleVariants()}>PREFERENCES</h4>
                <nav className={drawerNavVariants()}>
                  {[
                    { label: "Favorites", icon: Heart },
                    { label: "My Comments", icon: Comments },
                    { label: "Notifications", icon: Bell },
                    { label: "Settings", icon: Settings },
                    { label: "Account", icon: Account },
                  ].map(({ label, icon: Icon }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => {}}
                      className={drawerNavLinkVariants()}
                    >
                      <Icon className={drawerNavLinkIconVariants()} />
                      {label}
                    </button>
                  ))}
                </nav>
              </section>
            )}
          </div>

          {isAuthenticated && (
            <div className={drawerFooterVariants()} data-slot="user-drawer-footer">
              <button
                type="button"
                onClick={() => {}}
                className={drawerLogoutVariants()}
              >
                <Logout className={drawerActionIconVariants()} />
                Logout
              </button>
            </div>
          )}
        </VaulDrawer.Content>
      </VaulDrawer.Portal>
    </VaulDrawer.Root>
  );
}

export const Drawer = () => {
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const [isUserOpen, setIsUserOpen] = useState<boolean>(false);
  const [isLoggedState, setIsLoggedState] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [activePath] = useState<string>("/competitors");

  const logoData: NavbarLogoData = {
    src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop",
    alt: "Brand Logo",
  };

  const navLinks: NavbarLinkItem[] = [
    { href: "/", label: "Home" },
    { href: "/news", label: "News" },
    { href: "/asteroids", label: "Asteroids" },
    { href: "/events", label: "Events" },
    { href: "/live", label: "Live", showDot: true },
  ];

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-[#0C0E16] text-gray-900 dark:text-[#E1E2ED] font-sans space-y-12 transition-colors duration-200">
      <div>
        <h1 className="text-3xl font-bold mb-2">Drawer</h1>
        <p className="text-gray-500 dark:text-[#8D90A0] mb-6 text-sm">
          Drawers present secondary content, navigation, or supplementary workflows in a sliding overlay panel anchored to the viewport edge.
        </p>

        <div className="mb-8">
          <h2 className="text-lg font-bold mb-3">Best practices</h2>
          <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-600 dark:text-[#8D90A0]">
            <li>Use drawers for navigation menus or contextual tasks that don't require leaving the current view.</li>
            <li>Keep navigation links short, clear, and categorized logically to reduce cognitive load.</li>
            <li>Include an explicit close button or back action to allow easy dismissal by the user.</li>
            <li>Ensure main content behind the overlay is appropriately dimmed to maintain clear visual hierarchy.</li>
          </ul>
        </div>
      </div>

      {/* Navigation Drawer */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Navigation Drawer</h2>
          <p className="text-sm text-gray-500 dark:text-[#8D90A0] mt-1">
            Mobile base navigation menu that mirrors the main navbar links and highlights the active route.
          </p>
        </div>

        <div className="border border-gray-200 dark:border-[#202436] rounded-2xl p-8 flex flex-col justify-center items-center bg-gray-50/30 dark:bg-[#12141F] min-h-50">
          <NavDrawer
            activePath={activePath}
            links={navLinks}
            logo={logoData}
            open={isNavOpen}
            onOpenChange={setIsNavOpen}
          >
            <button
              onClick={() => setIsNavOpen(true)}
              className="px-5 py-2.5 rounded-lg bg-blue-700 text-basic-00 hover:bg-blue-900 hover:outline hover:outline-blue-200-30 font-medium text-sm transition-colors shadow-lg shadow-indigo-500/20 cursor-pointer"
            >
              Open Navigation Drawer
            </button>
          </NavDrawer>
        </div>
      </section>

      {/* User Drawer */}
      <section className="space-y-4 pt-6 border-t border-gray-200 dark:border-[#202436]">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">User Drawer</h2>
          <p className="text-sm text-gray-500 dark:text-[#8D90A0] mt-1">
            User account panel. Includes social sign-in (OAuth), theme toggle (Dark/Light mode), shortcuts to profile preferences, and a Logout option.
          </p>
        </div>

        <div className="border border-gray-200 dark:border-[#202436] bg-white dark:bg-[#0C0E16]/60 rounded-xl px-4 py-3 flex items-center gap-6">
          <label htmlFor="is-logged-in" className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              id="is-logged-in"
              type="checkbox"
              checked={isLoggedState}
              onChange={(e) => setIsLoggedState(e.target.checked)}
              className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 accent-blue-600 cursor-pointer"
            />
            <span className="text-xs font-bold tracking-wider text-gray-800 dark:text-white uppercase">
              LOGGED IN
            </span>
          </label>
        </div>

        <div className="border border-gray-200 dark:border-[#202436] rounded-2xl p-6 space-y-6 bg-gray-50/30 dark:bg-[#12141F]">
          <div className="flex justify-center items-center min-h-36">
            <MockUserDrawer
              open={isUserOpen}
              onOpenChange={setIsUserOpen}
              isAuthenticated={isLoggedState}
              isDarkMode={isDarkMode}
              onDarkModeChange={setIsDarkMode}
            >
              <button
                onClick={() => setIsUserOpen(true)}
                className="px-5 py-2.5 rounded-lg bg-blue-700 text-basic-00 hover:bg-blue-900 hover:outline hover:outline-blue-200-30 font-medium text-sm transition-colors shadow-lg shadow-indigo-500/20 cursor-pointer"
              >
                Open User Drawer
              </button>
            </MockUserDrawer>
          </div>
        </div>
      </section>
    </div>
  );
};