---
date: 2020-05-10
title: Reference AWS Lambda API Endpoints in serverless.yml
template: post
thumbnail: "../thumbnails/serverless.png"
slug: serverless-reference-another-aws-lambda-pseudo-parameters-variables
categories:
  - Serverless
tags:
  - serverless
  - aws-lambda
---

## Generating an AWS Lambda API endpoint

A handy trick to reference an AWS Lambda API endpoint is to use <a href='https://www.serverless.com/plugins/serverless-pseudo-parameters/' target='_blank'>serverless-pseudo-parameters</a> and <a href='https://www.serverless.com/framework/docs/providers/aws/guide/variables/' target="_blank">Serverless variables</a> to create the endpoint URL that can be passed to lambda function through an environment variable.

Consider the two lambda functions defined in this `serverless.yml`:

- `get-index`: Returns an HTML page
- `get-stores`: Return a list of stores

<div class="filename">serverless.yml</div>

```yml{13,23}
provider:
  name: aws
  runtime: nodejs12.x

functions:
  get-index:
    handler: functions/get-index.handler
    events:
      - http:
          path: /
          method: get
    environment:
      stores_api: https://#{ApiGatewayRestApi}.execute-api.#{AWS::Region}.amazonaws.com/${self:provider.stage}/stores

  get-stores:
    handler: functions/get-stores.handler
    events:
      - http:
          path: /stores
          method: get

plugins:
  - serverless-pseudo-parameters
```

The `get-index` function needs to make a call to the `get-stores` function to do some logic, like querying a database.

> **Use pseudo-parameters and Serverless variables to generate the API endpoint URL of the `get-stores` API endpoint.**
>
> **Store this URL as an environment variable for the `get-index` function:**

```
https://#{ApiGatewayRestApi}.execute-api.#{AWS::Region}.amazonaws.com/${self:provider.stage}/stores
```

## CloudFormation Pseudo Parameters and Serverless Variables

<a href='https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/pseudo-parameter-reference.html' target='_blank'>Pseudo parameters</a> are parameters that are predefined by AWS CloudFormation that return AWS resource IDs.

The available CloudFormation Pseudo Parameters are:

- `AWS::AccountId`
- `AWS::NotificationARNs`
- `AWS::NoValue`
- `AWS::Partition`
- `AWS::Region`
- `AWS::StackId`
- `AWS::StackName`
- `AWS::URLSuffix`

### #{ApiGatewayRestApi} Resource

Serverless generates a `cloudformation-template-update-stack.json` CloudFormation template that from our `serverless.yml`.

<div class="filename">cloudformation-template-update-stack.json</div>

```json{2,3}
"Resources": {
  "ApiGatewayRestApi": {
      "Type": "AWS::ApiGateway::RestApi",
      "Properties": {
        "Name": "dev-api-service",
        "EndpointConfiguration": {
          "Types": [
            "EDGE"
          ]
        },
        "Policy": ""
      }
  }

  ## Other resources...
}
```

This CloudFormation template specifies `ApiGatewayRestApi` as an API Gateway REST API resource that contains a collection API Gateway resources.

We can use `#{ApiGatewayRestApi}` to reference the `ApiGatewayRestApi` resource from our CloudFormation template.

### #{AWS::Region}

`#{AWS::Region}` references the CloudFormation pseudo parameter to retrieve the AWS Region which our `get-stores` AWS Lambda resource is being created in.

### \${self:provider.stage}

`${self:provider.stage}` self-reference the provider stage variable property in our serverless.yml.
