---
date: 2020-04-16
title: Array .map() over TypeScript Array Union Types
template: post
thumbnail: "../thumbnails/typescript.png"
slug: typescript-array-map-over-union-array-type
categories:
  - TypeScript
tags:
  - typescript
---

## Problem: TypeScript Error Calling .map() on an Array Union Type

I was running into a TypeScript issue trying to call `Array.prototype.map()` over an `uploadedDocuments` array of items in a React component `<UserDocumentList />` that renders a list of uploaded documents.

<div class="filename">UserDocumentList.tsx</div>

```typescript{7,13}
import React from "react";
import { FileWithPath } from "react-dropzone";

import { S3Document } from "~/api/user/getUserDocuments";

type Props = {
  uploadedDocuments: S3Document[] | FileWithPath[];
};

const UserDocumentList: React.FC<Props> = ({ uploadedDocuments, intl }) => {
  return (
    <div>
      {uploadedDocuments.map((document, i: number) => {
        // ... render my list items
      })}
    </div>
  );
};

export default UserDocumentList;
```

Depending on where my `<UserDocumentList />` component is used, `uploadedDocuments` can either render a list of `S3Document[]` documents or `FileWithPath[]` documents.

Naively, I declared the type of `uploadedDocuments` as:

```typescript{2}
type Props = {
  uploadedDocuments: S3Document[] | FileWithPath[];
};
```

However, TypeScript did not like this:

```terminal
This expression is not callable.

  Each member of the union type '(<U>(callbackfn: (value: FileWithPath, index: number, array: FileWithPath[]) => U, thisArg?: any) => U[]) | (<U>(callbackfn: (value: S3Document, index: number, array: S3Document[]) => U, thisArg?: any) => U[])' has signatures, but none of those signatures are compatible with each other.ts(2349)
```

## Solution:

Apparently, for union types, members which are functions will also be typed as union types, so the the type of `Array.prototype.map` is not callable.

To fix this issue, the correct typing of `uploadedDocuments` should be an array of the union of `S3Document` and `FileWithPath` types.

```typescript{2}
type Props = {
  uploadedDocuments: (S3Document | FileWithPath)[];
};
```
