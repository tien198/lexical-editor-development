import styles from './-rich-text-editor.module.css'
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
import type { DocumentSnapshot } from './-editor-data'
import { isLinkUrl } from './-editor-data'
import {
  $createStarterDocument,
  EDITOR_NODES,
  EDITOR_THEME,
} from './-editor-config'
import { EditorToolbar } from './-editor-toolbar'
import { DocumentPlugin } from './-document-plugin'
import { EDITOR_TYPOGRAPHY } from './-editor-typography'

// Code blocks are not registered; inline code and all other supported shortcuts work.
const TRANSFORMERS = [
  ...ELEMENT_TRANSFORMERS,
  ...TEXT_FORMAT_TRANSFORMERS,
  ...TEXT_MATCH_TRANSFORMERS,
]

export const RichTextEditor = memo(function RichTextEditor({
  initialState,
  onChange,
}: {
  initialState: EditorState | null
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
      <div className={styles.postEditorContent}>
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                aria-label="Article body"
                className={`${EDITOR_TYPOGRAPHY.content} min-h-72 break-words focus-visible:outline-ring`}
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
