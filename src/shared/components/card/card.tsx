'use client'

import Image from 'next/image'
import { createContext, use } from 'react'
import type { ComponentProps, ReactNode } from 'react'
import type { VariantProps } from 'class-variance-authority'

import { Badge } from '@/shared/components/badge'
import {
  cardBodyVariants,
  cardDateVariants,
  cardDescriptionVariants,
  cardFooterVariants,
  cardHeaderVariants,
  cardImageVariants,
  cardTagVariants,
  cardTitleVariants,
  cardVariants,
} from '@/shared/styles/components/card'
import { cn } from '@/shared/utils/className-builder'

type DivProps = Omit<ComponentProps<'div'>, 'children'> & { children?: ReactNode }
type BadgeProps = Omit<ComponentProps<typeof Badge>, 'children'> & { children?: ReactNode }
type ImageProps = Omit<ComponentProps<typeof Image>, 'src' | 'alt' | 'fill'>
type TimeProps = Omit<ComponentProps<'time'>, 'dateTime' | 'children'> & {
  children?: ReactNode
}

export type CardTone = NonNullable<VariantProps<typeof cardTagVariants>['tone']>

export type CardData = {
  tag: string
  tone?: CardTone
  image: string
  imageAlt: string
  title: string
  description: string
  date: string
  dateTime?: string
}

type CardContextValue = {
  data: CardData
}

const CardContext = createContext<CardContextValue | null>(null)

function useCardContext() {
  const context = use(CardContext)

  if (!context) {
    throw new Error('Card compound parts must be used within <Card data={...}>')
  }

  return context
}

type CardRootProps = DivProps & {
  data: CardData
}

function CardRoot({ className, data, children, ...props }: CardRootProps) {
  return (
    <CardContext value={{ data }}>
      <div data-slot="card" className={cn(cardVariants({ tone: data.tone }), className)} {...props}>
        {children}
      </div>
    </CardContext>
  )
}

function CardHeader({ className, children, ...props }: DivProps) {
  return (
    <div data-slot="card-header" className={cn(cardHeaderVariants(), className)} {...props}>
      {children}
    </div>
  )
}

function CardTag({ className, ...props }: BadgeProps) {
  const { data } = useCardContext()

  return (
    <Badge
      data-slot="card-tag"
      className={cn(cardTagVariants({ tone: data.tone }), className)}
      {...props}
    >
      {data.tag}
    </Badge>
  )
}

function CardImage({ className, sizes = '(max-width: 768px) 100vw, 33vw', ...props }: ImageProps) {
  const { data } = useCardContext()

  return (
    <Image
      {...props}
      data-slot="card-image"
      src={data.image}
      alt={data.imageAlt}
      loading="eager"
      fill
      sizes={sizes}
      className={cn(cardImageVariants(), className)}
    />
  )
}

function CardBody({ className, children, ...props }: DivProps) {
  return (
    <div data-slot="card-body" className={cn(cardBodyVariants(), className)} {...props}>
      {children}
    </div>
  )
}

function CardTitle({ className, ...props }: DivProps) {
  const { data } = useCardContext()

  return (
    <div
      data-slot="card-title"
      className={cn(cardTitleVariants({ tone: data.tone }), className)}
      {...props}
    >
      {data.title}
    </div>
  )
}

function CardDescription({ className, ...props }: DivProps) {
  const { data } = useCardContext()

  return (
    <div
      data-slot="card-description"
      className={cn(cardDescriptionVariants(), className)}
      {...props}
    >
      {data.description}
    </div>
  )
}

function CardFooter({ className, children, ...props }: DivProps) {
  return (
    <div data-slot="card-footer" className={cn(cardFooterVariants(), className)} {...props}>
      {children}
    </div>
  )
}

function CardDate({ className, ...props }: TimeProps) {
  const { data } = useCardContext()

  return (
    <time
      data-slot="card-date"
      dateTime={data.dateTime}
      className={cn(cardDateVariants(), className)}
      {...props}
    >
      {data.date}
    </time>
  )
}

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Tag: CardTag,
  Image: CardImage,
  Body: CardBody,
  Title: CardTitle,
  Description: CardDescription,
  Footer: CardFooter,
  Date: CardDate,
})

export type CardProps = CardRootProps
