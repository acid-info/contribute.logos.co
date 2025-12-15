'use client'

import { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useCategories } from '@/hooks/useCategories'
import { useSubmitContribution } from '@/hooks/useSubmitContribution'
import { useLocale } from 'next-intl'
import { ROUTES } from '@/constants/routes'

const RichTextEditor = dynamic(() => import('./rich-text-editor'), {
  ssr: false,
  loading: () => (
    <div className="rich-text-editor w-full">
      <div className="border-primary flex flex-wrap items-center gap-1 divide-x border border-b-0 bg-transparent p-1 text-sm text-black dark:bg-transparent dark:text-white">
        <button
          type="button"
          disabled
          className="cursor-not-allowed px-2 py-1 pr-3 text-black opacity-50 dark:text-white"
          aria-label="Toggle H1"
        >
          H1
        </button>
        <button
          type="button"
          disabled
          className="cursor-not-allowed px-2 py-1 pr-3 pl-3 text-black opacity-50 dark:text-white"
          aria-label="Toggle H2"
        >
          H2
        </button>
        <button
          type="button"
          disabled
          className="cursor-not-allowed px-2 py-1 pr-3 pl-3 text-black opacity-50 dark:text-white"
          aria-label="Bold"
        >
          B
        </button>
        <button
          type="button"
          disabled
          className="cursor-not-allowed px-2 py-1 pr-3 pl-3 text-black opacity-50 dark:text-white"
          aria-label="Italic"
        >
          I
        </button>
        <button
          type="button"
          disabled
          className="cursor-not-allowed px-2 py-1 pr-3 pl-3 text-black opacity-50 dark:text-white"
          aria-label="Underline"
        >
          U
        </button>
        <button
          type="button"
          disabled
          className="cursor-not-allowed px-2 py-1 pl-3 text-black opacity-50 dark:text-white"
          aria-label="Set link"
        >
          🔗
        </button>
      </div>
      <div className="border-primary rounded-none border bg-transparent px-3 py-2 text-sm text-black ring-0 transition-colors outline-none dark:bg-transparent dark:text-white">
        <div className="prose prose-sm dark:prose-invert flex min-h-[9rem] items-center justify-center text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            Loading editor...
          </div>
        </div>
      </div>
    </div>
  ),
})

type TouchedState = {
  name: boolean
  email: boolean
  message: boolean
}

export default function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [messageHtml, setMessageHtml] = useState('')
  const [messageText, setMessageText] = useState('')
  const [editorResetKey, setEditorResetKey] = useState(0)
  const [category, setCategory] = useState<number | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [touched, setTouched] = useState<TouchedState>({
    name: false,
    email: false,
    message: false,
  })
  const dropdownRef = useRef<HTMLDivElement>(null)

  const locale = useLocale()

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories()
  const submitMutation = useSubmitContribution()

  useEffect(() => {
    if (categories.length > 0 && category === null) {
      setCategory(categories[0].id)
    }
  }, [categories, category])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  function validateEmail(value: string) {
    const re = /\S+@\S+\.\S+/
    return re.test(value)
  }

  function validateChatKey(value: string) {
    return value.length === 49 && value.startsWith('zQ3sh') && /^[a-zA-Z0-9]+$/.test(value)
  }

  function validateContact(value: string) {
    return validateEmail(value) || validateChatKey(value)
  }

  function handleCategorySelect(value: number) {
    setCategory(value)
    setIsDropdownOpen(false)
  }

  function handleDropdownKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setIsDropdownOpen(!isDropdownOpen)
    } else if (event.key === 'Escape') {
      setIsDropdownOpen(false)
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!isDropdownOpen) {
        setIsDropdownOpen(true)
      }
    }
  }

  function handleOptionKeyDown(event: React.KeyboardEvent, value: number) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleCategorySelect(value)
    }
  }

  const nameError =
    touched.name && name.trim().length < 2 ? 'Please enter at least 2 characters.' : ''

  const emailError =
    touched.email && !validateContact(email)
      ? 'Please enter a valid email address or Status App chat key (49 characters starting with zQ3sh).'
      : ''

  const messageError =
    touched.message && messageText.trim().length < 5 ? 'Please enter at least 5 characters.' : ''

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault()

    window.umami.track('Proposals - Logos Contribute', {
      source: `${locale}${ROUTES.proposals}/`,
    })

    const nextTouched: TouchedState = { name: true, email: true, message: true }
    setTouched(nextTouched)

    const hasErrors =
      name.trim().length < 2 || !validateContact(email) || messageText.trim().length < 5

    if (hasErrors) {
      return
    }

    if (!category) {
      return
    }

    submitMutation.mutate(
      {
        name,
        email,
        message: messageHtml,
        category: category,
      },
      {
        onSuccess: () => {
          setName('')
          setEmail('')
          setMessageHtml('')
          setMessageText('')
          setEditorResetKey((k) => k + 1)
          setCategory(categories.length > 0 ? categories[0].id : null)
          setTouched({ name: false, email: false, message: false })
        },
      }
    )
  }

  const isSubmitting = submitMutation.isPending
  const status = submitMutation.isSuccess ? 'success' : submitMutation.isError ? 'error' : 'idle'
  const error = submitMutation.error?.message || null

  if (categoriesError) {
    return (
      <div className="border-primary mx-auto w-full border p-6">
        <div
          role="alert"
          className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300"
        >
          Failed to load categories. Please refresh the page.
        </div>
      </div>
    )
  }

  return (
    <div className="border-primary mx-auto w-full border p-6">
      {status === 'success' && (
        <div
          role="status"
          aria-live="polite"
          className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950/30 dark:text-green-300"
        >
          Thanks! Your message has been sent.
        </div>
      )}
      {status === 'error' && (
        <div
          role="alert"
          className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300"
        >
          {error || 'There was an error sending your message.'}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="form grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2"
      >
        <div className="flex flex-col">
          <label htmlFor="name" className="mb-1 block text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            aria-invalid={!!nameError}
            aria-describedby={nameError ? 'name-error' : undefined}
            className={`w-full rounded-none border bg-transparent px-3 py-2 text-base ring-0 transition-colors outline-none dark:bg-transparent ${
              nameError
                ? 'border-red-500 focus:border-red-600'
                : 'border-primary focus:border-primary'
            }`}
            placeholder="Your name"
          />
          {nameError && (
            <p id="name-error" className="mt-1 text-xs text-red-600">
              {nameError}
            </p>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            Email or Status App Chat Key
          </label>
          <input
            id="email"
            name="email"
            type="text"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            aria-invalid={!!emailError}
            aria-describedby={emailError ? 'email-error' : 'email-help'}
            className={`w-full rounded-none border bg-transparent px-3 py-2 text-base ring-0 transition-colors outline-none dark:bg-transparent ${
              emailError
                ? 'border-red-500 focus:border-red-600'
                : 'border-primary focus:border-primary'
            }`}
            placeholder="Email or Status App chat key"
          />
          {emailError && (
            <p id="email-error" className="pt-2 text-xs text-red-600">
              {emailError}
            </p>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="category" className="mb-1 block text-sm font-medium">
            Category
          </label>
          <div className="relative" ref={dropdownRef}>
            <div
              id="category"
              role="combobox"
              aria-expanded={isDropdownOpen}
              aria-haspopup="listbox"
              tabIndex={0}
              onClick={() => !categoriesLoading && setIsDropdownOpen(!isDropdownOpen)}
              onKeyDown={handleDropdownKeyDown}
              className={`border-primary focus:border-primary w-full rounded-none border bg-transparent px-3 py-2 pr-10 text-base text-black ring-0 transition-colors outline-none dark:bg-transparent dark:text-white ${
                categoriesLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
              }`}
            >
              {categoriesLoading
                ? 'Loading categories...'
                : categories.find((cat) => cat.id === category)?.display_name || 'Select category'}
            </div>
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg
                className={`h-4 w-4 text-black transition-transform dark:text-white ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
            {isDropdownOpen && !categoriesLoading && (
              <div
                role="listbox"
                className="dropdown-menu absolute top-full right-0 left-0 z-10 mt-1 border border-black bg-white shadow-lg dark:border-white dark:bg-black"
                style={{
                  backgroundColor: 'var(--dropdown-bg, white)',
                  color: 'var(--dropdown-text, black)',
                }}
              >
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    role="option"
                    aria-selected={category === cat.id}
                    tabIndex={0}
                    onClick={() => handleCategorySelect(cat.id)}
                    onKeyDown={(e) => handleOptionKeyDown(e, cat.id)}
                    className="dropdown-option cursor-pointer px-3 py-2 text-sm transition-colors"
                    style={{
                      color: 'inherit',
                    }}
                  >
                    {cat.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="message" className="mb-1 block text-sm font-medium">
            Message
          </label>
          <div id="message" className="sr-only" aria-hidden="true">
            Editor
          </div>
          <RichTextEditor
            initialValue={messageHtml}
            resetKey={editorResetKey}
            onChange={(html, text) => {
              setMessageHtml(html)
              setMessageText(text)
            }}
            onBlur={() => setTouched((t) => ({ ...t, message: true }))}
            invalid={!!messageError}
            ariaDescribedBy={messageError ? 'message-error' : undefined}
            placeholder="Please describe your proposal here."
          />
          {messageError && (
            <p id="message-error" className="mt-1 text-xs text-red-600">
              {messageError}
            </p>
          )}
        </div>

        <div className="pt-2 md:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="border-primary inline-flex cursor-pointer items-center justify-center gap-2 rounded-none border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting && (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            )}
            {isSubmitting ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  )
}
