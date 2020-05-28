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



Console out the `event`
- know what `event` the function was called with
- put into JSON file
- locally execute the function
- attach debugger

```javascript
exports.handler = async (event, context) => {
  console.log(JSON.stringify(event));

  const response = {
    statusCode: 200,
    body: JSON.stringify("Hello world"),
  };

  return response;
};
```

### Attach debugger

Install serverless as a local dependency to project

```terminal
$ yarn add -D serverless
```

<div class="filename">launch.json</div>

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "program": "${workspaceFolder}/node_modules/.bin/sls",
      "args": ["invoke", "local", "-f", "hello", "-p", "package.json"]
    }
  ]
}
```

- Debugger
- Set breakpoint in VSCode
- Run

Useful when you have a set up to write the event payload into your log

- Can run the function locally with the debugger attached