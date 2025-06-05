# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Development workflow:**
```bash
yarn dev                # Start development server at http://localhost:3000
yarn build              # Production build + post-build processing (generates tag counts, search index)
yarn serve              # Start production server
yarn lint               # ESLint with auto-fix for pages, app, components, lib, layouts, scripts
yarn analyze            # Bundle analysis
```

**Package manager:** Uses Yarn 3.6.3 with packageManager field set

## Architecture Overview

This is a **Next.js 15** blog built with the **App Router** using **React Server Components**. Content is managed via **Contentlayer2** which processes MDX files into typed content objects.

### Core Technologies
- **Next.js 15.2.4** with App Router and React Server Components
- **Contentlayer2 0.5.5** for content management and MDX processing
- **Tailwind CSS 4.0.17** for styling
- **Pliny 0.4.0** for analytics, search, comments, and newsletter functionality
- **TypeScript** for type safety

### Content Management System

**Content structure:**
- Blog posts: `data/blog/*.mdx` with YYYY-MM-DD prefixed filenames
- Authors: `data/authors/*.mdx` 
- Bibliography: `data/*.bib` files for citations
- Static assets: `public/static/`

**Content processing pipeline:**
- **Remark plugins**: GitHub-flavored markdown, math, code titles, image optimization, GitHub alerts
- **Rehype plugins**: Syntax highlighting (Prism), auto-linking headers, KaTeX math, citations with tooltips
- **Frontmatter schema**: title, date, tags, authors, summary, layout, draft, images, canonicalUrl
- **Computed fields**: reading time, slug generation (removes date prefix), table of contents

**Important content conventions:**
- Blog post filenames: `YYYY-MM-DD-post-title.mdx` (date prefix auto-removed from URLs)
- Frontmatter follows Hugo standards
- Authors field should match filenames in `data/authors/`
- Layout field should match layout components in `layouts/`

### Key Configuration Files

**Site configuration:**
- `data/siteMetadata.js` - Core site metadata, analytics, newsletter, comments configuration
- `contentlayer.config.ts` - Content schema, MDX plugins, post-build hooks (tag counting, search indexing)
- `next.config.js` - Next.js config with security headers and CSP

**Customization files:**
- `data/headerNavLinks.ts` - Navigation menu items
- `data/projectsData.ts` - Project showcase data
- `components/MDXComponents.tsx` - Custom components available in MDX content

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

The build process includes post-build scripts that:
1. Generate `app/tag-data.json` with tag occurrence counts
2. Create search index at `public/search.json` for Kbar search
3. Process RSS feeds and sitemaps

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
- Syntax highlighting with line numbers
- Table of contents auto-generation
- Image optimization with next/image
- Reading time calculation