import { createSlice  } from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit';
import {
  DEFAULT_SETTINGS
  
  
} from '../../routes/comps/editor-workspace/core/-editor-data'
import type {DocumentSettings, DocumentSnapshot} from '../../routes/comps/editor-workspace/core/-editor-data';

export interface EditorState {
  postId: string | null
  settings: DocumentSettings
  snapshot: DocumentSnapshot | null
  status: string
  error: string
  isLoaded: boolean
}

const initialState: EditorState = {
  postId: null,
  settings: DEFAULT_SETTINGS,
  snapshot: null,
  status: 'Loading draft…',
  error: '',
  isLoaded: false,
}

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setPostId(state, action: PayloadAction<string>) {
      if (state.postId !== action.payload) {
        state.postId = action.payload
        state.settings = DEFAULT_SETTINGS
        state.snapshot = null
        state.error = ''
        state.status = 'Loading draft…'
        state.isLoaded = false
      }
    },
    setSettings(state, action: PayloadAction<Partial<DocumentSettings>>) {
      state.settings = { ...state.settings, ...action.payload }
    },
    setSnapshot(state, action: PayloadAction<DocumentSnapshot>) {
      state.snapshot = action.payload
    },
    setStatus(state, action: PayloadAction<string>) {
      state.status = action.payload
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload
    },
    loadDraftData(
      state,
      action: PayloadAction<{
        settings: DocumentSettings
        snapshot: DocumentSnapshot | null
        error: string
      }>,
    ) {
      state.settings = action.payload.settings
      state.snapshot = action.payload.snapshot
      state.error = action.payload.error
      state.status = action.payload.error ? 'Draft recovery needed' : 'Loaded'
      state.isLoaded = true
    },
  },
})

export const {
  setPostId,
  setSettings,
  setSnapshot,
  setStatus,
  setError,
  loadDraftData,
} = editorSlice.actions
export default editorSlice.reducer
