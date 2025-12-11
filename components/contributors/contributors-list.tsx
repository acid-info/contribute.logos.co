'use client'

import { Contributor } from '@/types'
import ContributorItem from './contributor-item'
import ContributorsLoading from './contributors-loading'
import ContributorsError from './contributors-error'
import ContributorsEmpty from './contributors-empty'

interface ContributorsListProps {
  contributors: Contributor[]
  isLoading: boolean
  error: boolean
}

export default function ContributorsList({
  contributors,
  isLoading,
  error,
}: ContributorsListProps) {
  if (isLoading) {
    return <ContributorsLoading />
  }

  if (error) {
    return <ContributorsError />
  }

  if (contributors.length === 0) {
    return <ContributorsEmpty />
  }

  return (
    <>
      {contributors.map((contributor) => (
        <ContributorItem key={contributor.id} contributor={contributor} />
      ))}
    </>
  )
}
