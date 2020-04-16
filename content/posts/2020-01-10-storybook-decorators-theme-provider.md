---
date: 2020-01-10
title: Set Up Storybook Decorators - Emotion Theme Provider
template: post
thumbnail: "../thumbnails/storybook.png"
slug: storybook-decorators-emotion-theme-provider
categories:
  - Storybook
tags:
  - storybook
  - emotion
  - css-in-js
  - theme
---

Related Post: [Set Up Storybook Decorators - React Intl Provider](/storybook-decorators-react-intl-provider/)

## Problem: Storybook Not Recognizing Emotion Theme Provider

I was running into an issue setting up Storybook with Emotion Theming.

I was receiving an error when attempting to create a Storybook decorator with Emotion's `<ThemeProvider />`:

```terminal
Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.

Check the render method of `storyFn`.
```

I had set up Emotion's Theme provider in Storybook `.storybook/preview.js` in the similar pattern that React context providers are set up - Using a provider to pass the current theme to the tree below.

<div class="filename">.storybook/preview.js</div>

```js{9,11}
// !! This does not work

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

This was the pattern used in our parent `<App />` React component.

<div class="filename">~/src/components/App.tsx</div>

```js{13,15}
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

## Extract ThemeProvider into its own Decorator

The fix is to extract Emotion's `<ThemeProvider />` into its own decorator.

<div class="filename">.storybook/preview.js</div>

```js{10}
import React from "react";

import { addDecorator } from "@storybook/react";

import { EmotionThemeProvider } from "./decorators";
import GlobalStyles from "../src/components/Layout/GlobalStyles";

// Global Styles ==============================
addDecorator((story) => (
  <>
    <GlobalStyles />
    <div style={{ padding: "3rem" }}>{story()}</div>
  </>
));

// Emotion Theme Provider =====================
addDecorator(EmotionThemeProvider);

// ... other decorators
```

<div class="filename">.storybook/decorators/EmotionThemeProvider.js</div>

```js{5-7}
import React from "react";
import { ThemeProvider } from "emotion-theming";
import theme from "~/theme";

const EmotionThemeProvider = (storyFn) => (
  <ThemeProvider theme={theme}>{storyFn()}</ThemeProvider>
);

export default EmotionThemeProvider;
```

## Gatsby Starter: TypeScript + Emotion + Storybook

If you want to see the full config in a project, I created a Gatsby Starter that uses **Gatsby** + **TypeScript** + **Emotion** + **Storybook** + **React Intl** + **SVGR** + **Jest**.

Check it out at: <a href='https://github.com/duncanleung/gatsby-typescript-emotion-storybook/blob/master/.storybook/webpack.config.js#L55-L68' target="_blank" rel="noopener noreferrer">Gatsby Starter: TypeScript + Emotion + Storybook</a>
