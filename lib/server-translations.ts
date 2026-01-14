/**
 * Server-side translation utility for static export mode.
 * `getTranslations` from `next-intl/server` doesn't auto-detect locale in static export, so we manually load messages.
 */

type Messages = Record<string, any>

const messageLoaders = {
  en: () => import('@/messages/en.json'),
  fr: () => import('@/messages/fr.json'),
  ko: () => import('@/messages/ko.json'),
} as const

export async function getServerTranslations(
  locale: string,
  namespace: string
): Promise<(key: string) => string> {
  const loader = messageLoaders[locale as keyof typeof messageLoaders]
  if (!loader) {
    throw new Error(`Unsupported locale: ${locale}`)
  }
  const messages: Messages = (await loader()).default
  const namespaceMessages = messages[namespace] || {}

  return (key: string): string => {
    return namespaceMessages[key] || key
  }
}
