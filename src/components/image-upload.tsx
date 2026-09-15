import { Button } from '@/components/ui/button'

export function ImageUpload() {
  return (
    <div className="grid gap-[8px] mb-[26px]">
      <span id="hero-image-label">Hero Image</span>
      <div
        className={
          'flex min-h-[62px] flex-wrap items-center gap-[10px] border border-dotted border-[#666] px-[18px] py-[16px] max-[699px]:gap-[8px] max-[699px]:px-[12px] [&_button:disabled]:opacity-100 [&_button]:h-[24px] [&_button]:bg-[#363636] [&_button]:px-[9px]'
        }
        role="group"
        aria-labelledby="hero-image-label"
      >
        <Button variant="secondary" size="xs" disabled>
          Create New
        </Button>
        <span className="text-muted-foreground">or</span>
        <Button variant="secondary" size="xs" disabled>
          Choose from existing
        </Button>
        <span
          className={
            'ml-auto text-muted-foreground max-[1023px]:ml-0 max-[1023px]:w-full'
          }
        >
          or drag and drop a file
        </span>
      </div>
    </div>
  )
}
