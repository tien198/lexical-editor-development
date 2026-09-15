import styles from './-editor-workspace.module.css'
import { useState } from 'react'
import {
  Check,
  ChevronDown,
  Clock3,
  Download,
  Eye,
  LoaderCircle,
  Plus,
} from 'lucide-react'
import { useDraft } from './-use-draft'
import { RichTextEditor } from './-rich-text-editor'
import { SeoPanel } from './-seo-panel'
import { DocumentPreview } from './-document-preview'
import { buildHtmlDocument } from './-document-export'
import { slugify } from './-editor-data'
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
    <div className={styles.postField}>
      <span id={`label-${label.replaceAll(' ', '-').toLowerCase()}`}>
        {label}
      </span>
      <div
        className={styles.postRelationship}
        role="group"
        aria-labelledby={`label-${label.replaceAll(' ', '-').toLowerCase()}`}
      >
        <Button
          variant="ghost"
          className={styles.postRelationshipSelect}
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
      <div className={styles.postActionBar}>
        <div className={styles.postStatusDetails}>
          <span>
            <span className="text-muted-foreground">Status: </span>
            <strong>Draft</strong>
          </span>
          <span role="status" className={styles.postSaveStatus}>
            {status === 'Saving…' ? (
              <LoaderCircle className="size-3 animate-spin motion-reduce:animate-none" />
            ) : status === 'Saved on this device' ? (
              <Check className="size-3" />
            ) : null}
            {status}
          </span>
          <span className={styles.postReadingTime}>
            <Clock3 className="size-3" />
            {words ? Math.ceil(words / 200) : 0} min read
          </span>
        </div>
        <div className={styles.postActions}>
          <Button
            variant="ghost"
            disabled={!snapshot}
            onClick={() => setPreview(true)}
          >
            <Eye />
            Preview
          </Button>
          <Button disabled={!snapshot} onClick={exportHtml}>
            <Download />
            Export HTML
          </Button>
        </div>
      </div>
      {(error || notice) && (
        <div className={styles.postNotices}>
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
      <div className={styles.postLayout}>
        <div className={styles.postFields}>
          <div className={`${styles.postTitleField} ${styles.postField}`}>
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
          <Tabs defaultValue="content" className={styles.postTabs}>
            <TabsList
              variant="line"
              className={styles.postTabList}
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
              className={styles.postPanel}
            >
              <div className={`${styles.postField} ${styles.postHeroField}`}>
                <span id="hero-image-label">Hero Image</span>
                <div
                  className={styles.postUpload}
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
                  <span className={styles.postUploadHint}>
                    or drag and drop a file
                  </span>
                </div>
              </div>
              <section aria-label="Article editor">
                <RichTextEditor
                  initialState={initialState}
                  onChange={setSnapshot}
                />
                <div className={styles.postEditorFooter}>
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
              <p className={styles.postShortcuts}>
                Type <Kbd>##</Kbd> then space for a heading, or <Kbd>-</Kbd>{' '}
                then space for a list.
              </p>
              {snapshot && snapshot.headings.length > 0 && (
                <section
                  aria-label="Document outline"
                  className={styles.postOutline}
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
              className={`${styles.postPanel} space-y-6`}
            >
              <RelationshipField label="Related Posts" />
              <RelationshipField label="Categories" />
            </TabsContent>
            <TabsContent value="seo" keepMounted className={styles.postPanel}>
              <SeoPanel
                settings={settings}
                onChange={setSettings}
                snapshot={snapshot}
              />
            </TabsContent>
          </Tabs>
        </div>
        <aside aria-label="Post metadata" className={styles.postMetadata}>
          <div className={styles.postField}>
            <Label htmlFor="published-at">Published At</Label>
            <Input id="published-at" type="datetime-local" />
          </div>
          <RelationshipField label="Authors" />
          <div className={styles.postField}>
            <Label htmlFor="post-slug">Slug</Label>
            <div className={styles.postSlugField}>
              <Input id="post-slug" value={slugify(settings.title)} readOnly />
              <span className={styles.postSlugLabel}>Auto</span>
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
