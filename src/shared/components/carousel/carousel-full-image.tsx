/* eslint-disable react/jsx-no-comment-textnodes */
"use client";

import Image from "next/image";
import {useEffect, useState} from "react";

import {cn} from "@/shared/utils/className-builder";

import {Button} from "../button/button";
import {Text} from "../text/text";
import {Carousel, CarouselApi, CarouselContent, CarouselItem} from "./carousel";

export function CarouselFullImage() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect -- Embla publica su estado recién cuando la API está montada.
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className="mx-auto w-100">
      <Carousel className="w-full" setApi={setApi}>
        <CarouselContent>
          {Array.from({length: 5}).map((_, index) => (
            <CarouselItem key={index}>
              <Image
                alt={`Image ${index + 1}`}
                className="h-full w-full object-cover"
                height={400}
                src={`https://placehold.co/600x400?text=${index + 1}`}
                width={600}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-1">
          {Array.from({length: count}).map((_, index) => (
            <Button
              aria-current={current === index ? "true" : undefined}
              aria-label={`Go to slide ${index + 1}`}
              className={cn("size-2", current === index ? "bg-primary" : "bg-secondary")}
              key={index}
              size="intrinsic"
              variant="ghost"
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>
        <Text className="text-secondary-foreground" variant="body.4">
          Image 0{current + 1} // 0{count}
        </Text>
      </div>
    </div>
  );
}
