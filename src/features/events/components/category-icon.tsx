import type { EventCategory } from '@/features/events/constants/categories'
import { Cyclone } from '@/shared/components/icons/nature/cyclone'
import { Droplet } from '@/shared/components/icons/nature/droplet'
import { Flame } from '@/shared/components/icons/nature/flame'
import { Snowflake } from '@/shared/components/icons/nature/snowflake'
import { Volcano } from '@/shared/components/icons/nature/volcano'
import { WarningTriangle } from '@/shared/components/icons/feedback/warning-triangle'

/**
 * El ícono con el que el diseño identifica cada tipo de evento. Las categorías
 * de EONET que no tienen chip propio caen en el triángulo de alerta.
 */
const ICON_BY_CATEGORY = {
  wildfires: Flame,
  floods: Droplet,
  severeStorms: Cyclone,
  volcanoes: Volcano,
  seaLakeIce: Snowflake,
} as const

export function CategoryIcon({
  category,
  className,
}: {
  category: EventCategory
  className?: string
}) {
  const Icon = ICON_BY_CATEGORY[category.id as keyof typeof ICON_BY_CATEGORY] ?? WarningTriangle

  return <Icon aria-hidden="true" className={className} />
}
