---
date: 2020-02-15
title: Use NodeJS AWS SDK .promise()
template: post
thumbnail: "../thumbnails/serverless.png"
slug: serverless-nodejs-aws-sdk-promise
categories:
  - Serverless
tags:
  - serverless
  - aws-lambda
  - nodejs
---

<!-- ------------------------------------------------------------------------------------------------------- -->

```javascript
const AWS = require("aws-sdk");
const Lambda = new AWS.Lambda();

async function invokeLambda(functionName) {
  const req = {
    FunctionName: functionName,
    Payload: JSON.stringify({ message: "hello world" })
  };
  await Lambda.invoke(req).promise();
}
```

<!-- ------------------------------------------------------------------------------------------------------- -->

Node8's built-in util module has filled that gap with the promisify function.

transform the readFile function from the fs module like this:

```javascript
const fs = require("fs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);
```

```javascript
const AWS = require("aws-sdk");
const fs = require("fs").promises;
const Mustache = require("mustache");

// cache
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
