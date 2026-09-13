import {cva} from "class-variance-authority";

import {headingVariants} from "./heading";
import {textVariants} from "./text";

export const drawerOverlayVariants = cva([
  "fixed",
  "inset-0",
  "z-50",
  "bg-basic-960-80",
  "data-[state=open]:animate-in",
  "data-[state=closed]:animate-out",
  "data-[state=open]:fade-in-0",
  "data-[state=closed]:fade-out-0",
]);

export const drawerContentVariants = cva([
  "fixed",
  "top-0",
  "right-0",
  "bottom-0",
  "z-50",
  // En mobile ocupa el ancho menos un respiro de 24px para ver el overlay;
  // desde `sm` vuelve al ancho fijo del diseño.
  "left-6",
  "sm:left-auto",
  "sm:w-112.5",
  "flex",
  "flex-col",
  "justify-between",
  "border-l",
  "border-basic-00-10",
  "bg-basic-700-90",
  "py-4",
  "pr-4",
  "pl-4.25",
  "shadow-drawer",
  "backdrop-blur-6",
  "focus:outline-none",
  "data-[state=open]:animate-in",
  "data-[state=closed]:animate-out",
  "data-[state=open]:slide-in-from-right",
  "data-[state=closed]:slide-out-to-right",
  "data-[state=open]:duration-300",
  "data-[state=closed]:duration-200",
]);

/* ---------------------------------- Header --------------------------------- */

export const drawerHeaderVariants = cva([
  "flex",
  "w-full",
  "items-center",
  "justify-between",
  "pb-8",
]);

export const drawerIdentityVariants = cva(["flex", "shrink-0", "items-center", "gap-2"]);

export const drawerAvatarVariants = cva([
  "flex",
  "size-10",
  "shrink-0",
  "items-center",
  "justify-center",
  "rounded-full",
  "bg-blue-700-20",
  "text-blue-200",
]);

export const drawerAvatarIconVariants = cva(["size-6"]);

export const drawerAvatarImageVariants = cva(["size-full", "rounded-full", "object-cover"]);

export const drawerUserMetaVariants = cva(["flex", "min-w-0", "flex-col", "gap-0.5"]);

export const drawerUserNameVariants = cva([
  "truncate",
  "text-basic-00",
  headingVariants({variant: "title.4"}),
]);

export const drawerUserEmailVariants = cva([
  "truncate",
  "text-basic-500",
  textVariants({variant: "meta.1"}),
]);

export const drawerLogoVariants = cva([
  "relative",
  "block",
  "size-10",
  "shrink-0",
  "overflow-hidden",
  "rounded-full",
]);

export const drawerLogoImageVariants = cva(["size-full", "object-cover"]);

export const drawerTitleVariants = cva(["text-basic-00", headingVariants({variant: "title.4"})]);

export const drawerCloseVariants = cva([
  "inline-flex",
  "shrink-0",
  "flex-col",
  "items-center",
  "justify-center",
  "rounded-full",
  "px-1",
  "pt-1",
  "pb-2",
  "text-basic-300",
  "transition-colors",
  "duration-200",
  "hover:cursor-pointer",
  "hover:text-basic-00",
  "focus-visible:ring-2",
  "focus-visible:ring-blue-200",
  "focus-visible:outline-none",
]);

export const drawerCloseIconVariants = cva(["size-6"]);

/* ----------------------------------- Body ---------------------------------- */

export const drawerBodyVariants = cva([
  "flex",
  "min-h-px",
  "w-full",
  "flex-1",
  "flex-col",
  "gap-6",
]);

export const drawerSectionVariants = cva(["flex", "w-full", "shrink-0", "flex-col", "gap-2"]);

export const drawerSectionTitleVariants = cva([
  "w-full",
  "px-3",
  "text-basic-500",
  textVariants({variant: "meta.2"}),
]);

export const drawerNavVariants = cva(["flex", "w-full", "shrink-0", "flex-col", "gap-1"]);

export const drawerNavLinkVariants = cva(
  [
    "flex",
    "w-full",
    "shrink-0",
    "items-center",
    "gap-3",
    "rounded-lg",
    "p-3",
    "text-basic-300",
    "transition-colors",
    "duration-200",
    "hover:bg-basic-00-05",
    "hover:text-blue-200",
    "focus-visible:ring-2",
    "focus-visible:ring-blue-200",
    "focus-visible:outline-none",
    textVariants({variant: "drawer.item"}),
  ],
  {
    variants: {
      active: {
        true: "bg-basic-00-05 text-blue-200",
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

export const drawerNavLinkIconVariants = cva(["size-6", "shrink-0"]);

/* ---------------------------------- Acciones -------------------------------- */

export const drawerLoginWrapperVariants = cva([
  "flex",
  "w-full",
  "shrink-0",
  "flex-col",
  "gap-2",
  "px-3",
  "pb-2",
]);

export const drawerLoginVariants = cva(
  [
    "relative",
    "flex",
    "w-full",
    "items-center",
    "justify-center",
    "gap-2",
    "rounded-lg",
    "py-3",
    "shadow-drawer-action",
    "transition-colors",
    "duration-200",
    "hover:cursor-pointer",
    "disabled:cursor-not-allowed",
    "disabled:opacity-60",
    "focus-visible:ring-2",
    "focus-visible:ring-blue-200",
    "focus-visible:ring-offset-2",
    "focus-visible:ring-offset-basic-700",
    "focus-visible:outline-none",
    textVariants({variant: "button.2"}),
  ],
  {
    variants: {
      // Un provider destacado (`primary`) y el resto en tono neutro, para que
      // la lista de OAuth no compita entre sí.
      intent: {
        primary: ["bg-blue-200", "text-blue-900", "hover:bg-blue-50"],
        secondary: [
          "border",
          "border-basic-00-10",
          "bg-basic-00-05",
          "text-basic-00",
          "hover:bg-basic-00-10",
        ],
      },
    },
    defaultVariants: {
      intent: "primary",
    },
  },
);

export const drawerActionIconVariants = cva(["size-6", "shrink-0"]);

/* ----------------------------------- Tema ----------------------------------- */

export const drawerThemeRowVariants = cva([
  "flex",
  "w-full",
  "shrink-0",
  "items-center",
  "justify-between",
  "rounded-lg",
  "border",
  "border-basic-00-05",
  "bg-basic-00-05",
  "p-3.25",
]);

export const drawerThemeLabelVariants = cva([
  "flex",
  "shrink-0",
  "items-center",
  "gap-2",
  "text-basic-300",
  textVariants({variant: "drawer.item"}),
]);

export const drawerThemeIconVariants = cva(["size-6", "shrink-0"]);

export const drawerSwitchVariants = cva([
  "relative",
  "h-5",
  "w-10",
  "shrink-0",
  "rounded-full",
  // anulan los defaults de shadcn que corren el thumb 1px y agregan sombra
  "border-0",
  "shadow-none",
  "p-1",
  // `!` para sobrevivir al `* { transition: none !important }` que next-themes
  // inyecta en cada cambio de tema (disableTransitionOnChange en el layout).
  "transition-colors!",
  "duration-200!",
  "hover:cursor-pointer",
  "focus-visible:ring-2",
  "focus-visible:ring-blue-200",
  "focus-visible:ring-offset-2",
  "focus-visible:ring-offset-basic-700",
  "focus-visible:outline-none",
  "data-[state=checked]:bg-blue-200",
  "data-[state=unchecked]:bg-basic-00-10",
]);

export const drawerSwitchThumbVariants = cva([
  "block",
  "size-3",
  "rounded-full",
  // ídem: sin `!` el thumb salta sin animar al togglear el tema.
  "transition-transform!",
  "duration-200!",
  "will-change-transform",
  "data-[state=checked]:translate-x-5",
  "data-[state=checked]:bg-blue-900",
  "data-[state=unchecked]:translate-x-0",
  "data-[state=unchecked]:bg-basic-300",
]);

/* ---------------------------------- Footer ---------------------------------- */

export const drawerFooterVariants = cva([
  "flex",
  "w-full",
  "shrink-0",
  "flex-col",
  "border-t",
  "border-basic-00-10",
  "pt-4.25",
]);

export const drawerLogoutVariants = cva([
  "flex",
  "w-full",
  "items-center",
  "justify-center",
  "gap-2",
  "rounded-lg",
  "border",
  "border-red-200-30",
  "bg-red-700-20",
  "px-px",
  "py-3.25",
  "text-red-200",
  "transition-colors",
  "duration-200",
  "hover:cursor-pointer",
  "hover:bg-red-700",
  "focus-visible:ring-2",
  "focus-visible:ring-red-200",
  "focus-visible:ring-offset-2",
  "focus-visible:ring-offset-basic-700",
  "focus-visible:outline-none",
  textVariants({variant: "button.2"}),
]);
