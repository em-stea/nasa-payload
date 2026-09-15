import type {CardTone} from "@/shared/components/card/card";

/**
 * El catálogo de imágenes no trae un tono propio (no es una taxonomía como la
 * de noticias), así que alternamos entre los dos tonos del diseño.
 */
const TONE_PALETTE: CardTone[] = ["blue", "red"];

export function assignFrontierTone(index: number): CardTone {
  return TONE_PALETTE[index % TONE_PALETTE.length];
}
