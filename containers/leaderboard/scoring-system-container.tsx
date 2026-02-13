import { Typography } from '@acid-info/lsd-react'
import ReactMarkdown from 'react-markdown'

export default function ScoringSystemContainer() {
  const markdownContent = `### Baseline points (per accepted/approved contribution)

- GitHub Issue opened with clear repro/spec: 3 pts
- Git Commit (part of merged PR): 1 pt
- Pull Request merged (code or docs): 7 pts
- Code Review: 3 pts
- Spec/ADR/Design Doc merged: 8 pts
- Blog post: 5 pts
- Translation: per 500 approved words: 4 pts
- Design asset (UI kit, logo set, infographic) adopted: 6 pts
- Meetup/Workshop organized (online/offline): 10 pts
- Talk/Panel delivered at event: 7 pts
- Mentorship (onboard a Seeker to first merged PR or published work): 6 pts

### Quality multipliers (apply once per item)

- **Impact label** (Council tags):
    - \`impact:high\` × **1.5** (e.g., security fix, major doc, large translation)
    - \`impact:critical\` × **2.0** (e.g., CVE patch, pivotal spec)
- **First-time contributor** bonus: **+3 pts** on first accepted item`

  return (
    <div className="mt-12 space-y-6">
      <div className="mb-8 text-center">
        <Typography variant="h2" className="mb-2 !text-2xl">
          Scoring System
        </Typography>
      </div>

      <div className="border-primary border p-6">
        <div className="prose-sm prose max-w-none">
          <ReactMarkdown
            components={{
              h3: ({ children }) => (
                <Typography variant="h3" className="mt-6 mb-4 !text-lg font-bold first:mt-0">
                  {children}
                </Typography>
              ),
              ul: ({ children }) => <ul className="mb-4 ml-6 list-disc space-y-2">{children}</ul>,
              li: ({ children }) => <li className="text-sm leading-relaxed">{children}</li>,
              p: ({ children }) => <p className="mb-4 text-sm leading-relaxed">{children}</p>,
              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
              em: ({ children }) => <em className="italic">{children}</em>,
              code: ({ children }) => (
                <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-black">
                  {children}
                </code>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:no-underline"
                >
                  {children}
                </a>
              ),
            }}
          >
            {markdownContent}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
