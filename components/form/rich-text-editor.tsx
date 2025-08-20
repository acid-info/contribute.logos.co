'use client'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'

type RichTextEditorProps = {
  initialValue?: string
  resetKey?: number
  onChange: (html: string, text: string) => void
  onBlur?: () => void
  invalid?: boolean
  ariaDescribedBy?: string
  placeholder?: string
}

export default function RichTextEditor({
  initialValue = '',
  resetKey = 0,
  onChange,
  onBlur,
  invalid,
  ariaDescribedBy,
  placeholder = 'Please describe your proposal here.',
}: RichTextEditorProps) {
  const attributes: Record<string, string> = {
    'aria-invalid': invalid ? 'true' : 'false',
    class: 'prose prose-sm dark:prose-invert min-h-[9rem] focus:outline-none',
  }
  if (ariaDescribedBy) {
    attributes['aria-describedby'] = ariaDescribedBy
  }

  const editor = useEditor(
    {
      immediatelyRender: false,
      extensions: [
        StarterKit.configure({
          heading: { levels: [1, 2, 3] },
        }),
        Underline,
        Link.configure({
          openOnClick: true,
          autolink: true,
          protocols: ['http', 'https', 'mailto'],
          HTMLAttributes: {
            class:
              'underline underline-offset-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300',
          },
        }),
      ],
      content: initialValue || '',
      editorProps: {
        attributes,
      },
      onUpdate: ({ editor }) => {
        const html = editor.getHTML()
        const text = editor.getText()
        onChange(html, text)
      },
    },
    [resetKey]
  )

  if (!editor) return null

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('Enter URL', previousUrl || '')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().unsetLink().run()
      return
    }
    editor.chain().focus().setLink({ href: url }).run()
  }

  return (
    <div className={`w-full ${invalid ? '' : ''}`}>
      <div className="flex flex-wrap items-center gap-1 border border-b-0 bg-neutral-50 p-1 text-sm dark:bg-neutral-900">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-2 py-1 ${editor.isActive('heading', { level: 1 }) ? 'bg-neutral-200 dark:bg-neutral-800' : ''}`}
          aria-label="Toggle H1"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 py-1 ${editor.isActive('heading', { level: 2 }) ? 'bg-neutral-200 dark:bg-neutral-800' : ''}`}
          aria-label="Toggle H2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 ${editor.isActive('bold') ? 'bg-neutral-200 dark:bg-neutral-800' : ''}`}
          aria-label="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 ${editor.isActive('italic') ? 'bg-neutral-200 dark:bg-neutral-800' : ''}`}
          aria-label="Italic"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`px-2 py-1 ${editor.isActive('underline') ? 'bg-neutral-200 dark:bg-neutral-800' : ''}`}
          aria-label="Underline"
        >
          U
        </button>
        <button type="button" onClick={setLink} className="px-2 py-1" aria-label="Set link">
          Link
        </button>
        <span className="ml-auto text-xs opacity-60">{placeholder}</span>
      </div>
      <div
        className={`rounded-none border bg-white px-3 py-2 text-sm ring-0 transition-colors outline-none dark:bg-neutral-900 ${
          invalid ? 'border-red-500 focus:border-red-600' : 'border-primary focus:border-primary'
        }`}
      >
        <EditorContent editor={editor} onBlur={() => onBlur?.()} />
      </div>
    </div>
  )
}
