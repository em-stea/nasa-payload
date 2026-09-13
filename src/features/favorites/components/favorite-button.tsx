"use client";

import {type ReactNode, useEffect, useState} from "react";
import {toast} from "sonner";

import {toggleFavorite} from "@/features/favorites/actions/favorites";
import {Heart} from "@/shared/components/icons/other/heart";
import {Text} from "@/shared/components/text/text";
import {cn} from "@/shared/utils/className-builder";

export type FavoriteItem = {
  kind: "news" | "apod";
  itemId: string;
  title: string;
  description?: string;
  image?: string;
  href?: string;
  tag?: string;
  tone?: "blue" | "red" | "orange";
};

type FavoriteButtonProps = {
  item: FavoriteItem;
  /** Estado en la base al renderizar; lo resuelve el server. */
  saved: boolean;
  /** Sin sesión el botón no se muestra. */
  canSave: boolean;
  /** Avisa al padre el estado optimista, para listas que necesitan reaccionar (ej. sacar la card al desguardar). */
  onSavedChange?: (saved: boolean) => void;
};

const ICON_CLASSNAME = "size-5 shrink-0";

/** Reserva el ancho de "Saved" (la más larga) para que el toggle no mueva el layout. */
function ReservedLabel({children}: {children: ReactNode}) {
  return (
    <span className="relative hidden sm:inline-grid">
      <Text
        aria-hidden="true"
        className="invisible col-start-1 row-start-1 uppercase"
        variant="meta.3"
      >
        Saved
      </Text>
      <Text className="col-start-1 row-start-1 uppercase" variant="meta.3">
        {children}
      </Text>
    </span>
  );
}

/**
 * Mismo lugar exacto que el botón (ícono + label), pero invisible y sin
 * interacción.
 *
 * La usan tanto el fallback del `Suspense` que envuelve a `FavoriteButton`
 * como el propio botón cuando no hay sesión: así el tamaño de la fila de
 * acciones del artículo nunca cambia al resolverse la sesión.
 */
export function FavoriteButtonPlaceholder() {
  return (
    <span aria-hidden="true" className="invisible flex items-center gap-2">
      <Heart className={ICON_CLASSNAME} />
      <ReservedLabel>Save</ReservedLabel>
    </span>
  );
}

/**
 * Guarda la noticia en favoritos.
 *
 * El corazón es optimista y vive en estado local: se pinta apenas hacés click y
 * la acción viaja en segundo plano. Si falla, vuelve a como estaba y avisa por
 * toast.
 *
 * Es a propósito que la acción **no** se dispare dentro de una transición
 * (nada de `useActionState` ni `startTransition`): el árbol tiene un
 * `<ViewTransition>` en el hero, y cualquier commit en transición hace que
 * React arranque una view transition de toda la página —el salto raro que se
 * veía al apretar. Con `setState` común el cambio es un render normal y no
 * mueve nada.
 */
export function FavoriteButton({item, saved, canSave, onSavedChange}: FavoriteButtonProps) {
  const [isSaved, setIsSaved] = useState(saved);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    onSavedChange?.(isSaved);
    // Sólo nos importa reaccionar al cambio de estado, no a que cambie la referencia del callback.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSaved]);

  if (!canSave) return <FavoriteButtonPlaceholder />;

  const label = isSaved ? "Quitar de favoritos" : "Guardar en favoritos";

  async function handleToggle() {
    if (pending) return;

    const previous = isSaved;

    setIsSaved(!previous);
    setPending(true);

    try {
      const result = await toggleFavorite(item);

      if (result.status === "error") {
        setIsSaved(previous);
        toast.error(result.message ?? "No pudimos guardar el cambio.");

        return;
      }

      // La base es la que manda: si resolvió distinto de lo que asumimos, gana.
      setIsSaved(result.saved);
    } catch {
      setIsSaved(previous);
      toast.error("No pudimos guardar el cambio. Revisá tu conexión.");
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      className={cn(
        "flex items-center gap-2 transition-colors duration-200 hover:cursor-pointer",
        isSaved ? "text-red-300" : "text-basic-500 hover:text-foreground",
      )}
      aria-label={label}
      aria-pressed={isSaved}
      title={label}
      type="button"
      onClick={handleToggle}
    >
      <Heart aria-hidden="true" className={ICON_CLASSNAME} />
      <ReservedLabel>{isSaved ? "Saved" : "Save"}</ReservedLabel>
    </button>
  );
}
