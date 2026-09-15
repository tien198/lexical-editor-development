import { useState } from 'react'
import { ChevronDown, Clock3, Plus } from 'lucide-react'
import { useDraft } from './document/-use-draft'
import { RichTextEditor } from './lexical/-rich-text-editor'
import { SeoPanel } from './seo/-seo-panel'
import { DocumentPreview } from './document/-document-preview'
import { buildHtmlDocument } from './document/-document-export'
import { slugify } from './core/-editor-data'
import { StatusBar } from './layout/-status-bar'
import { EditorActions } from './layout/-editor-actions'
import { Button } from '@/components/ui/button'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Kbd } from '@/components/ui/kbd'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

/** Relationship fields reproduce the admin layout without a collection API. */
function RelationshipField({ label }: { label: string }) {
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
      <div
        className={
          'flex min-h-[56px] items-center justify-between gap-[16px] border-b border-border px-[var(--admin-gutter)] py-[10px] max-[699px]:flex-col max-[699px]:items-start max-[699px]:gap-[12px]'
        }
      >
        <StatusBar />
        <EditorActions
          hasSnapshot={!!snapshot}
          onPreview={() => setPreview(true)}
          onExport={exportHtml}
        />
      </div>
      {(error || notice) && (
        <div
          className={
            'grid gap-[8px] border-b border-border px-[var(--admin-gutter)] py-[16px]'
          }
        >
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
        </div>
      )}
      <div
        className={
          'grid min-h-[calc(100dvh-179px)] grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] max-[1023px]:grid-cols-[minmax(0,1fr)_280px] max-[699px]:flex max-[699px]:flex-col'
        }
      >
        <div className={'min-w-0'}>
          <div className="grid gap-[8px] pb-[24px] pl-[var(--admin-gutter)] pr-[40px] pt-[30px] max-[1399px]:pr-[32px] max-[699px]:pr-[var(--admin-gutter)]">
            <Label htmlFor="article-title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="article-title"
              aria-label="Article title"
              value={settings.title}
              placeholder="Untitled document"
              onChange={(event) =>
                setSettings((previous) => ({
                  ...previous,
                  title: event.target.value,
                }))
              }
            />
          </div>
          <Tabs defaultValue="content" className="gap-0">
            <TabsList
              variant="line"
              className="flex h-[57px] w-full justify-start gap-[20px] border-b border-border px-[var(--admin-gutter)] [&_[data-slot=tabs-trigger]]:h-full [&_[data-slot=tabs-trigger]]:flex-none [&_[data-slot=tabs-trigger]]:rounded-none [&_[data-slot=tabs-trigger]]:border-0 [&_[data-slot=tabs-trigger]]:p-0 [&_[data-slot=tabs-trigger]]:text-[16px] [&_[data-slot=tabs-trigger]]:font-semibold [&_[data-slot=tabs-trigger]]:after:bottom-0 [&_[data-slot=tabs-trigger]]:after:h-[2px]"
              aria-label="Post fields"
            >
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="meta">Meta</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>
            {/* Keep Lexical mounted so switching tabs preserves selection and undo history. */}
            <TabsContent
              value="content"
              keepMounted
              className="px-[var(--admin-gutter)] pb-[40px] pt-[22px] text-[13px] max-[699px]:pb-[28px] [&_[data-slot=card]]:overflow-visible [&_[data-slot=card]]:rounded-none [&_[data-slot=card]]:border-b [&_[data-slot=card]]:border-border [&_[data-slot=card]]:pb-[26px] [&_[data-slot=card]]:shadow-none [&_[data-slot=card]]:[--card-spacing:0px] [&_[data-slot=card-content]]:rounded-none [&_[data-slot=card-content]_.text-sm]:text-[13px] [&_[data-slot=card-description]]:text-[13px] [&_[data-slot=card-footer]]:rounded-none [&_[data-slot=card-footer]]:bg-transparent [&_[data-slot=card-footer]]:pt-[12px] [&_[data-slot=card-header]]:rounded-none [&_[data-slot=card-title]]:text-[14px]"
            >
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
              <section aria-label="Article editor">
                <RichTextEditor
                  initialState={initialState}
                  onChange={setSnapshot}
                />
                <div
                  className={
                    'mt-[16px] flex flex-wrap justify-between gap-[8px] border-t border-border py-[14px] text-[12px] text-muted-foreground [&>span:last-child]:flex [&>span:last-child]:items-center [&>span:last-child]:gap-[6px]'
                  }
                >
                  <span>
                    {words.toLocaleString()} words /{' '}
                    {snapshot?.text.length.toLocaleString() ?? 0} characters
                  </span>
                  <span>
                    <Clock3 className="size-3" />
                    {words ? Math.ceil(words / 200) : 0} min read
                  </span>
                </div>
              </section>
              <p
                className={
                  'mt-[12px] text-[12px] leading-[1.8] text-muted-foreground'
                }
              >
                Type <Kbd>##</Kbd> then space for a heading, or <Kbd>-</Kbd>{' '}
                then space for a list.
              </p>
              {snapshot && snapshot.headings.length > 0 && (
                <section
                  aria-label="Document outline"
                  className={
                    'mt-[26px] text-[13px] [&_h2]:mb-[12px] [&_h2]:font-semibold'
                  }
                >
                  <h2>In this document</h2>
                  <ol className="list-inside list-decimal space-y-2 text-muted-foreground">
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
            </TabsContent>
            <TabsContent
              value="meta"
              keepMounted
              className={`${'px-[var(--admin-gutter)] pb-[40px] pt-[22px] text-[13px] max-[699px]:pb-[28px] [&_[data-slot=card]]:overflow-visible [&_[data-slot=card]]:rounded-none [&_[data-slot=card]]:border-b [&_[data-slot=card]]:border-border [&_[data-slot=card]]:pb-[26px] [&_[data-slot=card]]:shadow-none [&_[data-slot=card]]:[--card-spacing:0px] [&_[data-slot=card-content]]:rounded-none [&_[data-slot=card-content]_:global(.text-sm)]:text-[13px] [&_[data-slot=card-description]]:text-[13px] [&_[data-slot=card-footer]]:rounded-none [&_[data-slot=card-footer]]:bg-transparent [&_[data-slot=card-footer]]:pt-[12px] [&_[data-slot=card-header]]:rounded-none [&_[data-slot=card-title]]:text-[14px]'} space-y-6`}
            >
              <RelationshipField label="Related Posts" />
              <RelationshipField label="Categories" />
            </TabsContent>
            <TabsContent
              value="seo"
              keepMounted
              className={
                'px-[var(--admin-gutter)] pb-[40px] pt-[22px] text-[13px] max-[699px]:pb-[28px] [&_[data-slot=card]]:overflow-visible [&_[data-slot=card]]:rounded-none [&_[data-slot=card]]:border-b [&_[data-slot=card]]:border-border [&_[data-slot=card]]:pb-[26px] [&_[data-slot=card]]:shadow-none [&_[data-slot=card]]:[--card-spacing:0px] [&_[data-slot=card-content]]:rounded-none [&_[data-slot=card-content]_:global(.text-sm)]:text-[13px] [&_[data-slot=card-description]]:text-[13px] [&_[data-slot=card-footer]]:rounded-none [&_[data-slot=card-footer]]:bg-transparent [&_[data-slot=card-footer]]:pt-[12px] [&_[data-slot=card-header]]:rounded-none [&_[data-slot=card-title]]:text-[14px]'
              }
            >
              <SeoPanel
                settings={settings}
                onChange={setSettings}
                snapshot={snapshot}
              />
            </TabsContent>
          </Tabs>
        </div>
        <aside
          aria-label="Post metadata"
          className={
            'flex flex-col gap-[22px] border-l border-border pb-[40px] pl-[40px] pr-[var(--admin-gutter)] pt-[30px] max-[1399px]:pl-[28px] max-[699px]:border-l-0 max-[699px]:border-t max-[699px]:px-[var(--admin-gutter)] max-[699px]:py-[24px]'
          }
        >
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
              <span
                className={
                  'absolute right-[12px] top-[12px] text-[12px] text-muted-foreground'
                }
              >
                Auto
              </span>
            </div>
          </div>
        </aside>
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
