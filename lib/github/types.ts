export interface Commit {
  sha: string
  url: string
  author: {
    login: string
    avatar_url: string
  } | null // Author can be null if the commit author is not a GitHub user
}

export interface PullRequestContributor {
  login: string
  avatar_url: string
  commitCount: number
}

export interface PullRequest {
  number: number
  title: string
  createdAt: string
  mergedAt: string | null
  closedAt: string | null // Added closedAt
  url: string
  author: {
    login: string
    __typename: string
  }
  repository: {
    nameWithOwner: string
    url: string
  }
  contributors: PullRequestContributor[]
}

export interface PullRequestsResponse {
  repository: {
    nameWithOwner: string
    url: string
    pullRequests: {
      nodes: PullRequest[]
      pageInfo: {
        hasNextPage: boolean
        endCursor: string
      }
    }
  }
}

export const prQuery = `
query RepoPRs($owner:String!,$name:String!,$after:String){
  repository(owner:$owner,name:$name){
    nameWithOwner url
    pullRequests(states:[MERGED], first:100, orderBy:{field:UPDATED_AT,direction:DESC}, after:$after){
      nodes{ number title createdAt mergedAt url author{ login __typename }
        repository{ nameWithOwner url }
      }
      pageInfo{ hasNextPage endCursor }
    }
  }
}`
