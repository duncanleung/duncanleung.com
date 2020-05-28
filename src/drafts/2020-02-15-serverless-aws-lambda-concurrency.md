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

## When use provisioned concurrency

- Have to manage Pay for uptime
- Use if

  - Can't optimize cold start duration any longer and is still a problem
  - Microserive env - services have sync API calls to each other
    - If SLA is 90% of requests complete within 1 sec
    - Can usually optimize to get cold starts of 1 lambda down to 1/2 second
    - But if you have 1, 2, 3 function calling another through direct API call - the 1/2 second will stack up

- Spikey Traffic
- Food delivery / etc

- 10 - 1 mill in 30 seconds
- Scaling limit
  - No limit on total concurrency
  - But limit on speed of reaching total concurrency needed
  - 3000 burst capacity
  - 500 / min
  - 10,000: 15min.
  - 3000 first, then 500 every /min
- Provisioned Concurrency
  - Acts as Auto scaling - prepare ahead of time
  - If you have Predictable traffic pattern when spikes will come

<!--
------------------------------------------------------------------------------------------------------- -->

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
