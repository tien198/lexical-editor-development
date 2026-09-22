import { useEffect, useRef, useState } from 'react'
import { createEditor } from 'lexical'
import type { EditorState } from 'lexical'
import { EDITOR_NODES } from '../core/-editor-config'
import { DEFAULT_SETTINGS } from '../core/-editor-data'
import type { DocumentSettings, DocumentSnapshot } from '../core/-editor-data'

const STORAGE_KEY = 'draft-editor:v1'

function readDraft(): {
  settings: DocumentSettings
  editorState: EditorState | null
  error: string
} {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw)
      return { settings: DEFAULT_SETTINGS, editorState: null, error: '' }
    const value = JSON.parse(raw)
    if (
      value?.version !== 1 ||
      typeof value.editor !== 'string' ||
      !value.settings ||
      !['title', 'description', 'canonicalUrl', 'keyword'].every(
        (field) => typeof value.settings[field] === 'string',
      )
    )
      throw new Error('Invalid draft')
    const editor = createEditor({
      nodes: EDITOR_NODES,
      onError: (error) => {
        throw error
      },
    })
    const editorState = editor.parseEditorState(value.editor)
    if (editorState.isEmpty()) throw new Error('Empty editor state')
    return {
      settings: {
        title: value.settings.title,
        description: value.settings.description,
        canonicalUrl: value.settings.canonicalUrl,
        keyword: value.settings.keyword,
        heroImage: value.settings.heroImage ?? null,
      },
      editorState,
      error: '',
    }
  } catch {
    return {
      settings: DEFAULT_SETTINGS,
      editorState: null,
      error:
        'Your saved draft could not be opened. It has been kept untouched. Export this session to keep your changes.',
    }
  }
}

export function useDraft() {
  const [initial] = useState(readDraft)
  const [settings, setSettings] = useState(initial.settings)
  const [snapshot, setSnapshot] = useState<DocumentSnapshot | null>(null)
  const [status, setStatus] = useState('Loading draft…')
  const [error, setError] = useState(initial.error)
  const pending = useRef<string | null>(null)

  useEffect(() => {
    if (!snapshot || initial.error) return
    pending.current = JSON.stringify({
      version: 1,
      settings,
      editor: JSON.stringify(snapshot.json),
    })
    setStatus('Saving…')
    const timeout = window.setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, pending.current!)
        setStatus('Saved on this device')
        setError('')
      } catch {
        setStatus('Not saved')
        setError(
          'This browser could not save your draft. Export your HTML to keep a copy.',
        )
      }
    }, 500)
    return () => window.clearTimeout(timeout)
  }, [settings, snapshot, initial.error])

  useEffect(() => {
    function flush() {
      if (!pending.current || initial.error) return
      try {
        localStorage.setItem(STORAGE_KEY, pending.current)
      } catch {
        /* The visible autosave status reports storage failures. */
      }
    }
    window.addEventListener('pagehide', flush)
    return () => {
      flush()
      window.removeEventListener('pagehide', flush)
    }
  }, [initial.error])

  return {
    settings,
    setSettings,
    snapshot,
    setSnapshot,
    initialState: initial.editorState,
    status: initial.error ? 'Draft recovery needed' : status,
    error,
  }
}
