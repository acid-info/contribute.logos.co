'use client'

import React, { ReactNode, useTransition, useState, useRef, useEffect } from 'react'
import { usePathname, useRouter } from '@/i18n/navigation'
import clsx from 'clsx'
import { Locale } from 'next-intl'

type Props = {
  children: ReactNode
  defaultValue: string
  label: string
}

const getLanguageDisplayName = (locale: string): string => {
  const languageNames: Record<string, string> = {
    en: 'English',
    fr: 'Français',
    ko: '한국어',
  }
  return languageNames[locale] || locale
}

export default function LocaleSwitcherSelect({ children, defaultValue }: Props) {
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState(defaultValue)
  const pathname = usePathname()
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)

  function onOptionClick(value: string) {
    const nextLocale = value as Locale
    setSelectedValue(value)
    setIsOpen(false)
    startTransition(() => {
      const normalized = pathname.endsWith('/') ? pathname : pathname + '/'
      router.replace({ pathname: normalized }, { locale: nextLocale })
    })
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Extract options from children
  const options = React.Children.toArray(children)

  return (
    <div className="relative inline-block w-24" ref={dropdownRef}>
      <div
        className={clsx(
          'border-primary w-full cursor-pointer border px-3 py-2 text-sm',
          'flex items-center justify-between',

          isPending && 'pointer-events-none opacity-30 transition-opacity'
        )}
        onClick={() => !isPending && setIsOpen(!isOpen)}
      >
        <span>{getLanguageDisplayName(selectedValue)}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={clsx(
            'h-4 w-4 text-gray-500 transition-transform dark:text-gray-400',
            isOpen && 'rotate-180'
          )}
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
      </div>

      {isOpen && (
        <div className="border-primary absolute top-full right-0 left-0 z-50 mt-1 border">
          {options.map((option, index) => {
            const element = option as React.ReactElement<{ value: string; children: ReactNode }>
            const optionValue = element.props.value

            return (
              <div
                key={index}
                className={clsx(
                  'bg-primary text-primary cursor-pointer px-3 py-2 text-sm',

                  'hover:bg-gray-100 hover:text-black dark:hover:bg-gray-800 dark:hover:text-white',
                  selectedValue === optionValue &&
                    'bg-gray-50 text-black dark:bg-gray-900 dark:text-white'
                )}
                onClick={() => onOptionClick(optionValue)}
              >
                {getLanguageDisplayName(optionValue)}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
