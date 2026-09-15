import { useState } from 'react'
import { ChevronLeft, ChevronUp, Folder, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
          className="hidden max-[1023px]:block max-[1023px]:fixed max-[1023px]:inset-0 max-[1023px]:z-20 max-[1023px]:bg-[#0009]"
          aria-label="Close navigation"
          onClick={onClose}
        />
      )}
      <aside
        id="admin-navigation"
        className="fixed inset-y-0 left-0 z-30 w-[var(--admin-nav-width)] overflow-y-auto border-r bg-background px-[20px] py-[16px] data-[collapsed=true]:hidden max-[1023px]:hidden max-[1023px]:w-[272px] data-[open=true]:max-[1023px]:block [&_button:disabled]:opacity-100"
        data-open={open}
        data-collapsed={collapsed}
        aria-label="Admin navigation"
      >
        <div className="h-[45px] [&_button]:ml-[-3px] [&_button]:size-[26px] [&_button]:text-muted-foreground">
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
            className="mb-[14px] h-[42px] w-full justify-start bg-transparent px-[12px]"
            disabled
          >
            <Folder className="fill-current text-muted-foreground" />
            Browse by Folder
          </Button>
          <Button
            variant="ghost"
            className="h-[30px] w-full justify-between bg-transparent p-0 text-muted-foreground [&_svg]:w-[12px] [&_svg]:opacity-[0.55]"
            aria-expanded={collectionsOpen}
            aria-controls="collection-links"
            onClick={() => setCollectionsOpen(!collectionsOpen)}
          >
            Collections{' '}
            <ChevronUp className={collectionsOpen ? '' : 'rotate-180'} />
          </Button>
          {collectionsOpen && (
            <div
              id="collection-links"
              className="mb-[8px] flex flex-col items-stretch [&_button]:relative [&_button]:h-[25px] [&_button]:justify-start [&_button]:p-0 [&_[aria-current=page]]:font-semibold [&_[aria-current=page]]:before:absolute [&_[aria-current=page]]:before:-left-[20px] [&_[aria-current=page]]:before:h-[16px] [&_[aria-current=page]]:before:w-[2px] [&_[aria-current=page]]:before:rounded-[2px] [&_[aria-current=page]]:before:bg-foreground [&_[aria-current=page]]:before:content-['']"
            >
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
            className="h-[30px] w-full justify-between bg-transparent p-0 text-muted-foreground [&_svg]:w-[12px] [&_svg]:opacity-[0.55]"
            aria-expanded={globalsOpen}
            aria-controls="global-links"
            onClick={() => setGlobalsOpen(!globalsOpen)}
          >
            Globals <ChevronUp className={globalsOpen ? '' : 'rotate-180'} />
          </Button>
          {globalsOpen && (
            <div
              id="global-links"
              className="mb-[8px] flex flex-col items-stretch [&_button]:relative [&_button]:h-[25px] [&_button]:justify-start [&_button]:p-0 [&_[aria-current=page]]:font-semibold [&_[aria-current=page]]:before:absolute [&_[aria-current=page]]:before:-left-[20px] [&_[aria-current=page]]:before:h-[16px] [&_[aria-current=page]]:before:w-[2px] [&_[aria-current=page]]:before:rounded-[2px] [&_[aria-current=page]]:before:bg-foreground [&_[aria-current=page]]:before:content-['']"
            >
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
          className="mt-[32px] text-muted-foreground"
          aria-label="Log out"
          disabled
        >
          <LogOut />
        </Button>
      </aside>
    </>
  )
}
