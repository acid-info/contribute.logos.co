import { routing } from '@/i18n/routing'
import { useLocale, useTranslations } from 'next-intl'

import LocaleSwitcherSelect from './locale-switcher-select'

export default function LocaleSwitcher() {
  const t = useTranslations('locale')
  const locale = useLocale()

  return (
    <LocaleSwitcherSelect defaultValue={locale} label={t('language')}>
      {routing.locales.map((cur) => (
        <option key={cur} value={cur}>
          {t(cur, { locale: cur })}
        </option>
      ))}
    </LocaleSwitcherSelect>
  )
}
