import { Check, Circle, ListChecks } from 'lucide-react'
import type { DocumentSettings, DocumentSnapshot } from './-editor-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function SeoChecklist({
  settings,
  snapshot,
}: {
  settings: DocumentSettings
  snapshot: DocumentSnapshot | null
}) {
  const keyword = settings.keyword.trim().toLocaleLowerCase()
  const checks = [
    {
      label: 'A descriptive title (30–60 characters)',
      pass:
        settings.title.trim().length >= 30 &&
        settings.title.trim().length <= 60,
    },
    {
      label: 'A summary (120–160 characters)',
      pass:
        settings.description.trim().length >= 120 &&
        settings.description.trim().length <= 160,
    },
    {
      label: 'Headings that organize your story',
      pass: !!snapshot?.headings.length,
    },
    {
      label: 'Descriptive alt text for every image',
      pass: !!snapshot && snapshot.images.every((image) => image.alt.trim()),
    },
    {
      label: 'Focus phrase in the title and body',
      pass:
        !!keyword &&
        settings.title.toLocaleLowerCase().includes(keyword) &&
        !!snapshot?.text.toLocaleLowerCase().includes(keyword),
    },
  ]
  const passed = checks.filter((check) => check.pass).length
  return (
    <Card className="shadow-none">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-sm">
          <ListChecks className="size-4 text-muted-foreground" /> Writing checks
        </CardTitle>
        <span className="text-xs text-muted-foreground">
          {passed}/{checks.length}
        </span>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-1" aria-hidden="true">
          {checks.map((check) => (
            <span
              key={check.label}
              className={`h-1 flex-1 rounded-full ${check.pass ? 'bg-primary/75' : 'bg-muted'}`}
            />
          ))}
        </div>
        <ul className="space-y-3">
          {checks.map((check) => (
            <li
              key={check.label}
              className="flex items-start gap-2 text-xs leading-relaxed"
            >
              {check.pass ? (
                <Check
                  className="mt-0.5 size-3.5 shrink-0 text-primary"
                  aria-label="Passed"
                />
              ) : (
                <Circle
                  className="mt-0.5 size-3.5 shrink-0 text-muted-foreground"
                  aria-label="To improve"
                />
              )}
              <span
                className={
                  check.pass ? 'text-foreground' : 'text-muted-foreground'
                }
              >
                {check.label}
              </span>
            </li>
          ))}
        </ul>
        <p className="border-t pt-3 text-[11px] leading-relaxed text-muted-foreground">
          Helpful editorial guidelines, not a search ranking score. Write for
          your readers first.
        </p>
      </CardContent>
    </Card>
  )
}
