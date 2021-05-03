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

This adds the dynamodb:scan permission to the Lambda execution role.

serverless.yml

```yml
provider:
  # other provider config

  iamRoleStatements:
    - Effect: Allow
      Action: dynamodb:scan
      Resource: !GetAtt RestaurantsTable.Arn
```

======================

Lambda: Get items from DynamoDB

```javascript
const DocumentClient = require("aws-sdk/clients/dynamodb").DocumentClient;
const dynamodb = new DocumentClient();

const defaultResults = process.env.defaultResults || 8;
const tableName = process.env.restaurants_table;

const getRestaurants = async (count) => {
  console.log(`fetching ${count} restaurants from ${tableName}...`);
  const req = {
    TableName: tableName,
    Limit: count,
  };

  const resp = await dynamodb.scan(req).promise();
  console.log(`found ${resp.Items.length} restaurants`);
  return resp.Items;
};

module.exports.handler = async (event, context) => {
  const restaurants = await getRestaurants(defaultResults);
  const response = {
    statusCode: 200,
    body: JSON.stringify(restaurants),
  };

  return response;
};
```
