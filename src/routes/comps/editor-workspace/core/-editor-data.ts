import type { SerializedEditorState } from 'lexical'

export type DocumentSettings = {
  title: string
  description: string
  canonicalUrl: string
  keyword: string
  heroImage?: string | null
}

export type DocumentSnapshot = {
  json: SerializedEditorState
  html: string
  text: string
  words: number
  headings: { key: string; text: string; level: number }[]
  images: { alt: string }[]
}

export type ImagePayload = { src: string; alt: string; caption: string }

export const DEFAULT_SETTINGS: DocumentSettings = {
  title: 'A little space for your next big idea',
  description:
    'Good writing starts with a little space to think. Turn your next idea into a thoughtful article with clear headings, useful details, and a voice of your own.',
  canonicalUrl: '',
  keyword: 'writing',
  heroImage: null,
}

// Shared by the server-rendered fallback and the initial Lexical document.
export const STARTER_BLOCKS = [
  {
    type: 'p',
    text: 'Every great story starts with a single thought. This is your space to explore it, find the right words, and make something worth reading.',
  },
  { type: 'h2', text: 'Start with what matters' },
  {
    type: 'p',
    text: 'What do you want your reader to take away? Begin there. A clear idea is the foundation of good writing, whether you are sharing a personal story, a practical guide, or a fresh perspective.',
  },
  {
    type: 'quote',
    text: 'You do not need to have it all figured out. You just need to start.',
  },
  { type: 'h2', text: 'Make it your own' },
  {
    type: 'p',
    text: 'Replace these words with yours. Use headings to give your story structure, add links to helpful sources, and bring your ideas to life with images. Describe each image so everyone can follow along.',
  },
  {
    type: 'p',
    text: 'When you are ready, check the search preview and export your article. A small beginning can become something remarkable.',
  },
] as const

export function isWebUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return (
      ['https:', 'http:'].includes(url.protocol) &&
      !url.username &&
      !url.password
    )
  } catch {
    return false
  }
}

export function isLinkUrl(value: string): boolean {
  return isWebUrl(value) || /^mailto:[^\s@]+@[^\s@]+$/.test(value)
}

export function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\p{L}\p{N}]+/gu, '-')
      .replace(/^-|-$/g, '') || 'untitled'
  )
}
