---
date: 2020-04-27
title: Select Gatsby Contentful Locale Data in GraphQL
template: post
thumbnail: "../thumbnails/graphql.png"
slug: select-contentful-locale-gatsby-context-graphql-variable
categories:
  - GraphQL
tags:
  - gatsby
  - graphql
  - contentful
  - internationalization
---

_Credit 👏: My teammate,_ <a href='https://github.com/riley-rangel' target='_blank'>Riley Rangel</a>_, worked out this solution and improved the DX for our team._

## Problem: How to select the correct Contentful locale content data from GraphQL

I was working with my teammate, <a href='https://github.com/riley-rangel' target='_blank'>Riley</a>, to connect our web app to Contentful to drive page content. Previously page was handled by <a href='https://github.com/formatjs/formatjs/tree/master/packages/react-intl' target='_blank'>React-Intl</a> and <a href='https://github.com/wiziple/gatsby-plugin-intl' target='_blank'>gatsby-plugin-intl</a>. However, text updates from the product leads meant that a we had to do a full release.

_(Granted our CI/CD is pretty streamlined, but we wanted to reduce this step by allowing product leads to make text changes outside of the release cycle.)_

Contentful provides a nice headless CMS platform that handles internationalization, and <a href='https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-source-contentful' target='_blank'>gatsby-source-contentful</a> allows us to access Contentful data during build time.

### Our main road-bump was how to select the specific localization content data from our GraphQL layer.

All the Contentful locale content was sourced into GraphQL via **gatsby-source-contentful**, but we had to map this data into a new dictionary `mappedLocaleContent`, where content is stored according to the locale as the `key`.

```typescript{8}
// Page content shape from Contentful
export type Page = {
  /** Type of page. Eg: Home Page, FAQ Page */
  pageName: string;
  /** Main H1 headline */
  h1Headline: string;
  /** Contentful Locale Value */
  node_locale: "en-US" | "en-ES";
};
```

```typescript
// Shape of the mapped content stored according to the locale as the `key`
const mappedLocaleContent = {
  "en-US": Page,
  "en-ES": Page,
};
```

This would allow us to select the correct locale content with a quick object key reference using the currently selected locale `currentLocale` from **react-intl**:

<div class="filename">./src/pages/index.tsx</div>

```typescript{5,11,25-26,30}
import React from "react";
import { PageRendererProps, graphql } from "gatsby";
import { injectIntl, InjectedIntlProps } from "gatsby-plugin-intl";

import mapContentByLocale from "~/utils/mapContentByLocale";

export const query = graphql`
  query ContentfulQuery($intlLocale: String) {
    contentfulPage {
      h1Headline
      node_locale
    }
  }
`;

type Props = {
  data: {
    content: Page;
  };
} & PageRendererProps &
  InjectedIntlProps;

const Index: React.FC<Props> = ({ intl, data }) => {
  const { content } = data;
  const currentLocale = intl.locale;
  const mappedLocaleContent = mapContentByLocale(data);

  return (
    <div>
      <p>{mappedLocaleContent[currentLocale].h1Headline}</p>
    </div>
  );
};

export default injectIntl(Index);
```

Where the mapping function would be something like:

<div class="filename">./src/utils/mapContentByLocale.tsx</div>

```typescript{9-16}
type QueryData = {
  contentfulPage: {
    edges: {
      node: Page;
    }[];
  };
};

const mapContentByLocale = (data: QueryData): { [key: string]: Page } => {
  return data.allContentfulPage.edges.reduce((acc, curr) => {
    return {
      ...acc,
      [curr.node.node_locale]: curr.node,
    };
  }, {});
};

export default mapContentByLocale;
```

## Solution: Pass React-Intl locales as a GraphQL variable during Build Time

A more "Gatsby" solution that follows the paradigm of utilizing GraphQL's query variables allows us to query for the specific locale content needed.

In this specific case, we want to filter the Contentful locale property `node_locale` associated with each localized content node.

```typescript{8}
// Page content shape from Contentful
export type Page = {
  /** Type of page. Eg: Home Page, FAQ Page */
  pageName: string;
  /** Main H1 headline */
  h1Headline: string;
  /** Contentful Locale Value */
  node_locale: "en-US" | "en-ES";
};
```

### Query GraphQL by a variable

To do this, we modify our GraphQL query by creating the `(\$intlLocale: String)` variable definition after the query operation name `ContentfulQuery`, which declare `$intlLocale` as a variable accepted by the query.

(Similar to an argument definitions for a function in a typed language, a GraphQL variable definition lists all of the variables, prefixed by `\$`, followed by their type.)

Now we can query the `contentfulPage` by the `node_locale` that matches the `$intlLocale` variable from React-Intl.

```typescript{2,3}
export const query = graphql`
  query ContentfulQuery($intlLocale: String) {
    contentfulPage(node_locale: { eq: $intlLocale }) {
      h1Headline
    }
  }
`;
```

### Add the GraphQL variable to the Gatsby Page Context

In order to query `node_locale` in GraphQL by a variable, we need to make that variable available in the Gatsby page context during build time through <a href='https://www.gatsbyjs.org/docs/creating-and-modifying-pages/#pass-context-to-pages' target='_blank'>Gatsby's `createPage` API</a>.

Here we're adding `intLocale` to the Gatsby page context:

<div class="filename">./gatsby-node.js</div>

```javascript{4,20}
exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions;
  const { context } = page;
  const { intl } = context;

  if (intl.language && !page.context.intlLocale) {
    // Map React-Intl locale values to Contentful's locale string
    const intlToCms = {
      "en-us": "en-US",
      "es-us": "es-US",
    };

    deletePage(page);
    createPage({
      ...page,
      context: {
        ...page.context,
        // Build the pages with the available react-intl locales
        // passed into the page level GraphQL context
        intlLocale: intlToCms[intl.language],
      },
    });
  }
};
```

### Final solution:

This approach utilizes the power of GraphQL, and the resulting React component is much cleaner:

<div class="filename">./src/pages/index.tsx</div>

```typescript{5-9,19,23}
import React from "react";
import { PageRendererProps, graphql } from "gatsby";

export const query = graphql`
  query ContentfulQuery($intlLocale: String) {
    contentfulPage(node_locale: { eq: $intlLocale }) {
      h1Headline
    }
  }
`;

type Props = {
  data: {
    content: Page;
  };
} & PageRendererProps;

const Index: React.FC<Props> = ({ data }) => {
  const { content } = data;

  return (
    <div>
      <p>{content.h1Headline}</p>
    </div>
  );
};

export default Index;
```
