import Link from "next/link";

import {Badge} from "@/shared/components/badge/badge";
import {Button} from "@/shared/components/button/button";
import {Container} from "@/shared/components/container/container";
import {Heading} from "@/shared/components/heading/heading";
import {Live} from "@/shared/components/icons/other/live";
import {Text} from "@/shared/components/text/text";
import {cn} from "@/shared/utils/className-builder";

import {TelescopeViewport} from "./telescope-viewport";

/**
 * La pantalla del 404 entera: la toma por el telescopio y, abajo, la salida.
 *
 * La usan las dos puertas de entrada al error —`not-found` del grupo del sitio
 * y `global-not-found` para las URLs que no matchean ninguna ruta—, así que no
 * asume nada del layout que la envuelve: trae su propio fondo y su alto.
 */
export function NotFoundScreen({className}: {className?: string}) {
  return (
    <main
      className={cn(
        "relative isolate flex min-h-dvh flex-col overflow-hidden bg-[#05060a] text-basic-00",
        className,
      )}
    >
      <TelescopeViewport>
        <Container className="flex flex-col items-center gap-4 pb-10 text-center md:pb-14">
          {/* La pantalla trae su propio fondo negro en los dos temas, así que
              el rojo del badge no puede seguir al tema: en claro `destructive`
              es el rojo oscuro y se perdería contra el cielo. */}
          <Badge className="text-red-200" variant="alert">
            <Live /> No signal
          </Badge>

          <Heading as="h1" className="text-basic-00" variant="title.2">
            {/* El 404 lo dicen los planetas; para un lector de pantalla, acá. */}
            <span className="sr-only">Error 404. </span>
            Off the star chart
          </Heading>

          <Text className="max-w-[58ch] text-basic-300" variant="body.3">
            Nothing orbits these coordinates — the only thing out here spells four, zero, four.
          </Text>

          <div className="mt-1 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="xs">
              <Link href="/">Back to Earth</Link>
            </Button>

            <Button asChild className="text-basic-300" size="xs" variant="text-link">
              <Link href="/news">Read the latest news</Link>
            </Button>
          </div>
        </Container>
      </TelescopeViewport>
    </main>
  );
}
