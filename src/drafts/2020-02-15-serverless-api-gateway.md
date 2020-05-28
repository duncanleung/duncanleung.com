---
date: 2020-02-15
title: Securing AWS Lambda API Endpoints in Serverless
template: post
thumbnail: "../thumbnails/serverless.png"
slug: serverless-securing-lambda-api-endpoints
categories:
  - Serverless
tags:
  - serverless
  - aws-lambda
  - aws-api-gateway
  - aws-api-key
  - aws-iam
  - aws-cognito
---

- Blog post: https://theburningmonk.com/2019/11/check-list-for-going-live-with-api-gateway-and-lambda/
- You don't have take care of every thing mentioned in the post, but the more critical the system - the more we should invest in things that can improve observability, security, performance and resilience of our API
- API Gateway has a timeout of 29 seconds so even if you set your function timeout to 15 minutes it won't matter because it's going to timeout way sooner
- Serverless caching: https://theburningmonk.com/2019/10/all-you-need-to-know-about-caching-for-serverless-applications/
