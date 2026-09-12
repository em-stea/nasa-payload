/**
 * Id de una relación de Payload.
 *
 * Según la profundidad con la que se haya leído el documento, una relación
 * llega como id suelto o como el documento entero ya poblado. Los hooks no
 * controlan esa profundidad, así que normalizan con esto.
 */
export const toId = (value: unknown): string | undefined => {
  if (!value) return undefined
  if (typeof value === 'object') return String((value as { id: unknown }).id)

  return String(value)
}
