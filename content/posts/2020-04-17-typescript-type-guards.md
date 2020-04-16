---
date: 2020-04-17
title: Using TypeScript Type Guards
template: post
thumbnail: "../thumbnails/typescript.png"
slug: typescript-type-guards
categories:
  - TypeScript
tags:
  - typescript
---

I've been appreciating a TypeScript pattern called **type-guards**.

Type-guards provide type-safety by performing a runtime check to ensure a variable is within the typed scope.

```typescript
/**
 * Type-Guard: Asserts that the document is a S3 file
 */
export const isS3Document = (document: Document): document is S3Document =>
  "url" in document;
```

You could use the **type-guard** as such:

```typescript{2}
const onlyS3Files = (files: Document[]): S3Document[] =>
  files.filter(isS3Document);
```

To create a type-guard, you must:

- Return a type predicate (e.g. `variable is S3Document`)
- Contain a logical statement to determine the type of the given variable

With this in view, you can also create a **generic type-guard** that can be used to assert the type safety of any variable:

```typescript
export const isType = <T>(variable: any, property: keyof T): variable is T =>
  (variable as T)[property] !== undefined;
```

```typescript{2}
const onlyS3Files = (files: Document[]): S3Document[] =>
  files.filter((document) => isType<S3Document>(document, "url"));
```
