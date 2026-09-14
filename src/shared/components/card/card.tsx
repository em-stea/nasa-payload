"use client";

import type {VariantProps} from "class-variance-authority";
import type {ComponentProps, ReactNode} from "react";

import Image from "next/image";
import {createContext, use, ViewTransition} from "react";

import {Badge, badgeVariants} from "@/shared/components/badge/badge";
import {Separator} from "@/shared/components/separator/separator";
import {type BadgeTone} from "@/shared/styles/components/badge";
import {
  cardBodyVariants,
  cardDateVariants,
  cardDescriptionVariants,
  cardFooterVariants,
  cardHeaderVariants,
  cardImageVariants,
  cardStatLabelVariants,
  cardStatValueVariants,
  cardStatVariants,
  cardTitleVariants,
  cardVariants,
} from "@/shared/styles/components/card";
import {cn} from "@/shared/utils/className-builder";

type DivProps = Omit<ComponentProps<"div">, "children"> & {children?: ReactNode};
type BadgeProps = Omit<ComponentProps<typeof Badge>, "children" | "variant" | "tone">;
type ImageProps = Omit<ComponentProps<typeof Image>, "src" | "alt" | "fill">;
type TimeProps = Omit<ComponentProps<"time">, "dateTime" | "children"> & {
  children?: ReactNode;
};

/**
 * El tono de la card es el mismo del Badge: viaja sin traducción desde el dato
 * hasta el tag, y de paso decide el hover del borde y el color del título.
 */
export type CardTone = BadgeTone;

export type CardStatData = {
  label: string;
  value: string;
  highlight?: boolean;
};

export type CardData = {
  tag?: string;
  tone?: CardTone;
  image?: string;
  imageAlt?: string;
  title: string;
  description?: string;
  date?: string;
  dateTime?: string;
  alert?: string;
  stats?: CardStatData[];
  viewTransitionName?: string;
  isHighlighted?: boolean;
};

type CardContextValue = {
  data: CardData;
};

const CardContext = createContext<CardContextValue | null>(null);

function useCardContext() {
  const context = use(CardContext);

  if (!context) {
    throw new Error("Card compound parts must be used within <Card data={...}>");
  }

  return context;
}

type CardRootProps = DivProps &
  Omit<VariantProps<typeof cardVariants>, "tone"> & {
    data: CardData;
  };

function CardRoot({className, data, padding, children, ...props}: CardRootProps) {
  return (
    <CardContext value={{data}}>
      <div
        className={cn(
          cardVariants({
            tone: data.tone,
            isHighlighted: data.isHighlighted,
            padding,
          }),
          className,
        )}
        data-slot="card"
        {...props}
      >
        {children}
      </div>
    </CardContext>
  );
}

type CardHeaderProps = DivProps & VariantProps<typeof cardHeaderVariants>;

function CardHeader({className, variant, children, ...props}: CardHeaderProps) {
  return (
    <div
      className={cn(cardHeaderVariants({variant}), className)}
      data-slot="card-header"
      {...props}
    >
      {children}
    </div>
  );
}

type CardTagProps = BadgeProps & {
  /** Antepone el punto de color del tone, como en las cards de noticias. */
  dot?: boolean;
  variant?: VariantProps<typeof badgeVariants>["variant"];
};

/**
 * El tag de la card es la pastilla `dark` del diseño con el tono del dato. La
 * posición es lo único que aporta la card: el resto sale del Badge.
 */
function CardBadge({className, dot = false, variant = "dark", ...props}: CardTagProps) {
  const {data} = useCardContext();

  if (!data.tag) return null;

  return (
    <Badge
      className={cn("absolute top-4 left-4", className)}
      data-slot="card-tag"
      hasDot={dot}
      tone={data.tone}
      variant={variant}
      {...props}
    >
      {data.tag}
    </Badge>
  );
}

function CardImage({className, sizes = "(max-width: 768px) 100vw, 33vw", ...props}: ImageProps) {
  const {data} = useCardContext();

  if (!data.image) return null;

  const image = (
    <Image
      {...props}
      fill
      alt={data.imageAlt ?? ""}
      className={cn(cardImageVariants(), className)}
      data-slot="card-image"
      loading="eager"
      sizes={sizes}
      src={data.image}
    />
  );

  if (!data.viewTransitionName) return image;

  return <ViewTransition name={data.viewTransitionName}>{image}</ViewTransition>;
}

type CardBodyProps = DivProps & VariantProps<typeof cardBodyVariants>;

function CardBody({className, variant, children, ...props}: CardBodyProps) {
  return (
    <div className={cn(cardBodyVariants({variant}), className)} data-slot="card-body" {...props}>
      {children}
    </div>
  );
}

type CardTitleProps = DivProps & Omit<VariantProps<typeof cardTitleVariants>, "tone">;

function CardTitle({className, size, children, ...props}: CardTitleProps) {
  const {data} = useCardContext();

  return (
    <div
      className={cn(cardTitleVariants({tone: data.tone, size}), className)}
      data-slot="card-title"
      {...props}
    >
      {/* Por defecto pinta el título de `data`; se le pueden pasar children
          para envolverlo (por ejemplo en un link que estira su área de click). */}
      {children ?? data.title}
    </div>
  );
}

function CardDescription({className, ...props}: DivProps) {
  const {data} = useCardContext();

  if (!data.description) {
    return null;
  }

  return (
    <div
      className={cn(cardDescriptionVariants(), className)}
      data-slot="card-description"
      {...props}
    >
      {data.description}
    </div>
  );
}

type CardFooterProps = DivProps &
  VariantProps<typeof cardFooterVariants> & {
    withSeparator?: boolean;
  };

function CardFooter({
  className,
  variant,
  children,
  withSeparator = false,
  ...props
}: CardFooterProps) {
  return (
    <div
      className={cn(cardFooterVariants({variant}), className)}
      data-slot="card-footer"
      {...props}
    >
      {withSeparator && <Separator />}

      <div className="flex w-full flex-row pt-1">{children}</div>
    </div>
  );
}

function CardDate({className, ...props}: TimeProps) {
  const {data} = useCardContext();

  if (!data.date) {
    return null;
  }

  return (
    <time
      className={cn(cardDateVariants(), className)}
      data-slot="card-date"
      dateTime={data.dateTime}
      {...props}
    >
      {data.date}
    </time>
  );
}

type CardStatProps = DivProps &
  VariantProps<typeof cardStatVariants> &
  Omit<VariantProps<typeof cardStatValueVariants>, "tone"> & {
    index: number;
  };

function CardStat({className, index, layout, size, ...props}: CardStatProps) {
  const {data} = useCardContext();
  const stat = data.stats?.[index];

  if (!stat) {
    return null;
  }

  return (
    <div className={cn(cardStatVariants({layout}), className)} data-slot="card-stat" {...props}>
      <span className={cardStatLabelVariants()} data-slot="card-stat-label">
        {stat.label}
      </span>
      <span
        className={cardStatValueVariants({
          size,
          tone: stat.highlight ? "highlight" : "default",
        })}
        data-slot="card-stat-value"
      >
        {stat.value}
      </span>
    </div>
  );
}

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Badge: CardBadge,
  Image: CardImage,
  Body: CardBody,
  Title: CardTitle,
  Description: CardDescription,
  Footer: CardFooter,
  Date: CardDate,
  Stat: CardStat,
});

export type CardProps = CardRootProps;
