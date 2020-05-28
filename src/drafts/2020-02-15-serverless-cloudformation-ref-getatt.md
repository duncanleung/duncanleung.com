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

## !Ref and !GetAtt?

- Cloud formation - create resource (Dynamodb table / cognito user pool)
- Resource has different aspects
- Dynmodb: table name, ARN (unique amazon resource name to a particular resource in AWS environment)
- Depending on resource type
- Reference the ID for the table / table name

- CloudFormation resource types and their corresponding Ref and Fn::GetAtt outputs
  - https://theburningmonk.com/cloudformation-ref-and-getatt-cheatsheet/
  - `Ref` Get a CloudFormation resource value, depending on the resource type
- Fn::GetAtt
  - Native function to use in CloudFormation stack
    - `!GetAtt logicalNameOfResource.attributeName`
    - ``
  - The Fn::GetAtt intrinsic function returns the value of an attribute from a resource in the template.
  - https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-getatt.html

Example: AWS::DynamoDB::Table Name Arn, StreamArn

To get the ARN of a DynamoDB table

```yml
!GetAtt RestaurantsTable.Arn
```

To get the Table Name of a DynamoDB table

```yml
!Ref RestaurantsTable
```

```yml
service: workshop-${self:custom.name}

provider:
  iamRoleStatements:
    - Effect: Allow
      Action: dynamodb:scan
      Resource: !GetAtt RestaurantsTable.Arn

resources:
  Resources:
    RestaurantsTable:
      Type: AWS::DynamoDB::Table
```
