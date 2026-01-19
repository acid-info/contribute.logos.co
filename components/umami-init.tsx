'use client'

import { useEffect } from 'react'

export default function UmamiInit() {
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.umami) {
      window.umami = {
        track() {},
        identify() {},
      }
    }
  }, [])

  return null
}
