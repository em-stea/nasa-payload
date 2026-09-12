'use client'

import Image from 'next/image'
import { createContext, use } from 'react'
import type { ComponentProps, ReactNode } from 'react'
import type { VariantProps } from 'class-variance-authority'

import { Badge } from '@/shared/components/badge/badge'
import {
  cardAlertDotVariants,
  cardBodyVariants,
  cardDateVariants,
  cardDescriptionVariants,
  cardFooterVariants,
  cardHeaderVariants,
  cardImageVariants,
  cardStatLabelVariants,
  cardStatValueVariants,
  cardStatVariants,
  cardTagVariants,
  cardTitleVariants,
  cardVariants,
} from '@/shared/styles/components/card'
import { cn } from '@/shared/utils/className-builder'

type DivProps = Omit<ComponentProps<'div'>, 'children'> & { children?: ReactNode }
type BadgeProps = Omit<ComponentProps<typeof Badge>, 'children' | 'variant'>
type ImageProps = Omit<ComponentProps<typeof Image>, 'src' | 'alt' | 'fill'>
type TimeProps = Omit<ComponentProps<'time'>, 'dateTime' | 'children'> & {
  children?: ReactNode
}

export type CardTone = NonNullable<VariantProps<typeof cardVariants>['tone']>

export type CardStatData = {
  label: string
  value: string
  highlight?: boolean
}

export type CardData = {
  tag?: string
  tone?: CardTone
  image?: string
  imageAlt?: string
  title: string
  description?: string
  date?: string
  dateTime?: string
  alert?: string
  stats?: CardStatData[]
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

type CardRootProps = DivProps &
  Omit<VariantProps<typeof cardVariants>, 'tone'> & {
    data: CardData
  }

function CardRoot({ className, data, padding, children, ...props }: CardRootProps) {
  return (
    <CardContext value={{ data }}>
      <div
        data-slot="card"
        className={cn(cardVariants({ tone: data.tone, padding }), className)}
        {...props}
      >
        {children}
      </div>
    </CardContext>
  )
}

type CardHeaderProps = DivProps & VariantProps<typeof cardHeaderVariants>

function CardHeader({ className, variant, children, ...props }: CardHeaderProps) {
  return (
    <div
      data-slot="card-header"
      className={cn(cardHeaderVariants({ variant }), className)}
      {...props}
    >
      {children}
    </div>
  )
}

function CardTag({ className, ...props }: BadgeProps) {
  const { data } = useCardContext()

  if (!data.tag) {
    return null
  }

  return (
    <Badge
      data-slot="card-tag"
      variant={data.tone ?? 'blue'}
      className={cn(cardTagVariants(), className)}
      {...props}
    >
      {data.tag}
    </Badge>
  )
}

function CardImage({ className, sizes = '(max-width: 768px) 100vw, 33vw', ...props }: ImageProps) {
  const { data } = useCardContext()

  if (!data.image) {
    return null
  }

  return (
    <Image
      {...props}
      data-slot="card-image"
      src={data.image}
      alt={data.imageAlt ?? ''}
      loading="eager"
      fill
      sizes={sizes}
      className={cn(cardImageVariants(), className)}
    />
  )
}

type CardBodyProps = DivProps & VariantProps<typeof cardBodyVariants>

function CardBody({ className, variant, children, ...props }: CardBodyProps) {
  return (
    <div data-slot="card-body" className={cn(cardBodyVariants({ variant }), className)} {...props}>
      {children}
    </div>
  )
}

type CardTitleProps = DivProps & Omit<VariantProps<typeof cardTitleVariants>, 'tone'>

function CardTitle({ className, size, ...props }: CardTitleProps) {
  const { data } = useCardContext()

  return (
    <div
      data-slot="card-title"
      className={cn(cardTitleVariants({ tone: data.tone, size }), className)}
      {...props}
    >
      {data.title}
    </div>
  )
}

function CardDescription({ className, ...props }: DivProps) {
  const { data } = useCardContext()

  if (!data.description) {
    return null
  }

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

type CardFooterProps = DivProps & VariantProps<typeof cardFooterVariants>

function CardFooter({ className, variant, children, ...props }: CardFooterProps) {
  return (
    <div
      data-slot="card-footer"
      className={cn(cardFooterVariants({ variant }), className)}
      {...props}
    >
      {children}
    </div>
  )
}

function CardDate({ className, ...props }: TimeProps) {
  const { data } = useCardContext()

  if (!data.date) {
    return null
  }

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

type CardStatProps = DivProps &
  VariantProps<typeof cardStatVariants> &
  Omit<VariantProps<typeof cardStatValueVariants>, 'tone'> & {
    index: number
  }

function CardStat({ className, index, layout, size, ...props }: CardStatProps) {
  const { data } = useCardContext()
  const stat = data.stats?.[index]

  if (!stat) {
    return null
  }

  return (
    <div data-slot="card-stat" className={cn(cardStatVariants({ layout }), className)} {...props}>
      <span data-slot="card-stat-label" className={cardStatLabelVariants()}>
        {stat.label}
      </span>
      <span
        data-slot="card-stat-value"
        className={cardStatValueVariants({
          size,
          tone: stat.highlight ? 'highlight' : 'default',
        })}
      >
        {stat.value}
      </span>
    </div>
  )
}

function CardAlert({ className, ...props }: BadgeProps) {
  const { data } = useCardContext()

  if (!data.alert) {
    return null
  }

  return (
    <Badge data-slot="card-alert" variant="alert" className={className} {...props}>
      <span data-slot="card-alert-dot" className={cardAlertDotVariants()} />
      {data.alert}
    </Badge>
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
  Stat: CardStat,
  Alert: CardAlert,
})

export type CardProps = CardRootProps
