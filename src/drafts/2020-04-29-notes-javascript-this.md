---
date: 2020-04-27
title: Notes on Javascript Function Invocation and "this"
template: post
thumbnail: "../thumbnails/javascript.png"
slug: javascript-invocation-this
categories:
  - Javascript
tags:
  - interview-prep
  - javascript
---

Notes on Javascript this

## Core Function Invocation Primitive

https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/

understanding the core function invocation primitive, and then looking at all other ways of invoking a function as sugar on top of that primitive

core function invocation primitive: Function's `call` method

all other function calls as desugaring to this primitive

1. Make an argument list (`argList`) out of parameters 1 through the end
2. The first parameter is `thisValue`
3. Invoke the function with `this` set to `thisValue` and the `argList` as its argument list

```javascript
function hello(thing) {
  console.log("Hello " + thing);
}

// this:
hello("world");

// desugars to:
hello.call(window, "world");
```

## Member Functions

`person.hello()`

```javascript
var person = {
  name: "Brendan Eich",
  hello: function(thing) {
    console.log(this + " says hello " + thing);
  },
};

// `hello` method call:
person.hello("world");

// desugars to:
person.hello.call(person, "world"); // [object Object] says hello world
```

```javascript
function hello(thing) {
  console.log(this + " says hello " + thing);
}

person = { name: "Brendan Eich" };
person.hello = hello;

// `hello` method call:
// still desugars to person.hello.call(person, "world")
person.hello("world"); // [object Object] says hello world

// Whereas calling the function `hello`
// "this" is in the `Window` execution context
hello("world"); // "[object Window] says hello world"
```

### Caveat: Arrow Function will lexically bind object methods

```javascript
var person = {
  name: "Brendan Eich",
  hello: (thing) => {
    console.log(this + " says hello " + thing);
  },
};

// `hello` method call:
person.hello("world");

// desugars to:
person.hello.call(person, "world"); // "[object Window] says hello world"
```

============================================================

### Implement `Function.prototype.bind()`

```javascript
// Given
const foo = function() {
  console.log(this.bar);
};

// Implement `Function.Prototype.bind()`
let baz = foo.bind({ bar: "hi" });

baz();
// "hi"
```

```javascript
Function.prototype.bind = function(context) {
  // Store a reference to the function that is calling `.bind()`
  // foo.bind(...), the function `foo` is the object invoking `.bind()`
  // `this` is `foo`
  const _fn = this;

  return function() {
    _fn.call(context);
  };
};
```
