---
date: 2020-02-15
title: Serverless Notes
template: post
thumbnail: "../thumbnails/serverless.png"
slug: serverless-notes
categories:
  - Serverless
tags:
  - serverless
  - aws-lambda
  - aws-api-gateway
  - aws-iam
---

manage users when using cognito user pools?

- how can I fetch a list of orders based on user id?
- Are all the users stored in the user pool or would we also store our users in a database?

* lambda test function: API Gateway Event - apigateway-aws-proxy
  - will receive a test payload similar to what is passed by API Gateway
  - `requestContext`
  - if API is protected by cognito
  - `identify`
    - `cognitoIdentityPoolId`
    - `accountId`
    - `user`
*
