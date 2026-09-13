import type {AsteroidStatus} from "@/features/asteroids/types/asteroid";

/**
 * Los rótulos de la card en el diseño (CRITICAL, PHA, TRK, HIST, NEW, ACTV).
 *
 * NeoWs no publica un estado por objeto: lo único que trae es el flag de
 * "potencialmente peligroso", la fecha de primera observación y la lista de
 * aproximaciones. El estado sale de cruzar esos tres, en el orden de
 * precedencia de `resolveAsteroidStatus`.
 *
 * El `tone` es el de la card. El diseño reserva el rojo para `critical` —el
 * único rótulo que pide una acción— y deja el resto en el azul de acento, PHA
 * incluido: que un objeto esté catalogado como potencialmente peligroso no
 * quiere decir que venga en camino.
 */

export type AsteroidStatusMeta = {
  /** Texto del badge. */
  label: string;
  /** Descripción larga, para el `title` del badge. */
  description: string;
  tone: "blue" | "red";
};

export const ASTEROID_STATUS: Record<AsteroidStatus, AsteroidStatusMeta> = {
  critical: {
    label: "Critical",
    description: "Potentially hazardous and passing inside 20 lunar distances",
    tone: "red",
  },
  pha: {
    label: "PHA",
    description: "Classified as a potentially hazardous asteroid",
    tone: "blue",
  },
  new: {
    label: "New",
    description: "First observed within the last two years",
    tone: "blue",
  },
  hist: {
    label: "Hist",
    description: "Tracked since before 1990",
    tone: "blue",
  },
  actv: {
    label: "Actv",
    description: "Has an approach to Earth still ahead",
    tone: "blue",
  },
  trk: {
    label: "Trk",
    description: "Catalogued and tracked, no approach ahead",
    tone: "blue",
  },
};

/** Adentro de esta distancia una aproximación de un PHA pasa a `critical`. */
export const CRITICAL_LUNAR_DISTANCE = 20;

/** Un objeto observado por primera vez hace menos de esto es `new`. */
export const NEW_OBJECT_YEARS = 2;

/** Antes de este año el objeto se considera histórico. */
export const HISTORIC_OBJECT_YEAR = 1990;

export function getAsteroidStatus(status: AsteroidStatus) {
  return ASTEROID_STATUS[status];
}
