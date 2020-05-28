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

## Export environment variables from serverless.yml

Use the `serverless-export-env` plugin to export the environment variables to a .env file.

```
$ yarn add -D serverless-export-env
```

Add to end of serverless.yml

```yml
plugins:
  - serverless-export-env
```

```
$ serverless export-env
```

---

Will generate a .env file in your project root, and the file content should look something like this:

```
restaurants_table=workshop-yancui-dev-RestaurantsTable-1Y097GF7QLUIX
```

`get-restaurants` function has an environment variable called `restaurants_table`.

The `serverless-export-env` plugin has resolved the `!Ref RestaurantTable` reference
added the resolved table name to the .env file.

## Import environment variables .env

- Add .env to your .gitignore file

```
$ yarn add -D dotenv
```

```javascript
require("dotenv").config();

// ... your code
let RESTAURANTS_TABLE = process.env.restaurants_table;
```
