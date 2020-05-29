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

https://stackoverflow.com/questions/58617503/cloudformation-when-to-use-getatt-ref-vs

Ref can be used for two things:

To return the value of a parameter that you passed in via the parameters section of the template.

When you ref the logical ID of another resource in your template, Ref returns what you could could consider as a default attribute for that type of resource. So using ref for an EC2 instance will return the instance ID, Ref'ing an s3 bucket resource, it will return the bucket name. You can look at the bottom of each cloudformation resources page in the AWS docs to see what this value will be (See Return Values section: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html)

GetAtt is essentially the same as the 2nd function of Ref above, it also returns an attribute of the resource that you created within your resource, but while ref returns only a default attribute, GetAtt allows you to choose from different attributes to return.

Example, GetAtt for an EC2 instance gives you the option to return the AvailabilityZone, PrivateDnsName, PublicDNSName, etc of an instance - whereas Ref will only return the InstanceID. The different attributes you can return are different per resource type. You can also look at the bottom of each cloudformation resources page in the AWS docs to see what attributes you can all return (See Return Values section: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html)

\${} is another way to reference parameters passed in through the parameters section of the template.

All of this is in the AWS documentation though.

## !Ref and !GetAtt?

quickly reference what you can get via a Ref and GetAtt for most CloudFormation resources. You can use a Ref for a logical resource's default value (including inside a Sub using the \${NAME} method) as well as for a parameter of the stack. GetAtt is only useful for logical resources of the stack.

- Cloud formation - create resource (Dynamodb table / cognito user pool)
- Resource has different aspects
- Dynmodb: table name, ARN (unique amazon resource name to a particular resource in AWS environment)
- Depending on resource type
- Reference the ID for the table / table name

- CloudFormation resource types and their corresponding Ref and Fn::GetAtt outputs
  - https://theburningmonk.com/cloudformation-ref-and-getatt-cheatsheet/
  - `Ref` Get a CloudFormation resource value, depending on the resource type
- Fn::GetAtt
  - Native function to use in CloudFormation stack
    - `!GetAtt logicalNameOfResource.attributeName`
    - ``
  - The Fn::GetAtt intrinsic function returns the value of an attribute from a resource in the template.
  - https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-getatt.html

Example: AWS::DynamoDB::Table Name Arn, StreamArn

To get the ARN of a DynamoDB table

```yml
!GetAtt RestaurantsTable.Arn
```

To get the Table Name of a DynamoDB table

```yml
!Ref RestaurantsTable
```

```yml
service: workshop-${self:custom.name}

provider:
  iamRoleStatements:
    - Effect: Allow
      Action: dynamodb:scan
      Resource: !GetAtt RestaurantsTable.Arn

resources:
  Resources:
    RestaurantsTable:
      Type: AWS::DynamoDB::Table
```
