import { lazy, Suspense } from 'react'
import { ClientOnly, createFileRoute } from '@tanstack/react-router'
import { Feather, PenLine } from 'lucide-react'
import { EditorFallback } from './comps/-editor-fallback'

const EditorWorkspace = lazy(() => import('./comps/-editor-workspace'))

const description =
  'A thoughtful space to write for the web. Create rich-text articles with accessible images, search previews, local drafts, and semantic HTML export.'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Draft — A thoughtful editor for the web' },
      { name: 'description', content: description },
      {
        property: 'og:title',
        content: 'Draft — A thoughtful editor for the web',
      },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
    ],
  }),
  component: Home,
})

function Home() {
  return (
    <div className="min-h-screen bg-muted/35">
      <a
        href="#workspace"
        className="sr-only fixed top-2 left-2 z-50 rounded-lg bg-background p-3 focus:not-sr-only"
      >
        Skip to editor
      </a>
      <header className="border-b bg-background">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8">
          <a
            href="/"
            aria-label="Draft home"
            className="flex items-center gap-2.5"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Feather className="size-4" />
            </span>
            <span className="text-xl font-semibold tracking-tight">
              draft<span className="text-primary">.</span>
            </span>
            <span className="ml-4 hidden border-l pl-5 text-xs text-muted-foreground sm:inline">
              A little space for big ideas
            </span>
          </a>
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <PenLine className="size-3.5" />
            <span>Writing workspace</span>
          </span>
        </div>
      </header>
      <main
        id="workspace"
        className="mx-auto max-w-7xl px-5 pt-10 pb-16 sm:px-8 sm:pt-12"
      >
        <div className="mb-9">
          <p className="mb-2 text-[10px] font-semibold tracking-[0.2em] text-primary uppercase">
            From first thought to final draft
          </p>
          <h1 className="font-serif text-3xl tracking-tight sm:text-4xl">
            Make room for good ideas.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Write something meaningful. Give it the structure to be discovered.
          </p>
        </div>
        <ClientOnly fallback={<EditorFallback />}>
          <Suspense fallback={<EditorFallback />}>
            <EditorWorkspace />
          </Suspense>
        </ClientOnly>
      </main>
      <footer className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 border-t px-5 py-6 text-[11px] text-muted-foreground sm:px-8">
        <span>Made for a more thoughtful web.</span>
        <span>
          Your draft stays in this browser. Export when you are ready.
        </span>
      </footer>
    </div>
  )
}
