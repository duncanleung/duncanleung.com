---
date: 2020-01-06
title: Use Emotion CSS Prop in Storybook
template: post
thumbnail: "../thumbnails/storybook.png"
slug: emotion-css-prop-jsx-pragma-storybook
categories:
  - Storybook
tags:
  - storybook
  - react
  - emotion
  - css-in-js
  - webpack
---

## Storybook Not Parsing CSS Prop without JSX Pragma

I was running into an issue where my Storybook `webpack.config.js` was not correctly parsing and evaluating Emotion styles passed via the `css` prop for React components without the Emotion JSX Pragma.

Instead of evaluating a computed class name, `[object Object]` was being passed to the HTML element.

```html
<div css="[object Object]">
  <div css="[object Object]">
    <h1 css="[object Object]"></h1>
  </div>
</div>
```

<a href='https://emotion.sh/docs/css-prop' target='_blank'>The Emotion API</a> enables styling React components or element that accepts a `className` prop by using a `css` prop. Emotion evaluates the styles passed to the `css` prop to a computed class name, which is applied to the `className` prop.

The Emotion docs specify two ways to use the `css` prop:

- Setting a Babel Preset: <a href='https://emotion.sh/docs/@emotion/babel-preset-css-prop' target='_blank'>@emotion/babel-preset-css-prop</a>
- Using the <a href='https://emotion.sh/docs/css-prop#jsx-pragma' target='_blank'>JSX Pragma</a>

### Emotion CSS Prop Works in Gatsby, not Storybook

React components in Gatsby would parse and render the Emotion `css` prop styles correctly via the `@emotion/babel-preset-css-prop` by using <a href='https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-plugin-emotion/src/gatsby-node.js#L3' target='_blank'>gatsby-plugin-emotion</a> in `gatsby-config.js`.

<div class="filename">gatsby-config.js</div>

```js{2}
const plugins = [
  "gatsby-plugin-emotion"
  // ... other gatsby-plugins
];

module.exports = {
  plugins
};
```

However, Storybook needs its own webpack configuration to load the `@emotion/babel-preset-css-prop` to parse styles properly via the `css` prop without the JSX pragma.

## Setting Up .storybook/webpack.config.js

A <a href='https://storybook.js.org/docs/configurations/custom-webpack-config/#full-control-mode' target="_blank">custom webpack config for Storybook</a> needs to be set up to specify `@emotion/babel-preset-css-prop` as a babel preset.

> Order is important when setting up babel presets, and `@emotion/babel-preset-css-prop` must run **before** `@babel/preset-react` preset to convert css-prop.
>
> Note: Babel preset-ordering runs reversed. So `@emotion/babel-preset-css-prop` should be listed after `@babel/preset-react`.

<div class="filename">.storybook/webpack.config.js</div>

```ts{8,20}
const path = require("path");

module.exports = ({ config }) => {
  // use @babel/preset-react for JSX and env (instead of staged presets)
  config.module.rules[0].use[0].options.presets = [
    require.resolve("@babel/preset-react"),
    require.resolve("@babel/preset-env"),
    require.resolve("@emotion/babel-preset-css-prop")
  ];
  // ... other configs

  // Add Webpack rules for TypeScript
  // ========================================================
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve("babel-loader"),
    options: {
      presets: [
        ["react-app", { flow: false, typescript: true }],
        require.resolve("@emotion/babel-preset-css-prop")
      ]
      // ... other configs
    }
  });
  // ... other configs

  config.resolve.extensions.push(".ts", ".tsx");

  return config;
};
```

## Gatsby Starter: TypeScript + Emotion + Storybook

If you want to see the full config in a project, I created a Gatsby Starter that uses **Gatsby** + **TypeScript** + **Emotion** + **Storybook** + **React Intl** + **SVGR** + **Jest**.

Check it out at: <a href='https://github.com/duncanleung/gatsby-typescript-emotion-storybook/blob/master/.storybook/webpack.config.js' target='_blank'>Gatsby Starter: TypeScript + Emotion + Storybook</a>
