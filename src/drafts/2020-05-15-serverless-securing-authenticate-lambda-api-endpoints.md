---
date: 2020-05-15
title: Authenticating AWS Lambda API Endpoints
template: post
thumbnail: "../thumbnails/serverless.png"
slug: serverless-securing-authenticate-lambda-api-endpoints
categories:
  - Serverless
tags:
  - serverless
  - aws-lambda
  - aws-api-gateway
  - aws-api-key
  - aws-iam
  - aws-cognito
---

## API Accessibility Concepts

- APIs in a system will have different levels of accessibility
  - Public APIs
  - authenticated APIs that require the user to be authenticated first
    - APIs that typically update the system state on a user's behalf
      - User Profile
      - Place orders
  - Internal API
    - Used by microservices
    - Not to be consumed by client app

## Secure APIs in API Gateway with API Keys

- API keys and usage patterns are designed for rate limiting individual clients rather than authentication and authorization
- give clients access to APIs included in the usage plan, but only at an agreed-upon request rate and quota

- create a usage plan, which allows us to rate limit as well as ration the number of requests an individual client is able to make
- associate the API with this usage plan

  - `private:true`

- An important detail per API Keys:
  - the request rate and quota assigned to an API Key apply to all the APIs AND the **stages** covered by the current usage plan.

<div class="filename">serverless.yml</div>

```yml
provider:
  name: aws
  runtime: nodejs12.x
  apiKeys:
    - free:
        - freeKey
    - paid:
        - paidKey
  usagePlan:
    - free:
        quota:
          limit: 5000
          offset: 2
          period: MONTH
        throttle:
          burstLimit: 200
          rateLimit: 100
    - paid:
        quota:
          limit: 50000
          offset: 1
          period: MONTH
        throttle:
          burstLimit: 2000
          rateLimit: 1000
functions:
  get-index:
    handler: functions/get-index.handler
    events:
      - http:
          path: /
          method: get
    environment:
      restaurants_api: https://cx6jygh1y4.execute-api.us-east-1.amazonaws.com/dev/restaurants

  get-restaurants:
    handler: functions/get-restaurants.handler
    events:
      - http:
          path: /restaurants/
          method: get
          private: true
```

- Set up the header with `x-api-key`

<div class="filename">/functions/get-index.js</div>

```js{12}
async function getRestaurants() {
  const url = URL.parse(restaurantsApiRoot);

  const res = await axios.get(restaurantsApiRoot, {
    headers: {
      "x-api-key": process.env.LAMBDA_API_KEY,
    },
  });
  return res.data;
}

module.exports.handler = async function(event, context) {
  let restaurants = await getRestaurants();

  // ...

  const response = {
    statusCode: 200,
    body: html,
    headers: {
      "Content-Type": "text/html; charset=UTF-8",
    },
  };

  return response;
};
```

<!-- ------------------------------------------------------------------------------------------------------- -->

## Securing the endpoint with IAM authorization

- Restrict access to endpoints by role based permission model
- AKA for own services

- You generally want to have different levels of access for different APIs in your system (obviously not everything should be public)
- One way to address that is to use usage plans + API keys. They are designed for rate limiting, not auth and they allow the client to access the selected API at agreed upon request rates and quotas (like Google Maps API). Request rate and quote apply to all APIs and stages covered by the usage plan.
- Another thing is to allow certain APIs to be accessed by your infrastructure only - by using IAM authorization
- API Gateway also supports an custom authorizer that you can build yourself
- A VPC Endpoint allows you to securely connect your VPC to another service

- restrict access to endpoints using a role-based permission model
- use AWS_IAM authorization - allow internal APIs to be accessible only by your own services
- for endpoints only used by other lambda functions and not intended to be called by the client directly

- function and not intended to be called by the client directly
- secured via IAM authorization, as the caller is already running in AWS and should have an IAM role already
- internal APIs should be secured via IAM authorization
- caller is already running in AWS and should have an IAM role already

- `execute-api:invoke` permission is for call API gateway endpoints
- `lambda:InvokeFunction` allows you to directly invoke lambdas, bypassing API gateway
- give our functions the permission to execute the GET method on the restaurants resource to any API and any stage

### Manually signing with `aws4`

- sign the HTTP request with the AWS version 4 signature
  https://docs.aws.amazon.com/general/latest/gr/sigv4_signing.html

```
$ yarn add aws4
```

<div class="filename">serverless.yml</div>

```yml{7-8,26}
provider:
  name: aws
  runtime: nodejs12.x

  iamRoleStatements:
    - Effect: Allow
      Action: execute-api:Invoke
      Resource: arn:aws:execute-api:#{AWS::Region}:#{AWS::AccountId}:#{ApiGatewayRestApi}/${self:provider.stage}/GET/restaurants

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
          authorizer: aws_iam

plugins:
  - serverless-pseudo-parameters
```

<div class="filename">/functions/get-index.js</div>

```js{5,15}
const http = require("axios");
const aws4 = require("aws4");
const URL = require("url");

const restaurantsApiRoot = process.env.restaurants_api;

const getRestaurants = async () => {
  const url = URL.parse(restaurantsApiRoot);

  const opts = {
    host: url.hostname,
    path: url.pathname,
  };

  aws4.sign(opts);

  const httpReq = http.get(restaurantsApiRoot, {
    headers: opts.headers,
  });

  return (await httpReq).data;
};

module.exports.handler = async (event, context) => {
  const restaurants = await getRestaurants();
  const response = {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html; charset=UTF-8",
    },
    body: html,
  };

  return response;
};
```

Trying to hit the `/restaurants` API endpoint directly will result in the error:

```
{
  message: "Missing Authentication Token"
}
```

### Using Javascript SDK

- lambda node.js code is using the AWS node SDK, which should be picking up permissions from the instance environment
- The execution role provides the Lambda function with the credentials it needs to run and to invoke other web services
- API handler only has permissions from the statically defined execution role

```yml
provider:
  name: aws
  runtime: nodejs12.x
  iamRoleStatements:
    - Effect: Allow
      Action: lambda:InvokeFunction
      Resource: arn:aws:lambda:#{AWS::Region}:#{AWS::AccountId}:function:manning-serverless-dev-get-restaurants

functions:
  get-index:
    handler: functions/get-index.handler
    events:
      - http:
          path: /
          method: get
    environment:
      restaurants_api: YOUR_DEPLOYED_API_URL
  get-restaurants:
    handler: functions/get-restaurants.handler
    events:
      - http:
          path: /restaurants/
          method: get
          private: true
          authorizer: aws_iam
```

```js
const AWS = require("aws-sdk");

const lambda = new AWS.Lambda({
  region: "us-east-1",
});

async function getRestaurants() {
  const params = {
    FunctionName: "manning-serverless-dev-get-restaurants",
    InvocationType: "RequestResponse",
  };
  const data = await lambda.invoke(params).promise();

  const dataPayload = JSON.parse(data.Payload);
  return JSON.parse(dataPayload.body);
}

module.exports.handler = async (event, context) => {
  let restaurants = await getRestaurants();

  // ...

  const response = {
    statusCode: 200,
    body: html,
    headers: {
      "Content-Type": "text/html; charset=UTF-8",
    },
  };

  return response;
};
```

<!-- ------------------------------------------------------------------------------------------------------- -->

## Cognito User Pool

- We can think of Cognito as a collection of 3 different services: Cognito User Pools, Cognito Federated Identities and Cognito Sync
- Cognito User Pools is a managed identity service (registration/verify email/password policy etc. etc.). After signign in user can access - APIs on API Gateway that require sign in
- Cognito Federated Identities - allows you to take auth token issues by auth providers and exchange it for a set of temporary AWS credentials
- Cognito Sync - nobody uses it lmao, it syncs user data across multiple devices

- In short - when user registers, confirms their email etc. the client talks with Cognito User Pools, and after a successful sign-in, Cognito User Pools returns a JWT token. This token is later used for authorization in API Gateway.

- endpoints called by the client directly doesn't have any IAM roles they can use to authenticate themselves with. you should use Cognito user pools

- Cognito

  - manage user sign-ups and synchronizing user profiles across devices
  - Cognito user pools to create new users for your application and give them temporary credentials they can use to access either AWS resources or your APIs in API Gatewayb

- Auth Flow
  - Client: Sign in with username and password
  - Cognito User Pool:
    - authenticate the user with username and password
    - Return the ID token with JWT
  - Client: include JWT in header of HTTP request to API Gateway secured with a Cognito authorizer

```
Client         Cognito User Pools     API Gateway
  |                      |                |
  | Register             |                |
  | -------------------> |                |
  | <------------------- |                |
  |   Verification Token |                |
  |        (Email / SMS) |                |
  |                      |                |
  | Confirm Token        |                |
  | -------------------> |                |
  | <------------------- |                |
  |         Registration |                |
  |             Complete |                |
  |                      |                |
```

```
Client         Cognito User Pools     API Gateway
  |                      |                 |
  | Sign In              |                 |
  | -------------------> |                 |
  | <------------------- |                 |
  |             ID Token |                 |
  |                (JWT) |                 |
  |                      |                 |
  |                      |                 |
  |                      |                 |
  | HTTP POST { authorization: ...}        |
  | -------------------------------------> |
  | <------------------------------------- |
  |                      |    200 {......} |

```

- This is different from the endpoints that are protected by IAM authorization, which requires us to sign the request using the AWS v4 signature

<!-- ------------------------------------------------------------------------------------------------------- -->

## Custom authorizer

- Can also use custom authorizers for authenticating and authorizing users
- When a client makes a request to API Gateway, if a policy doesn't exist for this client already, as identified by the client's authentication token in the request

- API Gateway invoke and cache the policies for you,
- API Gateway will invoke this custom authorization function, which will return a JSON payload with a policy object for this user.
- For successfully authenticated requests, the policy would then be cached for future requests. API Gateway would then forward the request to the configured integration endpoint
