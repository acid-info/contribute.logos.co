'use client'

import { IssueItem as IssueItemType } from '@/hooks/useIssues'
import IssueItem from './issue-item'

interface IssuesListProps {
  issues: IssueItemType[]
}

export default function IssuesList({ issues }: IssuesListProps) {
  return (
    <div className="divide-primary divide-y">
      {issues.map((issue) => (
        <IssueItem key={issue.id} issue={issue} />
      ))}
    </div>
  )
}
