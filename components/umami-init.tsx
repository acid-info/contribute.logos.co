'use client'

import { useEffect } from 'react'

const UMAMI_SCRIPT_URL = 'https://umami.bi.status.im/script.js'
const UMAMI_WEBSITE_ID = '92fb3459-5270-4ce8-a81b-70bee39fbdfe'
const UMAMI_DOMAINS = 'contribute.logos.co'

function loadUmamiScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = UMAMI_SCRIPT_URL
    script.setAttribute('data-website-id', UMAMI_WEBSITE_ID)
    script.setAttribute('data-domains', UMAMI_DOMAINS)
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Umami script'))
    document.head.appendChild(script)
  })
}

export default function UmamiInit() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // if umami script fails to load likely because blocked by client, we set a mock
    loadUmamiScript().catch(() => {
      window.umami = {
        track() {},
        identify() {},
      }
    })
  }, [])

  return null
}
