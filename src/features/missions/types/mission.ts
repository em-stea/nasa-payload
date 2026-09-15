import type {CardTone} from "@/shared/components/card/card";

/** Fila `label / value` de los paneles del detalle. */
export type MissionFact = {
  label: string;
  value: string;
};

/** Los tres puntos de Technology Readiness Level que publica TechPort. */
export type MissionTrl = {
  begin: number | null;
  current: number | null;
  end: number | null;
};

/** Proyecto de TechPort completo: lo que pinta `/missions/[id]`. */
export type MissionDetail = {
  id: string;
  title: string;
  description: string;
  benefits?: string;
  image?: string;
  status: string;
  tone: CardTone;
  destinationTypes: string[];
  technologyArea?: string;
  trl: MissionTrl;
  startDate?: string;
  endDate?: string;
  program?: string;
  responsibleOrganization?: string;
  leadOrganization?: string;
  principalInvestigator?: string;
  projectManager?: string;
};

/**
 * Forma cruda de `techport/api/projects`: el índice del catálogo. No trae el
 * proyecto, sólo su id y cuándo se actualizó por última vez; el título y el
 * resto hay que pedirlos de a uno por `projects/{id}`.
 */
export type TechPortProjectsListResponse = {
  projects: Array<{
    projectId: number;
    /** `2026-9-14`: sin cero a la izquierda, no es ISO. */
    lastUpdated: string;
    favorited: boolean;
    detailedFunding: boolean;
  }>;
};

/**
 * Forma cruda de `techport/api/projects/{id}`, acotada a lo que consume
 * `getMission`. TechPort anida mucho más (taxonomías, financiamiento,
 * organizaciones de soporte) que no hace falta para el detalle.
 */
export type TechPortProjectDetailResponse = {
  project: {
    projectId: number;
    title: string;
    description?: string;
    benefits?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    destinationType?: string[];
    trlBegin?: number;
    trlCurrent?: number;
    trlEnd?: number;
    primaryTx?: {
      title: string;
    };
    program?: {
      title: string;
      acronymOrTitle?: string;
      responsibleMd?: {
        organizationName?: string;
      };
    };
    leadOrganization?: {
      organizationName: string;
    };
    projectContacts?: Array<{
      fullName: string;
      projectContactRole: string;
    }>;
  };
};
