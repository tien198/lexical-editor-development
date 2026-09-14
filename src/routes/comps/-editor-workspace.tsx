import { useCallback, useState } from 'react'
import {
  Check,
  Clock3,
  Download,
  Eye,
  FileText,
  HardDrive,
  LoaderCircle,
} from 'lucide-react'
import { useDraft } from './-use-draft'
import { RichTextEditor } from './-rich-text-editor'
import { SeoPanel } from './-seo-panel'
import { DocumentPreview } from './-document-preview'
import { buildHtmlDocument } from './-document-export'
import { slugify } from './-editor-data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TooltipProvider } from '@/components/ui/tooltip'

export default function EditorWorkspace() {
  const {
    settings,
    setSettings,
    snapshot,
    setSnapshot,
    initialState,
    status,
    error,
  } = useDraft()
  const [preview, setPreview] = useState(false)
  const [notice, setNotice] = useState('')
  const changeTitle = useCallback(
    (title: string) => setSettings((previous) => ({ ...previous, title })),
    [setSettings],
  )
  const words = snapshot?.words ?? 0

  function exportHtml() {
    if (!snapshot) return
    const html = buildHtmlDocument(settings, snapshot.html)
    const url = URL.createObjectURL(
      new Blob([html], { type: 'text/html;charset=utf-8' }),
    )
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${slugify(settings.title)}.html`
    document.body.append(anchor)
    anchor.click()
    anchor.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    setNotice('HTML exported with your article and search metadata.')
  }

  return (
    <TooltipProvider delay={350}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-lg border bg-card">
            <FileText className="size-4 text-muted-foreground" />
          </span>
          <div>
            <p className="text-sm font-medium">
              Your document{' '}
              <Badge
                variant="secondary"
                className="ml-2 align-middle text-[10px] font-normal"
              >
                Draft
              </Badge>
            </p>
            <p
              role="status"
              className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground"
            >
              {status === 'Saving…' ? (
                <LoaderCircle className="size-3 animate-spin" />
              ) : status === 'Saved on this device' ? (
                <Check className="size-3" />
              ) : (
                <HardDrive className="size-3" />
              )}
              {status}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="lg"
            disabled={!snapshot}
            onClick={() => setPreview(true)}
          >
            <Eye /> Preview
          </Button>
          <Button size="lg" disabled={!snapshot} onClick={exportHtml}>
            <Download /> Export HTML
          </Button>
        </div>
      </div>
      {error && (
        <p
          role="alert"
          className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
        >
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="mb-4 text-sm text-muted-foreground">
          {notice}
        </p>
      )}
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_310px]">
        <div className="min-w-0">
          <section
            aria-label="Article editor"
            className="overflow-hidden rounded-xl border bg-card shadow-xs"
          >
            <RichTextEditor
              initialState={initialState}
              settings={settings}
              onTitleChange={changeTitle}
              onChange={setSnapshot}
            />
            <footer className="flex flex-wrap items-center justify-between gap-3 border-t px-6 py-3 text-[11px] text-muted-foreground">
              <span>
                {words.toLocaleString()} words{' '}
                <span className="mx-2 opacity-40">/</span>{' '}
                {snapshot?.text.length.toLocaleString() ?? 0} characters
              </span>
              <span className="flex items-center gap-1.5">
                <Clock3 className="size-3" />
                {words ? Math.ceil(words / 200) : 0} min read
              </span>
            </footer>
          </section>
          <p className="mt-4 text-center text-[11px] leading-relaxed text-muted-foreground">
            A little shortcut: type{' '}
            <kbd className="rounded border bg-card px-1">##</kbd> then space for
            a heading, or <kbd className="rounded border bg-card px-1">-</kbd>{' '}
            then space for a list.
          </p>
          {snapshot && snapshot.headings.length > 0 && (
            <section aria-label="Document outline" className="mt-8 px-2">
              <h2 className="mb-3 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                In this document
              </h2>
              <ol className="space-y-2 border-l pl-4 text-xs text-muted-foreground">
                {snapshot.headings.map((heading) => (
                  <li
                    key={heading.key}
                    className={heading.level > 2 ? 'ml-3' : ''}
                  >
                    {heading.text || 'Untitled heading'}
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>
        <SeoPanel
          settings={settings}
          onChange={setSettings}
          snapshot={snapshot}
        />
      </div>
      {preview && snapshot && (
        <DocumentPreview
          html={buildHtmlDocument(settings, snapshot.html)}
          onClose={() => setPreview(false)}
        />
      )}
    </TooltipProvider>
  )
}
