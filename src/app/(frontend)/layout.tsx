import type {Metadata} from "next";

import {SessionProvider} from "next-auth/react";
import {ThemeProvider} from "next-themes";
import React from "react";

import {SiteFooter} from "@/shared/components/footer/site-footer";
import {SiteNavbar} from "@/shared/components/navbar/site-navbar";
import {Toaster} from "@/shared/components/toast/toaster";
import {JetBrainsMono, SpaceGrotesk} from "@/shared/styles/foundations/fonts";
import {getCurrentYear} from "@/shared/utils/current-year";

import "@styles/globals.css";

export const metadata: Metadata = {
  description: "Blog de noticias espaciales de la NASA. Próximamente.",
  title: "NASA — Blog",
};

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const fonts = `${SpaceGrotesk.variable} ${JetBrainsMono.variable}`;
  const year = await getCurrentYear();

  return (
    <html suppressHydrationWarning className={fonts} lang="es">
      <body>
        <ThemeProvider
          disableTransitionOnChange
          enableSystem
          attribute="data-theme"
          defaultTheme="system"
        >
          <SessionProvider>
            <SiteNavbar />
            {children}
            <SiteFooter year={year} />
            <Toaster />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
