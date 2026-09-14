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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reader preview</DialogTitle>
          <DialogDescription>
            Your article as a standalone web page.
          </DialogDescription>
        </DialogHeader>
        <iframe
          title="Article preview"
          sandbox=""
          srcDoc={html}
          className="h-[60dvh] w-full"
        />
      </DialogContent>
    </Dialog>
  )
}
