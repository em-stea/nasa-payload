import type {Metadata} from "next";

import {Suspense} from "react";

import {SignInPanel} from "@/features/account/components/sign-in-panel";
import {getSessionIdentity} from "@/features/account/services/site-user";
import {FavoriteCard} from "@/features/favorites/components/favorite-card";
import {getFavorites} from "@/features/favorites/services/get-favorites";
import {Container} from "@/shared/components/container/container";
import {Heading} from "@/shared/components/heading/heading";
import {Text} from "@/shared/components/text/text";

export const metadata: Metadata = {
  title: "Favorites",
  description: "Las noticias que guardaste para leer después.",
};

export const instant = true;

const GRID_CLASSNAME = "grid w-full auto-rows-96 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3";

/**
 * Lo que el lector guardó.
 *
 * El encabezado viaja en el shell estático de la ruta y la lista, que depende
 * de la sesión, entra por streaming: sin eso la página entera tendría que
 * esperar a la cookie antes de pintar nada.
 */
export default function FavoritesPage() {
  return (
    <main className="flex min-h-dvh w-full flex-col items-center bg-background pt-24 pb-32 text-primary-foreground">
      <Container className="flex flex-col items-start gap-8">
        <header className="gap-1.8 flex w-full flex-col border-b border-border pt-20 pb-6">
          <Text className="flex flex-wrap items-baseline gap-2" variant="body.4">
            <span className="text-foreground">SYS.MSG</span>
            <span className="text-basic-500">PERSONAL_ARCHIVE</span>
          </Text>

          <Heading as="h1" className="leading-13.2 text-12 tracking-n0_96" variant="title.2">
            Favorites
          </Heading>

          <Text className="max-w-2xl text-basic-500" variant="body.1">
            Las transmisiones que marcaste para volver a leer.
          </Text>
        </header>

        <Suspense fallback={<FavoritesSkeleton />}>
          <FavoritesList />
        </Suspense>
      </Container>
    </main>
  );
}

async function FavoritesList() {
  const identity = await getSessionIdentity();

  if (!identity) {
    return (
      <div className="w-full max-w-[600px]">
        <SignInPanel description="Iniciá sesión para ver lo que guardaste." />
      </div>
    );
  }

  const favorites = await getFavorites();

  if (favorites.length === 0) {
    return (
      <div className="w-full border border-dashed border-border bg-card p-6">
        <Text className="text-basic-500 uppercase" variant="meta.3">
          &gt; Archive empty. Guardá una noticia desde su detalle.
        </Text>
      </div>
    );
  }

  return (
    <div className={GRID_CLASSNAME}>
      {favorites.map((favorite) => (
        <FavoriteCard favorite={favorite} key={favorite.id} />
      ))}
    </div>
  );
}

function FavoritesSkeleton() {
  return (
    <div aria-hidden="true" className={GRID_CLASSNAME}>
      {Array.from({length: 3}, (_, index) => (
        <div
          className="h-full animate-pulse rounded-2xl border border-basic-00-10 bg-card-foreground"
          key={index}
        />
      ))}
    </div>
  );
}
