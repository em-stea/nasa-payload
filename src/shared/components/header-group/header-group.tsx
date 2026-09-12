import { Badge } from '../badge/badge'
import { Heading } from '../heading/heading'
import { Text } from '../text/text'

interface HeaderGroupProps {
  title: string
  description: string
  badge?: {
    text: string
    icon: React.ReactNode
  }
}

export function HeaderGroup({ title, description, badge }: HeaderGroupProps) {
  return (
    <div className="flex flex-col gap-4">
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
  )
}
