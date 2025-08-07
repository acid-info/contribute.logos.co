import { faker } from '@faker-js/faker'

export interface Contributor {
  id: number
  username: string
  profileUrl: string
  contributions: number
  latestContribution: string
  latestRepo: string
  avatarUrl: string
}

export const LOGOS_REPOSITORIES = [
  'logos-core',
  'logos-ui',
  'logos-docs',
  'logos-cli',
  'logos-api',
  'logos-utils',
  'logos-theme',
  'logos-components',
  'logos-hooks',
  'logos-icons',
  'logos-styles',
  'logos-config',
] as const

const FIXED_USERNAMES = [
  'alice-dev',
  'bob-contributor',
  'charlie-coder',
  'diana-oss',
  'edward-dev',
  'fiona-hacker',
  'george-builder',
  'hannah-maker',
  'ivan-tester',
  'julia-designer',
  'kevin-architect',
  'lisa-engineer',
  'mike-developer',
  'nina-coder',
  'oscar-builder',
]

export const generateMockContributors = (count: number = 10): Contributor[] => {
  return Array.from({ length: count }, (_, index) => {
    const username = FIXED_USERNAMES[index] || faker.internet.userName()
    return {
      id: index + 1,
      username,
      profileUrl: `https://github.com/${username}`,
      contributions: faker.number.int({ min: 3, max: 10 }),
      latestContribution: faker.date.recent({ days: 60 }).toISOString().split('T')[0],
      latestRepo: faker.helpers.arrayElement(LOGOS_REPOSITORIES),
      avatarUrl: faker.image.avatar(),
    }
  })
}

export const MOCK_CONTRIBUTORS: Contributor[] = generateMockContributors(15)
