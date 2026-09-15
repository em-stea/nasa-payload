import type {CardTone} from "@/shared/components/card/card";

/**
 * TechPort no publica un tono para la card: se deriva del status del
 * proyecto, que es lo más parecido a un semáforo que trae la API.
 */
export function resolveMissionTone(status: string): CardTone {
  const normalized = status.toLowerCase();

  if (normalized.includes("cancel")) return "red";
  if (normalized.includes("complet")) return "neutral";

  return "blue";
}
