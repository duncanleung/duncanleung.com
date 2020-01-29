---
date: 2020-1-28
title: How to Setup ESLint .eslintrc Config
template: post
thumbnail: "../thumbnails/eslint.png"
slug: how-to-setup-eslint-eslintrc-config-difference-eslint-config-plugin
categories:
  - Toolchain

tags:
  - eslint
---

### Jump to an article section:

- [ESLint: An Overview](#-eslint-an-overview)
- [Step by Step: How to Configure .eslintrc](#-step-by-step-how-to-configure-eslintrc)

## 💡 How to Determine the Required ESLint Config

I was reviewing our React + TypeScript project's ESLint config to debug conflicting settings that were causing ESLint to miss errors in large portions of our codebase.

Unfortunately, official documentation, blogs, and StackOverflow answers on ESLint all have varying instructions on how ESLint `.eslintrc` config should be set up.

There were multiple differing recommendations on which plugins and parsers needed to be declared, or environment values that needed to be added.

After getting our project's ESLint config set up, I discovered the best way to determine the values needed to set up an `.eslintrc` config is to look at the source code for the **eslint-config-\*** and **eslint-plugin-\*** that you intend to use.

I'll provide an example, but first let's look at the main sections of an `.eslintrc` config file.

## 📝 ESLint: An Overview

ESLint is a tool to help you write better JavaScript code.

ESLint does both **traditional linting** (looking for problematic patterns) and **style checking** (enforcement of conventions). It catches possible errors and identifies and reports on patterns in your code.

ESLint functions by parsing your code into an Abstract Syntax Tree (AST) data format, and running assertions on the AST of what your code should look or behave like.

**ESLint Plugins**: Shareable assertions are distributed via **eslint-plugin-\*** NPM packages, and these plugins use the generated AST to create new rules that can be enabled in an `.eslintrc`.

**ESLint Rule Configurations**: Shareable base configuration of rules are distributed via **eslint-config-\*** NPM packages.

## The Main .eslintrc Properties

### Rules

The `rules` property in `.eslintrc` allows:

- Enabling rules that are defined in an **eslint-plugin-\***
- Overriding options for rules that were set by an existing **eslint-config-\*** configuration.

ESlint Docs: <a href="https://eslint.org/docs/user-guide/configuring#configuring-rules" target="_blank" rel="noopener noreferrer">Configuring Rules</a>

<div class="filename">.eslintrc.js</div>

```js{6-7}
// The example settings below tell ESLint to error when single-quotes are used, and when semi-colons are missing.

module.exports = {
  rules: {
    // enable additional rules
    quotes: ["error", "double"],
    semi: ["error", "always"]
  }
};
```

### Extends

Instead of manually configuring each rule individually, you can apply a bulk rule configuration from a shared config.

The `extends` property in `.eslintrc` allows extending off a set of rule configurations from an existing configuration.

For example, extending off the base ESLint <a href="https://github.com/eslint/eslint/blob/master/conf/eslint-recommended.js" target="_blank" rel="noopener noreferrer">eslint:recommended</a> configuration will enable a subset of core rules that report common problems.

Shared configs are distributed as **eslint-config-\*** NPM packages. One of the commonly used configurations is Airbnb's <a href="https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb" target="_blank" rel="noopener noreferrer">eslint-config-airbnb</a>.

ESlint Docs: <a href="https://eslint.org/docs/user-guide/configuring#extending-configuration-files" target="_blank" rel="noopener noreferrer">Extending Configuration Files</a>

<div class="filename">.eslintrc.js</div>

```js{4}
// The example settings below tell ESLint use the eslint:recommended base configuration and the eslint-config-airbnb shared configuration.

module.exports = {
  extends: ["eslint:recommended"]
};
```

> ESLint extends configurations recursively, so a shared **eslint-config-\*** configuration can also have its own `extends`, `env`,`plugins`,`parser` properties which will apply to the`.eslintrc` configuration.
>
> Many **recommended** base configurations shared from **eslint-config-\*** already set the `parser`, `plugins`, and `env` properties.
>
> There is no need to re-declare these properties in your own `.eslintrc` if you're extending off a **recommended** base configuration that already has these declared.

### Plugins

The `plugins` property in `.eslintrc` allows using third-party plugins to apply specific linting rules for different code bases.

For example, <a href='https://github.com/yannickcr/eslint-plugin-react' target="_blank" rel="noopener noreferrer">eslint-plugin-react</a>, and <a href='https://github.com/vuejs/eslint-plugin-vue' target="_blank" rel="noopener noreferrer">eslint-plugin-vue</a>, adds specific linting rules for React or Vue projects, respectively.

ESLint plugins contain implementation for additional rules that ESLint will check for, however, these defined ESlint rules still need to be manually configured in an `.eslintrc` to determine how to handle each rule.

The new rules defined by an **eslint-plugin-\*** still need to be configured under the `rules` property, or by taking a set of rule configurations in the `extends` property.

ESlint Docs: <a href="https://eslint.org/docs/user-guide/configuring#configuring-plugins" target="_blank" rel="noopener noreferrer">Configuring Plugins</a>

<div class="filename">.eslintrc.js</div>

```js
// The example settings below tell ESLint use the eslint-plugin-react linting rules, and manually configures two rules.

module.exports = {
  plugins: ["react"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error"
  }
};
```

### Environment

The `env` property in `.eslintrc` declares which environments your code is expected to run in.

Each environment brings with it a certain set of predefined global variables, and prevents ESLint from throwing an `no-undef` rule error when referencing an expected global variable such as, `window`, or `document`.

ESlint Docs: <a href="https://eslint.org/docs/user-guide/configuring#specifying-environments" target="_blank" rel="noopener noreferrer">Specifying Environments</a>

<div class="filename">.eslintrc.js</div>

```js
// The example settings below tell ESLint to enable browser and node global variables like `window`.

module.exports = {
  env: {
    browser: true,
    node: true
  }
};
```

### Parser

The `parser` property in `.eslintrc` declares which parser ESLint should use to parse your code into an AST. By default, ESLint uses Espree as its parser.

ESlint Docs: <a href="https://eslint.org/docs/user-guide/configuring#specifying-parser" target="_blank" rel="noopener noreferrer">Specifying Parser</a>

<div class="filename">.eslintrc.js</div>

```js
// The example settings below tell ESLint to use the TypeScript ESTree parser.

module.exports = {
  parser: "@typescript-eslint/parser"
};
```

### Parser Options

The `parserOptions` property in `.eslintrc` specifies the JavaScript language options you want to support.

By default, ESLint supports ECMAScript 5 syntax. Configure `parserOptions` to enable support for other ECMAScript versions as well as JSX.

ESlint Docs: <a href="https://eslint.org/docs/user-guide/configuring#specifying-parser-options" target="_blank" rel="noopener noreferrer">Specifying Parser Options</a>

<div class="filename">.eslintrc.js</div>

```js
// The example settings below specifies ESLint to enable support for ECMAScript 2018 and JSX.

module.exports = {
  parserOptions: {
    ecmaVersion: 2018,
    ecmaFeatures: {
      jsx: true
    }
  }
};
```

---

## 👨🏻‍💻 Step by Step: How to Configure .eslintrc

The best way to determine the values needed to set up an `.eslintrc` config is to look at the source code for the **eslint-config-\*** and **eslint-plugin-\*** that you intend to use.

Let's walk through the process to determine what needs to be configured in an `.eslintrc`.

For this example, let's set up an `.eslintrc` for a **React + TypeScript project**.

### 1) Look at the relevant **eslint-plugin-\***

Look for the relevant **eslint-plugin-\*** to add additional rules linting rules that ESLint should check for in a **React + TypeScript project**.

A quick internet search brings us to the NPM packages:

- <a href='https://www.npmjs.com/package/@typescript-eslint/eslint-plugin' target="_blank" rel="noopener noreferrer">@typescript-eslint/eslint-plugin</a>
- <a href='https://www.npmjs.com/package/eslint-plugin-react' target="_blank" rel="noopener noreferrer">eslint-plugin-react</a>

### 2) Follow the **eslint-plugin-\*** documentation

In the **eslint-plugin-\*** documentation, determine the main config requirements.

The main configs generally involve setting up:

- `plugins`: Include the plugin itself
- `parser`: Setting a specific parser
- `env`: Including any global environment variables

### TypeScript

From the <a href='https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/README.md#getting-started---linting-your-typescript-codebase' target="_blank" rel="noopener noreferrer">@typescript-eslint/eslint-plugin docs</a>, we need a minimum config specifying:

<div class="filename">.eslintrc.js</div>

```js{2-3}
module.exports = {
  parser: "@typescript-eslint/parser", // allows ESLint to understand TypeScript
  plugins: ["@typescript-eslint"] // use the plugin rules within ESLint
};
```

### React

From the <a href='https://github.com/yannickcr/eslint-plugin-react' target="_blank" rel="noopener noreferrer">eslint-plugin-react docs</a>, we need a minimum config specifying:

<div class="filename">.eslintrc.js</div>

```js{2,5,10-11}
module.exports = {
  plugins: ["react"], // use the plugin rules within ESLint
  parserOptions: {
    ecmaFeatures: {
      jsx: true // enable JSX support
    }
  },
  settings: {
    react: {
      pragma: "React", // Pragma to use, default to "React"
      version: "detect" // React version
    }
  }
};
```

### Combined .eslintrc config

<div class="filename">.eslintrc.js</div>

<!-- prettier-ignore-start -->
```js
module.exports = {
  plugins: [
    "react",
    "@typescript-eslint"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    react: {
      pragma: "React",
      version: "detect"
    }
  }
};
```
<!-- prettier-ignore-end -->

### 3) Check for any /recommended configurations

It's common for **eslint-plugin-\*** authors to bundle a **recommended** rule configuration inside a plugin to use as starting a point.

I usually start with these **recommended** configs, and manually configure any overrides in the `rules` property later.

<!--
_Note that the bundled configurations itself do not enable any of the plugin's rules by default. These recommended configs should be treated as a stand alone **eslint-config-\***._

_The plugin name must still be specified in the `plugins` array in the `.eslintrc`, as well as any rules you want to enable that are part of the plugin._ -->

#### TypeScript: plugin:@typescript-eslint/recommended

<a href='https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/README.md#getting-started---linting-your-typescript-codebase' target="_blank" rel="noopener noreferrer">@typescript-eslint/eslint-plugin</a> comes with a bundled **recommended** base config.

<div class="filename">.eslintrc.js</div>

```js{3-4,7-11}
module.exports = {
  // Remove these config
- parser: "@typescript-eslint/parser",
- plugins: ["@typescript-eslint"],

  // Add these config
+ extends: [
+   "eslint:recommended", // ESLint's inbuilt "recommended" config
+   "plugin:@typescript-eslint/eslint-recommended",
+   "plugin:@typescript-eslint/recommended"
+ ]
};
```

#### React: plugin:react/recommended

<a href='https://github.com/yannickcr/eslint-plugin-react#configuration' target="_blank" rel="noopener noreferrer">eslint-plugin-react</a> comes with a bundled **recommended** base config.

<div class="filename">.eslintrc.js</div>

```js{3-8,11-14}
module.exports = {
  // Remove these config
- plugins: ["react"],
- parserOptions: {
-   ecmaFeatures: {
-     jsx: true
-   }
- },

  // Add these config
+ extends: [
+   "eslint:recommended",
+   "plugin:react/recommended"
+ ],
  settings: {
    react: {
      pragma: "React",
      version: "detect"
    }
  }
};
```

### Airbnb ESLint TypeScript Configuration

An alternative to using a **recommended** base configuration is to use Airbnb's ESLint <a href="https://www.npmjs.com/package/eslint-config-airbnb" target="_blank" rel="noopener noreferrer">eslint-config-airbnb</a> config. This provides an all-in-one configuration. It's opinionated, but it sets your project up with general best practices, so you can focus on building your project, and not on configuring hundreds of ESLint rules.

For our TypeScript example, we'll use <a href="https://github.com/iamturns" target="_blank" rel="noopener noreferrer">Matt Turnbull</a>'s Airbnb config with TypeScript support: <a href="https://www.npmjs.com/package/eslint-config-airbnb-typescript" target="_blank" rel="noopener noreferrer">eslint-config-airbnb-typescript</a>.

✨ Using **eslint-config-airbnb-typescript** is also nice because the installation docs specifies a <a href="https://github.com/iamturns/eslint-config-airbnb-typescript#i-use-eslint-config-airbnb-with-react-support" target="_blank" rel="noopener noreferrer">very simple minimum setup</a>:

<div class="filename">.eslintrc.js</div>

```js{2}
module.exports = {
  extends: ["airbnb-typescript"]
};
```

> ### Note: The common .eslintrc confusion
>
> This is usually the point where configuring `.eslintrc` becomes confusing.
>
> - Why is the configuration of **eslint-config-airbnb-typescript** so simple?
> - Do we still need to specify the `parser` and `plugins`?
> - Why could we remove some config, like the `parser` and `plugins`, when using the **recommended** base configs from **@typescript-eslint/recommended** and **react/recommended**?

### 4) Look at the source code for the recommended base configurations

To answer the questions from above, we'll dig into the source code for **eslint-config-airbnb-typescript** to see what `plugins`, `env`, `parser`, and `settings` it already declares.

> **Remember**: ESLint extends configurations recursively, so a shared **eslint-config-\*** configuration can also have its own `extends`, `env`,`plugins`,`parser` properties which will apply to the`.eslintrc` configuration.

I personally like to go back through my `.eslintrc` to remove any configs that have already been declared in a shared **eslint-config-\*** that I'm extending off.

#### plugin:@typescript-eslint/recommended Source Code

If you remember, the <a href='https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/README.md#getting-started---linting-your-typescript-codebase' target="_blank" rel="noopener noreferrer">@typescript-eslint/eslint-plugin docs</a> required a minimum config with:

<div class="filename">.eslintrc.js</div>

```js
module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"]
};
```

If we look in the **eslint-config-airbnb-typescript** source code you'll see that these two properties are already set on <a href='https://github.com/iamturns/eslint-config-airbnb-typescript/blob/master/lib/shared.js#L9-L10' target="_blank" rel="noopener noreferrer">Line 9 - 10</a>.

<div class="filename">eslint-config-airbnb-typescript/lib/shared.js - Line 9 - 10</div>

```js{4-5}
// ... imports

module.exports = {
  plugins: ["@typescript-eslint"],
  parser: "@typescript-eslint/parser"

  // ... other configs
};
```

#### plugin:react/recommended Source Code

Also for the <a href='https://github.com/yannickcr/eslint-plugin-react' target="_blank" rel="noopener noreferrer">eslint-plugin-react</a>, it required a minimum config with:

<div class="filename">.eslintrc.js</div>

```js{2,5,10-11}
module.exports = {
  plugins: ["react"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    react: {
      pragma: "React",
      version: "detect"
    }
  }
};
```

Looking in the **eslint-config-airbnb-typescript** source code you'll see that it extends off **eslint-config-airbnb** on <a href='https://github.com/iamturns/eslint-config-airbnb-typescript/blob/master/index.js#L3' target="_blank" rel="noopener noreferrer">Line 3</a>.

<div class="filename">eslint-config-airbnb-typescript/index.js</div>

<!-- prettier-ignore-start -->
```js{5}
// This file adds some React specific settings. Not using React? Use base.js instead.

module.exports = {
  extends: [
    "eslint-config-airbnb",
    "./lib/shared" // TypeScript related config
  ].map(require.resolve),
  
  // ... other configs
};
```
<!-- prettier-ignore-end -->

Following the dependency chain to **eslint-config-airbnb**, and its source code, you'll see that the required minimum config properties from the **eslint-config-airbnb** are already set on <a href='https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb/rules/react.js#L7-L15' target="_blank" rel="noopener noreferrer">Line 7 - 15, and Line 511 - 514</a>.

<div class="filename">eslint-config-airbnb/rules/react.js - Line 7 - 15, Line 511 - 514</div>

```js{5,9,17-18}
// ... imports and setup

module.exports = {
  plugins: [
    'react',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },

  // ... other configs

  settings: {
    react: {
      pragma: 'React',
      version: 'detect',
    },

    // ... other configs
  }
```

## Use the ~~Force~~ Source, Luke

Enjoy your new ESLint super powers.

Now you'll understand why there are some tutorials and blogs that have certain configs set, while others articles omit those properties.

Just look in the source code 💾.
