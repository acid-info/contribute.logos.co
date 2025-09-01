'use client'

import { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { getContributeApiBase } from '@/lib/utils'
import { CONTACT_CATEGORIES } from '@/constants/contact-categories'

const RichTextEditor = dynamic(() => import('./rich-text-editor'), {
  ssr: false,
})

const API_BASE = getContributeApiBase()
const SUBMIT_ENDPOINT = `${API_BASE}/contribute`

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

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
  const [category, setCategory] = useState('software')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [status, setStatus] = useState<SubmitState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [touched, setTouched] = useState<TouchedState>({
    name: false,
    email: false,
    message: false,
  })
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  function handleCategorySelect(value: string) {
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

  function handleOptionKeyDown(event: React.KeyboardEvent, value: string) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleCategorySelect(value)
    }
  }

  const nameError =
    touched.name && name.trim().length < 2 ? 'Please enter at least 2 characters.' : ''
  const emailError =
    touched.email && !validateEmail(email) ? 'Please enter a valid email address.' : ''
  const messageError =
    touched.message && messageText.trim().length < 5 ? 'Please enter at least 5 characters.' : ''

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault()

    const nextTouched: TouchedState = { name: true, email: true, message: true }
    setTouched(nextTouched)

    const hasErrors =
      name.trim().length < 2 || !validateEmail(email) || messageText.trim().length < 5
    if (hasErrors) {
      setStatus('idle')
      return
    }

    setStatus('submitting')
    setError(null)

    try {
      const res = await fetch(SUBMIT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message: messageHtml, category }),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Failed to submit')
      }

      setStatus('success')

      setName('')
      setEmail('')
      setMessageHtml('')
      setMessageText('')
      setEditorResetKey((k) => k + 1)
      setCategory('software')
      setTouched({ name: false, email: false, message: false })
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  const isSubmitting = status === 'submitting'

  return (
    <div className="m:p-8 border-primary mx-auto w-full border p-6">
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
            className={`w-full rounded-none border bg-transparent px-3 py-2 text-sm ring-0 transition-colors outline-none dark:bg-transparent ${
              nameError
                ? 'border-red-500 focus:border-red-600'
                : 'border-primary focus:border-primary'
            }`}
            placeholder="Enter your name"
          />
          {nameError && (
            <p id="name-error" className="mt-1 text-xs text-red-600">
              {nameError}
            </p>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            aria-invalid={!!emailError}
            aria-describedby={emailError ? 'email-error' : 'email-help'}
            className={`w-full rounded-none border bg-transparent px-3 py-2 text-sm ring-0 transition-colors outline-none dark:bg-transparent ${
              emailError
                ? 'border-red-500 focus:border-red-600'
                : 'border-primary focus:border-primary'
            }`}
            placeholder="Enter your email"
          />
          {emailError && (
            <p id="email-error" className="mt-1 text-xs text-red-600">
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
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              onKeyDown={handleDropdownKeyDown}
              className="border-primary focus:border-primary w-full cursor-pointer rounded-none border bg-transparent px-3 py-2 pr-10 text-sm text-black ring-0 transition-colors outline-none dark:bg-transparent dark:text-white"
            >
              {CONTACT_CATEGORIES.find((cat) => cat.value === category)?.label || 'Select category'}
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
            {isDropdownOpen && (
              <div
                role="listbox"
                className="dropdown-menu absolute top-full right-0 left-0 z-10 mt-1 border border-black bg-white shadow-lg dark:border-white dark:bg-black"
                style={{
                  backgroundColor: 'var(--dropdown-bg, white)',
                  color: 'var(--dropdown-text, black)',
                }}
              >
                {CONTACT_CATEGORIES.map((cat) => (
                  <div
                    key={cat.value}
                    role="option"
                    aria-selected={category === cat.value}
                    tabIndex={0}
                    onClick={() => handleCategorySelect(cat.value)}
                    onKeyDown={(e) => handleOptionKeyDown(e, cat.value)}
                    className="dropdown-option cursor-pointer px-3 py-2 text-sm transition-colors"
                    style={{
                      color: 'inherit',
                    }}
                  >
                    {cat.label}
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
