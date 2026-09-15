import styles from './index.module.css'
import { lazy, Suspense, useState } from 'react'
import { ClientOnly, createFileRoute } from '@tanstack/react-router'
import { Menu, UserRound } from 'lucide-react'
import { Breadcrumb } from './comps/-breadcrumb'
import { NavSidebar } from './comps/-nav-sidebar'
import { EditorFallback } from './comps/-editor-fallback'
import { Button } from '@/components/ui/button'

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
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuCollapsed, setMenuCollapsed] = useState(false)

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
            <UserRound className={styles.adminAvatar} aria-label="Account" />
          </div>
          <div className={styles.adminDocumentHeading}>
            <h1>5</h1>
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
              <EditorWorkspace />
            </Suspense>
          </ClientOnly>
        </main>
      </div>
    </div>
  )
}
