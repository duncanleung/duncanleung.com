---
date: 2020-05-05
title: Switch the AWS Profile for Serverless CLI
template: post
thumbnail: "../thumbnails/serverless.png"
slug: use-multiple-aws-profiles-aws-cli-serverless
categories:
  - Serverless
tags:
  - serverless
  - aws-cli
---

## The AWS CLI

You'll first need to use the AWS CLI to set up a new profile with an existing AWS IAM access keys into `~/.aws/credentials`.

_(You can also manually add new profiles and access keys directly into `~/.aws/credentials`)._

The Serverless CLI (and other AWS CLIs, like the Amplify CLI) uses the AWS IAM access keys in `~/.aws/credentials` to perform deploys.

### I. Set up the Python Environment: Version Manager, Virtual Env Manager, Package Manager

AWS CLI is written in Python so you'll need to install Python 3 to get this set up.

It is recommended to install Python via a Version Manager (See: <a href='https://realpython.com/intro-to-pyenv/#why-not-use-system-python' target='_blank'>Why Not Use System Python?</a>.)

I wrote another post about [setting up a Python dev environment](/set-up-python-pyenv-virtualenv-poetry/)

### II. Installing AWS CLI

Follow the docs to install the <a href='https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html' target='_blank'>AWS CLI</a>.

Verify the AWS CLI is available:

```terminal
$ which aws
```

> Note: If you run `which aws` and it returns `aws not found` - try reloading your bash environment.

### III. Create an AWS IAM Access Key in your AWS Console

1. Go to your <a href='https://console.aws.amazon.com/iam/home#/security_credentials' target='_blank'>AWS > My Security Credentials</a>. (_For future reference, this is under your AWS Console > Account Menu Dropdown_)

2. Click: **Create access key**

3. You will be shown your `Access Key ID` and `Secret Access Key`. Keep this window open. You will need this in the next steps.

### IV. Add your AWS IAM Access Keys as a new profile in .aws/credentials

You will need the `Access Key ID` and `Secret Access Key` here.

```terminal
$ aws configure --profile devProfile
```

Example:

```
AWS Access Key ID [None]: YOUR_ACCESS_KEY_ID
AWS Secret Access Key [None]: YOUR_SECRET_ACCESS_KEY
Default region name [None]: us-west-2
Default output format [None]: json
```

Successfully running `aws configure` will set up the `.aws/` folder in your root directory:

```
(root)
|
└── .aws/
     ├── config      // Your AWS Profiles
     └── credentials // Your access key pairs
```

Let's verify that your creds have been added correctly...

```terminal
# This will print your creds to the console.
$ cat ~/.aws/credentials

# If your console print-out includes the below, you're good-to-go!
[devProfile]
aws_access_key_id = XXXXX
aws_secret_access_key = XXXXX
```

> ⚠️ The entry `[profile devProfile]` must also exist in `~/.aws/config`. These are also used in other AWS CLIs like Amplify CLI.

```terminal
$ cat config

# Output:
[profile devProfile]
region=us-west-2
output = json
```

## Using an AWS Profile for Serverless CLI

There are several different ways to choose which AWS profile you want to use with Serverless CLI:

### A. Specifying the AWS profile in serverless.yml

Add `profile` setting to `provider` configuration in `serverless.yml`.

```yml
service: new-service
provider:
  name: aws
  runtime: nodejs12.x
  stage: dev
  profile: devProfile # Specify the profile here
```

### B. Set the AWS profile as an environment variable

You can switch the AWS profile per project executing once when you start your project:

Run an npm script for:

```bash
export AWS_PROFILE="devProfile" && export AWS_REGION=us-west-1.
```

### C. Specifying the AWS profile as a Serverless CLI flag with `--aws-profile`

Or manually pass the AWS profile as an option to the Serverless CLI command with the `--aws-profile` flag.

```terminal
$ serverless deploy --aws-profile devProfile
```

Read more at the <a href='https://serverless.com/framework/docs/providers/aws/guide/credentials#using-the-aws-profile-option' target='_blank'>Serverless Docs</a>.
