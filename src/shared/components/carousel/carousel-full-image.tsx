/* eslint-disable react/jsx-no-comment-textnodes */
'use client'

import { useEffect, useState } from 'react'
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from './carousel'
import { Button } from '../button/button'
import { cn } from '@/shared/utils/className-builder'
import { Text } from '../text/text'
import Image from 'next/image'

export function CarouselFullImage() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap())
    }

    api.on('select', onSelect)

    return () => {
      api.off('select', onSelect)
    }
  }, [api])

  return (
    <div className="mx-auto w-100">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index}>
              <Image
                src={`https://placehold.co/600x400?text=${index + 1}`}
                alt={`Image ${index + 1}`}
                className="h-full w-full object-cover"
                width={600}
                height={400}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="flex items-center justify-between py-4 ">
        <div className="flex items-center gap-1">
          {Array.from({ length: count }).map((_, index) => (
            <Button
              key={index}
              variant="ghost"
              size="intrinsic"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={current === index ? 'true' : undefined}
              className={cn('size-2 ', current === index ? 'bg-primary' : 'bg-secondary')}
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>
        <Text variant="body.4" className="text-secondary-foreground">
          Image 0{current + 1} // 0{count}
        </Text>
      </div>
    </div>
  )
}
