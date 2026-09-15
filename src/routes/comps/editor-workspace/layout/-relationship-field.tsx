import { Button } from '@/components/ui/button'
import { ChevronDown, Plus } from 'lucide-react'

/** Relationship fields reproduce the admin layout without a collection API. */
export function RelationshipField({ label }: { label: string }) {
  return (
    <div className={'grid gap-[8px]'}>
      <span id={`label-${label.replaceAll(' ', '-').toLowerCase()}`}>
        {label}
      </span>
      <div
        className={
          'flex h-[40px] min-w-0 rounded-[3px] border border-input bg-[#222] [&_button:last-child]:w-[40px] [&_button:last-child]:border-l [&_button:last-child]:border-input [&_button]:h-[38px] [&_button]:rounded-none [&_button]:opacity-100 [&_svg]:w-[13px]'
        }
        role="group"
        aria-labelledby={`label-${label.replaceAll(' ', '-').toLowerCase()}`}
      >
        <Button
          variant="ghost"
          className={'flex flex-1 min-w-0 justify-between px-[14px]'}
          disabled
        >
          Select a value <ChevronDown />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Add ${label.toLowerCase()}`}
          disabled
        >
          <Plus />
        </Button>
      </div>
    </div>
  )
}
