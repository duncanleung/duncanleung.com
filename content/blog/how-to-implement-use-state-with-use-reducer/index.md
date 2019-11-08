---
slug: 'how-to-implement-usestate-with-usereducer'
title: 'How to implement useState with useReducer'
date: '2019-08-30'
author: 'Kent C. Dodds'
description:
  '_A fun exercise to help understand the differences and use cases of these two
  related hooks_'
categories:
  - 'react'
keywords:
  - 'react hooks'
  - 'javascript'
  - 'composability'
banner: './images/banner.jpg'
bannerCredit:
  'Photo by [Marc Sendra Martorell](https://unsplash.com/photos/7ajo0Vz98yU)'
---

Here's the TL;DR:

```javascript
const useStateReducer = (prevState, newState) =>
  typeof newState === 'function' ? newState(prevState) : newState

const useStateInitializer = initialValue =>
  typeof initialValue === 'function' ? initialValue() : initialValue

function useState(initialValue) {
  return React.useReducer(useStateReducer, initialValue, useStateInitializer)
}
```

Wanna dive in? Let's go.

## But Kent... Why?

For fun 🤓 Also I think that re-implementing things is a great way to learn how
they work.

## State management in React

React hooks expose two mechanisms for state management: `useState` and
`useReducer`. Interestingly enough, React actually builds `useState` out of the
same code that's used to build `useReducer`. They do this because managing a
single value of state in a component is very common, but doing that with
`useReducer` would require a bit of boilerplate. So they reduce the boilerplate
by exposing a simpler state management API through `useState`.

They have the benefit of having all their internal code to do this, but we can
do this ourselves as well 😄

## The `useState` API

Let's start off by looking at the API that `useState` exposes to us:

**useState function arguments**:

You can call `useState` three different ways:

```javascript
useState() // no initial value
useState(initialValue) // a literal initial value
useState(() => initialValue) // a lazy initial value
```

> [Read more about lazy initial state](https://reactjs.org/docs/hooks-reference.html#lazy-initial-state)

So our new `useReducer`-based `useState` will need to support all of these
argument variations.

**useState return value**

When you call `useState` it returns the state and a mechanism for updating that
state (commonly called a "state updater function"). That function can be called
with the new state or a function which accepts the previous state and returns
the new state. So our new `useReducer`-based `useState` will need to support
both of these variations.

```javascript
const [state, setState] = useState()
setState(newState)
setState(previousState => newState)
```

This is similar to what `useReducer` does as well, except the mechanism for
updating the state is called a "dispatch" function and instead of being used to
set the state directly, it delegates the actual state update logic to the
reducer.

## The `useReducer` API

So here's the `useReducer` API:

```javascript
const [state, dispatch] = React.useReducer(reducerFn, initialValue)
```

And with `useReducer`, if you want to have lazy initialization, then you provide
a third argument which is your initialization function and the second argument
serves as an argument to that initialization function, so you can rename that to
something like `initialArg`.

```javascript
const initializationFn = initialArg => initialArg

const [state, dispatch] = useReducer(reducerFn, initialArg, initializationFn)
```

And remember, the `reducerFn` is responsible for what the `dispatch` function
does. So if you want to control how the state is updated by the `dispatch`
function, you can do that via the `reducerFn` which is called with whatever
`dispatch` is called with.

```javascript
const reducerFn = (prevState, dispatchArg) => newState
```

With that, we can implement all the features of `useState`.

## The `useReducer`-based `useState` implementation

Here's our starting point:

```javascript
const useStateReducer = () => {}

function useState() {
  return React.useReducer(useStateReducer)
}
```

---

Let's start by trying to implement this use case for the state update function:

```javascript
const [count, setCount] = useState(0)
setCount(count + 1)
```

So we need to make the `dispatch` function actually update the state value. To
do that, we make our reducer take the `dispatchArg` and return that.

```javascript {1}
const useStateReducer = (prevState, dispatchArg) => dispatchArg

function useState() {
  return React.useReducer(useStateReducer)
}
```

With that it actually makes more sense to call `dispatchArg` `newState` instead:

```javascript {1}
const useStateReducer = (prevState, newState) => newState

function useState() {
  return React.useReducer(useStateReducer)
}
```

---

Great! Next, let's support the function update version of the `useState` API:

```javascript
const [count, setCount] = useState(0)
setCount(previousCount => previousCount + 1)
```

If we want to continue to support the previous API, we'll need to do some
`typeof` checking to determine whether it's a function and if it is we'll call
it with the previous state. Otherwise we'll just return it. Ternaries to the
rescue!

```javascript {1-2}
const useStateReducer = (prevState, newState) =>
  typeof newState === 'function' ? newState(prevState) : newState

function useState() {
  return React.useReducer(useStateReducer)
}
```

---

Nice! Now let's move on to that initial value! For the simple `useState(0)`
case, it's actually really straightforward:

```javascript {4,5}
const useStateReducer = (prevState, newState) =>
  typeof newState === 'function' ? newState(prevState) : newState

function useState(initialValue) {
  return React.useReducer(useStateReducer, initialValue)
}
```

That's it. But what about the lazy version? `useState(() => 0)` That one's a
little more tricky because the `useReducer` API is slightly different here.
Let's iterate to that first. Here's another way we could implement the non-lazy
`useState(0)` use case:

```javascript {4,7}
const useStateReducer = (prevState, newState) =>
  typeof newState === 'function' ? newState(prevState) : newState

const useStateInitializer = initialArg => initialArg

function useState(initialValue) {
  return React.useReducer(useStateReducer, initialValue, useStateInitializer)
}
```

In this case we're passing the `initialValue` as the `initialArg` and our
`useStateInitializer` function is simply returning that value. This makes it
easier to support the lazy initializer version of the API. We simply need to
determine whether the `initialArg` is a function and if it is, we'll call it,
otherwise we'll return it.

```javascript {5}
const useStateReducer = (prevState, newState) =>
  typeof newState === 'function' ? newState(prevState) : newState

const useStateInitializer = initialValue =>
  typeof initialValue === 'function' ? initialValue() : initialValue

function useState(initialValue) {
  return React.useReducer(useStateReducer, initialValue, useStateInitializer)
}
```

And that's it!

## Conclusion

I hope you enjoyed digging around these APIs a little bit more with me. I
definitely recommend you just continue using the built-in `useState` hook, but I
thought you'd find it interesting to see how flexible `useReducer` is. You don't
have to use it the same way you used redux (in fact, you don't have to use redux
in the conventional way either...
[or at all](/blog/application-state-management-with-react)).

And just for fun, you can play around with this on CodeSandbox if you wanna:

[![Edit useState implemented by useReducer](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/react-codesandbox-ptvo1)

Good luck!
