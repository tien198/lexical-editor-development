import { EDITOR_TYPOGRAPHY } from '../core/-editor-typography'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

/** Loading skeleton shown before the browser editor hydrates. */
export function EditorFallback() {
  return (
    <Card>
      <CardHeader>
        <CardDescription role="status">
          Your writing workspace is loading. Enable JavaScript to edit.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <article className={`${EDITOR_TYPOGRAPHY.content} space-y-6`}>
          {/* Title Skeleton */}
          <Skeleton className="h-12 w-3/4" />

          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          <Skeleton className="h-8 w-1/2 mt-8" />

          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>

          <Skeleton className="h-24 w-full" />

          <Skeleton className="h-8 w-1/3 mt-8" />

          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </article>
      </CardContent>
    </Card>
  )
}
