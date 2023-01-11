---
date: 2023-01-11
title: Tailwind CSS Unknown at Rule
template: post
thumbnail: "../thumbnails/css.png"
slug: tailwind-css-unknown-at-rule
categories:
  - CSS
tags:
  - tailwind
  - css
---

## VSCode warning for Tailwind Directives

I was running into an issue with VSCode warnings on CSS "Unknown at rule" for Tailwind directives.



<div class="filename">./styles/globals.css</div>

```css{3}
@tailwind base;
^^^^^^^^^ 
Unknown at rule @tailwind css(unknownAtRules)

```

<div class="filename">./styles/globals.css</div>

```css{5}
@layer base {
  * {
    @apply text-gray-dark;
    ^^^^^^^^ 
    Unknown at rule @apply css(unknownAtRules)
  }
}
```

## VSCode Solution: Define Custom Data for CSS

The solution was to [load a custom CSS dataset](https://code.visualstudio.com/blogs/2020/02/24/custom-data-format) for Tailwind directives in a workspace settings file `settings.json`.

A list of the different Tailwind Directives in the docs: [Functions & Directives](https://v2.tailwindcss.com/docs/functions-and-directives)

> Note: It's usually necessary to reload the VS Code window for the change to be recognized.


<div class="filename">.vscode/settings.json</div>

```json
{
  "css.customData": [".vscode/tailwindcss.json"],
}
```


<div class="filename">.vscode/tailwindcss.json</div>

```json
{
  "version": 1.1,
  "atDirectives": [
    {
      "name": "@tailwind",
      "description": "Use the `@tailwind` directive to insert Tailwind's `base`, `components`, `utilities` and `screens` styles into your CSS.",
      "references": [
        {
          "name": "Tailwind Documentation",
          "url": "https://tailwindcss.com/docs/functions-and-directives#tailwind"
        }
      ]
    },
    {
      "name": "@apply",
      "description": "Use the `@apply` directive to inline any existing utility classes into your own custom CSS. This is useful when you find a common utility pattern in your HTML that you’d like to extract to a new component.",
      "references": [
        {
          "name": "Tailwind Documentation",
          "url": "https://tailwindcss.com/docs/functions-and-directives#apply"
        }
      ]
    },
    {
      "name": "@responsive",
      "description": "You can generate responsive variants of your own classes by wrapping their definitions in the `@responsive` directive:\n```css\n@responsive {\n  .alert {\n    background-color: #E53E3E;\n  }\n}\n```\n",
      "references": [
        {
          "name": "Tailwind Documentation",
          "url": "https://tailwindcss.com/docs/functions-and-directives#responsive"
        }
      ]
    },
    {
      "name": "@screen",
      "description": "The `@screen` directive allows you to create media queries that reference your breakpoints by **name** instead of duplicating their values in your own CSS:\n```css\n@screen sm {\n  /* ... */\n}\n```\n…gets transformed into this:\n```css\n@media (min-width: 640px) {\n  /* ... */\n}\n```\n",
      "references": [
        {
          "name": "Tailwind Documentation",
          "url": "https://tailwindcss.com/docs/functions-and-directives#screen"
        }
      ]
    },
    {
      "name": "@variants",
      "description": "Generate `hover`, `focus`, `active` and other **variants** of your own utilities by wrapping their definitions in the `@variants` directive:\n```css\n@variants hover, focus {\n   .btn-brand {\n    background-color: #3182CE;\n  }\n}\n```\n",
      "references": [
        {
          "name": "Tailwind Documentation",
          "url": "https://tailwindcss.com/docs/functions-and-directives#variants"
        }
      ]
    }
  ]
}
```
