/* eslint-disable react/jsx-no-comment-textnodes */
"use client";

import {ReactNode, useCallback, useEffect, useState} from "react";
import {useMediaQuery} from "usehooks-ts";

import {cn} from "@/shared/utils/className-builder";

import {Button} from "../button/button";
import {Text} from "../text/text";
import {ButtonArrows} from "./button-arrows";
import {Carousel, CarouselApi, CarouselContent, CarouselItem} from "./carousel";

type CarouselVariant = "full" | "grid";

type CarouselImageProps<T> = {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
  variant?: CarouselVariant;
};

export function CarouselImage<T>({
  items,
  renderItem,
  className,
  variant = "full",
}: CarouselImageProps<T>) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  // Detecta si la pantalla es menor al breakpoint lg (1024px)
  const isMobile = useMediaQuery("(max-width: 1023px)");

  const updateScrollSnapState = useCallback((emblaApi: CarouselApi) => {
    if (!emblaApi) return;
    setCount(emblaApi.scrollSnapList().length);
    setCurrent(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!api) return;

    updateScrollSnapState(api);

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    const onReInit = () => {
      updateScrollSnapState(api);
    };

    api.on("select", onSelect);
    api.on("reInit", onReInit);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onReInit);
    };
  }, [api, updateScrollSnapState]);

  const isGrid = variant === "grid";
  const formatNumber = (num: number) => String(num).padStart(2, "0");

  const showArrowsOnly = isMobile && items.length > 4;

  return (
    <div className={cn("mx-auto w-full", className)}>
      <Carousel
        opts={{
          align: "start",
          containScroll: "trimSnaps",
          breakpoints: {
            "(min-width: 1024px)": {
              slidesToScroll: isGrid ? 4 : 1,
            },
          },
        }}
        className={cn("w-full", isGrid && "-mx-5")}
        setApi={setApi}
      >
        {/* El viewport recorta los slides fuera de vista, pero también se comía el
        box-shadow de las cards de los extremos: el padding le da lugar a la sombra
        para sangrar sin clippearse, y el -mx-5 de arriba lo compensa para que el
        contenido no se corra de posición. */}
        <CarouselContent className={cn(isGrid && "-ml-4")} viewportClassName={cn(isGrid && "px-5")}>
          {items.map((item, index) => (
            <CarouselItem
              className={cn(isGrid ? "basis-full pl-4 sm:basis-1/2 lg:basis-1/4" : "basis-full")}
              key={index}
            >
              {renderItem(item, index)}
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {count > 1 && (
        <div className="flex items-center justify-between py-4">
          {showArrowsOnly ? (
            <ButtonArrows api={api} />
          ) : (
            <div className="flex items-center gap-1.5">
              {Array.from({length: count}).map((_, index) => (
                <Button
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    current === index ? "w-6 bg-primary" : "w-2 bg-secondary",
                  )}
                  aria-current={current === index ? "true" : undefined}
                  aria-label={`Go to slide ${index + 1}`}
                  key={index}
                  size="intrinsic"
                  variant="ghost"
                  onClick={() => api?.scrollTo(index)}
                />
              ))}
            </div>
          )}

          <Text className="text-secondary-foreground" variant="body.4">
            {formatNumber(current + 1)} // {formatNumber(count)}
          </Text>
        </div>
      )}
    </div>
  );
}
