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

# Managing Permissions for Serverless Framework

AWS profile was configured with an IAM user with full admin access

principle of least privilege and start with the bare minimum of permissions, such as S3 create bucket, and gradually add more permissions as the developers bump against the wall when they try to deploy

- Add additional deploy or when you remove an existing deployment
- creating and deleting S3 buckets and creating CloudFormation stacks, etc

starting with a dedicated deployed user with admin access in your development account

- Developers can freely develop and experiment
- only copy over the permissions they have actually used to the deployer role in the production account
- less friction in the process, but it's predicated on the assumption that you have account-level separation between environments, so that those admin assets are never handed out for the production account
- see what services were accessed by, and I'll stress this, the dedicated deployer user
  (screenshot in Production Ready Serverless: 1. Intro > Managing persmissions)
