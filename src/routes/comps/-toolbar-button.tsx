import type { ComponentProps } from 'react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export function ToolbarButton({
  label,
  active,
  className,
  ...props
}: ComponentProps<typeof Button> & { label: string; active?: boolean }) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label={label}
            aria-pressed={active}
            className={cn(
              active &&
                'bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary',
              className,
            )}
            onMouseDown={(event) => event.preventDefault()}
            {...props}
          />
        }
      />
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
