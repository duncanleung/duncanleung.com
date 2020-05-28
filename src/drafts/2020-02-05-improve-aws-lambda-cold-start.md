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

- First invocation on a new container spawned to contain code
- Needs to init any deps
- Exmaple - in the global space you require `aws-sdk`
- Additional time for the lambda runtime to init the module
- Have to require the module from the execution env

===========
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

===================

## Python vs Node and Cold Starts

python

How to keep binaries small

serverless-python-requiresments

- doesn't do tree shaking and getting binaries down
- cold start performance?
- Often not used for web facing APIs because can't get the binaries small

### 2 Types of Cold Starts

Normal Cold Start

- Filesize of package only affects the duration of the coldstart for the first coldstart after you make code changes

First cold start after a cold deployment

- init time for the module

* Keeping binary size down will not affect much
* Number and size of dependencies impacts cold start more

* Putting deps in layers - layers loads the deps faster than compared to
  - Loading from package in node_modules folder
  - Loading from AWS execusion environment
    (Something to do with the order of loading)
  - Layers still bound to 250mb unzipped size limit
* But still choose webpack to treeshake - only load only code used

===========

- warmup: if you have coldstart issues - optimize it until the cold start is within latency range that is acceptable - or if frequency of coldstart is a problem, and the latency can't be optimized more because we have to use some 3rd party dependency - look at provisioned concurrency

========

## Layers

- Used to avoid re-including something (like an external SDK) in every single lambda function
- Helps improve coldstart perf
- Many 3rd party providers are now providing their SDKs through layers - by pointing to their ARN for the layer directly
- Still recommended to use locally packaged libs through package managers like npm packages
- https://lumigo.io/blog/lambda-layers-when-to-use-it/
