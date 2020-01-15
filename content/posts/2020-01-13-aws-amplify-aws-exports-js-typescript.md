---
date: 2020-01-13
title: AWS Amplify TypeScript aws-exports.js
template: post
thumbnail: "../thumbnails/aws-amplify.png"
slug: aws-amplify-aws-exports-js-typescript
categories:
  - AWS
tags:
  - aws
  - amplify
  - typescript
---

## Importing aws-exports.js with TypeScript Error

I was running into an issue using the <a href='https://github.com/aws-amplify/amplify-js' target="_blank">AWS Amplify amplify-js package</a> in a TypeScript project.

When I was importing the `aws-exports.js` configuration file to initialize Amplify, the TypeScript compiler was erroring:

<div class="filename">./src/components/Layout.tsx</div>

```tsx
import React from "react";
import Amplify from "aws-amplify";

import config from "../../aws-exports";

// Call configuration API at the global Layout level
Amplify.configure(config);

// Layout Component code...
```

```terminal
Could not find a declaration file for module '../../aws-exports'.

'.../src/aws-exports.js' implicitly has an 'any' type.ts(7016)
```

## Create an aws-exports.d.ts Module Declaration File

The solution is to create an `./src/@types/aws/aws-exports.d.ts` TypeScript module declaration file.

<div class="filename">./src/@types/aws/aws-exports.d.ts</div>

```ts
declare const awsmobile: {};
export default awsmobile;
```

Also, since `aws-exports.js` is a `.js` file extension, `tsconfig.json` needs to be updated to allow JavaScript files.

<div class="filename">tsconfig.json</div>

```json{3}
{
  "compilerOptions": {
    "allowJs": true,
    ...
  },
}
```
