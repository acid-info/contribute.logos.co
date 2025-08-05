# Logos Next.js + TailwindCSS Template

A starter template built with **Next.js** and **TailwindCSS**.

## Getting Started

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
