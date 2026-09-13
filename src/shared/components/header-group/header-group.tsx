import Link from 'next/link'
import { Badge } from '../badge/badge'
import { Button } from '../button/button'
import { Heading } from '../heading/heading'
import { Text } from '../text/text'
import { ArrowRight } from '../icons/directional/arrow-right'

interface HeaderGroupProps {
  title: string
  description: string
  badge?: {
    text: string
    icon: React.ReactNode
  }
  link?: {
    text: string
    href: string
  }
}

export function HeaderGroup({ title, description, badge, link }: HeaderGroupProps) {
  return (
    <div className="flex items-start lg:items-end justify-between pb-6 flex-col lg:flex-row gap-4 lg:gap-0">
      <div className="flex flex-col gap-2 ">
        {badge && (
          <Badge variant="destructive">
            {badge.icon} {badge.text}
          </Badge>
        )}

        <Heading variant="title.2">{title}</Heading>

        <Text variant="body.3" color="basic-300" className="max-w-2xl">
          {description}
        </Text>
      </div>

      {link && (
        <Button asChild variant="text-link" size="intrinsic">
          <Link href={link.href}>
            {link.text}
            <ArrowRight className="size-5" />
          </Link>
        </Button>
      )}
    </div>
  )
}
