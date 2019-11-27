---
date: 2019-11-26
title: "Fixing Netlify Build Fail - error #98123 WEBPACK"
template: post
thumbnail: "../thumbnails/netlify.png"
slug: fixing-netlify-build-fail
categories:
  - Code
tags:
  - netlify
  - gatsby
---

### Netlify Build Failing: error #98123 WEBPACK

I ran into an annoying issue when relaunching this blog.

The strange thing was that `yarn build` would build Gatsby successfully locally (I'm on OSX) but the Netlify build would fail 🤦🏻‍♂️.

```bash{4-7}
...
...
8:50:22 PM: info bootstrap finished - 5.699 s
8:50:22 PM: ERROR #98123  WEBPACK
8:50:41 PM: failed Building production JavaScript and CSS bundles - 18.625s
8:50:41 PM: error Generating JavaScript bundles failed
8:50:41 PM: Can't resolve '../components/Footer' in '/opt/build/repo/src/layout'
8:50:41 PM: not finished run queries - 18.730s
8:50:41 PM: error Command failed with exit code 1.
...
...
```

### The Cause: Linux Case Sensitivity

It turns out the issue was because of a [case difference](https://github.com/gatsbyjs/gatsby/issues/8205#issuecomment-421795109) in what some files were requiring and the name of the file.

The reason it was working locally, is that OSX will automatically resolve the issue, but the Netlify build server is Linux, and will fail.

### Fix: Set git config or Fix Imports

The fix that resolved the issue was to run the following command.

```bash
$ git config core.ignorecase false
```

_Credit to user: [pedrouid](https://github.com/gatsbyjs/gatsby/issues/8205#issuecomment-444876531) on GitHub_
