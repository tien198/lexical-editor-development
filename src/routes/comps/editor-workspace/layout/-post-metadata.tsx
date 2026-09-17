import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { RelationshipField } from './-relationship-field'
import { slugify } from '../core/-editor-data'
import type { DocumentSettings, DocumentSnapshot } from '../core/-editor-data'
import { DocumentPreview } from '../document/-document-preview'
import { buildHtmlDocument } from '../document/-document-export'

export function PostMetadata({
  settings,
  preview,
  snapshot,
}: {
  settings: DocumentSettings
  preview: boolean
  snapshot: DocumentSnapshot | null
}) {
  const [previewWidth, setPreviewWidth] = useState<number | string>('100%')

  return (
    <aside
      aria-label="Post metadata"
      className={
        preview && snapshot
          ? 'flex flex-col border-l border-border max-[699px]:border-l-0 max-[699px]:border-t'
          : 'flex flex-col gap-[22px] border-l border-border pb-[40px] pl-[40px] pr-[var(--admin-gutter)] pt-[30px] max-[1399px]:pl-[28px] max-[699px]:border-l-0 max-[699px]:border-t max-[699px]:px-[var(--admin-gutter)] max-[699px]:py-[24px]'
      }
      style={{
        width:
          preview && snapshot
            ? previewWidth !== '100%'
              ? `${previewWidth}px`
              : '100%'
            : undefined,
        minWidth:
          preview && snapshot && previewWidth === '100%' ? '400px' : undefined,
      }}
    >
      {preview && snapshot ? (
        <DocumentPreview
          html={buildHtmlDocument(settings, snapshot.html)}
          onWidthChange={setPreviewWidth}
        />
      ) : (
        <>
          <div className={'grid gap-[8px]'}>
            <Label htmlFor="published-at">Published At</Label>
            <Input id="published-at" type="datetime-local" />
          </div>
          <RelationshipField label="Authors" />
          <div className={'grid gap-[8px]'}>
            <Label htmlFor="post-slug">Slug</Label>
            <div
              className={
                'relative [&_[data-slot=input]]:bg-[#2c2c2c] [&_[data-slot=input]]:pr-[52px] [&_[data-slot=input]]:text-[#aaa] [&_[data-slot=input]]:text-ellipsis'
              }
            >
              <Input id="post-slug" value={slugify(settings.title)} readOnly />
              <button
                className={
                  'absolute right-[12px] top-[12px] text-[12px] text-muted-foreground hover:cursor-pointer hover:text-primary'
                }
                onClick={() => {}}
              >
                Auto
              </button>
            </div>
          </div>
        </>
      )}
    </aside>
  )
}
