/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";
import Link from "next/link";

import {getAPODImage} from "@/features/apod/services/get-apod-image";
import {Badge} from "@/shared/components/badge/badge";
import {Button} from "@/shared/components/button/button";
import {Container} from "@/shared/components/container/container";
import {Heading} from "@/shared/components/heading/heading";
import {ArrowRight} from "@/shared/components/icons/directional/arrow-right";
import {Text} from "@/shared/components/text/text";

export default async function APODHero() {
  const apodImage = await getAPODImage();

  return (
    <div className="relative h-[calc(100dvh-80px)] w-full overflow-hidden">
      {/* La foto sangra a todo el ancho; la placa de texto respeta el Container. */}
      <Container className="absolute inset-x-0 bottom-4 z-10 sm:bottom-8">
        <div className="relative h-fit overflow-hidden rounded-2xl border border-basic-00-10">
          <div className="absolute inset-0 z-0 bg-basic-950-60 backdrop-blur-md" />

          <div className="relative z-10 flex flex-col items-start gap-2 p-4 sm:p-6">
            <Badge hasDot variant="default">
              APOD // ACTIVE
            </Badge>

            <Heading className="w-full md:w-[70%] lg:w-[45%]" color="basic-00" variant="title.1">
              Astronomy Picture of the Day
            </Heading>

            <Text className="w-full pb-4 md:w-[70%] lg:w-[45%]" color="basic-00" variant="body.1">
              Witness the cosmos through the lens of NASA's most profound observatories. Today's
              feature unveils the intricate filamentary structures of the Veil Nebula.
            </Text>

            <Button
              asChild
              className="w-full justify-center gap-2 sm:w-auto"
              size="md"
              variant="primary"
            >
              <Link href="/apod">
                Explore More
                <ArrowRight className="size-5" color="text-basic-00" />
              </Link>
            </Button>
          </div>
        </div>
      </Container>

      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          fill
          priority
          alt={apodImage.alt || apodImage.title}
          className="object-cover object-center"
          sizes="100vw"
          src={apodImage.image}
        />
      </div>
    </div>
  );
}
