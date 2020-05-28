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

https://www.codingame.com/playgrounds/347

any function given to the setTimeout function will be executed asynchronously, when the main thread is not busy anymore.

next tick

```javascript
setTimeout(function() {
  console.log("I am an asynchronous message");
}); // You can omit the 0

console.log("Test 1");

for (let i = 0; i < 10000; ++i) {
  doSomeStuff();
}

console.log("Test 2");

// The 'I am an asynchronous message' will be displayed when the main thread reach here

function doSomeStuff() {
  return 1 + 1;
}
```

```javascript
var promise = new Promise((resolve) => {
  setTimeout(() => {
    resolve("1");
  }, 1000);
});

promise.then(function(data) {
  console.log("data", data);
  return Promise.resolve("2");
});
```

When you code a function returning a promise, make sure to always return a promise.
Even if you want to handle an error, just return a promise and reject it. You will have more maintenable code like this.

```javascript
function asyncWork(data) {
  return new Promise((resolve, reject) => {
    if (typeof data !== "number") {
      reject("error");
    }
  });
}
```

The result of `then` is always a promise. Always. At worst, it can be a never resolved promise, but it is a promise

difference is in the promise returned by the `then` function

In this second example, you are not calling `.catch` on the original promise, you call `catch` on the promise returned by `then`

```javascript
function job1() {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve("result of job 1");
    }, 1000);
  });
}

function job2() {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve("result of job 2");
    }, 1000);
  });
}

var promise = job1();

promise
  // // By chaining our 2 promises (job1 then job2), job2 is always executed after job1
  .then(function(data1) {
    console.log("data1", data1);

    // When you are in a then callback, if you return a promise, it will be the resulting promise of the then call
    return job2();
  })

  .then(function(data2) {
    console.log("data2", data2);
    // In a `then` callback, returning anything (except a promise), an auto-resolved promise is created
    // This returns an auto-resolved promise, and it will pass 'Hello world' in the data
    // This auto-resolved promise will be the result of the `then` call
    return "Hello world";
  });
```

## resolve vs reject

passing a value into `reject` does not simply mean the promise has "failed"
passing a value into `resolve` does not simply mean the promise is "successful"

rejection callback will be called if you pass something into `resolve` that is either:

- not defined (error is thrown). This is caught by the promise and turned into a rejection
- a promise that rejects

```javascript
new Promise(function(resolve, reject) {
  resolve(Promise.reject());
}).then(
  function() {
    console.log("Success callback");
  },
  function() {
    console.log("Failure callback");
  }
);

// Output:
// Failure callback
```

All these promises are rejected

```javascript
var promise1 = Promise.resolve(Promise.reject());

var promise2 = Promise.resolve().then(function() {
  return Promise.reject();
});

var promise3 = Promise.reject().catch(function() {
  return Promise.reject();
});
```

## .catch

```javascript
var promise = request();

promise.catch(function(error) {
  displayError(error);
});

// This is the same code as this:
promise.then(null, function(error) {
  displayError(error);
});
```

if a `then` has no error callback provided, **it will not stop on a rejected promise** - it will pass through until it reaches a `.catch` block

```javascript
let rejectedPromise = new Promise((resolve, reject) => {
  reject("I failed");
});

// call `then`, pass in a success callback and an error callback
rejectedPromise
  // This `then` block has no error callback
  // It will pass through to a `then` block with an error callback
  .then(function(data) {
    console.log("success callback");
    console.log(data);
  })
  .then(null, function(error) {
    console.log("error callback");
    console.error(error);
  });

// Output:
// error callback
// I failed
```

The promise will end in the `catch`

```javascript
// Example 2
let rejectedPromise = new Promise((resolve, reject) => {
  reject("I failed");
});

// call `then`, only pass a success callback
// after that we call catch with an error callback
rejectedPromise

  .then(function(data) {
    console.log("success callback");
    console.log(data);
  })
  .catch(function(error) {
    console.log("error callback");
    console.error(error);
  });

// Output:
// error callback
// I failed
```

### Errors in "then" callback

a then callback can crash. It can throw an error (with an explicit throw or by trying to reach a property of a null variable). The catch method will also catch these crashes.

```javascript
let rejectedPromise = new Promise((resolve, reject) => {
  resolve("I succeeded");
});

rejectedPromise.then(
  function(data) {
    console.log("success callback");
    console.log(data);
    throw new Error("throw error");
  },
  function(error) {
    console.log("error callback");
    console.error(error);
  }
);

// Output:
// success callback
// I succeeded
```

```javascript
let rejectedPromise = new Promise((resolve, reject) => {
  resolve("I succeeded");
});

// call `then`, only pass a success callback
// after that we call catch with an error callback
rejectedPromise

  .then(function(data) {
    console.log("success callback");
    console.log(data);
    // Only throw will
    throw new Error("throw error");
  })
  // throw will skip this `then` block
  .then(function(data) {
    console.log("success callback");
    console.log(data);
  })
  .catch(function(error) {
    console.log("error callback");
    console.error(error);
  });

// Output:
// success callback
// I succeeded

// error callback
// Error: throw error
// at eval (eval at n.evaluate (https://repl.it/public/replbox_lang/2.14.0/javascript.js:237:152404), <anonymous>:12:9)
```

## .catch vs .then(null, errorCallback)

When you want to handle errors that happened in exactly this step

```javascript
let rejectedPromise = new Promise((resolve, reject) => {
  resolve("I succeeded");
});

rejectedPromise.then(
  function(data) {
    console.log("success callback");
    console.log(data);
  },
  function(error) {
    console.log("error callback");
    console.error(error);
  }
);
```

only have one final handler which handles all errors
errors in some of the then-callbacks are not handled

```javascript
let rejectedPromise = new Promise((resolve, reject) => {
  resolve("I succeeded");
});

// call `then`, only pass a success callback
// after that we call catch with an error callback
rejectedPromise

  .then(function(data) {
    console.log("success callback");
    console.log(data);
  })
  .catch(function(error) {
    console.log("error callback");
    console.error(error);
  });
```

In `Promise.all` have each promise handle it's own error to avoid the fail-fast behavior of `Promise.all`.

```javascript
let p1 = new Promise(function(resolve, reject) {
  setTimeout(resolve, 500, "p1");
});

let p2 = new Promise(function(resolve, reject) {
  setTimeout(resolve, 1000, "p2");
});

let promise = Promise.all([
  p1.catch(function(error) {
    console.log(`Failed: ${error}`);
  }),
  p2.catch(function(error) {
    console.log(`Failed: ${error}`);
  }),
]);
```

## Promise.resolve and Promise.reject

When a function can return a promise, ALWAYS return a promise

```javascript
// Don't do this
function job() {
  if (test) {
    return aNewPromise();
  } else {
    return 42;
  }
}
```

```javascript
// Don't do this
function job() {
  if (test) {
    return aNewPromise();
  } else {
    return Promise.reject(42);
  }
}
```

create an auto-resolved promise with a simple value

create an auto-rejected promise

Promise.resolve

## Promise.all

- `Promise.all` has a fail-fast behaviour.
- If a given promise is rejected, the resulting promise of `Promise.all` will be rejected at this exact moment.
- It will not wait for the other promises to complete
- the only received data is the error of the rejected request.

```javascript
let p1 = new Promise(function(resolve, reject) {
  setTimeout(resolve, 500, "p1");
});

let p2 = new Promise(function(resolve, reject) {
  setTimeout(resolve, 1000, "p2");
});

let p3 = new Promise(function(resolve, reject) {
  setTimeout(reject, 300, "p3");
});

let p4 = new Promise(function(resolve, reject) {
  setTimeout(resolve, 1200, "p4");
});

let promise = Promise.all([p1, p2, p3, p4]);

promise

  .then(function(data) {
    data.forEach(function(data) {
      console.log(data);
    });
  })

  .catch(function(error) {
    console.error("error", error);
  });

// error p4
```

### Without Fail Fast

- Pass the result of `p.catch` (an auto-resolved promise) to `Promise.all`
- we don't give the promises directly to `Promise.all` - avoids the fail fast
- However, you have to test the received data yourself to check for errors.

```javascript
let p1 = new Promise(function(resolve, reject) {
  setTimeout(resolve, 500, "p1");
});

let p2 = new Promise(function(resolve, reject) {
  setTimeout(resolve, 1000, "p2");
});

let p3 = new Promise(function(resolve, reject) {
  setTimeout(reject, 300, "p3");
});

let p4 = new Promise(function(resolve, reject) {
  setTimeout(resolve, 1200, "p4");
});

let promise = Promise.all([
  p1.catch(function(error) {
    console.log(`Failed: ${error}`);
  }),
  p2.catch(function(error) {
    console.log(`Failed: ${error}`);
  }),
  p3.catch(function(error) {
    console.log(`Failed: ${error}`);
  }),
  p4.catch(function(error) {
    console.log(`Failed: ${error}`);
  }),
]);

promise
  .then(function(data) {
    data.forEach(function(data) {
      if (data !== undefined) {
        console.log(`Success: ${data}`);
      }
    });
  })
  .catch(function(error) {
    console.error("error", error);
  });

// Failed: p4
// Success: p1
// Success: p2
// Success: p3
// Success: undefined
// Success: p5
```

## Promise.race

result is a new promise that resolves or rejects as soon as one of the promises in the given array resolves or rejects

```javascript
function delay(time) {
  return new Promise(function(resolve) {
    setTimeout(resolve, time, "success " + time);
  });
}

Promise.race([delay(500), delay(100)]).then(function(data) {
  console.log(data);
});
```

## Checking if an object is a promise

```
obj instanceof Promise
```

## async / await

`async` function will always return a promise

`return` auto-resolved promise

```javascript
function job() {
  return new Promise(function(resolve, reject) {
    setTimeout(resolve, 500, "Hello world 1");
  });
}

async function test() {
  let message = await job();
  console.log(message);

  return "Hello world 2";
}

test().then(function(message) {
  console.log(message);
});
```

Is the equivalent of:

```javascript
function test() {
  return job().then(function(message) {
    console.log(message);

    return "Hello world 2";
  });
}
```

## Catching rejected promises in async / await

return a rejected promise in an async function, you just have to throw an error

deal with a rejected promise when using async and await
with try / catch

```javascript
async function job() {
  throw new Error("Reject");
}

async function test() {
  try {
    let message = await job();
    console.log(message);

    return "Hello world";
  } catch (error) {
    console.error(error);

    return "Error happened during test";
  }
}

test().then(function(message) {
  console.log(message);
});
```

```javascript
function job() {
  return Promise.reject(new Error("Reject"));
}

job()
  .then(function(message) {
    console.log(message);
    return "Hello world";
  })
  .catch(function(error) {
    console.log(error);
    return "Error happened during test";
  })
  .then(function(message) {
    console.log(message);
  });
```

## Call await in parallel

```javascript
const start = Date.now();
function timeLog(text) {
  console.log(`${Date.now() - start}ms - ${text}`);
}

function job(number) {
  return new Promise(function(resolve, reject) {
    timeLog(`Job start ${number}`);
    setTimeout(function() {
      timeLog(`Job done ${number}`);
      resolve(`Data ${number}`);
    }, 500);
  });
}

async function main() {
  let message1 = await job(1),
    message2 = await job(2),
    message3 = await job(3);

  timeLog(message1);
  timeLog(message2);
  timeLog(message3);
}

main();

// Output:
// 9ms - Job start 1
// 514ms - Job done 1
// 514ms - Job start 2
// 1015ms - Job done 2
// 1015ms - Job start 3
// 1517ms - Job done 3
// 1519ms - Data 1
// 1519ms - Data 2
// 1519ms - Data 3
```

```javascript
const start = Date.now();
function timeLog(text) {
  console.log(`${Date.now() - start}ms - ${text}`);
}

function job(number) {
  return new Promise(function(resolve, reject) {
    timeLog(`Job start ${number}`);
    setTimeout(function() {
      timeLog(`Job done ${number}`);
      resolve(`Data ${number}`);
    }, 500);
  });
}

async function main() {
  let messages = await Promise.all([job(1), job(2), job(3)]);

  messages.forEach(function(message) {
    timeLog(message);
  });
}

main();

// Output:
// 7ms - Job start 1
// 11ms - Job start 2
// 11ms - Job start 3
// 520ms - Job done 1
// 521ms - Job done 2
// 521ms - Job done 3
// 528ms - Data 1
// 529ms - Data 2
// 529ms - Data 3
```
