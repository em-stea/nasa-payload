import type {CommentTone} from "@/features/comments/types/comment";

/**
 * Los comentarios del diseño están firmados como puestos de una misión
 * (`ENG_O'BRIEN`, `DR_VANCE`) y cada uno tiene su color. Como los nombres
 * reales vienen de Google o GitHub, acá se los lleva a esa forma.
 */

const TONES: CommentTone[] = ["blue", "red"];

/**
 * Color estable para un autor.
 *
 * Sale de un hash del id, así que la misma persona se ve del mismo color en
 * todos los hilos y en todas las sesiones —que es lo que hace que el color
 * sirva para reconocer a alguien— sin tener que guardarlo en la base.
 *
 * El hash es FNV-1a con una mezcla final. No es capricho: los ids de Mongo son
 * casi iguales entre sí (comparten timestamp y máquina, cambian en los últimos
 * dígitos) y un hash más simple los reparte en ciclos, con lo que dos personas
 * que se registraron seguidas terminan siempre del mismo color.
 */
export function toCommentTone(seed: string): CommentTone {
  let hash = 2166136261;

  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  hash ^= hash >>> 15;

  return TONES[Math.abs(hash) % TONES.length];
}

/** `Ana Pérez` → `ANA_PEREZ`. */
export function toCommentHandle(name: string) {
  return name.trim().toUpperCase().replace(/\s+/g, "_");
}
