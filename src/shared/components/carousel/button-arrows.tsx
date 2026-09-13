import {Button} from "../button/button";
import {ArrowRight} from "../icons/directional/arrow-right";
import {CarouselApi} from "./carousel";

export const ButtonArrows = ({api}: {api: CarouselApi}) => {
  return (
    <div className="flex items-center gap-4">
      <Button
        aria-label="Previous slide"

        disabled={!api?.canScrollPrev()}
        size="intrinsic"
        variant="ghost-outline"
        onClick={() => api?.scrollPrev()}
      >
        <ArrowRight className="size-5 rotate-180" />
      </Button>
      <Button
        aria-label="Next slide"

        disabled={!api?.canScrollNext()}
        size="intrinsic"
        variant="ghost-outline"
        onClick={() => api?.scrollNext()}
      >
        <ArrowRight className="size-5" />
      </Button>
    </div>
  );
};
