import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function DocumentPreview({
  html,
  onClose,
}: {
  html: string
  onClose: () => void
}) {
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-4xl">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle>Reader preview</DialogTitle>
          <DialogDescription>
            Your article as a standalone web page.
          </DialogDescription>
        </DialogHeader>
        <iframe
          title="Article preview"
          sandbox=""
          srcDoc={html}
          className="h-[75dvh] w-full border-0 bg-white"
        />
      </DialogContent>
    </Dialog>
  )
}
