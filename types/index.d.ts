import { Icons } from '@/components/icons'

export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
  label?: string
  paid?: boolean
  event?: string
}

export interface NavItemWithChildren extends NavItem {
  items?: NavItemWithChildren[]
}

export interface MainNavItem extends NavItem {}

export interface SidebarNavItem extends NavItemWithChildren {}

export interface Contributor {
  id: number
  username: string
  profileUrl: string
  contributions: number
  latestContribution: string
  latestRepo: string
  avatarUrl: string
}

// TipTap placeholder module declaration (for IDE/TS until types are resolved)
declare module '@tiptap/extension-placeholder' {
  const Placeholder: any
  export default Placeholder
}
