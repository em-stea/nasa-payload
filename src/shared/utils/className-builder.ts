import {type ClassValue, clsx} from "clsx";
import {extendTailwindMerge} from "tailwind-merge";

const themeColors = [
  "basic-00",
  "basic-00-05",
  "basic-00-10",
  "basic-00-80",
  "basic-300",
  "basic-500",
  "basic-700",
  "basic-700-90",
  "basic-900",
  "basic-950",
  "basic-950-60",
  "basic-960",
  "basic-960-80",
  "basic-960-90",
  "blue-50",
  "blue-200",
  "blue-200-30",
  "blue-700",
  "blue-700-20",
  "blue-900",
  "red-200",
  "red-200-30",
  "red-300",
  "red-700",
  "red-700-20",
  "red-900",
  "orange-200",
  // Roles del chrome (cambian con data-theme)
  "transparency-navbar",
  "navbar-border",
  "footer-background",
  "footer-border",
  "live-dot",
  "icon",
] as const;

/**
 * La escala de `semantic-tokens/text.css` va de `--text-1` a `--text-200`, con
 * medios pasos escritos `--text-2_5`. Tailwind traduce el `_` del token al `.`
 * de la clase, así que en el código se escribe `text-2.5`: hay que aceptar las
 * dos formas o tailwind-merge lo toma por un color y lo tira cuando la misma
 * lista trae un `text-<color>`.
 */
const isThemeFontSize = (value: string) => /^\d+(?:[._]\d+)?$/.test(value);

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      color: [...themeColors],
    },
    classGroups: {
      "font-size": [{text: [isThemeFontSize]}],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
