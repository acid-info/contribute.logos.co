'use client'

import { useState, useRef, useEffect } from 'react'

interface SortDropdownOption {
  value: string
  label: string
}

interface SortDropdownProps {
  value: string
  options: SortDropdownOption[]
  onChange: (value: string) => void
}

const capitalizeFirst = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

export default function SortDropdown({ value, options, onChange }: SortDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selectedLabel = options.find((o) => o.value === value)?.label ?? ''

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="border-primary text-primary flex items-center gap-2 border bg-transparent px-3 py-2 text-sm"
      >
        {capitalizeFirst(selectedLabel)}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      {open && (
        <div className="dropdown-menu absolute right-0 z-50 mt-1 min-w-full border shadow-sm">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value)
                setOpen(false)
              }}
              className={`dropdown-option block w-full px-3 py-2 text-left text-sm ${
                option.value === value ? 'font-semibold' : ''
              }`}
            >
              {capitalizeFirst(option.label)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
