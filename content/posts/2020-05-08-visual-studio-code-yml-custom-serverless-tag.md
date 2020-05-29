---
date: 2020-05-08
title: Add Custom AWS YAML Tags in VS Code
template: post
thumbnail: "../thumbnails/serverless.png"
slug: visual-studio-code-yml-custom-serverless-tag
categories:
  - Serverless
tags:
  - visual-studio-code
  - aws
  - serverless
---

Visual Studio Code was showing an IntelliSense error when adding `!Ref` and `!GetAtt` tags in my `serverless.yml`.

I was trying to reference the `StoresTable` resource using the CloudFormation pseudo functions `!Ref` and `!GetAtt`:

```terminal
unknown tag <!Ref>

unknown tag <!GetAtt>
```

<div class="filename">serverless.yml</div>

```yml{8,18,22,35}
provider:
  name: aws
  runtime: nodejs12.x

  iamRoleStatements:
    - Effect: Allow
      Action: dynamodb:scan
      Resource: !GetAtt StoresTable.Arn

functions:
  get-stores:
    handler: functions/get-stores.handler
    events:
      - http:
          path: /stores
          method: get
    environment:
      stores_table: !Ref StoresTable

resources:
  Resources:
    StoresTable:
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
    StoresTableName:
      Value: !Ref StoresTable
```

## Add yaml.customTags in VSCode settings.json

The fix was the add the `yaml.customTags` property in my Visual Studio Code `settings.json`, with an array of custom tags I wanted to support.

<div class="filename">VSCode - settings.json</div>

```json
{
  // ... other settings
  "yaml.customTags": ["!Ref", "!GetAtt"]
}
```
