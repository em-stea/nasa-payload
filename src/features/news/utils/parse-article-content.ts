import type {ArticleBlock, ArticleFigure} from "@/features/news/types/news";

import {toPlainText} from "@/features/news/utils/html-text";

/**
 * Baja el `content.rendered` de un post de nasa.gov a bloques de texto y a una
 * lista de imágenes.
 *
 * El cuerpo llega como el HTML completo de Gutenberg: 30 KB de divs con las
 * clases del design system de nasa.gov, y al final los módulos de la plantilla
 * (compartir, créditos, "Explore More"), que no son parte de la nota. Nada de
 * eso sirve acá, y volcarlo con `dangerouslySetInnerHTML` traería además los
 * estilos y los scripts de ellos adentro de nuestra página.
 *
 * Así que extraemos sólo lo que el diseño pinta —títulos, párrafos, figuras— y
 * lo devolvemos como datos. El costo es que se pierde el formato inline
 * (negritas, links dentro del párrafo); a cambio la tipografía es la del sitio
 * y el HTML de terceros nunca entra al DOM.
 */

/**
 * Encabezados con los que arranca el pie de la plantilla de nasa.gov. El
 * primero que aparezca marca dónde termina la nota.
 */
const TEMPLATE_HEADINGS = new Set([
  "share",
  "details",
  "related terms",
  "explore more",
  "discover related topics",
  "about the author",
  "keep exploring",
  "more from nasa",
]);

/** Debajo de esto un <p> es una etiqueta o un crédito, no un párrafo. */
const MIN_PARAGRAPH_LENGTH = 60;

/**
 * Las notas de prensa de la NASA cierran con los datos de contacto del área de
 * comunicación, sueltos en un <p> igual que el resto. Un párrafo con un mail
 * adentro es siempre uno de esos.
 */
const CONTACT_PATTERN = /[\w.+-]+@[\w-]+\.[\w.]+/;

/** Tope de figuras que puede consumir el carrusel. */
const MAX_FIGURES = 8;

/** Descarta píxeles de tracking y spacers. */
const MIN_IMAGE_WIDTH = 200;

const BLOCK_PATTERN = /<(h2|h3|p)\b[^>]*>([\s\S]*?)<\/\1>/gi;
const IMAGE_PATTERN = /<img\b[^>]*>/gi;
const FIGCAPTION_PATTERN = /<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/i;

function readAttribute(tag: string, name: string) {
  return tag.match(new RegExp(`${name}="([^"]*)"`, "i"))?.[1];
}

/**
 * Corta el HTML en el primer encabezado de la plantilla. Si el post no tiene
 * ninguno (pasa con las notas cortas) se usa entero.
 */
function cutTemplateFooter(html: string) {
  for (const match of html.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)) {
    if (TEMPLATE_HEADINGS.has(toPlainText(match[1]).toLowerCase())) {
      return html.slice(0, match.index);
    }
  }

  return html;
}

function parseBlocks(html: string): ArticleBlock[] {
  // Los epígrafes se sacan antes de buscar párrafos: viven adentro de la
  // figura, se pintan con ella y repetirlos en el cuerpo sería ruido.
  const body = html.replace(/<figcaption\b[^>]*>[\s\S]*?<\/figcaption>/gi, "");
  const blocks: ArticleBlock[] = [];

  for (const [, tag, inner] of body.matchAll(BLOCK_PATTERN)) {
    const text = toPlainText(inner);

    if (!text) continue;

    if (tag.toLowerCase() === "p") {
      if (text.length < MIN_PARAGRAPH_LENGTH || CONTACT_PATTERN.test(text)) continue;
      blocks.push({kind: "paragraph", text});
      continue;
    }

    blocks.push({kind: "heading", text});
  }

  // Un encabezado al final quedó sin su sección: se lo llevó alguno de los
  // filtros de arriba.
  while (blocks.at(-1)?.kind === "heading") blocks.pop();

  return blocks;
}

function parseFigures(html: string): ArticleFigure[] {
  const matches = [...html.matchAll(IMAGE_PATTERN)];
  const figures: ArticleFigure[] = [];
  const seen = new Set<string>();

  matches.forEach((match, index) => {
    const tag = match[0];
    const url = readAttribute(tag, "src");

    if (!url || !url.startsWith("http") || seen.has(url)) return;

    const width = Number.parseInt(readAttribute(tag, "width") ?? "", 10);

    if (Number.isFinite(width) && width < MIN_IMAGE_WIDTH) return;

    // El epígrafe es el primero que aparece entre esta imagen y la siguiente.
    const from = (match.index ?? 0) + tag.length;
    const to = matches[index + 1]?.index ?? html.length;
    const caption = toPlainText(html.slice(from, to).match(FIGCAPTION_PATTERN)?.[1] ?? "");

    seen.add(url);
    figures.push({
      url,
      alt: toPlainText(readAttribute(tag, "alt") ?? ""),
      caption: caption || undefined,
    });
  });

  return figures.slice(0, MAX_FIGURES);
}

/** "3 min read", que nasa.gov publica como una etiqueta arriba del titular. */
function parseReadingTime(html: string) {
  return html.match(/>(\s*\d+\s*min read\s*)</i)?.[1].trim();
}

export function parseArticleContent(html: string) {
  const body = cutTemplateFooter(html);

  return {
    blocks: parseBlocks(body),
    figures: parseFigures(body),
    readingTime: parseReadingTime(html),
  };
}
