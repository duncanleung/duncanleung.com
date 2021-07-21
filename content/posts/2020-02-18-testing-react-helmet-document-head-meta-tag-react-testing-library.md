---
date: 2020-02-18
title: Testing Document Head Meta Tags
template: post
thumbnail: "../thumbnails/jest.png"
slug: testing-react-helmet-document-head-meta-tag-react-testing-library
categories:
  - Testing

tags:
  - react-testing-library
  - jest
---

## Problem: How to target meta tags with React Testing Library

I needed to test our SEO component that the correct meta tags were being passed, but I didn't know how to access the meta tags using React Testing Library.

## Solution: Manually access the "meta" tag with Browser document API

It's still possible to use the Browser API `document.getElementsByTagName("meta")` with **jest-dom**.

```tsx{7-17,26-30,37}
import React from "react";
import { render } from "test-utils";
import { waitFor } from "@testing-library/react";

import SEO from "../SEO";

function getMeta(metaName: string) {
  const metas = document.getElementsByTagName("meta");

  for (let i = 0; i < metas.length; i += 1) {
    if (metas[i].getAttribute("name") === metaName) {
      return metas[i].getAttribute("content");
    }
  }

  return "";
}

describe("<SEO />", () => {
  test("Passes meta prop to HTML markup", async () => {
    render(
      <>
        <SEO
          title="hi"
          pageEventLabel="Home"
          meta={[
            {
              name: "robots",
              content: "noindex, nofollow",
            },
          ]}
        />
        <div>Body</div>
      </>
    );

    await waitFor(() => expect(getMeta("robots")).toEqual("noindex, nofollow"));
  });
});
```

```tsx{21}
import React, { useEffect } from "react";
import Helmet, { HelmetProps } from "react-helmet";
import { Location } from "@reach/router";

type Props = {
  /** Description text for the description meta tags */
  description?: string;
} & HelmetProps;

/**
 * An SEO component that handles all element in the head that can accept
 */
const SEO: React.FC<Props> = ({ children, description = "", title, meta }) => {
  const metaDescription =
    description || "This blog is about software engineering";

  return (
    <Location>
      {({ location }) => (
        <>
          <Helmet title={title} titleTemplate="%s | My New Blog" meta={meta} />
          <Helmet>
            <meta name="description" content={metaDescription} />
            {children}
          </Helmet>
        </>
      )}
    </Location>
  );
};

export default SEO;
```
