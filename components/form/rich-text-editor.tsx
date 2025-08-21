'use client'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'

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
    class:
      'prose prose-sm dark:prose-invert min-h-[9rem] focus:outline-none text-black dark:text-white',
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
        Placeholder.configure({
          placeholder,
          showOnlyWhenEditable: true,
          showOnlyCurrent: true,
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
    <div className={`rich-text-editor w-full ${invalid ? '' : ''}`}>
      <div className="border-primary flex flex-wrap items-center gap-1 divide-x border border-b-0 bg-transparent p-1 text-sm text-black dark:bg-transparent dark:text-white">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`cursor-pointer px-2 py-1 text-black dark:text-white ${editor.isActive('heading', { level: 1 }) ? 'font-semibold underline' : 'opacity-80 hover:opacity-100'} pr-3`}
          aria-label="Toggle H1"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`cursor-pointer px-2 py-1 text-black dark:text-white ${editor.isActive('heading', { level: 2 }) ? 'font-semibold underline' : 'opacity-80 hover:opacity-100'} pr-3 pl-3`}
          aria-label="Toggle H2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`cursor-pointer px-2 py-1 text-black dark:text-white ${editor.isActive('bold') ? 'font-semibold underline' : 'opacity-80 hover:opacity-100'} pr-3 pl-3`}
          aria-label="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`cursor-pointer px-2 py-1 text-black dark:text-white ${editor.isActive('italic') ? 'font-semibold underline' : 'opacity-80 hover:opacity-100'} pr-3 pl-3`}
          aria-label="Italic"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`cursor-pointer px-2 py-1 text-black dark:text-white ${editor.isActive('underline') ? 'font-semibold underline' : 'opacity-80 hover:opacity-100'} pr-3 pl-3`}
          aria-label="Underline"
        >
          U
        </button>
        <button
          type="button"
          onClick={setLink}
          className={`cursor-pointer px-2 py-1 text-black dark:text-white ${editor.isActive('link') ? 'font-semibold underline' : 'opacity-80 hover:opacity-100'} pl-3`}
          aria-label="Set link"
        >
          🔗
        </button>
      </div>
      <div
        className={`rounded-none border bg-transparent px-3 py-2 text-sm text-black ring-0 transition-colors outline-none dark:bg-transparent dark:text-white ${
          invalid ? 'border-red-500 focus:border-red-600' : 'border-primary focus:border-primary'
        }`}
      >
        <EditorContent editor={editor} onBlur={() => onBlur?.()} />
      </div>
    </div>
  )
}
