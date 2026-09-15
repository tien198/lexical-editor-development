import { DEFAULT_SETTINGS, STARTER_BLOCKS } from '../core/-editor-data'
import { EDITOR_TYPOGRAPHY } from '../core/-editor-typography'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'

/** Meaningful HTML is available before the browser editor hydrates. */
export function EditorFallback() {
  return (
    <Card>
      <CardHeader>
        <CardDescription role="status">
          Your writing workspace is loading. Enable JavaScript to edit.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <article className={`${EDITOR_TYPOGRAPHY.content} break-words`}>
          <h2 className={EDITOR_TYPOGRAPHY.title}>{DEFAULT_SETTINGS.title}</h2>
          {STARTER_BLOCKS.map((block, index) =>
            block.type === 'h2' ? (
              <h3 key={index} className={EDITOR_TYPOGRAPHY.heading.h2}>
                {block.text}
              </h3>
            ) : block.type === 'quote' ? (
              <blockquote key={index} className={EDITOR_TYPOGRAPHY.quote}>
                {block.text}
              </blockquote>
            ) : (
              <p key={index} className={EDITOR_TYPOGRAPHY.paragraph}>
                {block.text}
              </p>
            ),
          )}
        </article>
      </CardContent>
    </Card>
  )
}
