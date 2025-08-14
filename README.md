# Logos Contribute

**Logos Contribute** is a contribution hub that recognizes open source contributors and helps new developers make their first contributions. By showcasing contributor activity and offering curated resources, it aims to strengthen the Logos ecosystem and accelerate organic community growth.

## Purpose

- Highlight and celebrate open source contributors within the Logos ecosystem.
- Provide clear pathways for new developers to make their first meaningful contributions.

## Benefits for the Open Source Community

- **Stronger community bonds**: Recognizing contributors helps retain and motivate developers to stay engaged in the ecosystem.
- **Social proof**: Public acknowledgment enhances Logos' reputation in the open source community.
- **Lower barriers to entry**: Curated resources and contribution ideas make it easier for new developers to get started.

## Key features

* **Contributor Directory**
  * Displays Github usernames, profile links, number of contributions, latest contribution, and link to full contribution history.

* **Contributor Profiles**
  * Individual pages with contribution details and a list of all contributions.

* **Search Functionality**
  * Search by Github username or repository name.

* **Contribution Guidelines**
  * Provide clear instructions and best practices for open source contributions.
  * All content is maintained on Github in markdown format.
  * Suggestions can be submitted and reviewed through Github Issues.

## Getting Started

### Tech Stack

* **Next.js 15** and **React 19** for the core application framework
* **Tailwind CSS 4** with PostCSS and `tailwind-merge` for styling and utility class management
* **next-intl** for internationalization support
* **MDX**, Remark, and Rehype plugins for content processing
* **@acid-info/lsd-react** for UI components
* **TypeScript** for type-safe development
* **ESLint** with Prettier and Tailwind plugins for code linting and formatting
* **Vitest** for testing
* **Husky** and **lint-staged** for pre-commit checks


### Install dependencies and run the development server

```bash
pnpm install
pnpm dev
```

### Production build and start

```bash
pnpm build
pnpm start
```

### Static export

To enable static export, update `next.config.js`:

```javascript
// next.config.js
module.exports = () => {
  const plugins = [withBundleAnalyzer]
  return plugins.reduce((acc, next) => next(acc), {
    // for static builds
    output: 'export',
    ...
```

Then build the project:

```bash
pnpm build
# Run any web server you prefer and host the /out directory.
# Below is an example using http-server (install it globally first):
http-server out
```
