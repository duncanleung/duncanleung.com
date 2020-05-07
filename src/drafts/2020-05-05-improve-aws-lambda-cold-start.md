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

When a Node.js Lambda function cold starts, a number of things happen:

- the Lambda service has to find a server with enough capacity to host the new container
- the new container is initialized
- the Node.js runtime is initialized
- your handler module is initialized, which includes initializing any global variables and functions you declare outside the handler function

```javascript
const AWS = require("aws-sdk");
module.exports.handler = async () => {};
```

Use the AWS SDK when your function needs to interact with AWS resources.
If you only need to interact with one service (e.g. DynamoDB), you can save some initialization time by requiring only the client we need (DynamoDB.DocumentClient client) greatly improves cold start performance.

```javascript
const DynamoDB = require("aws-sdk/clients/dynamodb");
const documentClient = new DynamoDB.DocumentClient();

module.exports.handler = async () => {};
```

Use the serverless-webpack plugin to bundle your lambdas with Webpack
https://github.com/serverless-heaven/serverless-webpack

WebPack improves the Initialization time across the board.
