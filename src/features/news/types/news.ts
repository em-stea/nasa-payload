import type {NewsTone} from "@/features/news/constants/categories";
import type {CardData} from "@/shared/components/card/card";

/**
 * Post tal como lo devuelve el WP REST de nasa.gov, acotado a los `_fields`
 * que pedimos en `get-latest-news`.
 */
export type NasaPost = {
  id: number;
  date: string;
  link: string;
  title: {rendered: string};
  excerpt: {rendered: string};
  categories: number[];
  /** Antigüedad ya formateada por el backend: "2 hours", "1 day", "1 month". */
  time_ago: string;
  /** Imagen destacada en tamaño completo; puede venir vacía. */
  featured_image_url: string;
};

/** El mismo post pero pedido de a uno, con el cuerpo completo. */
export type NasaPostDetail = NasaPost & {
  content: {rendered: string};
};

/** Noticia lista para pintar: lo que consume la Card más los links. */
export type NewsArticle = CardData & {
  id: number;
  /** Sale siempre de la categoría, así que nunca es el tono neutro de la card. */
  tone: NewsTone;
  /** Ruta interna al detalle. */
  href: string;
  /** Permalink original en nasa.gov. */
  sourceUrl: string;
};

/** Un bloque del cuerpo del artículo, ya bajado a texto plano. */
export type ArticleBlock = {kind: "heading"; text: string} | {kind: "paragraph"; text: string};

/** Imagen del cuerpo del artículo, con su epígrafe si lo trae. */
export type ArticleFigure = {
  url: string;
  alt: string;
  caption?: string;
};

/** Noticia completa: lo que pinta `/news/[id]`. */
export type NewsArticleDetail = {
  id: number;
  title: string;
  excerpt: string;
  /** Permalink original en nasa.gov. */
  sourceUrl: string;
  image?: string;
  tag: string;
  tone: NewsTone;
  /** ISO, para el `dateTime` del <time>. */
  publishedAt: string;
  /** Antigüedad formateada por el backend de nasa.gov. */
  timeAgo: string;
  /** "3 min read", cuando el post lo trae. */
  readingTime?: string;
  blocks: ArticleBlock[];
  figures: ArticleFigure[];
};

export type NewsPage = {
  articles: NewsArticle[];
  /** Página pedida, ya normalizada. */
  page: number;
  totalPages: number;
  totalArticles: number;
};
