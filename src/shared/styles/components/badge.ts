import {cva} from "class-variance-authority";

import {textVariants} from "./text";

/**
 * Los dos ejes del frame 321-85: `variant` decide el relleno y la tipografía,
 * `tone` decide el color. Nada más — no hay variantes de color sueltas.
 *
 * - `full-filled`: la pastilla rellena del tono. Va sobre superficies que
 *   siguen al tema, así que pinta con roles semánticos.
 * - `default`: la pastilla de vidrio que se apoya sobre una foto. El fondo es
 *   oscuro en los dos temas, así que acá los tokens crudos son los correctos.
 * - `dark`: el tag opaco de las cards, el más chico y el único en negrita.
 *
 * `light-red` es el rojo invertido —fondo claro, texto oscuro— que el diseño
 * reserva para el vivo y las alertas de cabecera. `orange` no está en el frame:
 * lo pide la categoría "The Sun" de noticias y sigue la fórmula de los otros.
 */
export type BadgeTone = "blue" | "red" | "light-red" | "neutral" | "orange";

export type BadgeVariant = "full-filled" | "default" | "dark";

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

export const badgeVariants = cva(commonClassnames, {
  variants: {
    variant: {
      "full-filled": textVariants({variant: "eyebrow"}),
      default: [
        textVariants({variant: "eyebrow"}),
        "border-basic-00-10",
        "bg-basic-700",
        // "backdrop-blur-sm",
        // "pt-2.5",
        // "pb-1.75",
        "text-2.5",
        "leading-3.75",
        "tracking-0.5",
        "uppercase",
      ],
      dark: [
        "border-gray-200",
        "bg-basic-950",
        "px-3",
        "py-2.5",
        textVariants({variant: "eyebrow"}),
      ],
    },
    tone: {
      blue: "",
      red: "",
      "light-red": "",
      neutral: "",
      orange: "",
      default: "",
    },
    position: {
      "top-left": "absolute top-4 left-4",
      relative: "",
    },
  },
  compoundVariants: [
    {
      variant: "full-filled",
      tone: "blue",
      class: "border-blue-200-30 bg-blue-700-20 text-foreground",
    },
    {
      variant: "full-filled",
      tone: "red",
      class: "border border-destructive bg-red-700-20 text-destructive",
    },
    {
      variant: "full-filled",
      tone: "light-red",
      class: "border-destructive/30 bg-destructive text-destructive-foreground",
    },
    {
      variant: "full-filled",
      tone: "neutral",
      class: "border-basic-00-10 bg-basic-700 text-basic-300",
    },
    {
      variant: "full-filled",
      tone: "orange",
      class: "border-orange-200/30 bg-orange-200/20 text-orange-200",
    },
    {
      variant: "default",
      tone: "default",
      class: "border-basic-00-10 bg-tag-default text-basic-300",
    },

    {variant: ["default", "dark"], tone: "blue", class: "text-blue-200"},
    {variant: ["default", "dark"], tone: "red", class: "text-red-300"},
    {variant: ["default", "dark"], tone: "orange", class: "text-orange-200"},
    {variant: ["default", "dark"], tone: "neutral", class: "text-basic-300"},
  ],
  defaultVariants: {
    variant: "full-filled",
    tone: "blue",
  },
});

/**
 * El punto toma el color del texto del badge, así que no necesita repetir la
 * matriz: cualquier `variant`/`tone` —y cualquier override por `className`— ya
 * lo deja del color correcto.
 */
export const badgeDotVariants = cva("size-2 shrink-0 rounded-full bg-current");
