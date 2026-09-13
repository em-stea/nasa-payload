/**
 * WP devuelve todo como HTML renderizado: títulos y bajadas vienen con
 * entidades (`&#8217;`, `&amp;`) y el cuerpo con el markup completo de
 * Gutenberg. Como la UI del sitio renderiza strings —nada de
 * `dangerouslySetInnerHTML`—, todo pasa por acá antes de llegar a un componente.
 */

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  hellip: "…",
  mdash: "—",
  ndash: "–",
  rsquo: "’",
  lsquo: "‘",
  rdquo: "”",
  ldquo: "“",
};

export function decodeEntities(value: string) {
  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, entity: string) => {
    if (entity.startsWith("#x") || entity.startsWith("#X")) {
      return String.fromCodePoint(Number.parseInt(entity.slice(2), 16));
    }

    if (entity.startsWith("#")) {
      return String.fromCodePoint(Number.parseInt(entity.slice(1), 10));
    }

    return NAMED_ENTITIES[entity.toLowerCase()] ?? match;
  });
}

export function toPlainText(html: string) {
  return decodeEntities(html.replace(/<[^>]*>/g, ""))
    .replace(/\[…\]|\[&hellip;\]/g, "…")
    .replace(/\s+/g, " ")
    .trim();
}
