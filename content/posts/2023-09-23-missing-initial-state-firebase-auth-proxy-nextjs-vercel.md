---
date: 2023-09-23
title: "Proxy Firebase Auth with NextJS on Vercel"
template: post
thumbnail: "../thumbnails/firebase.png"
slug: missing-initial-state-firebase-auth-proxy-nextjs-vercel
categories:
  - Web
tags:
  - firebase
---

## Problem

I was having issues implementing SAML single sign-on (SSO) authentication with Firebase on our NextJS web app hosted on Vercel.

We wanted to use `signInWithRedirect()` (apparently this happens with `signInWithPopup()` too), however we were running into two issues:

1. When checking `getRedirectResult()`, I would get a `null` user
2. The app would display an error `missing initial state`

```terminal
Error:

Unable to process request due to missing initial state. This may happen if browser sessionStorage is inaccessible or accidentally cleared.
```

## Complications: Browser Security

Modern web browser have security features that block third-party storage access (aka block third-party cookies) to protect user privacy by stopping third-party content providers and advertisers from tracking users across websites.

(End users could manually disabling security settings like "Prevent Cross-site Tracking", however that's not really a reasonable solution).

## Firebase Auth and Vercel

The Firebase Authentication SDK relies on third-party browser storage access for its authentication process which roughly follows these steps:

1. Firebase opens an iframe to an intermediary page hosted under `<authDomain>/__/auth/iframe`
2. `<authDomain>/__/auth/iframe` redirects to the Identity Provider's (IdP) login page
3. On login success, the IdP redirects the user to the ACS URL `<authDomain>/__/auth/handler` storing the auth result in query params
4. On `<authDomain>/__/auth/handler`, the auth result is stored in browser storage under `authDomain`
5. The iframe is closed and returned redirected back to the app
6. The app reads the auth result from the `authDomain`'s browser storage

On a Firebase Hosted app, the `authDomain` is the same domain as the hostind domain: `<projectId>.firebaseapp.com`. In this case, the browser has no issues with cross-origin browser storage access.

However, on our Vercel hosted app, the Firebase SDK `authDomain` was still pointing cross-origin to `<projectId>.firebaseapp.com` and the browser prevents our app from cross-domain storage access needed to complete the authentication process.

## Solution:

The Firebase team has an article listing the different approaches to resolving this issue: <a href='https://firebase.google.com/docs/auth/web/redirect-best-practices' target="_blank" rel="noopener noreferrer">Best practices for using signInWithRedirect on browsers that block third-party storage access</a>.

For our app hosted on Vercel, we utilized a <a href='https://firebase.google.com/docs/auth/web/redirect-best-practices#proxy-requests' target="_blank" rel="noopener noreferrer">proxy to redirect auth requests to firebaseapp.com</a>:

1. Update the SAML provider's redirect ACS URL to point to our custom domain

```
redirect_uri ACS URL: https://myapp.com/__/auth/handler
```

2. Configure the Firebase SDK `authDomain` to point to our custom domain: `myapp.com`

<div class="filename">firebase/index.ts</div>

```ts
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  authDomain: 'myapp.com',
  ...
};

export const firebaseApp = initializeApp(firebaseConfig);
```

3. Use a NextJS rewrite to proxy any requests to `myapp.com/__/auth/*` to `<projectId>.firebaseapp.com/__/auth/*`

<div class="filename">next.config.js</div>

```js
module.exports = {
  async rewrites() {
    return [
      {
        source: "/__/auth/:path*",
        destination: `https://myapp.com/__/auth/:path*`,
      },
    ];
  },
};
```

The proxy rewrite masks the destination path of `authDomain`, so although `<projectId>.firebaseapp.com/__/auth/*` is handling the auth logic with the IdP, it appears to the browser as if `<projectId>.firebaseapp.com/__/auth/*` is on the origin as our app, eliminating any cross-origin storage access.

## The Proxied Firebase Auth Flow

1. The web app calls Firebase method `signInWithRedirect()`
2. `signInWithRedirect()` redirects the user to `myapp.com/__/auth/iframe`
3. NextJS rewrite reverse-proxies the request

   `myapp.com/__/auth/*` -> `<projectId>.firebaseapp.com/__/auth/*`

4. Firebase initiates the authentication flow with the corresponding IdP
5. On successful IdP login, the IdP redirects the user to the ACS URL with the auth result: `myapp.com/__/auth/handler?apiKey=xxxx`
6. NextJS rewrite reverse proxies the request

   `myapp.com/__/auth/*` -> `<projectId>.firebaseapp.com/__/auth/*`

7. Firebase receives the auth result and stores the result in browser storage under `myapp.com`
8. Firebase closes the iframe and redirects the user back to the app
9. Browser storage of the auth domain (`myapp.com`) can be accessed
