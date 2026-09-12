import Image from 'next/image'
import { getAPODImage } from '../../services/get-apod-image'
import { Heading } from '@/shared/components/heading/heading'
import { Text } from '@/shared/components/text/text'

export default async function APODHero() {
  const apodImage = await getAPODImage()

  console.log(apodImage, 'apodImage')
  return (
    <div className=" w-full h-full ">
      <div className="absolute z-1 bottom-0 left-8 right-8 h-77.75 border border-basic-950 rounded-2xl overflow-hidden">
        <div className="p-4 absolute z-2">
          <Heading variant="title.1" color="basic-00" className="w-50%">
            Astronomy Picture of the Day
          </Heading>
          <Text>lorem ipsum</Text>
          <Text>lorem ipsum</Text>
          <Text>lorem ipsum</Text>
        </div>
        <div className="bg-basic-950-60  blur-lg h-77.75" />
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
