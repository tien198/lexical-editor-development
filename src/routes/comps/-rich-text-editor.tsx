import { memo } from 'react'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'
import {
  ELEMENT_TRANSFORMERS,
  TEXT_FORMAT_TRANSFORMERS,
  TEXT_MATCH_TRANSFORMERS,
} from '@lexical/markdown'
import type { EditorState } from 'lexical'
import type { DocumentSettings, DocumentSnapshot } from './-editor-data'
import { isLinkUrl } from './-editor-data'
import {
  $createStarterDocument,
  EDITOR_NODES,
  EDITOR_THEME,
} from './-editor-config'
import { EditorToolbar } from './-editor-toolbar'
import { DocumentPlugin } from './-document-plugin'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

// Code blocks are not registered; inline code and all other supported shortcuts work.
const TRANSFORMERS = [
  ...ELEMENT_TRANSFORMERS,
  ...TEXT_FORMAT_TRANSFORMERS,
  ...TEXT_MATCH_TRANSFORMERS,
]

export const RichTextEditor = memo(function RichTextEditor({
  initialState,
  settings,
  onTitleChange,
  onChange,
}: {
  initialState: EditorState | null
  settings: DocumentSettings
  onTitleChange: (title: string) => void
  onChange: (snapshot: DocumentSnapshot) => void
}) {
  return (
    <LexicalComposer
      initialConfig={{
        namespace: 'DraftEditor',
        nodes: EDITOR_NODES,
        theme: EDITOR_THEME,
        editorState: initialState ?? $createStarterDocument,
        onError: (error) => {
          throw error
        },
      }}
    >
      <EditorToolbar />
      <div className="relative px-6 pt-10 pb-12 sm:px-12 lg:px-16">
        <Label
          htmlFor="article-title"
          className="mb-4 text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase"
        >
          Your story starts here
        </Label>
        <Textarea
          id="article-title"
          aria-label="Article title"
          value={settings.title}
          placeholder="Untitled document"
          rows={1}
          onChange={(event) =>
            onTitleChange(event.target.value.replace(/\n/g, ' '))
          }
          className="article-title mb-7 min-h-0 resize-none rounded-none border-0 bg-transparent p-0 shadow-none ring-0! md:text-[2.65rem]"
        />
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                aria-label="Article body"
                className="editor-content min-h-72 outline-none"
              />
            }
            placeholder={
              <p className="pointer-events-none absolute top-0 left-0 text-muted-foreground">
                Start writing your story…
              </p>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
      </div>
      <HistoryPlugin />
      <ListPlugin />
      <LinkPlugin validateUrl={isLinkUrl} />
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      <DocumentPlugin onChange={onChange} />
    </LexicalComposer>
  )
})
