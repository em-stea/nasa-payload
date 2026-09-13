import type {Notification} from "@/payload-types";

import {getSessionSiteUser} from "@/features/account/services/site-user";
import {getPayloadClient} from "@/shared/services/payload";

/** Tope de avisos que se listan de una. */
const MAX_NOTIFICATIONS = 50;

/** Avisos del lector del request, del más nuevo al más viejo. */
export async function getNotifications(): Promise<Notification[]> {
  const siteUser = await getSessionSiteUser();

  if (!siteUser) return [];

  const payload = await getPayloadClient();
  const {docs} = await payload.find({
    collection: "notifications",
    where: {user: {equals: siteUser.id}},
    sort: "-createdAt",
    limit: MAX_NOTIFICATIONS,
    depth: 0,
  });

  return docs;
}

/** Cuántos avisos sin leer tiene el lector del request. */
export async function countUnreadNotifications(): Promise<number> {
  const siteUser = await getSessionSiteUser();

  if (!siteUser) return 0;

  const payload = await getPayloadClient();
  const {totalDocs} = await payload.count({
    collection: "notifications",
    where: {
      and: [{user: {equals: siteUser.id}}, {read: {not_equals: true}}],
    },
  });

  return totalDocs;
}
