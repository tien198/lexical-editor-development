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
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardFooter } from '@/components/ui/card'
import { Kbd } from '@/components/ui/kbd'

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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <FileText className="size-4 text-muted-foreground" />
          <div>
            <p className="flex items-center gap-2 text-sm font-medium">
              Your document <Badge variant="secondary">Draft</Badge>
            </p>
            <p
              role="status"
              className="mt-1 flex items-center gap-2 text-sm text-muted-foreground"
            >
              {status === 'Saving…' ? (
                <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" />
              ) : status === 'Saved on this device' ? (
                <Check className="size-4" />
              ) : (
                <HardDrive className="size-4" />
              )}
              {status}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            disabled={!snapshot}
            onClick={() => setPreview(true)}
          >
            <Eye /> Preview
          </Button>
          <Button disabled={!snapshot} onClick={exportHtml}>
            <Download /> Export HTML
          </Button>
        </div>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {notice && (
        <Alert role="status">
          <AlertDescription>{notice}</AlertDescription>
        </Alert>
      )}
      <div className="grid items-start gap-6 lg:grid-cols-3">
        <div className="min-w-0 space-y-6 lg:col-span-2">
          <Card role="region" aria-label="Article editor">
            <RichTextEditor
              initialState={initialState}
              settings={settings}
              onTitleChange={changeTitle}
              onChange={setSnapshot}
            />
            <CardFooter className="flex-wrap justify-between gap-3">
              <span>
                {words.toLocaleString()} words /{' '}
                {snapshot?.text.length.toLocaleString() ?? 0} characters
              </span>
              <span className="flex items-center gap-2">
                <Clock3 className="size-4" />
                {words ? Math.ceil(words / 200) : 0} min read
              </span>
            </CardFooter>
          </Card>
          <p className="text-sm text-muted-foreground">
            A little shortcut: type <Kbd>##</Kbd> then space for a heading, or{' '}
            <Kbd>-</Kbd> then space for a list.
          </p>
          {snapshot && snapshot.headings.length > 0 && (
            <section aria-label="Document outline" className="space-y-2">
              <h2 className="text-sm font-medium">In this document</h2>
              <ol className="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
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
