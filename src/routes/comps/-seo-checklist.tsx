import { Check, Circle, ListChecks } from 'lucide-react'
import type { DocumentSettings, DocumentSnapshot } from './-editor-data'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

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
    <Card>
      <CardHeader>
        <CardTitle>
          <span className="flex items-center gap-2">
            <ListChecks className="size-4 text-muted-foreground" /> Writing
            checks
          </span>
        </CardTitle>
        <CardAction>
          <Badge variant="secondary">
            {passed}/{checks.length}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress
          value={passed}
          max={checks.length}
          aria-label="Writing checks passed"
        />
        <ul className="space-y-3">
          {checks.map((check) => (
            <li key={check.label} className="flex items-start gap-2">
              {check.pass ? (
                <Check
                  className="mt-0.5 size-4 shrink-0 text-primary"
                  aria-label="Passed"
                />
              ) : (
                <Circle
                  className="mt-0.5 size-4 shrink-0 text-muted-foreground"
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
      </CardContent>
      <CardFooter>
        <CardDescription>
          Helpful editorial guidelines, not a search ranking score. Write for
          your readers first.
        </CardDescription>
      </CardFooter>
    </Card>
  )
}
