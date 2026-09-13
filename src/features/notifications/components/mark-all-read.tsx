"use client";

import {useActionState} from "react";

import {markAllNotificationsRead} from "@/features/notifications/actions/notifications";
import {Text} from "@/shared/components/text/text";

/**
 * Botón para marcar todo como leído. Usa `useActionState` sólo por el `pending`
 * que devuelve; la lista se actualiza sola con el `refresh()` de la acción.
 */
export function MarkAllRead({disabled}: {disabled: boolean}) {
  const [, formAction, pending] = useActionState(async () => {
    await markAllNotificationsRead();

    return null;
  }, null);

  return (
    <form action={formAction}>
      <button
        className="text-basic-500 uppercase transition-colors duration-200 hover:cursor-pointer hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled || pending}
        type="submit"
      >
        <Text variant="meta.3">{pending ? "Marking…" : "Mark all as read"}</Text>
      </button>
    </form>
  );
}
