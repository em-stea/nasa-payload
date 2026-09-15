/**
 * Launch Library 2 (TheSpaceDevs): el calendario de lanzamientos que alimenta
 * la caja "UPCOMING" de Featured Missions.
 *
 * La respuesta de `/launch/upcoming` es enorme —cohete, misión, agencia,
 * ventana, órbita, imágenes— y acá está acotada a lo que pinta la caja. El
 * endpoint es público y sin key, pero limita a 15 requests por hora por IP.
 */
export type LaunchLibraryUpcomingResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: LaunchLibraryLaunch[];
};

export type LaunchLibraryLaunch = {
  id: string;
  /** `Vega-C | Sentinel-3C & FLEX`. */
  name: string;
  /**
   * No Earlier Than: el T-0 previsto, en ISO con `Z`. Es una estimación hasta
   * que el lanzamiento ocurre, así que puede moverse entre dos requests.
   */
  net: string;
  status: {
    id: number;
    /** `Go for Launch`, `To Be Determined`, `Launch Successful`. */
    name: string;
    abbrev: string;
    description: string;
  };
  pad?: {
    id: number;
    /** `Ariane Launch Area 1 (ELV)`. */
    name: string;
    location?: {
      id: number;
      /** `Guiana Space Centre, French Guiana`. */
      name: string;
      country_code: string;
    };
  };
};

/** El próximo lanzamiento, ya recortado a lo que muestra la caja. */
export type UpcomingLaunch = {
  name: string;
  /** Día del despegue (`YYYY-MM-DD`), recortado del `net`. */
  date: string;
  /** Texto del estado; `Unknown` si el calendario todavía no lo publica. */
  status: string;
  location: string;
};
