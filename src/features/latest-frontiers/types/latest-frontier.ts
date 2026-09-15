import type {CardTone} from "@/shared/components/card/card";

/** Item del catálogo de imágenes de la NASA, ya listo para pintar una card. */
export type LatestFrontier = {
  id: string;
  tag: string;
  title: string;
  description: string;
  image?: string;
  date: string;
  dateTime?: string;
  tone?: CardTone;
};

export type LatestFrontiersPage = {
  items: LatestFrontier[];
  page: number;
  totalPages: number;
  totalItems: number;
};

/** Detalle de un item del catálogo, con la descripción completa y su metadata. */
export type LatestFrontierDetail = {
  id: string;
  tag: string;
  tags: string[];
  title: string;
  description: string;
  image?: string;
  date: string;
  dateTime: string;
  center?: string;
  photographer?: string;
  location?: string;
  tone?: CardTone;
};

/**
 * Forma cruda de `images-api.nasa.gov/search`, acotada a lo que consumen
 * `parseLatestFrontier` y `getLatestFrontier`.
 */
export type ImagesApiItem = {
  data: Array<{
    nasa_id: string;
    title: string;
    description?: string;
    date_created: string;
    keywords?: string[];
    center?: string;
    photographer?: string;
    location?: string;
  }>;
  links?: Array<{href: string; rel: string; render: string}>;
};

export type ImagesSearchResponse = {
  collection: {
    items: ImagesApiItem[];
    metadata?: {total_hits: number};
  };
};
