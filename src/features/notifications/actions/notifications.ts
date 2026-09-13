"use server";

import {refresh} from "next/cache";

import {getSessionSiteUser, requireSiteUser} from "@/features/account/services/site-user";
import {countUnreadNotifications} from "@/features/notifications/services/get-notifications";
import {getPayloadClient} from "@/shared/services/payload";

/**
 * Marca como leídos todos los avisos del lector.
 *
 * Va como acción explícita y no al abrir la pantalla: si se marcaran solas al
 * entrar, un aviso que el lector todavía no miró desaparecería del contador por
 * haber pasado por la lista.
 */
export async function markAllNotificationsRead(): Promise<void> {
  const siteUser = await requireSiteUser();
  const payload = await getPayloadClient();

  await payload.update({
    collection: "notifications",
    where: {
      and: [{user: {equals: siteUser.id}}, {read: {not_equals: true}}],
    },
    data: {read: true},
    depth: 0,
  });

  refresh();
}

/** Marca un aviso como leído (al abrir el hilo desde la lista). */
export async function markNotificationRead(id: string): Promise<void> {
  const siteUser = await getSessionSiteUser();

  if (!siteUser) return;

  const payload = await getPayloadClient();

  await payload.update({
    collection: "notifications",
    where: {
      and: [{id: {equals: id}}, {user: {equals: siteUser.id}}],
    },
    data: {read: true},
    depth: 0,
  });
}

/**
 * Contador para el badge del drawer.
 *
 * Es una acción y no un route handler porque el drawer vive en el cliente y
 * sólo monta su contenido al abrirse: pedirlo ahí evita sumarle una lectura a
 * Mongo en cada navegación del sitio.
 */
export async function fetchUnreadNotificationCount(): Promise<number> {
  return countUnreadNotifications();
}
