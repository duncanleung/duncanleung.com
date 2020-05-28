---
date: 2020-05-28
title: Set Breakpoints to Locally Debug AWS Lambda
template: post
thumbnail: "../thumbnails/serverless.png"
slug: serverless-set-breakpoint-locally-debug-aws-lambda
categories:
  - Serverless
tags:
  - serverless
  - aws-lambda
---

## Debugging Use Case

Serverless functions can be <a href='https://www.serverless.com/framework/docs/providers/aws/cli-reference/invoke-local/' target='_blank'>invoked locally</a> with the Serverless CLI.

```
$ sls invoke local
```

If you set up your functions to write event payloads into your CloudWatch logs, the logged event payload can be used as the local event payload with the `--path` flag.

> **Using the VSCode debugger:**
>
> **You can set breakpoints to step-through and inspect your function during runtime with the exported payload that caused your function to error.**

## Run a Serverless function locally

In this exampole we're invoking the function named `index` with the flag `--function`. The function name `index` is specified by the `serverless.yml`.

We're also passing a data payload with the flag, `--path`, which points to a local json file that will be passed to the function as an event payload.

```terminal
## --function | -f: Name of the function
## --path | -p: Path to a json file to be used as the event input data

$ sls invoke local --function index --path 'logs-export.json'



## Output
{
    "statusCode": 200,
    "body": "{\n
               \"message\": \"Running function, \"index\" \",\n
               \"input\": {\n    \"foo\": \"bar\"\n  }
             \n}"
}
```

<div class="filename">serverless.yml</div>

```yml{6}
provider:
  name: aws
  runtime: nodejs12.x

functions:
  index:
    handler: functions/index.handler
    events:
      - http:
          path: /
          method: get
```

<div class="filename">/functions/index.js</div>

```javascript{7}
module.exports.handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: `Running function, "index"`,
        input: event,
      },
      null,
      2
    ),
  };
};
```

## Attaching a Visual Studio Code debugger

Since we're invoking the function locally, we can also attach a VSCode debugger breakpoint.

1. **Install serverless as a local dependency to project**

```terminal
$ yarn add -D serverless
```

2. **Set up a new VSCode `launch.json`**

The main part of the `launch.json` is to:

- Point the `program` to the locally installed serverless dependency in `node_modules`
- Pass in the same arguments that we used to run `sls invoke local`

<div class="filename">launch.json</div>

```json{8-9}
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "program": "${workspaceFolder}/node_modules/.bin/sls",
      "args": ["invoke", "local", "-f", "hello", "-p", "logs-export.json"]
    }
  ]
}
```

3. **Set up a breakpoint locally in VSCode**
4. **Use VSCode debugger to run the created launch.json**
