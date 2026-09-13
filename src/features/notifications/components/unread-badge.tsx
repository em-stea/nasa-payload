"use client";

import {useEffect, useState} from "react";

import {fetchUnreadNotificationCount} from "@/features/notifications/actions/notifications";

/**
 * Contador de avisos sin leer, para el link del drawer.
 *
 * Se pide al montar, y el drawer sólo monta su contenido cuando se abre: así
 * el contador está al día sin que cada navegación del sitio sume una lectura a
 * Mongo. Mientras no haya número —o sea cero— no se renderiza nada.
 */
export function UnreadNotificationsBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let active = true;

    fetchUnreadNotificationCount()
      .then((value) => {
        if (active) setCount(value);
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  if (count === 0) return null;

  return (
    <span
      aria-label={`${count} sin leer`}
      className="ms-auto inline-flex min-w-5 items-center justify-center rounded-full bg-blue-700 px-1.5 py-0.5 font-jetbrains-mono text-2_5 leading-3.75 text-white"
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
