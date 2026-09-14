import {cva} from "class-variance-authority";

import {textVariants} from "./text";

/**
 * Los tres acentos que el sitio le da a una pastilla: el azul del acento, el
 * rojo de alerta y el naranja del Sol. Es el mismo vocabulario que usan el tag
 * de las cards y las categorías de noticias, así que un `tone` viaja sin
 * traducción desde el dato hasta el badge.
 */
export type BadgeTone = "blue" | "red" | "orange";

const commonClassnames = [
  "inline-flex",
  "w-fit",
  "shrink-0",
  "items-center",
  "justify-center",
  "gap-2",
  "overflow-hidden",
  "rounded-lg",
  "border",
  "border-transparent",
  "px-3",
  "py-1",
  "whitespace-nowrap",
  "transition-colors",
  "[&>svg]:pointer-events-none",
  "[&>svg]:size-3",
];

/**
 * Las cuatro pastillas del diseño (frame 321-85), que ahí se llaman
 * `full-filled` con un tone cada una, más la `default` del diseño —la de
 * vidrio— que acá es `media`:
 *
 * | diseño                   | acá           |
 * | ------------------------ | ------------- |
 * | full-filled / blue       | `default`     |
 * | full-filled / red        | `alert`       |
 * | full-filled / light-red  | `destructive` |
 * | full-filled / neutral    | `neutral`     |
 * | default / blue·red       | `media`       |
 *
 * `default`, `alert` y `destructive` van sobre superficies que siguen al tema,
 * así que pintan con roles semánticos —que en oscuro resuelven exactamente a
 * los hex del diseño—. `media` no: es la pastilla de vidrio que se apoya sobre
 * una foto, donde el fondo es oscuro en los dos temas y los tokens crudos son
 * los correctos. Es la misma decisión que toma `cardTagVariants`.
 *
 * La tipografía va por variante y no en la base a propósito: `tracking-1.2` y
 * `leading-4` no caen en ningún grupo que tailwind-merge conozca, así que un
 * `textVariants` en la base no lo puede pisar la variante —el `eyebrow` de la
 * base se mezclaba con el `meta.1` de `media` y la pastilla salía en 12px/1.2
 * en vez de los 10px/0.5 del frame—.
 */
export const badgeVariants = cva(commonClassnames, {
  variants: {
    variant: {
      default: [
        "border-blue-200-30 bg-blue-700-20 text-foreground",
        textVariants({variant: "eyebrow"}),
      ],
      alert: [
        "border-red-200-30 bg-red-700-20 text-destructive",
        textVariants({variant: "eyebrow"}),
      ],
      destructive: [
        "border-destructive/30 bg-destructive text-destructive-foreground",
        textVariants({variant: "eyebrow"}),
      ],
      neutral: [
        "border-basic-00-10 bg-basic-700 text-basic-300",
        textVariants({variant: "eyebrow"}),
      ],
      media: [
        "border-basic-00-10",
        "bg-basic-960-80",
        "backdrop-blur-sm",
        "pt-2.5",
        "pb-1.75",
        // 10px/15px con tracking 0.5, como el `default` del frame.
        "text-2.5",
        "leading-3.75",
        "tracking-0.5",
        "uppercase",
      ],
    },
    tone: {
      blue: "",
      red: "",
      orange: "",
    },
  },
  compoundVariants: [
    {variant: "media", tone: "blue", class: "text-blue-200"},
    {variant: "media", tone: "red", class: "text-red-300"},
    {variant: "media", tone: "orange", class: "text-orange-200"},
  ],
  defaultVariants: {
    variant: "default",
  },
});

/**
 * El punto toma el color del texto del badge, así que no necesita repetir la
 * matriz de variantes: cualquier `variant`/`tone` —y cualquier override por
 * `className`— ya lo deja del color correcto.
 */
export const badgeDotVariants = cva("size-2 shrink-0 rounded-full bg-current");
