---
date: 2021-06-12
title: Setting Up Husky, Prettier, and ESLint with precise-commits and lint-staged
template: post
thumbnail: "../thumbnails/prettier.png"
slug: husky-prettier-eslint-precise-commits-lint-staged-pre-commit-pre-push
categories:
  - Toolchain

tags:
  - eslint
  - prettier
---

# Automatically Format and Lint Code with Git Hooks

I wanted to set up automatic code formatting and linting before a `git commit` (pre-commit) or before a `git push` (pre-push) that was independent from each of my team-member's IDE specific setup.

Having a gated `git push` also prevents lint-failing code from being pushed up to out team's remote branches.

## Set up ESLint and Prettier

I've previously written about how to set up ESLint for a mixed TypeScript and JavaScript codebase, and you can see an example of an ESLint config set up to parse both [TypeScript and JavaScript Files](https://duncanleung.com/eslint-mixed-javascript-typescript-files-codebase/)

Setting up a Prettier config is relatively straightforward, but ideally should be discussed with your own team's opinions.

<div class="filename">.prettierrc</div>

```bash
{
  "arrowParens": "always",
  "bracketSpacing": true,
  "embeddedLanguageFormatting": "auto",
  "htmlWhitespaceSensitivity": "css",
  "insertPragma": false,
  "jsxBracketSameLine": false,
  "jsxSingleQuote": true,
  "printWidth": 80,
  "proseWrap": "preserve",
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "useTabs": false
}
```

## Set Up Husky Git Hooks

Husky simplifies the set up to use run scripts on specific git hooks.

Here are example scripts that will be run on the `pre-commit` and `pre-push` git hooks with Husky.

```json
{
  "scripts": {
    "prepare": "husky install",
    "format": "prettier --write .",
    "test": "jest"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint"]
  },
  "lint-prepush": {
    "base": "develop",
    "tasks": {
      "*.{js,jsx,ts,tsx}": ["eslint"]
    }
  },
  "devDependencies": {
    "eslint": "^7.27.0",
    "husky": "^6.0.0",
    "jest": "^26.6.3",
    "lint-prepush": "^2.2.0",
    "lint-staged": "^11.0.0",
    "precise-commits": "^1.0.2",
    "prettier": "^2.3.0"
  }
}
```

<div class="filename">.husky/pre-commit</div>

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

yarn precise-commits && yarn lint-staged
```

<div class="filename">.husky/pre-push</div>

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

yarn lint-prepush && yarn test --bail
```

## precise-commits vs lint-staged

precise-commits and lint-staged are two helpful packages to minimize the scope that Prettier and ESLint are concerned with.

precise-commits

- Only reformats the exact code that has been modified
- Only deals with code formatting with Prettier
- Does not deal with ESLint

lint-staged

- Allows running ESLint and arbitrary shell tasks against staged git files
- Only lints files that will be committed
