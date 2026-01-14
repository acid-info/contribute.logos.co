/**
 * Server-side translation utility for static export mode.
 * `getTranslations` from `next-intl/server` doesn't auto-detect locale in static export, so we manually load messages.
 */

type Messages = Record<string, any>

export async function getServerTranslations(
  locale: string,
  namespace: string
): Promise<(key: string) => string> {
  const messages: Messages = (await import(`@/messages/${locale}.json`)).default
  const namespaceMessages = messages[namespace] || {}

  return (key: string): string => {
    return namespaceMessages[key] || key
  }
}
