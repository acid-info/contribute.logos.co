'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { getContributeApiBase } from '@/lib/utils'

const RichTextEditor = dynamic(() => import('./rich-text-editor'), {
  ssr: false,
})

const API_BASE = getContributeApiBase()
const SUBMIT_ENDPOINT = `${API_BASE}/contribute`
const EMAIL_ENDPOINT = `${API_BASE}/email/contribute`

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
  const [status, setStatus] = useState<SubmitState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [touched, setTouched] = useState<TouchedState>({
    name: false,
    email: false,
    message: false,
  })

  function validateEmail(value: string) {
    const re = /\S+@\S+\.\S+/
    return re.test(value)
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

      // After successful submit, send email notification with category and plain-text message
      try {
        await fetch(EMAIL_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category, message: messageHtml, name, email }),
        })
      } catch (e) {
        // Intentionally ignore email notification errors so UI success persists
      }

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
    <div className="m:p-8 border-primary mx-auto max-w-2xl border p-6">
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
            className={`w-full rounded-none border bg-transparent px-3 py-2 text-sm text-black ring-0 transition-colors outline-none dark:bg-transparent dark:text-white ${
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
            className={`w-full rounded-none border bg-transparent px-3 py-2 text-sm text-black ring-0 transition-colors outline-none dark:bg-transparent dark:text-white ${
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
          <div className="relative">
            <select
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border-primary focus:border-primary w-full appearance-none rounded-none border bg-transparent px-3 py-2 pr-10 text-sm text-black ring-0 transition-colors outline-none dark:bg-transparent dark:text-white"
            >
              <option value="software">Software</option>
              <option value="translation">Translation</option>
              <option value="content">Content</option>
              <option value="writing">Writing</option>
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg
                className="h-4 w-4 text-black dark:text-white"
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
