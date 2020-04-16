---
date: 2020-02-15
title: Mapping over TypeScript Array Union Type
template: post
thumbnail: "../thumbnails/typescript.png"
slug: typescript-map-over-union-array-type
categories:
  - TypeScript
tags:
  - typescript
---

https://stackoverflow.com/questions/49510832/typescript-how-to-map-over-union-array-type

```bash
This expression is not callable.
  Each member of the union type '(<U>(callbackfn: (value: FileWithPath, index: number, array: FileWithPath[]) => U, thisArg?: any) => U[]) | (<U>(callbackfn: (value: S3Document, index: number, array: S3Document[]) => U, thisArg?: any) => U[])' has signatures, but none of those signatures are compatible with each other.ts(2349)
```

```typescript
import React from "react";
import { injectIntl, InjectedIntlProps } from "gatsby-plugin-intl";

import { FileWithPath } from "react-dropzone";
import { RenderIf } from "~/components/RenderIf";
import { DisplayField } from "~/components/DisplayField";

import { S3Document } from "~/api/user/getUserDocuments";
import DocumentListItem from "~/components/Form/FileUpload/DocumentListItem";

const isS3Document = (
  document: S3Document | FileWithPath
): document is S3Document => "url" in document;

type Props = {
  uploadedDocuments: (S3Document | FileWithPath)[];
} & InjectedIntlProps;

const UserDocumentList: React.FC<Props> = ({ uploadedDocuments, intl }) => {
  return (
    <DisplayField
      title={intl.formatMessage({ id: "subscriptionReviewPage.uploadedFiles" })}
    >
      <RenderIf condition={uploadedDocuments.length > 0}>
        {uploadedDocuments.map((document, i: number) => {
          if (isS3Document(document)) {
            const { fileName, url } = document;

            return (
              <DocumentListItem key={`${fileName}-${i + 1}`}>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {fileName}
                </a>
              </DocumentListItem>
            );
          }

          const { name } = document;

          return (
            <DocumentListItem key={`${name}-${i + 1}`}>{name}</DocumentListItem>
          );
        })}
      </RenderIf>
    </DisplayField>
  );
};
export default injectIntl(UserDocumentList);
```
