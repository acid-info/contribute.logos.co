'use client'

import { Typography } from '@acid-info/lsd-react'

export default function SiteFooter() {
  return (
    <footer className="border-primary bg-background border-t">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
          <div className="flex items-center space-x-2">
            <img src="/brand/logo-black.svg" alt="Logos" className="h-5 w-auto sm:h-6" />
            <Typography variant="body2" className="text-xs sm:text-sm">
              Contribute
            </Typography>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <a
              href="https://logos.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs hover:underline sm:text-sm"
            >
              <Typography variant="body2">Website</Typography>
            </a>
            <a
              href="https://forum.logos.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs hover:underline sm:text-sm"
            >
              <Typography variant="body2">Forum</Typography>
            </a>
            <a
              href="https://discord.gg/logosnetwork"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs hover:underline sm:text-sm"
            >
              <Typography variant="body2">Discord</Typography>
            </a>
            <a
              href="https://twitter.com/@logos_network"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs hover:underline sm:text-sm"
            >
              <Typography variant="body2">Twitter</Typography>
            </a>
            <a
              href="https://www.youtube.com/@LogosNetwork"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs hover:underline sm:text-sm"
            >
              <Typography variant="body2">YouTube</Typography>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
