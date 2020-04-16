---
date: 2020-02-15
title: TypeScript Type Guards
template: post
thumbnail: "../thumbnails/typescript.png"
slug: typescript-type-guards
categories:
  - TypeScript
tags:
  - typescript
---

https://rangle.io/blog/how-to-use-typescript-type-guards

```typescript
/**
 * Type Guard
 *
 * Asserts that the file is a S3 type
 */
export const isS3Document = (document: Document): document is S3Document =>
  "url" in document;

const onlyS3Files = (files: Document[]): S3Document[] =>
  files.filter(isS3Document);

/**
 * Type Guard
 *
 * Asserts that the file is a FileWithPath type
 */
export const isFilePathDocument = (
  document: Document
): document is FileWithPath => "path" in document || "lastModified" in document;
```
