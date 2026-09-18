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
  saved: boolean;
  canSave: boolean;
  onSavedChange?: (saved: boolean) => void;
};

const ICON_CLASSNAME = "size-5 shrink-0";

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

export function FavoriteButtonPlaceholder() {
  return (
    <span aria-hidden="true" className="invisible flex items-center gap-2">
      <Heart className={ICON_CLASSNAME} />
      <ReservedLabel>Save</ReservedLabel>
    </span>
  );
}

export function FavoriteButton({item, saved, canSave, onSavedChange}: FavoriteButtonProps) {
  const [isSaved, setIsSaved] = useState(saved);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    onSavedChange?.(isSaved);
  }, [isSaved, onSavedChange]);

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
        isSaved ? "text-red-300" : "text-secondary-foreground hover:text-foreground",
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
