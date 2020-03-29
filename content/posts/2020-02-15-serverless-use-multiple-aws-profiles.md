---
date: 2020-02-15
title: Use Multiple AWS Profiles with Serverless
template: post
thumbnail: "../thumbnails/serverless.png"
slug: serverless-use-multiple-aws-profiles
categories:
  - Serverless
tags:
  - serverless
  - aws-lambda
  
---

## Serverless CLI

### Set up AWS CLI Profile with `aws configure`

Saved in `~/.aws/credentials`

```shell
$ aws configure --profile devProfile

AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
Default region name [None]: us-west-2
Default output format [None]: ENTER
```

### Using AWS Profiles

Using specific AWS profile keys in serverless CLI

### Use a profile by specifying in `serverless.yml`

Add `profile` setting to `provider` configuration

```yml
service: new-service
provider:
  name: aws
  runtime: nodejs12.x
  stage: dev
  profile: devProfile # Specify the profile here
```

### Use an existing AWS Profile as env var

1. define different profiles in ~/.aws/credentials

```shell
[workProfile]
aws_access_key_id=***************
aws_secret_access_key=***************

[devProfile]
aws_access_key_id=***************
aws_secret_access_key=***************
```

2. switch per project (/ API) by executing once when you start your project:

Idea: Run an npm script that will do this

```shell
export AWS_PROFILE="devProfile" && export AWS_REGION=us-west-1.
```

### use the `aws-profile` option

https://serverless.com/framework/docs/providers/aws/guide/credentials#using-the-aws-profile-option

```shell
$ serverless deploy --aws-profile devProfile
```