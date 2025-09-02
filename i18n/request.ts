import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = routing.defaultLocale

  try {
    if (requestLocale) {
      const requested = await requestLocale
      // Validate that the requested locale is supported
      if (requested && routing.locales.includes(requested as any)) {
        locale = requested as any
      }
    }
  } catch (error) {
    // If requestLocale fails (e.g., during static generation), use default
    console.warn('Failed to get request locale, using default:', routing.defaultLocale)
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
