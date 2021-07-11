---
date: 2021-07-10
title: Using SVGs with Next.js 11 and TypeScript
template: post
thumbnail: "../thumbnails/typescript.png"
slug: next-js-typescript-svg-any-module-declaration
categories:
  - TypeScript
tags:
  - typescript
---

## Problem: SVG TypeScript ESLint errors on `any` value

After updating to Next.js 11 (from v10.2.3 to v11.0.1) I noticed that TypeScript was having ESLint issues specifically related to SVGs.

```terminal
Unsafe assignment of an `any` value.
(eslint@typescript-eslint/no-unsafe-assignment)

Unsafe member access .palette on an `any` value.
(eslint@typescript-eslint/no-unsafe-member-access)
```

The TypeScript ESLint errors were occurring on all previously working SVG components:

<div class="filename">SomeComponent.tsx</div>

```typescript{5,9}
import { default as Logo } from '~/public/logo.svg';

<Logo
  height={40}
  css={(theme) => ({
        ^^^^^
        Parameter 'theme' implicitly has an 'any' type.ts(7006)

    fill: theme.palette.primary.main,
    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    Unsafe assignment of an `any` value.
    (eslint@typescript-eslint/no-unsafe-assignment)
  })}
/>
```

<div class="filename">SomeComponent.tsx</div>

```typescript{7}
import { default as XIcon } from '~/public/icons/x.svg';

<IconButton
  component='a'
  aria-label='exit sign-up'
  size={{ xs: 32, md: 40 }}
  icon={XIcon}
        ^^^^^
        Unsafe assignment of an `any` value.
        (eslint@typescript-eslint/no-unsafe-assignment)
/>
```

For some reason our module declarations for `*.svg` is no longer being recognized:

<div class="filename">@types/index.d.ts</div>

```typescript
declare module "*.svg" {
  const component: React.FC<React.SVGProps<SVGSVGElement>>;

  export default component;
}
```

## Reason

Next.js 11 <a href="https://github.com/vercel/next.js/pull/26485" target="_blank">introduced it's own image import types</a> to prevent conflicts with existing image handling set-ups.

Unfortunately, these image import module declarations are included in the non-modifiable (and regenerated at every build) `next-env.d.ts` file:

```diff{3}
  /// <reference types="next" />
  /// <reference types="next/types/global" />
+ /// <reference types="next/image-types/global" />
```

The newly included <a href="https://github.com/vercel/next.js/blob/canary/packages/next/image-types/global.d.ts#L17-L26" target="_blank">`next/image-types/global.d.ts`</a> module declarations file is overwriting our own `*.svg` module declaration, and setting the type to `any`:

<div class="filename">next.js/packages/next/image-types/global.d.ts</div>

```typescript{7}
declare module "*.svg" {
  /**
   * Use `any` to avoid conflicts with
   * `@svgr/webpack` plugin or
   * `babel-plugin-inline-react-svg` plugin.
   */
  const content: any;
        ^^^^^^^^^^^^
        This is the cause of the "of an `any` value" ESLint issues.

  export default content;
}
```

## Solution

### Create a custom next-env.dts to exclude image-types/global

Although Next.js owns the `next-env.d.ts` file we can customize `tsconfig.json` to add our own `custom-next-env.d.ts` declaration file that doesn't include the `next/image-types/global` module declarations.

<div class="filename">custom-next-env.d.ts</div>

```diff{3}
  /// <reference types="next" />
  /// <reference types="next/types/global" />
- /// <reference types="next/image-types/global" />
```

### Configure tsconfig.json

We can then configure `tsconfig.json` to exclude the original `next-env.d.ts` to exclude: `next-env.d.ts`, and include: `custom-next-env.d.ts`.

<div class="filename">tsconfig.json</div>

```diff{26,27}
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["es6", "dom", "dom.iterable", "esnext"],
    "noImplicitAny": true,
    "noImplicitThis": true,
    "strictNullChecks": true,
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "jsxImportSource": "@emotion/react",
    "baseUrl": ".",
    "paths": {
      "~/*": ["./*"],
      "~/static/*": ["./public/static/*"]
    }
  },
+ "include": ["custom-next-env.d.ts", "**/*.ts", "**/*.tsx"],
+ "exclude": ["node_modules", "next-env.d.ts"]
}
```

### Create our own image-types module declarations

Now we can create a `@types/images.d.ts` file and take the content of the original <a href="https://github.com/vercel/next.js/blob/canary/packages/next/image-types/global.d.ts#L17-L26" target="_blank">next/image-types/global.d.ts</a> file and specifically replace the module declaration for `*.svg`.

<div class="filename">@types/images.d.ts</div>

```diff{23,26}
  type StaticImageData = {
    src: string;
    height: number;
    width: number;
    placeholder?: string;
  };

  declare module '*.png' {
    const content: StaticImageData;
    export default content;
  }

- declare module '*.svg' {
-   /**
-    * Use `any` to avoid conflicts with
-    * `@svgr/webpack` plugin or
-    * `babel-plugin-inline-react-svg` plugin.
-    */
-   const content: any
-
-   export default content
- }
+  declare module '*.svg' {
+    const content: React.FC<React.SVGProps<SVGSVGElement>>;
+    export default content;
+  }

  declare module '*.jpg' {
    const content: StaticImageData;
    export default content;
  }

  declare module '*.jpeg' {
    const content: StaticImageData;
    export default content;
  }

  declare module '*.gif' {
    const content: StaticImageData;
    export default content;
  }

  declare module '*.webp' {
    const content: StaticImageData;
    export default content;
  }

  declare module '*.ico' {
    const content: StaticImageData;
    export default content;
  }

  declare module '*.bmp' {
    const content: StaticImageData;
    export default content;
  }

```

## Appendix: next.config.js configuration for @svgr/webpack

For reference, here is the corresponding `next.config.js` to configure `@svgr/webpack` in the project.

```bash
$ yarn add -D @svgr/webpack
```

<div class="filename">next.config.js</div>

```javascript
module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      // issuer section restricts svg as component only to
      // svgs imported from js / ts files.
      //
      // This allows configuring other behavior for
      // svgs imported from other file types (such as .css)
      issuer: { and: [/\.(js|ts|md)x?$/] },
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgoConfig: { plugins: [{ removeViewBox: false }] },
          },
        },
      ],
    });
    return config;
  },
};
```
