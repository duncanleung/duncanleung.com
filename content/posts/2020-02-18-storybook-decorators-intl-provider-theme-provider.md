---
date: 2020-02-18
title: Set Up Storybook Decorators - Intl Provider and Theme Provider
template: post
thumbnail: "../thumbnails/storybook.png"
slug: storybook-decorators-intl-provider-theme-provider
categories:
  - Storybook
tags:
  - storybook
  - emotion
  - css-in-js
  - react-intl
  - theme
---

https://storybook.js.org/docs/basics/writing-stories/#decorators

## Storybook Not Importing SVGs

I was running into an issue where SVG imports in Storybook were `undefined` instead of being imported as React components.

```js{4}
import React from "react";
import { ReactComponent as ArrowUpIcon } from "~/icons/icon-up-arrow.svg";

console.log(ArrowUpIcon); // undefined
```

```terminal
Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined.

You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.

Invariant Violation: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined.
```

#### Alternative Error: Failed to execute 'createElement' on 'Document'

I also came across this Stack Overflow thread where SVG imports result in an incorrect SVG path: <a href="https://stackoverflow.com/questions/54292667/react-storybook-svg-failed-to-execute-createelement-on-document" target="_blank" rel="noopener noreferrer">React Storybook SVG Failed to execute 'createElement' on 'Document'</a>

```terminal
Failed to execute 'createElement' on 'Document': The tag name provided ('static/media/border.inline.258eb86a.svg') is not a valid name.

Error: Failed to execute 'createElement' on 'Document': The tag name provided ('static/media/border.inline.258eb86a.svg') is not a valid name.
```

The fix is the same - setting up a custom Storybook webpack config.

## Storybook Default webpack Config Conflict

Storybook has a <a href="https://github.com/storybookjs/storybook/blob/next/lib/core/src/server/preview/base-webpack.config.js#L65-L68" target="_blank" rel="noopener noreferrer">default webpack config</a> which specifies `file-loader` for SVG assets which is the cause of the incorrectly imported SVGs.

<div class="filename">base-webpack.config.js - Line 64 - Line 69</div>

```js{3}
{
  test: /\.(svg|ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/,
  loader: require.resolve('file-loader'),
  query: {
    name: 'static/media/[name].[hash:8].[ext]',
  },
},
```

## Setting Up .storybook/webpack.config.js

A <a href='https://storybook.js.org/docs/configurations/custom-webpack-config/#full-control-mode' target="_blank" rel="noopener noreferrer">custom webpack config for Storybook</a> needs to be set up to specify `@svgr/webpack` as a webpack loader for `.svg` assets.

> The `@svgr/webpack` loader rule needs to occur before that other loaders like the `file-loader` rule so that `@svgr/webpack` takes precedence.

Place the `@svgr/webpack` loader <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift" target="_blank" rel="noopener noreferrer">before existing webpack asset loaders using `Array.prototype.unshift()`</a>.

<div class="filename">.storybook/webpack.config.js</div>

```js{11-14}
// Add SVGR Loader
// ========================================================
const assetRule = config.module.rules.find(({ test }) => test.test(".svg"));

const assetLoader = {
  loader: assetRule.loader,
  options: assetRule.options || assetRule.query
};

// Merge our rule with existing assetLoader rules
config.module.rules.unshift({
  test: /\.svg$/,
  use: ["@svgr/webpack", assetLoader]
});

// ... other configs
```

## Gatsby Starter: TypeScript + Emotion + Storybook

If you want to see the full config in a project, I created a Gatsby Starter that uses **Gatsby** + **TypeScript** + **Emotion** + **Storybook** + **React Intl** + **SVGR** + **Jest**.

Check it out at: <a href='https://github.com/duncanleung/gatsby-typescript-emotion-storybook/blob/master/.storybook/webpack.config.js#L55-L68' target="_blank" rel="noopener noreferrer">Gatsby Starter: TypeScript + Emotion + Storybook</a>
