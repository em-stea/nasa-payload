/**
 * Tipos del catálogo de objetos cercanos a la Tierra (NeoWs).
 *
 * NeoWs devuelve todo como string —incluso los números— y anida cada magnitud
 * bajo su unidad. Los tipos `Neo*` describen esa respuesta cruda tal cual
 * llega; los de abajo son lo que consume la UI, ya parseado y formateado.
 */

export type NeoCloseApproach = {
  close_approach_date: string;
  /** `2029-Apr-13 21:46`; puede faltar en aproximaciones viejas. */
  close_approach_date_full: string | null;
  epoch_date_close_approach: number;
  relative_velocity: {
    kilometers_per_second: string;
    kilometers_per_hour: string;
  };
  miss_distance: {
    astronomical: string;
    lunar: string;
    kilometers: string;
  };
  orbiting_body: string;
};

export type NeoOrbitalData = {
  first_observation_date: string | null;
  last_observation_date: string | null;
  observations_used: number | null;
  orbit_uncertainty: string | null;
  minimum_orbit_intersection: string | null;
  eccentricity: string | null;
  semi_major_axis: string | null;
  inclination: string | null;
  orbital_period: string | null;
  perihelion_distance: string | null;
  aphelion_distance: string | null;
  orbit_class: {
    orbit_class_type: string | null;
    orbit_class_description: string | null;
  } | null;
};

export type NeoObject = {
  id: string;
  neo_reference_id: string;
  /** `101955 Bennu (1999 RQ36)`. */
  name: string;
  name_limited?: string;
  designation?: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    meters: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  is_potentially_hazardous_asteroid: boolean;
  is_sentry_object: boolean;
  close_approach_data: NeoCloseApproach[];
  orbital_data?: NeoOrbitalData;
};

export type NeoBrowseResponse = {
  near_earth_objects: NeoObject[];
  page: {
    size: number;
    total_elements: number;
    total_pages: number;
    number: number;
  };
};

/**
 * Etiqueta de la card. NeoWs no publica un estado, así que sale de cruzar el
 * flag de peligrosidad con la distancia de la próxima aproximación y la
 * antigüedad del objeto en el catálogo.
 */
export type AsteroidStatus = "critical" | "pha" | "new" | "hist" | "actv" | "trk";

/** Aproximación a la Tierra, ya formateada para pintar. */
export type AsteroidApproach = {
  /** ISO del día, para el `dateTime` del <time>. */
  date: string;
  /** `2029-Apr-13 21:46`, como lo publica NeoWs. */
  dateLabel: string;
  /** Epoch en ms; sirve para ordenar y para saber si ya pasó. */
  epoch: number;
  velocityKmS: number;
  missAu: number;
  missLunar: number;
  missKm: number;
  /** `false` cuando la aproximación ya ocurrió. */
  upcoming: boolean;
};

/** Asteroide listo para la card del DISCOVERY LOG. */
export type Asteroid = {
  id: string;
  /** `101955 Bennu`, sin la designación provisional entre paréntesis. */
  name: string;
  href: string;
  status: AsteroidStatus;
  hazardous: boolean;
  /** Magnitud absoluta H: cuanto más baja, más grande el objeto. */
  magnitude: number;
  diameterMinM: number;
  diameterMaxM: number;
  /** Aproximación de referencia: la próxima, o la última si ya pasaron todas. */
  approach?: AsteroidApproach;
};

export type AsteroidPage = {
  asteroids: Asteroid[];
  /** Página pedida, ya normalizada (1-based). */
  page: number;
  totalPages: number;
  totalAsteroids: number;
};

/** Fila `label / value` de los paneles del detalle. */
export type AsteroidFact = {
  label: string;
  value: string;
  /** Pinta el valor con el acento azul. */
  highlight?: boolean;
};

/** Asteroide completo: lo que pinta `/asteroids/[id]`. */
export type AsteroidDetail = Asteroid & {
  /** Resumen armado con los datos orbitales; NeoWs no trae prosa. */
  summary: string;
  jplUrl: string;
  sentry: boolean;
  orbitClass?: string;
  /** Incertidumbre orbital 0–9; `null` cuando NeoWs no la publica. */
  orbitUncertainty: number | null;
  /** MOID en AU: lo más cerca que pueden llegar a estar las dos órbitas. */
  minimumOrbitIntersection: number | null;
  orbital: AsteroidFact[];
  observations: {
    first?: string;
    last?: string;
    used: number | null;
  };
};
