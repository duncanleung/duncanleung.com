---
date: 2020-02-15
title: "AWS Lambda: Caching Variables Between Invocations"
template: post
thumbnail: "../thumbnails/serverless.png"
slug: aws-lambda-caching-variables-between-invocations
categories:
  - Serverless
tags:
  - serverless
  - aws-lambda
  - nodejs
---

- global variables can persist from one invocation to another
- use them to cache static configurations, database connections

- HTML from the static folder
- since the HTML is static, it doesn't make sense for us to load it on every invocation
- if the container for our function is to be used, we will still have our global variables on the next invocation
- we can optimize here by caching the HTML after the first invocation

```javascript
const AWS = require("aws-sdk");
const fs = require("fs").promises;
const Mustache = require("mustache");

let html;

async function loadHtml() {
  if (!html) {
    html = await fs.readFile("static/index.html", "utf-8");
  }

  return html;
}

module.exports.handler = async (event, context) => {
  let template = await loadHtml();
  let restaurants = await getRestaurants();

  let html = Mustache.render(template, { restaurants });

  const response = {
    statusCode: 200,
    body: html,
    headers: {
      "Content-Type": "text/html; charset=UTF-8"
    }
  };

  return response;
};
```
