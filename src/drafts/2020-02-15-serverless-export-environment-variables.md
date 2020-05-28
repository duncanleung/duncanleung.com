---
date: 2020-05-10
title: Export Serverless Environment Variables into .env
template: post
thumbnail: "../thumbnails/serverless.png"
slug: serverless-export-environment-variables-env
categories:
  - Serverless
tags:
  - serverless
  - aws-lambda
---

There are Serverless resources that have randomly generated ARNs, such as DynamoDB table names.

## Export environment variables from serverless.yml

```yml
provider:
  iamRoleStatements:
    - Effect: Allow
      Action: dynamodb:scan
      Resource: !GetAtt RestaurantsTable.Arn

functions:
  get-index:
    handler: functions/get-index.handler
    events:
      - http:
          path: /
          method: get
    environment:
      restaurants_api: https://#{ApiGatewayRestApi}.execute-api.#{AWS::Region}.amazonaws.com/${self:provider.stage}/restaurants

  get-restaurants:
    handler: functions/get-restaurants.handler
    events:
      - http:
          path: /restaurants
          method: get
    environment:
      # CloudFormation pseudo function !Ref
      # resource called RestaurantsTable
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

plugins:
  - serverless-export-env
  - serverless-pseudo-parameters
```

Use the `serverless-export-env` plugin to export the environment variables to a `.env` file.

```
$ yarn add -D serverless-export-env
```

Add to end of serverless.yml

```yml
plugins:
  - serverless-export-env
```

```
$ serverless export-env
```

---

Will generate a .env file in your project root, and the file content should look something like this:

```
restaurants_table=workshop-yancui-dev-RestaurantsTable-1Y097GF7QLUIX
```

`get-restaurants` function has an environment variable called `restaurants_table`.

The `serverless-export-env` plugin has resolved the `!Ref RestaurantTable` reference
added the resolved table name to the .env file.

## Import environment variables .env

- Add .env to your .gitignore file

```
$ yarn add -D dotenv
```

```javascript
require("dotenv").config();

// ... your code
let RESTAURANTS_TABLE = process.env.restaurants_table;
```
