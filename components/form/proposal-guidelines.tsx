import Markdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'

const content = `## Logos Contribution Guidelines

Welcome to Logos! We're excited to have you contribute to building the decentralized web. Whether you're a developer, writer, or have other valuable skills to offer, there are many ways to get involved.

---

## For Developers

### Code Contributions
- **Frontend Development**: Build user interfaces using React, TypeScript, and modern web technologies
- **Mobile Development**: Develop mobile applications for iOS and Android
- **Infrastructure**: Contribute to DevOps, CI/CD pipelines, and deployment automation
- **Protocol Development**: Contribute to core protocol implementations in Nim, Go, or Rust
- **Smart Contracts**: Help build and audit Logos-based contracts for the Logos ecosystem in Solidity, EVM, or Wasm

### Getting Started
1. **Explore the Codebase**: Browse our [GitHub repositories](https://github.com/logos-co) to understand the project structure
2. **Set Up Development Environment**: Follow the README instructions in each repository
3. **Find Good First Issues**: Look for issues labeled "good first issue" or "help wanted"
4. **Join Developer Discussions**: Participate in technical discussions on our Discord #hq channels

### Development Process
- Fork the repository and create a feature branch
- Write clean, well-documented code following our style guidelines
- Include comprehensive tests for new features
- Submit a pull request with a clear description of changes
- Respond to code review feedback promptly
- Ensure CI/CD checks pass before merging

---

## Writers

### Blog Writing for Logos Press Engine
- **Articles**: Write about blockchain technology, decentralization, and privacy
- **Project Updates**: Share progress updates and milestone achievements
- **Educational Content**: Create tutorials and explainer articles for the community
- **Industry Analysis**: Provide insights on the broader Web3 ecosystem

### Submission Process:
1. Pitch your article idea via the contact form
2. Include a brief outline and target audience
3. Articles should be 800-2000 words with proper citations
4. Follow our editorial guidelines for tone and style
5. After review, the article will be published on press.logos.co

---

## Community Events & Circles
- **Host Local Meetups**: Organize Logos community gatherings in your city
- **Online Workshops**: Conduct educational sessions about decentralization
- **Conference Representation**: Represent Logos at blockchain conferences and events
- **Partnership Events**: Collaborate with other Web3 projects for joint events

### Event Planning Support:
- Marketing materials and swag provided
- Technical speakers can be arranged
- Budget support available for qualifying events
- Post-event reporting and community feedback

---

## Translation & Localization
- **Documentation Translation**: Translate technical docs into your native language
- **Website Localization**: Help localize logos.co and related sites
- **Community Content**: Translate blog posts and educational materials
- **UI/UX Translation**: Translate application interfaces and user guides

### Languages We Need:
- Spanish, French, German, Portuguese
- Chinese (Simplified/Traditional), Japanese, Korean
- Arabic, Hindi, Russian
- And many others!

---

## Design & Creative
- **UI/UX Design**: Create user interface designs and user experience improvements
- **Brand Assets**: Design logos, illustrations, and marketing materials
- **Infographics**: Create visual explanations of complex technical concepts
- **Video Content**: Produce educational and promotional videos

---

## Communication
- **Social Media Management**: Help manage X, LinkedIn, and other social platforms
- **Community Management**: Moderate Discord/Telegram and engage with community members
- **PR & Outreach**: Help with media relations and partnership outreach
- **Content Strategy**: Develop content calendars and communication strategies

---

## Business Development

### Partnerships
- **Ecosystem Partnerships**: Identify and develop relationships with complementary projects
- **Academic Collaborations**: Connect with universities and research institutions
- **Enterprise Outreach**: Engage with potential enterprise users and partners

### Strategy & Operations
- **Market Research**: Conduct research on competitive landscape and market opportunities
- **Business Analysis**: Analyze metrics and provide insights for strategic decisions
- **Process Improvement**: Help streamline operations and improve efficiency
`

const ProposalGuidelines = () => {
  return (
    <div className="border-primary mt-20 border p-8">
      <Markdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          p({ children }) {
            return <p className="!mb-3 !text-base !leading-7 last:mb-0">{children}</p>
          },
          img({ src, alt, title }) {
            return (
              <img
                src={src}
                alt={alt || ''}
                className="mx-auto my-6 max-h-[500px] w-auto max-w-full"
                style={{ objectFit: 'contain', objectPosition: 'center' }}
                loading="eager"
              />
            )
          },
          h1({ children }) {
            return <h1 className="!mb-4 !text-3xl font-semibold">{children}</h1>
          },
          h2({ children }) {
            return <h2 className="!mt-4 !mb-3 !text-2xl font-semibold">{children}</h2>
          },
          h3({ children }) {
            return <h3 className="!mt-3 !mb-2 !text-xl font-semibold">{children}</h3>
          },
          h4({ children }) {
            return <h4 className="!mt-3 !mb-2 !text-lg font-semibold">{children}</h4>
          },
          ol({ children }) {
            return <ol className="list-outside list-decimal pl-6">{children}</ol>
          },
          ul({ children }) {
            return <ul className="list-outside list-disc pl-6">{children}</ul>
          },
          li({ children }) {
            return <li className="mb-4 list-item">{children}</li>
          },
          a({ children, href }) {
            return (
              <a className="text-blue-500 hover:underline" href={href}>
                {children}
              </a>
            )
          },
          table: ({ children }) => (
            <div className="my-6 overflow-x-auto rounded-md border border-gray-300 shadow-sm dark:border-gray-600">
              <table className="w-full border-collapse">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="border-b border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="border-r border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-900 last:border-r-0 dark:border-gray-600 dark:text-white">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-r border-gray-200 px-4 py-3 text-sm whitespace-nowrap text-gray-700 last:border-r-0 dark:border-gray-600 dark:text-gray-300">
              {children}
            </td>
          ),
          hr: () => <hr className="border-primary my-10" />,
          blockquote({ children }) {
            return (
              <blockquote className="relative rounded-sm border-s-4 border-gray-800 bg-[--code-block-background] px-4 py-2">
                {children}
              </blockquote>
            )
          },
        }}
      >
        {content}
      </Markdown>
    </div>
  )
}

export default ProposalGuidelines
