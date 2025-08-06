'use client'

import { ChangeEvent, ReactNode, useTransition } from 'react'
import { usePathname } from '@/i18n/navigation'
import clsx from 'clsx'
import { Locale } from 'next-intl'

type Props = {
  children: ReactNode
  defaultValue: string
  label: string
}

export default function LocaleSwitcherSelect({ children, defaultValue }: Props) {
  const [isPending, startTransition] = useTransition()
  const pathname = usePathname()

  function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value as Locale
    startTransition(() => {
      window.location.pathname = `/${nextLocale}${pathname}`
    })
  }

  return (
    <div className="relative inline-block w-24">
      <select
        className={clsx(
          'text-foreground w-full appearance-none border border-black px-3 py-1 text-sm dark:border-white',
          'cursor-pointer',
          isPending && 'transition-opacity [&:disabled]:opacity-30'
        )}
        defaultValue={defaultValue}
        disabled={isPending}
        onChange={onSelectChange}
      >
        <optgroup label="Language">{children}</optgroup>
      </select>

      <span className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-gray-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06 0L10 10.44l3.71-3.23a.75.75 0 111.06 1.06l-4 3.5a.75.75 0 01-1.06 0l-4-3.5z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    </div>
  )
}
