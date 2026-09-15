import type {Metadata} from "next";

import React from "react";

export const metadata: Metadata = {
  title: "Design System",
  description: "Catálogo interno de componentes de UI. No es contenido público.",
  robots: {index: false, follow: false},
};

export default function DesignLayout({children}: {children: React.ReactNode}) {
  return children;
}
