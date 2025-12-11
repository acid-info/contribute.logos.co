'use client'

import { Typography } from '@acid-info/lsd-react'

export default function ContributorsError() {
  return (
    <div className="flex justify-center p-8 sm:p-12">
      <div className="flex flex-col items-center space-y-4">
        <Typography variant="body2" className="text-red-600">
          Failed to load contributors. Please try again later.
        </Typography>
      </div>
    </div>
  )
}
