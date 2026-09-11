import { Button } from '../button/button'
import { ChevronLeft } from '../icons/directional/chevron-left'
import { ChevronRight } from '../icons/directional/chevron-right'
import { Text } from '../text/text'

export const Pagination = () => {
  return (
    <div className="flex items-center justify-between gap-2  py-2">
      <Text variant="body.2" className="text-1">
        Page 01 / 45
      </Text>
      <div className="flex items-center gap-1">
        <Button variant="secondary" size="sm">
          <ChevronLeft className="text-muted-foreground" />
        </Button>
        <Button variant="secondary" size="sm">
          <Text variant="body.2" className="text-muted-foreground font-normal">
            01
          </Text>
        </Button>
        <Button variant="secondary" size="sm">
          <Text variant="body.2" className="text-muted-foreground font-normal">
            02
          </Text>
        </Button>
        <Button variant="secondary" size="sm" className="gap-1 align-items-end pt-1">
          <div className="size-0.5 rounded-full bg-muted-foreground" />
          <div className="size-0.5 rounded-full bg-muted-foreground" />
          <div className="size-0.5 rounded-full bg-muted-foreground" />
        </Button>

        <Button variant="secondary" size="sm">
          <ChevronRight className="text-muted-foreground" />
        </Button>
      </div>
    </div>
  )
}
