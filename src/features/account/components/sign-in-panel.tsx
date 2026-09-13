"use client";

import {signIn} from "next-auth/react";
import {useState} from "react";

import {AUTH_PROVIDERS, type AuthProviderId} from "@/features/auth/providers";
import {Text} from "@/shared/components/text/text";

type SignInPanelProps = {
  /** Rótulo de consola del bloque. */
  label?: string;
  description: string;
};

/**
 * Bloque de login para las partes del sitio que necesitan sesión.
 *
 * Repite los providers del drawer de usuario en vez de linkear a él porque
 * aparece justo donde el lector quiso hacer algo —comentar, guardar— y
 * mandarlo a buscar el menú arriba de todo es perderlo.
 */
export function SignInPanel({label = "> AUTH_REQUIRED", description}: SignInPanelProps) {
  const [pending, setPending] = useState<AuthProviderId | null>(null);

  return (
    <div className="flex w-full flex-col gap-3 border border-border bg-card p-4">
      <Text className="tracking-1_2 text-foreground" variant="body.4">
        {label}
      </Text>

      <Text className="text-basic-500" variant="meta.3">
        {description}
      </Text>

      <div className="flex flex-col gap-2 sm:flex-row">
        {AUTH_PROVIDERS.map(({id, label: providerLabel, icon: Icon}) => (
          <button
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-3 text-primary-foreground transition-colors duration-200 hover:cursor-pointer hover:border-foreground disabled:cursor-wait"
            disabled={pending !== null}
            key={id}
            type="button"
            onClick={() => {
              setPending(id);
              void signIn(id);
            }}
          >
            <Icon className="size-5 shrink-0" />
            <Text variant="button.2">{pending === id ? "Redirecting…" : providerLabel}</Text>
          </button>
        ))}
      </div>
    </div>
  );
}
