import { useState } from 'react'
import { ChevronLeft, ChevronUp, Folder, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import styles from './-nav-sidebar.module.css'

export function NavSidebar({
  open,
  collapsed,
  onClose,
  onCollapse,
}: {
  open: boolean
  collapsed: boolean
  onClose: () => void
  onCollapse: () => void
}) {
  const [collectionsOpen, setCollectionsOpen] = useState(true)
  const [globalsOpen, setGlobalsOpen] = useState(true)

  return (
    <>
      {open && (
        <button
          className={styles.adminNavBackdrop}
          aria-label="Close navigation"
          onClick={onClose}
        />
      )}
      <aside
        id="admin-navigation"
        className={styles.adminSidebar}
        data-open={open}
        data-collapsed={collapsed}
        aria-label="Admin navigation"
      >
        <div className={styles.adminSidebarToggle}>
          <Button
            variant="outline"
            size="icon-xs"
            aria-label="Close menu"
            onClick={onCollapse}
          >
            <ChevronLeft />
          </Button>
        </div>
        <nav>
          <Button
            variant="outline"
            className={styles.adminFolderButton}
            disabled
          >
            <Folder className="fill-current text-muted-foreground" />
            Browse by Folder
          </Button>
          <Button
            variant="ghost"
            className={styles.adminNavHeading}
            aria-expanded={collectionsOpen}
            aria-controls="collection-links"
            onClick={() => setCollectionsOpen(!collectionsOpen)}
          >
            Collections{' '}
            <ChevronUp className={collectionsOpen ? '' : 'rotate-180'} />
          </Button>
          {collectionsOpen && (
            <div id="collection-links" className={styles.adminNavLinks}>
              {[
                'Pages',
                'Posts',
                'Media',
                'Categories',
                'Users',
                'Redirects',
                'Forms',
                'Form Submissions',
                'Search Results',
              ].map((item) => (
                <Button
                  key={item}
                  variant="ghost"
                  disabled={item !== 'Posts'}
                  aria-current={item === 'Posts' ? 'page' : undefined}
                  onClick={onClose}
                >
                  {item}
                </Button>
              ))}
            </div>
          )}
          <Button
            variant="ghost"
            className={styles.adminNavHeading}
            aria-expanded={globalsOpen}
            aria-controls="global-links"
            onClick={() => setGlobalsOpen(!globalsOpen)}
          >
            Globals <ChevronUp className={globalsOpen ? '' : 'rotate-180'} />
          </Button>
          {globalsOpen && (
            <div id="global-links" className={styles.adminNavLinks}>
              <Button variant="ghost" disabled>
                Header
              </Button>
              <Button variant="ghost" disabled>
                Footer
              </Button>
            </div>
          )}
        </nav>
        <Button
          variant="ghost"
          size="icon"
          className={styles.adminLogout}
          aria-label="Log out"
          disabled
        >
          <LogOut />
        </Button>
      </aside>
    </>
  )
}
