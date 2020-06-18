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

## Return on Investment of Unit tests for Serverless is not worth it

- Risk of shipping software shifted to how Lambda functions integrate with external services
- Risk of misconfiguration (application and IAM) is higher

- Most issues when building serverless arise due to misconfiguration since the point of failure is usually at the integration with other systems

  - New dynamodb table
  - Maybe using PUT as well as GET (forgot to add PUT IAM role for the function)

- Risk profile for serverless is different to hosted server application

## Integration Tests

- Test: interaction with downstream
- Test: downstream system works as expected
- The aim is to test the actual integrations (without mocks and stubs)

- Does not: test IAM permissions
- Does not: Test API endpoint configurations
