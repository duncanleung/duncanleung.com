---
date: 2020-04-10
title: Set Up Storybook Decorators - React Intl Provider
template: post
thumbnail: "../thumbnails/storybook.png"
slug: storybook-decorators-react-intl-provider
categories:
  - Storybook
tags:
  - storybook
  - react-intl
---

https://storybook.js.org/docs/basics/writing-stories/#decorators

## Problem: Storybook Not Passing React Intl Locales

I was running into an issue setting up Storybook with React Intl (through gatsby-plugin-intl) and Emotion Theming.

I was receiving an error:

```terminal
Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.

Check the render method of `storyFn`.
```

<div class="filename">.storybook/preview.js</div>

```js
import { ThemeProvider } from "emotion-theming";
import theme from "~/theme";

addDecorator((story) => (
  <>
    <GlobalStyles />
    <ThemeProvider theme={theme}>
      <div style={{ padding: "3rem" }}>{story()}</div>
    </ThemeProvider>
  </>
));
```

<div class="filename">~/src/components/App.tsx</div>

```js{4}
import React, { ReactNode } from "react";
import { ThemeProvider } from "emotion-theming";

import theme from "~/theme";
import { ModalProvider } from "~/components/Modal";

/**
 * This component provides a reusable application wrapper for use
 * in Gatsby API's, testing, etc.
 */
const App = ({ element }: { element: ReactNode }) => {
  return (
    <ThemeProvider theme={theme}>
      <ModalProvider>{element}</ModalProvider>
    </ThemeProvider>
  );
};

export default App;
```

## Setting Up .storybook/webpack.config.js

A <a href='https://storybook.js.org/docs/configurations/custom-webpack-config/#full-control-mode' target="_blank" rel="noopener noreferrer">custom webpack config for Storybook</a> needs to be set up to specify `@svgr/webpack` as a webpack loader for `.svg` assets.

> The `@svgr/webpack` loader rule needs to occur before that other loaders like the `file-loader` rule so that `@svgr/webpack` takes precedence.

Place the `@svgr/webpack` loader <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift" target="_blank" rel="noopener noreferrer">before existing webpack asset loaders using `Array.prototype.unshift()`</a>.

<div class="filename">.storybook/preview.js</div>

```js
// Global Styles ==============================
addDecorator((story) => (
  <>
    <GlobalStyles />
    <div style={{ padding: "3rem" }}>{story()}</div>
  </>
));

// Emotion Theme Provider =====================
addDecorator(EmotionThemeProvider);

// gatsby-plugin-intl Provider ================
// Set supported locales
export const locales = ["en-us", "es-es"];

// Import translation messages
export const messages = locales.reduce((acc, locale) => {
  return {
    ...acc,
    [locale]: require(`../src/locales/${locale}.json`),
  };
}, {});

const getMessages = (locale) => messages[locale];

// Set `storybook-addon-intl` configuration (handles `react-intl`)
setIntlConfig({
  locales,
  defaultLocale: "en-us",
  getMessages,
});

// Load the locale data for all your supported locales
addLocaleData(enLocaleData);
addLocaleData(esLocaleData);

// Register decorators
// Adds gatsby-plugin-intl IntlContextProvider which wraps the Gatsby Link component
addDecorator(GatsbyIntlProvider);
// Adds react-intl
addDecorator(withIntl);
```

## Gatsby Starter: TypeScript + Emotion + Storybook

If you want to see the full config in a project, I created a Gatsby Starter that uses **Gatsby** + **TypeScript** + **Emotion** + **Storybook** + **React Intl** + **SVGR** + **Jest**.

Check it out at: <a href='https://github.com/duncanleung/gatsby-typescript-emotion-storybook/blob/master/.storybook/webpack.config.js#L55-L68' target="_blank" rel="noopener noreferrer">Gatsby Starter: TypeScript + Emotion + Storybook</a>
