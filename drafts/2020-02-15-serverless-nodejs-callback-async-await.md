---
date: 2020-02-15
title: Use async/await instead of callbacks in NodeJS AWS Lambdas
template: post
thumbnail: "../thumbnails/serverless.png"
slug: serverless-nodejs-callback-async-await
categories:
  - Serverless
tags:
  - serverless
  - aws-lambda
  - nodejs
---

<!-- ------------------------------------------------------------------------------------------------------- -->

```javascript
module.exports.handler = async (event, context, cb) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({ message: "hello world" })
  };

  cb(null, response);
};
```

```javascript
module.exports.handler = async (event, context) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({ message: "hello world" })
  };

  return response;
};
```
