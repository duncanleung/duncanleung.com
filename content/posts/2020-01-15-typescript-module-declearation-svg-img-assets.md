---
date: 2020-01-15
title: TypeScript Module Declaration for SVG Assets
template: post
thumbnail: "../thumbnails/typescript.png"
slug: typescript-module-declearation-svg-img-assets
categories:
  - TypeScript
  - Popular
tags:
  - typescript
---

## Importing SVG files as React Components in TypeScript

I was running into an issue importing `.svg` files as React Components in a TypeScript project.

When I was importing any `*.svg` files, the TypeScript compiler was erroring:

<div class="filename">./src/components/ReactComponent.tsx</div>

```tsx{2}
import React from "react";
import { ReactComponent as SVGIcon } from "~/icons/icon.svg";
                                           ^^^^^^^^^^^^^^^^

// React Component code...
```

```terminal
Cannot find module '~/icons/icon.svg'.ts(2307)
```

## Create a index.d.ts Module Declaration File

The solution was to create a `./src/@types/assets/index.d.ts` TypeScript module declaration file for media assets.

One main gotcha about TypeScript module declaration files is in how they are included in `tsconfig.json` using the <a href="http://www.typescriptlang.org/docs/handbook/tsconfig-json.html#types-typeroots-and-types" target="_blank">`typeRoots` property</a>.

> The property `typeRoots` defines the `types` folder where type declarations will be contained, but the `index.d.ts` module declaration files **must be in a subfolder** since each subfolder under `typeRoots` is considered a "package" and is added to your project.

We were incorrectly trying to place the `.svg` module declarations under `./src/@types/index.d.ts`.

Moving the `index.d.ts` for `.svg` files to it's own `./src/@types/assets` subfolder allowed TypeScript to correctly recognize the `.svg` module declarations.

<div class="filename">./src/@types/assets/index.d.ts</div>

```ts{1-6}
declare module "\*.svg" {
  import React = require("react");
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

declare module "\*.jpg" {
  const content: string;
  export default content;
}

declare module "\*.png" {
  const content: string;
  export default content;
}

declare module "\*.json" {
  const content: string;
  export default content;
}
```

Here is an example `tsconfig.json`:

<div class="filename">tsconfig.json</div>

```json{9}
{
  "compileOnSave": false,
  "compilerOptions": {
    "target": "es5",
    "module": "esnext",
    "types": ["node"],
    "moduleResolution": "node",
    "esModuleInterop": true,
    "typeRoots": ["./src/@types", "./node_modules/@types"],
    "lib": ["dom", "es2015", "es2017"],
    "jsx": "react",
    "sourceMap": true,
    "strict": true,
    "resolveJsonModule": true,
    "noUnusedLocals": true,
    "noImplicitAny": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "allowSyntheticDefaultImports": true,
    "downlevelIteration": true,
    "baseUrl": "./",
    "paths": {
      "~/*": ["src/*"],
      "@turn/styled": ["src/styled"]
    }
  },
  "include": ["./src/**/*", "./test-utils/**/*", "./__mocks__/**/*"],
  "exclude": ["node_modules"]
}
```
