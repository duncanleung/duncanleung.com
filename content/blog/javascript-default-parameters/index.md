---
slug: javascript-default-parameters
title: JavaScript default parameters
date: '2018-06-25'
author: Kent C. Dodds
description:
  _The expressive power of expressions in default values for parameters_
keywords:
  - javascript
banner: ./images/banner.jpg
bannerCredit:
  'Photo by [Jude Beck](https://unsplash.com/photos/YErQe8LQkyA) on
  [Unsplash](https://unsplash.com)'
---

Today I thought I'd take you through one of the examples from
[my es6 workshop](https://github.com/kentcdodds/es6-workshop).

Consider the following code:

```js
function getCandy(kind, size, upperKind, callback) {
  if (!kind) {
    requiredParam('kind')
  }
  if (!size) {
    requiredParam('size')
  }
  upperKind = upperKind || kind.toUpperCase()
  callback = callback || function noop() {}

  const result = {kind, size, upperKind}
  callback(result)
  return result
}

function requiredParam(argName) {
  throw new Error(`${argName} is required`)
}
```

It's fairly simple, but there are potential bugs (read about
[`Falsy`](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)
[on MDN](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)) and some
annoying boilerplate. Luckily for us, ES6 introduced new syntax into JavaScript
that we can use to simplify things a bit. In particular:
[default parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters).
Let's checkout what the above would be like when using this feature.

```js
function getCandy(
  kind = requiredParam('kind'),
  size = requiredParam('size'),
  upperKind = kind.toUpperCase(),
  callback = function noop() {},
) {
  const result = {kind, size, upperKind}
  callback(result)
  return result
}

function requiredParam(argName) {
  throw new Error(`${argName} is required`)
}
```

Notice that we're able to take each expression and put it on the right side of
the equals sign. If the parameter is `undefined`then the expression on the right
side will be evaluated. This allows us to only call the `requiredParam` function
if `kind` or `size` is `undefined`. It also is possible to use the value of
other parameters in our expression like we do in the default param for
`upperKind` which I find to be a ridiculously cool feature and I use this all
the time in options configuration for some of my tools
([for example](https://github.com/babel-utils/babel-plugin-tester/blob/4b512e895a8934cdc6bb54be3be3241d56cfb9dc/src/index.js#L25-L28)).

I'll add that the same kinds of semantics would apply for object destructuring
(whether as a parameter or not) as well. For example, if we change the arguments
to be an options object:

```js
function getCandy(options = {}) {
  const {
    kind = requiredParam('kind'),
    size = requiredParam('size'),
    upperKind = kind.toUpperCase(),
    callback = function noop() {},
  } = options
  // etc...
}
```

Or, if we want to destructure the options object directly in the parameter list:

```js
function getCandy({
  kind = requiredParam('kind'),
  size = requiredParam('size'),
  upperKind = kind.toUpperCase(),
  callback = function noop() {},
} = {}) {
  // etc...
}
```

Fun stuff!

### Conclusion

I hope you find this helpful! If you'd like to watch me talk about this a bit,
you can check out this section of my ES6 workshop I gave and recorded at PayPal
a while back:
[ES6 and Beyond Workshop Part 1 at PayPal (Jan 2017)](https://youtu.be/t3R3R7UyN2Y).
Good luck!
