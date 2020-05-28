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

<!-- ------------------------------------------------------------------------------------------------------- -->

# Week 01

## Lambda 101:

- By default there's a limit of 1000 concurrent lambda executions, this can be raised with a support ticket.
- There are companies that have this limit raised up to tens of thousands concurrent lambda executions.
- By default you get 75GB of code storage (so up to 10 React apps, lol) which can also be raised

### Monitoring

## AWS Lambda Dashboard

- Looking at `Throttles` graph is useful, we don't want our functions to be throttled. Most likely exhaused available concurrent executions
- `ConcurrentExecutions` graph is useful as well - to understand if we're not approaching a limit
- When using dead letter queues or lambda destinations: `async delivery` monitors when lambda service is unable to send failed events to DLQ or lambda destination
- When you have lambdas processing events from Kinesis streams: `iteratorAge` - age of those records - time between hitting the stream, to being picked up by the function - when your function is falling behind

## Managing Lambdas

- Proper naming: Allow searching for lambda functions using function name (adding prefixed help!) or using tags

* Naming:
* `{project}-{environment}-{function-name}`
* Prefix: `serverless-workshop-dev-test`

  - Use project prefix
  - Environment (dev, staging, prod)
  - Function name

- Tagging:

  - Team name
  - Cost center

## Layers

- Used to avoid re-including something (like an external SDK) in every single lambda function
- Helps improve coldstart perf
- Many 3rd party providers are now providing their SDKs through layers - by pointing to their ARN for the layer directly
- Still recommended to use locally packaged libs through package managers like npm packages
- https://lumigo.io/blog/lambda-layers-when-to-use-it/

## Limits

- You can get a memory limit of a function from within the function using the `context` object
- A lambda function is allocated CPU proportional to the memory configured for it, so 128MB (the default) is not going to have a lot of CPU power
- You get charged for the lambda execution time in 100ms blocks (so if your function takes 10ms to execute, you'll pay for 100ms)
- You also pay for the amount of memory given to the lambda function
- With more memory you get more consistent performance but you may end up paying more

- ARN is a unique identifier for a resource in AWS

## Lambda Config - Important Settings

- First invocation on a new container spawned to contain code
- Needs to init any deps
- Exmaple - in the global space you require `aws-sdk`
- Additional time for the lambda runtime to init the module
- Have to require the module from the execution env

## Timeout

- The max time that a lambda invocation can run for is 15min
- Lambda execution runtime will force stop the execution

## Memory

- Function is allocated CPU and network bandwidth proportional to the memory configured
- 128mb - 3gb
- More than 1.8gb of memory will unlock a second CPU core
  - Node can't make use of a second core

## Cost Optimization

- Always charged for 100ms blocks
- If avg 50ms runtime duration - there is no cost optimization based on runtime
- But you can reduce the memory allocation - the cost / 100ms of execution time
- is charged by runtime for memory allocation
- One of effective ways to reduce cost - is to reduce the memory allocation
- https://theburningmonk.com/2020/03/how-to-optimize-lambda-memory-size-during-ci-cd-pipeline/
  - Tune the function's memory so it's always optimized for the function's payload

---

## VPC

- By default lambda functions run inside VPC inside the lambda service manages
- No way to log onto the EC2 instance that manages the function itself
- If need VPC only resources

  - RDS, Elastic Cache, or other internal services sitting on container or EC2 behind a VPC

- Can configure custom VPC, subnet
- Should create separate subnet just for the lambda functions
- So prevent case of when functions scale up massively quickly
- Create too many Elastic Network Interfaces and consume too many of the IP addresses available
- Isolate the IP exhaustion scenario
-

## Concurrency

### reserved concurrency

- There is a pool of available concurrency (1000 for most regions)
  - able to reserve an amount of concurrency to a specific lambda
  - Also acts as the max concurrency - only that # of instances of that function running at a single time
- You can use `reserved concurrency` to limit the number of function invocations
- for instance setting it to 1 will ensure that at any given moment the function can be executed only one time

### Provisioned concurrency

- allows you to ensure that you always have a number of containers available (to ensure that you won't see cold starts)
- You cannot provision concurrency for the `$LATEST` alias
- Provisioned concurrency is not free, you have to figure out what's cheaper for you
- The containers will be warm all the time
- Paying a certain amount for having the provisioned concurrency + 100ms of execution (cost of 100ms of execution time is cheaper)
- If you can make about 60% utilization of your provisioned concurrency, you will break even with the regular on-demand per/100ms pricing

- When use alias and doing a deployment
- Change the version that the alias points at
- Provisioned concurrency is always pointed to a particular version
  - For a few minutes
    - On a new version
      - switch traffic to the new version
      - provisioned concurrency will remain on the old version
      - will take time to move the provisioned concurrency


## Async Invocation

- When function is executed by SNS, SES, CloudFormation, Event Bridge
- Can control the retry behavior
- And config the Dead Letter Queue service
- You can push failed async lambda function invocations to dead letter queue (for instance - SQS)

## Destinations

- for asnc invocations and streaming based traffic - processing events from kinesis or DynamoDB streams
- When it errors - can capture those failed events to SNS, SQS, Lambda, EventBridge
- When it succeeds - can set up one-hop workflows (multi-hop using step functions is better)
- to create simple lambda -> lambda workflows, for something more complicated you should use Step Functions

## Database Proxy

- RDS database
- Need to manage socketpool to not exhaust total socket pool available from RDS
- DB Proxy sits between function and RDS and manages the socket pooling

## Versioning and Aliasing

- Creating versions allows you to have 'point-in-time' versions of your lambda functions (required for provisioned concurrency)
- With aliases you can set two versions with weighted assignment of Lambda function (for instance run version A 90% of the time and version B 10% of the time)
