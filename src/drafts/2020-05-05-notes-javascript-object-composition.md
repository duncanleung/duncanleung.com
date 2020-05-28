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

```javascript
const barker = (state) => ({
  bark: () => console.log(`Woof, I am ${state.name}`),
});

const driver = (state) => ({
  drive: () => (state.position = state.position + state.speed),
});

const dogRobot = (name) => {
  let state = {
    name,
    speed: 100,
    position: 0,
  };

  return Object.assign({}, driver(state), barker(state));
};

const woofy = dogRobot("woofy");
const fifo = dogRobot("fifo");

woofy.bark();
fifo.drive();
fifo.bark();
```
