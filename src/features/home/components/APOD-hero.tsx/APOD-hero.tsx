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

  console.log(apodImage, 'apodImage')
  return (
    <div className="w-full h-[calc(100vh-80px)] overflow-hidden relative">
      <div className="absolute z-1 bottom-8 left-8 right-8 h-fit border border-basic-00-10 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-basic-950-60 backdrop-blur-md z-0" />

        <div className="p-4 relative z-10 flex flex-col gap-2 items-start">
          <Badge>APOD &nbsp;&nbsp;//&nbsp;&nbsp; ACTIVE</Badge>
          <Heading variant="title.1" color="basic-00" className="w-[45%]">
            Astronomy Picture of the Day
          </Heading>
          <Text variant="body.1" color="basic-00" className="w-[45%] pb-4">
            Witness the cosmos through the lens of NASA's most profound observatories. Today's
            feature unveils the intricate filamentary structures of the Veil Nebula.
          </Text>
          <Button variant="primary" size="md" className="gap-2">
            Explore More
            <ArrowRight color="text-basic-00" className="size-5" />
          </Button>
        </div>
      </div>

      <div className="relative overflow-hidden h-dvh">
        <Image
          src={apodImage.hdurl}
          alt={apodImage.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    </div>
  )
}
