import { Feather } from 'lucide-react'

export function Breadcrumb() {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-[12px] [&>span:last-child]:text-[#c4c4c4]"
    >
      <a
        href="/"
        aria-label="Draft home"
        className="flex items-center gap-[8px] font-sans text-[20px] font-semibold leading-[28px] tracking-[-0.025em]"
      >
        <Feather
          className="size-[20px] shrink-0 text-primary"
          aria-hidden="true"
        />
        <span>
          draft<span className="text-primary">.</span>
        </span>
      </a>
      <span>/</span>
      <span>Posts</span>
      <span>/</span>
      <span>5</span>
    </nav>
  )
}
