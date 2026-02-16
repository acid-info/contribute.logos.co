import { Icons } from '@/components/icons'
import { CONTACT_CATEGORIES } from '@/constants/contact-categories'

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
  points?: number
  contributions: number
  tier?: string | null
  latestContribution: string
  latestRepo: string
  avatarUrl: string
}

export interface SocialProofData {
  activeContributorsCount: number
  totalContributionsCount: number
  totalRepositoriesCount: number
  activeCirclesCount: number
}

export type ContactCategory = (typeof CONTACT_CATEGORIES)[number]['value']

// TipTap placeholder module declaration (for IDE/TS until types are resolved)
declare module '@tiptap/extension-placeholder' {
  const Placeholder: any
  export default Placeholder
}

declare global {
  interface Window {
    umami: {
      track: (event: string, data: Record<string, string>) => void
      identify: () => void
    }
  }
}
