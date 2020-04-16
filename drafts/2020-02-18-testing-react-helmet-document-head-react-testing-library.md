---
date: 2020-1-16
title: React Testing Library React Helmet Document Head
template: post
thumbnail: "../thumbnails/jest.png"
slug: testing-react-helmet-document-head-react-testing-library
categories:
  - Testing

tags:
  - react-testing-library
  - jest
---

https://github.com/testing-library/react-testing-library/issues/362

https://github.com/testing-library/react-testing-library/issues/402

https://spectrum.chat/testing-library/help/how-to-test-dynamic-page-titles~a982d183-9c1b-4bac-9f2e-694d822cbdd8?authed=true

```tsx
import React from "react";
import { render } from "test-utils";
import { wait } from "@testing-library/react";

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
              content: "noindex, nofollow"
            }
          ]}
        />
        <div>Body</div>
      </>
    );

    await wait(() => expect(getMeta("robots")).toEqual("noindex, nofollow"));
  });
});
```

```tsx
import React, { useEffect } from "react";
import Helmet, { HelmetProps } from "react-helmet";
import { injectIntl, InjectedIntlProps } from "gatsby-plugin-intl";
import { Location } from "@reach/router";

import { getLanguageCode } from "~/utils/i18n";
import analytics from "~/utils/analytics";

type Props = {
  /** Description text for the description meta tags */
  description?: string;
  /** The page event label that triggers a Segment page event call. Does not trigger if not present. */
  pageEventLabel?: string;
} & HelmetProps &
  InjectedIntlProps;

/**
 * An SEO component that handles all element in the head that can accept
 */
const SEO: React.FC<Props> = ({
  children,
  description = "",
  title,
  pageEventLabel,
  intl,
  meta
}) => {
  useEffect(() => {
    if (pageEventLabel) {
      analytics.page(pageEventLabel);
    }
  }, [pageEventLabel]);

  const metaDescription =
    description ||
    "Drive your dream with a turn car subscription that allows you to return your car any time. Maintenance and roadside assistance included.";

  return (
    <Location>
      {({ location }) => (
        <>
          {/**
           * https://github.com/nfl/react-helmet/issues/440
           * There is a bug with react-helmet
           * meta prop needs to be passed into a separate Helmet component
           */}
          <Helmet
            htmlAttributes={{
              lang: getLanguageCode(intl.locale)
            }}
            title={title}
            titleTemplate="%s | Turn Car Subscriptions"
            meta={meta}
          />
          <Helmet>
            <meta property="description" content={metaDescription} />

            {/* OG tags */}
            <meta
              property="og:url"
              content={process.env.GATSBY_SITE_URL + location.pathname}
            />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:locale" content={intl.locale} />

            {/* This might be better served by an env var but with multiple tenants in one app we will not be able to go that route */}
            <meta property="fb:app_id" content="359898047987066" />

            {children}
          </Helmet>
        </>
      )}
    </Location>
  );
};

export default injectIntl(SEO);
```
