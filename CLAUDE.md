# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Development workflow:**
```bash
yarn dev                # Start development server at http://localhost:3000
yarn build              # Production build + post-build processing (generates tag counts, search index, RSS)
yarn serve              # Start production server
yarn lint               # ESLint with auto-fix for pages, app, components, lib, layouts, scripts
yarn analyze            # Bundle analysis with @next/bundle-analyzer
yarn clean              # Remove .next and .contentlayer directories
```

**Package manager:** Uses Yarn 3.6.3 with packageManager field set

**Additional commands:**
```bash
yarn start              # Alternative to yarn dev
```

## Architecture Overview

This is a **Next.js 15** blog built with the **App Router** using **React Server Components**. Content is managed via **Contentlayer2** which processes MDX files into typed content objects.

### Core Technologies
- **Next.js 15.2.4** with App Router and React Server Components
- **Contentlayer2 0.5.5** for content management and MDX processing
- **Tailwind CSS 4.0.17** for styling with PostCSS
- **Pliny 0.4.0** for analytics, search, comments, and newsletter functionality
- **TypeScript** for type safety with strict null checks
- **React 19.0.0** and **React DOM 19.0.0**

### Content Management System

**Content structure:**
- Blog posts: `data/blog/*.mdx` with YYYY-MM-DD prefixed filenames
- Authors: `data/authors/*.mdx` 
- Bibliography: `data/*.bib` files for citations
- Static assets: `public/static/`

**Content processing pipeline:**
- **Remark plugins**: GitHub-flavored markdown, math, code titles, image optimization, GitHub alerts, custom inline footnote conversion
- **Rehype plugins**: Syntax highlighting (Prism Plus with line numbers), auto-linking headers, KaTeX math, citations with tooltips, minification
- **Custom processing**: `convert-inline-footnotes.js` converts `^[text]` syntax to proper footnotes
- **Frontmatter schema**: title, date, tags, authors, summary, layout, draft, images, canonicalUrl, bibliography, lastmod
- **Computed fields**: reading time, slug generation (removes date prefix), table of contents, structured data for SEO

**Important content conventions:**
- Blog post filenames: `YYYY-MM-DD-post-title.mdx` (date prefix auto-removed from URLs)
- Frontmatter follows Hugo standards
- Authors field should match filenames in `data/authors/`
- Layout field should match layout components in `layouts/`

### Key Configuration Files

**Site configuration:**
- `data/siteMetadata.js` - Core site metadata, analytics, newsletter, comments configuration
- `contentlayer.config.ts` - Content schema, MDX plugins, post-build hooks (tag counting, search indexing)
- `next.config.js` - Next.js config with security headers, CSP, redirects, and webpack customization
- `tailwind.config.js` - Tailwind CSS configuration with custom theme, typography plugin
- `postcss.config.js` - PostCSS configuration for Tailwind processing

**TypeScript & Path Configuration:**
- `tsconfig.json` - TypeScript configuration with path aliases and strict null checks
- `jsconfig.json` - JavaScript path aliases for non-TS files
- **Path aliases**: `@/components/*`, `@/data/*`, `@/layouts/*`, `@/css/*`, `contentlayer/generated`

**Code Quality Configuration:**
- `.eslintrc.js` - ESLint with TypeScript, accessibility, Prettier, and Next.js rules
- `.eslintignore` - Excludes node_modules, .eslintrc.js, and public directory
- `prettier.config.js` - Prettier with Tailwind plugin, custom formatting rules
- `.husky/pre-commit` - Git pre-commit hooks running lint-staged
- `package.json lint-staged` - Auto-fixes ESLint and Prettier on staged files

**Customization files:**
- `data/headerNavLinks.ts` - Navigation menu items
- `data/projectsData.ts` - Project showcase data
- `components/MDXComponents.tsx` - Custom components available in MDX content
- `types/blog.ts` - TypeScript interfaces for blog frontmatter

### Layout System

**Blog layouts (in `layouts/`):**
- `PostLayout` - Default 2-column layout with meta and author info
- `PostSimple` - Simplified single-column layout  
- `PostBanner` - Layout with banner image

**List layouts:**
- `ListLayoutWithTags` - Current default with tag sidebar
- `ListLayout` - Version 1 style with search bar

### App Router Structure

**Dynamic routes:**
- `app/blog/[...slug]/page.tsx` - Individual blog posts (supports nested routing)
- `app/blog/page/[page]/page.tsx` - Paginated blog listings
- `app/tags/[tag]/page.tsx` - Tag-specific post listings

**Static pages:**
- `app/page.tsx` - Homepage
- `app/about/page.tsx` - About page
- `app/projects/page.tsx` - Projects showcase

### Build Process

The build process includes automated post-build processing:

**During Contentlayer processing (`contentlayer.config.ts`):**
1. Generate `app/tag-data.json` with tag occurrence counts for all published posts
2. Create search index at `public/search.json` for Kbar search functionality

**Post-build script execution (`scripts/postbuild.mjs`):**
3. Generate RSS feeds (`scripts/rss.mjs`):
   - Main RSS feed at `public/feed.xml`
   - Individual tag-based RSS feeds at `public/tags/[tag]/feed.xml`
4. Process sitemaps and robots.txt (via Next.js app router)

**Security and Performance:**
- Content Security Policy (CSP) headers for XSS protection
- Security headers: Referrer-Policy, X-Frame-Options, X-Content-Type-Options, HSTS
- SVG processing via @svgr/webpack for optimized icon imports
- Image optimization with next/image and remote pattern allowlisting
- Bundle analysis available via `yarn analyze`

### Special Features

**Citation system:**
- Bibliography files in `data/*.bib` 
- Citations rendered with hover tooltips
- Automatic bibliography generation

**Search functionality:**
- Kbar command palette search (default)
- Search documents generated at build time

**Analytics integration:**
- Google Analytics, Umami, Plausible, Simple Analytics support via Pliny
- Newsletter providers: Mailchimp, Buttondown, Convertkit, Klaviyo, Revue, Emailoctopus

**Content enhancements:**
- Math rendering via KaTeX
- Syntax highlighting with line numbers (rehype-prism-plus)
- Table of contents auto-generation from headings
- Image optimization with next/image
- Reading time calculation
- Custom inline footnote syntax (`^[footnote text]`) converted to proper footnotes
- GitHub-style alerts and blockquotes
- Auto-linking headers with custom icons

## Development Workflow

### Code Quality Automation
- **Pre-commit hooks**: Husky runs lint-staged on every commit
- **Automated formatting**: Prettier with Tailwind class sorting
- **Linting**: ESLint with TypeScript, accessibility, and Next.js rules
- **Type checking**: TypeScript with strict null checks enabled

### Content Development
- **Live reload**: Content changes trigger automatic rebuilds via Contentlayer
- **Draft posts**: Use `draft: true` in frontmatter to exclude from production
- **Tag management**: Tags automatically generate count data and RSS feeds
- **Citation support**: Add `.bib` files to `data/` directory for academic citations

### Build Artifacts
The following files are auto-generated and should not be edited manually:
- `app/tag-data.json` - Tag occurrence counts
- `public/search.json` - Search index for Kbar
- `public/feed.xml` - Main RSS feed
- `public/tags/*/feed.xml` - Tag-specific RSS feeds
- `.contentlayer/` - Generated content types and data
- `.next/` - Next.js build output

## Testing Setup

**Current state**: No testing framework is currently configured.

**Recommended additions** for future development:
- Jest for unit testing
- React Testing Library for component testing  
- Playwright or Cypress for E2E testing
- Testing setup for MDX content processing

## Important Development Notes

1. **Path Aliases**: Use `@/components/*`, `@/data/*`, etc. for clean imports
2. **Content Date Format**: Blog posts must use `YYYY-MM-DD-` prefix in filename
3. **Environment Variables**: Configure analytics, newsletter, and comment providers via `data/siteMetadata.js`
4. **Custom Components**: Add reusable components to `components/MDXComponents.tsx` for use in MDX content
5. **Security**: CSP is configured - add new domains to `next.config.js` if needed
6. **Performance**: Use `yarn analyze` to check bundle size before major releases