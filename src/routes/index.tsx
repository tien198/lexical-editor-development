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
        className="sr-only fixed top-2 left-2 z-50 bg-background p-3 focus:not-sr-only"
      >
        Skip to editor
      </a>
      <header className="border-b bg-background">
        <div className="flex w-full flex-wrap items-center justify-between gap-4 p-6">
          <a
            href="/"
            aria-label="Draft home"
            className="flex items-center gap-2"
          >
            <Feather className="size-5 text-primary" />
            <span className="text-xl font-semibold tracking-tight">
              draft<span className="text-primary">.</span>
            </span>
            <span className="ml-4 hidden text-xs text-muted-foreground sm:inline">
              A little space for big ideas
            </span>
          </a>
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <PenLine className="size-4" />
            <span>Writing workspace</span>
          </span>
        </div>
      </header>
      <main id="workspace" className="w-full space-y-6 p-6">
        <div className="space-y-2">
          <p className="text-[10px] font-semibold tracking-[0.2em] text-primary uppercase">
            From first thought to final draft
          </p>
          <h1 className="font-serif text-3xl tracking-tight sm:text-4xl">
            Make room for good ideas.
          </h1>
          <p className="text-sm text-muted-foreground">
            Write something meaningful. Give it the structure to be discovered.
          </p>
        </div>
        <ClientOnly fallback={<EditorFallback />}>
          <Suspense fallback={<EditorFallback />}>
            <EditorWorkspace />
          </Suspense>
        </ClientOnly>
      </main>
      <footer className="flex w-full flex-wrap items-center justify-between gap-2 border-t p-6 text-[11px] text-muted-foreground">
        <span>Made for a more thoughtful web.</span>
        <span>
          Your draft stays in this browser. Export when you are ready.
        </span>
      </footer>
    </div>
  )
}
