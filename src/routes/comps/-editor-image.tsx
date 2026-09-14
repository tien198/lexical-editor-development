import { useEffect, useState } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection'
import { mergeRegister } from '@lexical/utils'
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  COMMAND_PRIORITY_LOW,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
} from 'lexical'
import type { NodeKey } from 'lexical'
import { ImageOff, Pencil, Trash2 } from 'lucide-react'
import type { ImagePayload } from './-editor-data'
import { $isImageNode } from './-image-node'
import { ImageDialog } from './-image-dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function EditorImage({
  nodeKey,
  image,
}: {
  nodeKey: NodeKey
  image: ImagePayload
}) {
  const [editor] = useLexicalComposerContext()
  const [selected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey)
  const [editing, setEditing] = useState(false)
  const [failedSrc, setFailedSrc] = useState<string | null>(null)

  useEffect(() => {
    const removeSelected = (event: KeyboardEvent) => {
      if (!selected || !$isNodeSelection($getSelection())) return false
      event.preventDefault()
      $getNodeByKey(nodeKey)?.remove()
      return true
    }
    return mergeRegister(
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        removeSelected,
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        removeSelected,
        COMMAND_PRIORITY_LOW,
      ),
    )
  }, [editor, nodeKey, selected])

  return (
    <figure
      className={cn(
        'group/image relative overflow-hidden rounded-xl border bg-muted/30',
        selected && 'ring-2 ring-primary',
      )}
    >
      <Button
        type="button"
        variant="ghost"
        className="h-auto w-full rounded-none p-0 hover:bg-transparent"
        aria-label={`Select image: ${image.alt || 'Image without alt text'}`}
        aria-pressed={selected}
        onClick={() => {
          clearSelection()
          setSelected(!selected)
        }}
      >
        {failedSrc === image.src || !image.src ? (
          <span className="flex min-h-40 items-center justify-center gap-2 p-6 text-muted-foreground">
            <ImageOff /> Image unavailable — edit the URL
          </span>
        ) : (
          <img
            src={image.src}
            alt={image.alt}
            loading="lazy"
            decoding="async"
            className="max-h-96 w-full object-contain"
            onError={() => setFailedSrc(image.src)}
          />
        )}
      </Button>
      <div className="absolute top-2 right-2 flex gap-1 rounded-lg border bg-background p-1 shadow-sm">
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          aria-label="Edit image"
          onClick={() => setEditing(true)}
        >
          <Pencil />
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          aria-label="Delete image"
          onClick={() =>
            editor.update(() => {
              $getNodeByKey(nodeKey)?.remove()
            })
          }
        >
          <Trash2 />
        </Button>
      </div>
      {image.caption && (
        <figcaption className="px-4 py-3 text-center text-sm text-muted-foreground">
          {image.caption}
        </figcaption>
      )}
      {editing && (
        <ImageDialog
          initial={image}
          onClose={() => setEditing(false)}
          onSubmit={(value) =>
            editor.update(() => {
              const node = $getNodeByKey(nodeKey)
              if ($isImageNode(node)) node.setImage(value)
            })
          }
        />
      )}
    </figure>
  )
}
