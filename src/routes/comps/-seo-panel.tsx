import { Globe2, Search, SlidersHorizontal } from 'lucide-react'
import type { DocumentSettings, DocumentSnapshot } from './-editor-data'
import { isWebUrl, slugify } from './-editor-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SeoChecklist } from './-seo-checklist'

export function SeoPanel({
  settings,
  onChange,
  snapshot,
}: {
  settings: DocumentSettings
  onChange: (settings: DocumentSettings) => void
  snapshot: DocumentSnapshot | null
}) {
  const canonicalValid =
    !settings.canonicalUrl.trim() || isWebUrl(settings.canonicalUrl.trim())
  const previewUrl =
    settings.canonicalUrl.trim() && canonicalValid
      ? settings.canonicalUrl.trim()
      : `example.com / ${slugify(settings.title)}`
  return (
    <aside aria-label="Document settings" className="space-y-5">
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <SlidersHorizontal className="size-4 text-muted-foreground" />{' '}
            Document settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-2">
            <Label htmlFor="focus-keyword">Focus phrase</Label>
            <Input
              id="focus-keyword"
              placeholder="What is your story about?"
              value={settings.keyword}
              onChange={(event) =>
                onChange({ ...settings, keyword: event.target.value })
              }
            />
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              The topic you want this article to be found for.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="meta-description">Search description</Label>
              <span className="text-[10px] tabular-nums text-muted-foreground">
                {settings.description.length}/160
              </span>
            </div>
            <Textarea
              id="meta-description"
              rows={5}
              aria-describedby="description-help"
              className="resize-y text-xs leading-relaxed"
              value={settings.description}
              onChange={(event) =>
                onChange({ ...settings, description: event.target.value })
              }
            />
            <p
              id="description-help"
              className="text-[11px] text-muted-foreground"
            >
              A short invitation to read your story.
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="canonical-url">
              Canonical URL{' '}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>
            <Input
              id="canonical-url"
              type="url"
              placeholder="https://yoursite.com/your-story"
              value={settings.canonicalUrl}
              aria-invalid={!canonicalValid}
              aria-describedby="canonical-help"
              onChange={(event) =>
                onChange({ ...settings, canonicalUrl: event.target.value })
              }
            />
            <p
              id="canonical-help"
              className={`text-[11px] leading-relaxed ${canonicalValid ? 'text-muted-foreground' : 'text-destructive'}`}
            >
              {canonicalValid
                ? 'The final public URL, included in your HTML export.'
                : 'Enter a complete http:// or https:// URL. This value will be omitted from the export.'}
            </p>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Search className="size-4 text-muted-foreground" /> Search preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-3 flex items-center gap-2">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted">
              <Globe2 className="size-3.5 text-muted-foreground" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-medium">Your website</p>
              <p className="truncate text-[10px] text-muted-foreground">
                {previewUrl}
              </p>
            </div>
          </div>
          <p className="mb-1.5 line-clamp-2 text-base leading-snug text-primary">
            {settings.title || 'Untitled document'}
          </p>
          <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
            {settings.description ||
              'Add a search description to give readers a reason to click.'}
          </p>
          <p className="mt-4 border-t pt-3 text-[10px] text-muted-foreground">
            An illustration. Search engines may display different text.
          </p>
        </CardContent>
      </Card>
      <SeoChecklist settings={settings} snapshot={snapshot} />
    </aside>
  )
}
