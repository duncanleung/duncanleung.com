---
date: 2020-05-05
title: Switch the AWS Profile for Serverless CLI
template: post
thumbnail: "../thumbnails/serverless.png"
slug: use-multiple-aws-profiles-aws-cli-serverless
categories:
  - Serverless
tags:
  - serverless
  - aws-cli
---

Pattern 2: Mutable content, always server-revalidated

```
Cache-Control: no-cache
```

can add an `ETag` (a version ID of your choosing) or `Last-Modified` date header to the response
If sending ETag/Last-Modified isn't possible, the server always sends the full content.

On client fetches for the same resource, it provides the value for the content it already has via
`ETag`: `If-None-Match`
`Last-Modified`: `If-Modified-Since`

The server will respond with `HTTP 304` - Not Modified
there is no need to retransmit the requested resources

- The content at this URL may change, therefore…
- Any locally cached version isn't trusted without the server's say-so

`no-cache`: must check (or "revalidate") the resource with the server before using the cached resource. doesn't mean "don't cache".

`no-store`: tells the browser not to cache the resource at all.

`must-revalidate`: If the browser has a cached version of the resource that is less than `max-age` period of time old, then use the cache without consulting the server. otherwise it must revalidate. doesn't mean "always must revalidate"


