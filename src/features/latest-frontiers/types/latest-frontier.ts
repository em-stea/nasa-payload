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

/**
 * Forma cruda de `images-api.nasa.gov/search`, acotada a lo que consume
 * `parseLatestFrontier`.
 */
export type ImagesApiItem = {
  data: Array<{
    nasa_id: string;
    title: string;
    description?: string;
    date_created: string;
    keywords?: string[];
  }>;
  links?: Array<{href: string; rel: string; render: string}>;
};

export type ImagesSearchResponse = {
  collection: {
    items: ImagesApiItem[];
    metadata?: {total_hits: number};
  };
};
