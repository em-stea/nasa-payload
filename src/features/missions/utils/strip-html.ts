/**
 * TechPort mezcla HTML liviano (`<br />`, `&nbsp;`) en la prosa de un
 * proyecto — la descripción y los benefits vienen pensados para un `<div>`,
 * no para el `<Text>` de texto plano del diseño.
 */
export function stripHtml(value: string) {
  return value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
