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

# Managing Permissions for Serverless Framework

AWS profile was configured with an IAM user with full admin access

principle of least privilege and start with the bare minimum of permissions, such as S3 create bucket, and gradually add more permissions as the developers bump against the wall when they try to deploy

- Add additional deploy or when you remove an existing deployment
- creating and deleting S3 buckets and creating CloudFormation stacks, etc

starting with a dedicated deployed user with admin access in your development account

- Developers can freely develop and experiment
- only copy over the permissions they have actually used to the deployer role in the production account
- less friction in the process, but it's predicated on the assumption that you have account-level separation between environments, so that those admin assets are never handed out for the production account
- see what services were accessed by, and I'll stress this, the dedicated deployer user
  (screenshot in Production Ready Serverless: 1. Intro > Managing persmissions)

---

<!-- ------------------------------------------------------------------------------------------------------- -->

# Week 01

## Lambda 101:

- By default there's a limit of 1000 concurrent lambda executions, this can be raised with a support ticket.
- There are companies that have this limit raised up to tens of thousands concurrent lambda executions.
- By default you get 75GB of code storage (so up to 10 React apps, lol) which can also be raised

## Serverless 101:

- Event driven computing
  - File upload
  - DB update
  - In app activity
  - API calls
  - website clicks
  - IoT events
- Using small stateless functions
- Invoked in response to different events

- Serverless functions run in docker like containers

  - Several of these functions can be run concurrently, and are therefore highly scalable
  - (Isolated, pre-configured environments)

- Events trigger the initialization of a container
- Loads the function and executes the function
- The function can optionally return a response
- The container will then spin down

### Timeout

- API Gateway has a hard limit timeout of 29 seconds
- Serverless framework has a default function timeout of 6 seconds

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

## Limits

- You can get a memory limit of a function from within the function using the `context` object
- A lambda function is allocated CPU proportional to the memory configured for it, so 128MB (the default) is not going to have a lot of CPU power
- You get charged for the lambda execution time in 100ms blocks (so if your function takes 10ms to execute, you'll pay for 100ms)
- You also pay for the amount of memory given to the lambda function
- With more memory you get more consistent performance but you may end up paying more

- ARN is a unique identifier for a resource in AWS

## Lambda Config - Important Settings

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

## Async Invocation

- When function is executed by SNS, SES, CloudFormation, Event Bridge
- Can control the retry behavior
- And config the Dead Letter Queue service
- You can push failed async lambda function invocations to dead letter queue (for instance - SQS)

## Serverless Plugins

- Prefer https://serverlessrepo.aws.amazon.com/applications/arn:aws:serverlessrepo:us-east-1:374852340823:applications~lambda-janitor over Prune (use a platform level concern)
- webpack
- Offline (only when needing to render HTML from lambda)
- Pseudo parameters
- step functions
- split stacks (for larger stacks - help with 200 recources limit)
- dotenv
- IAM Roles per Func

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

### No longer necessary

- Tracing

## NPM Modules

- https://github.com/agutoli/serverless-layers
  - attaches automatically layers for each function
  - Auto detect when deps have changes
  - Auto publish a layer

## VSCode Extensions

- AWS Toolkit
  - Event bridge
  - schema registry: use aws toolkit to browse contracts that the schema registry has detected or published yourself
- GraphQL for VSCode
- Serverless IDE
- cfn-lint: https://formulae.brew.sh/formula/cfn-lint

- Commitizen: https://github.com/commitizen/cz-cli
- SEmantic RElease

## How to structure functions in bigger products ?

- App consist of many services
- Micro repo approach - each microservice belongs in its own repo
- That repo has one serverless.yml
- Can still share code within that service
- Different endpoint for same API - shared logic
- Put into shared mo9dule in same project
- reference by relative path
- Shared utils, libs, across projects
  - Extract to util repo
  - Publish to NPM

* Small startups / full stack teams
  - mono repo
    - folder for components / services
      - each has its own serverless.yml
    - Sharing code is easier
    - Build time use webpack to bundle

## Local Stack is hard to configure - and easy to break

- Don't optimize for local dev experience
- Tooling right now is not good enough

- Slight difference in behavior with prod
- Talk to real AWS services
- Deploy / provision

## drawbacks of lambdas calling lambdas?

- handle all the retries manually
- first function has a timeout
- within that timeout - have to finish and call another function - have to wait for the other function to complete
- have to know what the other function needs in payload, context
- Okay within one micro-service that one team manages
- however, calling another microservice owned by another team - needs to know that team's function name, and contract of that function
- needs to know more about the implementation than needed
- better to know that the contract is just the API contract of API Gateway

* If there are two separate discrete logic in two lambdas
* better to put into one lambda - easier to manage and trace that way
* otherwise - better to have async calls via a queue
