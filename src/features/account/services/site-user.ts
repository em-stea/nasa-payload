import type {SiteUser} from "@/payload-types";

import {auth} from "@/auth";
import {getPayloadClient} from "@/shared/services/payload";

/**
 * Puente entre la sesión de Auth.js y la colección `site-users` de Payload.
 *
 * Auth.js no tiene adapter de base de datos: la sesión es un JWT y lo único
 * estable que trae es el id que devolvió el provider. Así que el documento del
 * lector se crea de forma perezosa, la primera vez que hace algo que necesita
 * identidad persistida (comentar, guardar un favorito). Quien sólo lee nunca
 * genera una fila.
 */

const PROVIDERS = ["google", "github"] as const;

type Provider = (typeof PROVIDERS)[number];

function isProvider(value: string | undefined): value is Provider {
  return value != null && (PROVIDERS as readonly string[]).includes(value);
}

export type SessionIdentity = {
  /** `<provider>:<id del provider>`; la clave con la que buscamos en Payload. */
  authKey: string;
  provider: Provider;
  name: string;
  email: string;
  image?: string;
};

/**
 * Identidad del request, ya normalizada. `null` si no hay sesión o si el JWT
 * llegó sin los datos mínimos (puede pasar con un token viejo tras cambiar la
 * config de Auth.js).
 */
export async function getSessionIdentity(): Promise<SessionIdentity | null> {
  const session = await auth();
  const user = session?.user;

  if (!user?.id || !isProvider(user.provider)) return null;

  return {
    authKey: `${user.provider}:${user.id}`,
    provider: user.provider,
    name: user.name?.trim() || "Astronaut",
    // El backoffice usa el email para contactar al autor de un comentario.
    // GitHub puede no devolverlo si el usuario lo tiene privado; en ese caso
    // guardamos una dirección sintética antes que dejar el campo vacío.
    email: user.email ?? `${user.provider}-${user.id}@lector.invalid`,
    image: user.image ?? undefined,
  };
}

/** Lector ya existente. No crea nada: sirve para las pantallas de sólo lectura. */
export async function getSessionSiteUser(): Promise<SiteUser | null> {
  const identity = await getSessionIdentity();

  if (!identity) return null;

  const payload = await getPayloadClient();
  const {docs} = await payload.find({
    collection: "site-users",
    where: {authKey: {equals: identity.authKey}},
    limit: 1,
    depth: 0,
  });

  return docs[0] ?? null;
}

/**
 * Lector del request, creándolo si es su primera interacción y refrescando el
 * perfil si cambió en el provider. Para las mutaciones: tira si no hay sesión.
 */
export async function requireSiteUser(): Promise<SiteUser> {
  const identity = await getSessionIdentity();

  if (!identity) throw new Error("Necesitás iniciar sesión.");

  const payload = await getPayloadClient();
  const {docs} = await payload.find({
    collection: "site-users",
    where: {authKey: {equals: identity.authKey}},
    limit: 1,
    depth: 0,
  });

  const existing = docs[0];

  if (!existing) {
    return payload.create({
      collection: "site-users",
      data: {
        authKey: identity.authKey,
        provider: identity.provider,
        name: identity.name,
        email: identity.email,
        image: identity.image,
      },
      depth: 0,
    });
  }

  const changed =
    existing.name !== identity.name ||
    existing.email !== identity.email ||
    (existing.image ?? undefined) !== identity.image;

  if (!changed) return existing;

  return payload.update({
    collection: "site-users",
    id: existing.id,
    data: {name: identity.name, email: identity.email, image: identity.image},
    depth: 0,
  });
}
