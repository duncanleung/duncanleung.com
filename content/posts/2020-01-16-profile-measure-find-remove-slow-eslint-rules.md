---
date: 2020-01-16
title: Profile and Remove Slow ESLint Rules
template: post
thumbnail: "../thumbnails/eslint.png"
slug: profile-measure-find-remove-slow-eslint-rules
categories:
  - Toolchain
tags:
  - eslint
---

## Profile and Remove Slow Running ESLint Rules

I was reviewing our project's ESLint config and I noticed that our lint process was running quite slow.

Here was my process to identify and eliminate slow and unnecessary rules.

### Profile ESLint Runtime of Each Rule

Prefixing the `eslint` command with <a href="https://eslint.org/docs/developer-guide/working-with-rules#performance-testing" target="_blank">`TIMING=1` profiles the time spent running</a> each individual ESLint rule.

```bash
$ TIMING=1 eslint ./
```

### Review the ESLint Config

`TIMING=1` revealed that the `prettier/prettier` rule was taking up ~70% of the lint runtime for our project!

```bash{5}
$ TIMING=1 eslint ./

Rule                                | Time (ms) | Relative
:-----------------------------------|----------:|--------:
prettier/prettier                   |   451.628 |    69.2%
import/no-unresolved                |    26.703 |     4.1%
import/no-extraneous-dependencies   |    22.003 |     3.4%
no-unused-vars                      |     9.794 |     1.5%
no-redeclare                        |     8.697 |     1.3%
react/jsx-no-bind                   |     7.798 |     1.2%
import/no-named-as-default-member   |     6.610 |     1.0%
react/no-deprecated                 |     5.764 |     0.9%
react/destructuring-assignment      |     5.180 |     0.8%
react/void-dom-elements-no-children |     4.900 |     0.8%
```

I had originally set up our ESLint config with <a href="https://github.com/prettier/eslint-plugin-prettier" target="_blank">`eslint-plugin-prettier` to run Prettier as an ESLint rule</a> through this config:

<div class="filename">.eslintrc.js</div>

```js
{
  "extends": ["plugin:prettier/recommended"]
}
```

The alternative would be to run Prettier through the <a href='https://github.com/prettier/prettier-vscode' target="_blank">prettier-vscode</a> Visual Studio Code extension. However, my intention of running Prettier as an ESLint plugin was to eliminate the dependency on any IDE extension to run Prettier.

The cause of the slow ESLint runtime with `eslint-plugin-prettier` is because that plugin also runs Prettier under the hood to detect and raise issues when the code differs from Prettier's expected output.

### Utilize eslint-config-prettier

The slow lint speed of `eslint-plugin-prettier` was not worth the cost of eliminating an IDE extension.

I still needed a config to turn off formatting-related ESLint rules that conflict with Prettier, so I used the configuration package, `eslint-config-prettier`, to configure the ESLint rule set to turn off rules that conflict with Prettier.

> The `eslint-config-prettier` config has to be the last config in order to ensure it overrides other configs.

<div class="filename">.eslintrc.js</div>

```js
{
  "extends": [
    // Other configs ...
    "prettier"
  ]
}
```

```bash
Rule                                | Time (ms) | Relative
:-----------------------------------|----------:|--------:
import/no-unresolved                |    23.946 |    13.2%
import/no-extraneous-dependencies   |    13.031 |     7.2%
no-unused-vars                      |    11.619 |     6.4%
react/jsx-no-bind                   |     7.377 |     4.1%
react/no-deprecated                 |     6.323 |     3.5%
no-redeclare                        |     5.892 |     3.2%
react/prefer-stateless-function     |     5.601 |     3.1%
react/destructuring-assignment      |     5.105 |     2.8%
react/void-dom-elements-no-children |     4.607 |     2.5%
```
