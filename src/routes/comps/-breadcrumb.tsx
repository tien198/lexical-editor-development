import { Feather } from 'lucide-react'
import styles from './-breadcrumb.module.css'

export function Breadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className={styles.adminBreadcrumb}>
      <a href="/" aria-label="Draft home" className={styles.brand}>
        <Feather className={styles.brandIcon} aria-hidden="true" />
        <span>
          draft<span className={styles.brandAccent}>.</span>
        </span>
      </a>
      <span>/</span>
      <span>Posts</span>
      <span>/</span>
      <span>5</span>
    </nav>
  )
}
