import styles from './index.module.css'
import { lazy, Suspense, useState } from 'react'
import { Await, ClientOnly, createFileRoute } from '@tanstack/react-router'
import { Menu, UserRound } from 'lucide-react'
import { Breadcrumb } from './comps/editor-workspace/layout/-breadcrumb'
import { NavSidebar } from './comps/editor-workspace/layout/-nav-sidebar'
import { EditorFallback } from './comps/editor-workspace/layout/-editor-fallback'
import { Button } from '@/components/ui/button'
import { getPostByIdServerFn } from '@/server/post/get-post-by-id'

const EditorWorkspace = lazy(
  () => import('./comps/editor-workspace/-editor-workspace'),
)

const description =
  'A thoughtful space to write for the web. Create rich-text articles with accessible images, search previews, local drafts, and semantic HTML export.'

export const Route = createFileRoute('/post/$postId')({
  // 2. Do NOT await the fetch, return the promise for SSR streaming
  loader: ({ params }) => {
    const deferredPost = getPostByIdServerFn({ data: { id: params.postId } })
    return { deferredPost }
  },
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
  component: EditorPage,
  errorComponent: ({ error }) => {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center p-4">
        <h1 className="mb-4 text-2xl font-bold">Failed to load post</h1>
        <p className="text-muted-foreground">{(error as any).message}</p>
      </div>
    )
  },
})

function EditorPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuCollapsed, setMenuCollapsed] = useState(false)

  // 4. Access the deferred promise
  const { deferredPost } = Route.useLoaderData()

  return (
    <div
      className={`${styles.payloadAdmin} ${menuCollapsed ? styles.navCollapsed : ''}`}
    >
      <a
        href="#workspace"
        className="sr-only fixed top-2 left-2 z-50 bg-background p-3 focus:not-sr-only"
      >
        Skip to editor
      </a>
      <NavSidebar
        open={menuOpen}
        collapsed={menuCollapsed}
        onClose={() => setMenuOpen(false)}
        onCollapse={() => {
          setMenuCollapsed(true)
          setMenuOpen(false)
        }}
      />
      <div className={styles.adminMain}>
        {/* 5. Wrap the dynamic parts in <Await> to stream them in */}
        <Await promise={deferredPost} fallback={<EditorFallback />}>
          {(post) => (
            <>
              <header className={styles.adminHeader}>
                <div className={styles.adminTopbar}>
                  <div className="flex min-w-0 items-center gap-4">
                    <Button
                      variant="outline"
                      size="icon-sm"
                      className={styles.adminOpenMenu}
                      aria-label="Open menu"
                      aria-controls="admin-navigation"
                      aria-expanded={menuOpen}
                      onClick={() => {
                        setMenuCollapsed(false)
                        setMenuOpen(true)
                      }}
                    >
                      <Menu />
                    </Button>
                    <Breadcrumb />
                  </div>
                  <UserRound
                    className={styles.adminAvatar}
                    aria-label="Account"
                  />
                </div>
                <div className={styles.adminDocumentHeading}>
                  {/* 6. Display the dynamic post ID */}
                  <h1>{post.id}</h1>
                  <nav
                    className={styles.adminDocumentViews}
                    aria-label="Document views"
                  >
                    <Button variant="secondary" aria-current="page">
                      Edit
                    </Button>
                    <Button variant="ghost" disabled>
                      Versions
                    </Button>
                    <Button variant="ghost" disabled>
                      API
                    </Button>
                  </nav>
                </div>
              </header>
              <main id="workspace">
                <ClientOnly fallback={<EditorFallback />}>
                  <Suspense fallback={<EditorFallback />}>
                    <EditorWorkspace postId={post.id.toString()} />
                  </Suspense>
                </ClientOnly>
              </main>
            </>
          )}
        </Await>
      </div>
    </div>
  )
}
