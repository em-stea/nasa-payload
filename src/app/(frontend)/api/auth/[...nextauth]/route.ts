import {handlers} from "@/auth";

/**
 * Endpoints de Auth.js: /api/auth/signin, /callback/:provider, /session, etc.
 *
 * Vive en el grupo (frontend) a propósito: Payload monta su propio catch-all en
 * `(payload)/api/[...slug]`, pero `api/auth/[...nextauth]` es más específico
 * (segmento estático `auth`) y gana en el ruteo.
 */
export const {GET, POST} = handlers;
