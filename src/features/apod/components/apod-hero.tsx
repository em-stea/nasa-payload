import type {ApodImage} from "@/features/apod/types/apod";
import type {ReactNode} from "react";

import Image from "next/image";

import {Heading} from "@/shared/components/heading/heading";
import {Text} from "@/shared/components/text/text";
import {toMissionTimestamp} from "@/shared/utils/mission-date";

type ApodHeroProps = {
  apod: ApodImage;
  /** Compartir; llega desde la page para mantener este componente sin estado. */
  actions?: ReactNode;
};

/**
 * Cabecera del detalle de la APOD, con el mismo tratamiento visual que
 * `ArticleHero`: la imagen a sangre y el titular apoyado sobre un degradado.
 */
export function ApodHero({apod, actions}: ApodHeroProps) {
  return (
    <header className="relative h-70 w-full overflow-hidden border border-border sm:h-96">
      <Image
        fill
        priority
        alt={apod.alt || apod.title}
        className="object-cover dark:opacity-80 dark:mix-blend-screen"
        sizes="100vw"
        src={apod.image}
      />

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-gradient-to-t from-background to-transparent px-4 pt-4 pb-4">
        <Heading
          as="h1"
          className="lg:leading-13.2 text-7 leading-8.5 tracking-n0_96 text-primary-foreground sm:text-8 sm:leading-10 lg:text-12"
          variant="title.2"
        >
          {apod.title}
        </Heading>

        <div className="flex w-full flex-wrap items-center gap-x-4 gap-y-1">
          <Text className="text-basic-500 uppercase" variant="meta.3">
            Author: NASA
          </Text>

          <Text className="text-basic-500 uppercase" variant="meta.3">
            <time dateTime={apod.date}>Date: {toMissionTimestamp(apod.date)}</time>
          </Text>

          <Text className="text-basic-500 uppercase" variant="meta.3">
            {apod.mediaType}
          </Text>

          {actions && <div className="ms-auto flex items-center gap-2">{actions}</div>}
        </div>
      </div>
    </header>
  );
}
