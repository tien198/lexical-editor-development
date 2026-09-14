import { DEFAULT_SETTINGS, STARTER_BLOCKS } from './-editor-data'

/** Meaningful HTML is available before the browser editor hydrates. */
export function EditorFallback() {
  return (
    <div className="rounded-xl border bg-card px-6 py-10 sm:px-12 lg:max-w-[calc(100%-334px)]">
      <p role="status" className="mb-8 text-xs text-muted-foreground">
        Your writing workspace is loading. Enable JavaScript to edit.
      </p>
      <article className="editor-content">
        <h2 className="article-title mb-8">{DEFAULT_SETTINGS.title}</h2>
        {STARTER_BLOCKS.map((block, index) =>
          block.type === 'h2' ? (
            <h3 key={index} className="editor-h2">
              {block.text}
            </h3>
          ) : block.type === 'quote' ? (
            <blockquote key={index} className="editor-quote">
              {block.text}
            </blockquote>
          ) : (
            <p key={index} className="editor-paragraph">
              {block.text}
            </p>
          ),
        )}
      </article>
    </div>
  )
}
