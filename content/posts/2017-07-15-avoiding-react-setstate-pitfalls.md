---
date: 2017-07-15
title: "Avoiding React setState() Pitfalls"
template: post
thumbnail: "../thumbnails/react.png"
slug: avoiding-react-setstate-pitfalls
categories:
  - React
  - Popular

tags:
  - javascript
  - react
---

I often read that `setState()` is one of the more misunderstood aspects of React.

Considering that managing component state is a fundamental aspect of React, I wanted to understand the common pitfalls and solutions around using `setState()`.

First, a quick overview of `setState()` and its behavior.

---

## setState() Signature:

```js
setState(updater, [callback]);
```

###### `setState()` takes two arguments.

- An **updater**
  - Either an `object literal` OR a `function`.
- An optional **callback**
  - `setState()` is _asynchronous_.
  - The callback is called when the Component state _has actually updated_.

###### Passing `updater` an `Object Literal`

- Use the object literal pattern for _simple state updates_.
- Passing an object literal is succinct.

```js
// Using an object literal in setState

this.setState({
  selectedLang: "Javascript"
});
```

###### Passing `updater` a `Function`

- Use the updater function pattern when updates _need to reference the previous state_.
- Passing an updater function provides access to `prevState` and current `props`.
- `prevState` is a reference to the previous state. It should not be directly mutated.

The Updater Function Signature:

```js
(prevState, props) => stateChange;
```

The updater function should _build a new object_ based on the input from `prevState` and `props`

```js
// Using an updater function in setState to build a new object

this.setState((prevState, props) => {
  return { counter: prevState.counter + props.increment };
});
```

## `setState()` Behavior:

When `setState()` is called it does two main things:

**1 - Queues changes to the component state (it is _asynchronous_)**

- **Note:** If an `object literal` is passed as an updater, React first merges the object you passed to `setState()` into the current state.

**2 - Tells React that the component (and children) needs to be re-rendered with the updated state.**

- React's reconciliation process

  - Create a new React Element tree (an object representation of the UI).
  - Diffs the new tree against the old tree.
  - Determines what changed, based on the updater passed to `setState()`.
  - Updates the DOM.

- **Note:** Use React's <a href='https://facebook.github.io/react/docs/react-component.html#updating' target='_blank'>lifecycle methods</a> to run code at different stages in reconciliation
- **<a href='https://facebook.github.io/react/docs/react-component.html#shouldcomponentupdate' target='_blank'>shouldComponentUpdate</a>**: Allows determining if the component should update itself by inspecting the previous and new state.
  - If `return false`, then `componentWillUpdate` and `componentDidUpdate` are **not executed**. The component UI won't re-render.
  - **`this.state` will still be updated** within the component.
- **<a href='https://facebook.github.io/react/docs/react-component.html#componentwillupdate' target='_blank'>componentWillUpdate</a>**: Run any code _before_ the new state is set and rendering happens
- <a href='https://facebook.github.io/react/docs/react-component.html#render' target='_blank'>render</a>: Render the updates visually to the DOM
- **<a href='https://facebook.github.io/react/docs/react-component.html#componentdidupdate' target='_blank'>componentDidUpdate</a>**: Run any code _after_ the new state is set and the component has re-rendered

---

## Common Pitfalls with `setState()`

#### Pitfall 1: Trying to modify `state` directly

The first mistake with `setState()` is not using `setState()`! =)

- Do not modify `state` directly.
- Modifying `this.state` directly will not trigger a Component re-render.
- The only place where `this.state` should be assigned is in the component's `constructor`.

```js
// WRONG: This will not re-render the component

this.state.discount = false;
```

###### Solution: `Use setState()`

`setState()` will trigger a re-render of the Component.

```js
// CORRECT: Use setState()

this.setState({
  discount: false
});
```

**Aside:** When should something be stored in Component `state`?

- If you don't use something in `render()`, it shouldn't be in `this.state`.

#### Pitfall 2: Trying to use `setState` synchronously

`setState()` is **asynchronous**. Do not call `setState` on one line and assume the state has already changed on the next line.

- `setState()` is a _request to update state_, rather than an immediate command to update state.
- `setState()` does not always immediately update the component.

```js
// WRONG: setState() should not be used synchronously

// assuming this.state = { orders: 0 }
this.setState({
  orders: 1
});

console.log(this.state.orders); // BUG! Prints out: 0
```

There are two solutions to this mistake:

- Use the `componentDidUpdate()` lifecycle method (_recommended by the React team_).
- Pass a `callback` as a second argument to `setState()`.

Using `componentDidUpdate` or a setState callback (`setState(updater, callback)`) guarantees your code will execute after the state update has been applied.

###### Solution 1: Use the `componentDidUpdate()` lifecycle method

`componentDidUpdate()` is invoked immediately after updating occurs (but is not called on the initial render of the Component).

```js
// CORRECT: Use the componentDidUpdate() lifecycle method

componentDidUpdate(prevProps, prevState) {
  console.log(this.state.orders); // Prints out: 1
}
```

###### Solution 2: Pass a callback function to `setState()`

The second parameter to `setState()` is an optional callback function that will be executed once setState is completed and the component is re-rendered.

```js
// CORRECT: Pass a callback as a second argument to setState()

// assuming this.state = { orders: 0 }
this.setState(
  {
    orders: 1
  },
  () => {
    console.log(this.state.orders); // Prints out: 1
  }
);
```

#### Pitfall 3: Trying to use a previous value of state

`setState()` is **asynchronous**. Consequently, the vales of `this.state` should not be used for calculating the next state.

- `this.props` and `this.state` may be updated asynchronously.
- `this.state` should not be used to calculate the next state.

```js
// WRONG: Don't rely on this.state to calculate the next state

this.setState({
  orders: this.state.orders + this.props.increment
});
```

###### Solution: Use the updater `function` form to access `prevState`

The first argument of the updater function, `prevState`, provides access to the previous state:

Updater function signature:

```js
(prevState, props) => stateChange;
```

```js
// CORRECT: Use the updater function form to access prevState

this.setState((prevState, props) => ({
  orders: prevState.orders + props.increment
}));
```

#### Pitfall 4: Trying to issue multiple `setState()` calls

Multiple `setState()` calls during the same cycle may be **batched**. This is specifically an issue when passing `updater` an `object literal`.

- `setState()` performs a shallow merge of the updater object into the new state.
- Subsequent `setState()` calls will override values from previous calls in the same cycle.
- If the updater objects have the same keys, the value of the key, of the last object passed to `Object.assign()`, overrides the previous value.

```js
// WRONG: Using an object literal with multiple setState calls during the same cycle will shallow merge the objects

// assuming this.state = { orders: 0 };
this.setState({ orders: this.state.orders + 1});
this.setState({ orders: this.state.orders + 1});
this.setState({ orders: this.state.orders + 1});

// --> OUTPUT: this.state.orders will be 1, not 3 as we would expect


// It is equivalent of an Object.assign, which performs a shallow merge
// The orders will only be incremented once

Object.assign(
  previousState,
  {orders: state.orders + 1},
  {orders: state.orders + 1},
  {orders: state.orders + 1},
  ...
)
```

###### Solution: Use the updater `function` form to queue state updates

By passing updater a function, the updates will be queued and later executed in the order they were called.

```js
//CORRECT: Use the updater function form to queue state updates

// assuming this.state = { orders : 0 };
this.setState(prevState => ({ orders: prevState.orders + 1 }));
this.setState(prevState => ({ orders: prevState.orders + 1 }));
this.setState(prevState => ({ orders: prevState.orders + 1 }));

// --> OUTPUT: this.state.orders will be 3
```
