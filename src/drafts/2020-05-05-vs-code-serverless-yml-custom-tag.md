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

Trying to reference RestaurantsTable

restaurants_table environment variable is referencing (using the CloudFormation pseudo function !Ref) a resource called RestaurantsTable

environment:
restaurants_table: !Ref RestaurantsTable

```yml{18}
service: workshop-${self:custom.name}

custom:
  name: Duncan-Leung

provider:
  name: aws
  runtime: nodejs12.x

functions:
  get-restaurants:
    handler: functions/get-restaurants.handler
    events:
      - http:
          path: /restaurants
          method: get
    environment:
      restaurants_table: !Ref RestaurantsTable

resources:
  Resources:
    RestaurantsTable:
      Type: AWS::DynamoDB::Table
      Properties:
        BillingMode: PAY_PER_REQUEST
        AttributeDefinitions:
          - AttributeName: name
            AttributeType: S
        KeySchema:
          - AttributeName: name
            KeyType: HASH

  Outputs:
    RestaurantsTableName:
      Value: !Ref RestaurantsTable
```

```
unknown tag <!Ref>
unknown tag <!GetAtt>
```

```json
{
  // ... other settings
  "yaml.customTags": ["!Ref", "!GetAtt"]
}
```
