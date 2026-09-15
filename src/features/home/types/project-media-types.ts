export interface ProjectMediaResponse {
  collection: {
    href: string;
    items: Item[];
  };
}

export interface Item {
  data: DataItem[];
  href: string;
  links: LinkItems[];
}

export interface DataItem {
  center: string;
  /** ISO completo (`2019-05-06T00:00:00Z`): la API lo manda como string. */
  date_created: string;
  description: string;
  description_508: string;
  keywords: string[];
  media_type: string;
  nasa_id: string;
  secondary_creator: string;
  title: string;
  album: string[];
}

export interface LinkItems {
  href: string;
  rel: string;
  render: string;
  width: number;
  size: number;
  height: number;
}
