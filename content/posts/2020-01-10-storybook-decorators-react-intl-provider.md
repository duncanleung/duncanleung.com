---
date: 2020-01-10
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

Related Post: [Set Up Storybook Decorators - Emotion Theme Provider](/storybook-decorators-emotion-theme-provider/)

## Problem: Storybook Not Passing Locales to React Intl Provider

I was running into an issue setting up Storybook with React Intl (through **gatsby-plugin-intl**) and **storybook-addon-intl**.

In the actual Gatsby app, **gatsby-plugin-intl** passes locales via the config object in `gatsby-config.js`.

I had set up the relevant **storybook-addon-intl** `withIntl` decorator in `.storybook/preview.js`, and had also loaded the locale data using **gatsby-plugin-intl**'s `addLocaleData`. But there was no documentation on how to provide locales into **gatsby-plugin-intl**'s Provider.

<div class="filename">gatsby-config.js</div>

```js{22,23}
// ... other configs

// Get and parse language sets provided by env var
const languages = process.env.GATSBY_SUPPORTED_LANGUAGES.split(
  ","
).map((item) => item.trim());

const languagesArray = process.env.GATSBY_SUPPORTED_LANGUAGES.split(",");

languagesArray.forEach((lang) => {
  excludedPages.push(
    ...excludedPagesList.map((page) => `/${lang.trim() + page}`)
  );
});

// Initial Gastby plugins array
const plugins = [
  // ... other plugins
  {
    resolve: "gatsby-plugin-intl",
    options: {
      path: `${__dirname}/src/locales`,
      languages,
      defaultLanguage: process.env.GATSBY_DEFAULT_LANGUAGE,
      redirect: false,
    },
  },
];
```

<div class="filename">.storybook/preview.js</div>

```js{32,33,36}
// !! This does not work

import { setIntlConfig, withIntl } from "storybook-addon-intl";

import { addLocaleData } from "gatsby-plugin-intl";
import enLocaleData from "react-intl/locale-data/en";
import esLocaleData from "react-intl/locale-data/es";

// ... other decorators

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

// Adds storybook-addon-intl
addDecorator(withIntl);
```

## Manually Setting Up IntlContextProvider

After digging around the **gatsby-plugin-intl** source code, I noticed that an <a href="https://github.com/wiziple/gatsby-plugin-intl/blob/master/src/index.js#L4" target="_blank">`IntlContextProvider` was being exported</a>.

I was able to pass a similar config object from `gatsby-config.js` into this provider, and set it up as another Storybook decorator.

<div class="filename">.storybook/decorators/GatsbyIntlProvider.js</div>

```js{15-17}
import React from "react";
import { IntlContextProvider } from "gatsby-plugin-intl/intl-context";

import { locales, messages } from "../preview";

const intlConfig = {
  language: "en-us",
  languages: locales,
  messages: messages,
  originalPath: "/",
  redirect: true,
  routed: true,
};

const GatsbyIntlProvider = (storyFn) => (
  <IntlContextProvider value={intlConfig}>{storyFn()}</IntlContextProvider>
);

export default GatsbyIntlProvider;
```

<div class="filename">.storybook/preview.js</div>

```js{34}
import { setIntlConfig, withIntl } from "storybook-addon-intl";

import { addLocaleData } from "gatsby-plugin-intl";
import enLocaleData from "react-intl/locale-data/en";
import esLocaleData from "react-intl/locale-data/es";

import { GatsbyIntlProvider } from "./decorators";

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

// Adds gatsby-plugin-intl IntlContextProvider
addDecorator(GatsbyIntlProvider);

// Adds storybook-addon-intl
addDecorator(withIntl);

// ... other decorators
```

## Gatsby Starter: TypeScript + Emotion + Storybook

If you want to see the full config in a project, I created a Gatsby Starter that uses **Gatsby** + **TypeScript** + **Emotion** + **Storybook** + **React Intl** + **SVGR** + **Jest**.

Check it out at: <a href='https://github.com/duncanleung/gatsby-typescript-emotion-storybook/blob/master/.storybook/webpack.config.js#L55-L68' target="_blank" rel="noopener noreferrer">Gatsby Starter: TypeScript + Emotion + Storybook</a>
