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

# Function Scope

Whenever a function is invoked, a new scope is created for that call
local variable declared inside the function belong to that scope
they can only be accessed from that function

When the function has finished the execution, the scope is usually destroyed

## Closure

closure is a function which has access to the variable from another function’s scope
access to the outer (enclosing) function’s scope
scope is not destroyed in this case

After the outer function is returned, by keeping a reference to the outer function (the closure) we prevent the outer scope to be destroyed.

closure serve as the gateway between the global context and the outer scope

cannot access directly variables from the outer scope if the closure is not allowing it
protect the variables from the outer scope

```javascript
// a closure is created at every function call
function buildContor(i) {
  var contor = i;
  var displayContor = function() {
    console.log(contor++);
    contor++;
  };
  return displayContor;
}

var myContor = buildContor(1);
// All three invocation of the function myContor are accessing the same outer scope
myContor(); // 1
myContor(); // 2
myContor(); // 3

// new closure - new outer scope - new contor variable
var myOtherContor = buildContor(10);
myOtherContor(); // 10
myOtherContor(); // 11

// myContor was not affected
myContor(); // 4
```
