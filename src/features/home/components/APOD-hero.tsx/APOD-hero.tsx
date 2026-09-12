/* eslint-disable react/no-unescaped-entities */
import Image from 'next/image'
import { getAPODImage } from '../../services/get-apod-image'
import { Heading } from '@/shared/components/heading/heading'
import { Text } from '@/shared/components/text/text'
import { Badge } from '@/shared/components/badge/badge'
import { Button } from '@/shared/components/button/button'
import { ArrowRight } from '@/shared/components/icons/directional/arrow-right'

export default async function APODHero() {
  const apodImage = await getAPODImage()

  return (
    <div className="w-full h-[calc(100dvh-80px)] overflow-hidden relative">
      <div className="absolute z-10 bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 h-fit border border-basic-00-10 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-basic-950-60 backdrop-blur-md z-0" />

        <div className="p-4 sm:p-6 relative z-10 flex flex-col gap-2 items-start">
          <Badge variant="default">
            <div className="size-2 rounded-full bg-blue-200" /> APOD // ACTIVE
          </Badge>

          <Heading variant="title.1" color="basic-00" className="w-full md:w-[70%] lg:w-[45%]">
            Astronomy Picture of the Day
          </Heading>

          <Text variant="body.1" color="basic-00" className="w-full md:w-[70%] lg:w-[45%] pb-4">
            Witness the cosmos through the lens of NASA's most profound observatories. Today's
            feature unveils the intricate filamentary structures of the Veil Nebula.
          </Text>

          <Button variant="primary" size="md" className="gap-2 w-full sm:w-auto justify-center">
            Explore More
            <ArrowRight color="text-basic-00" className="size-5" />
          </Button>
        </div>
      </div>

      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src={apodImage.hdurl}
          alt={apodImage.title}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>
    </div>
  )
}
