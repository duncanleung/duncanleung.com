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

## Using serverless-pseudo-parameters

reference CloudFormation pseudo parameters resources easily

serverless.yml

```yml
plugins:
  - serverless-pseudo-parameters
```

```yml{9}
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
```

plugin translates strings that contain `#{...}` into a `Fn::Sub`, which you can see in the generated CloudFormation update template
