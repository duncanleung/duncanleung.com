---
date: 2017-08-14
title: "Fixing React Warning: Synthetic Events in setState()"
thumbnail: "../thumbnails/react.png"
slug: fixing-react-warning-synthetic-events-in-setstate
template: post
categories:
  - React
  - Popular

tags:
  - javscript
  - react
---

## TLDR;

- <a href='https://facebook.github.io/react/docs/react-component.html#setstate' target='_blank'>React `setState()`</a> is asynchronous.
- <a href='https://facebook.github.io/react/docs/events.html' target='_blank'>React `SyntheticEvent`</a> cannot be accessed asynchronously.

## Problems Using `event.target` Within `setState()`

I came across an unexpected console error and warning when attempting to use `event.target` within `setState()`.

```terminal
Uncaught TypeError: Cannot read property 'value' of null
```

```terminal
Warning: This synthetic event is reused for performance reasons. If you're seeing this, you're accessing the property 'target' on a released/nullified synthetic event. This is set to null. If you must keep the original synthetic event around, use event.persist().
```

An example of the code I was attempting to run was:
_(Open up the console and try to run the demo in **preview view** to see the error)_

<iframe src="https://codesandbox.io/embed/KYP4KQzl?view=editor" style="width:100%; height:1200px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## React Event System: `SyntheticEvent`

It turns out <a href='https://facebook.github.io/react/docs/events.html' target='_blank'>React has it's own event system</a> for event handling, using `SyntheticEvent`.

React's `SyntheticEvent` wraps around the browser's native event to provide cross-browser compatibility support. Instead of passing in the native event to React event handlers, an instance of this `SyntheticEvent` is passed in.

The console warning I encountered occurs because React re-uses the `SyntheticEvent` object for performance reasons, by pooling the synthetic events all together. Thus, all the properties on `event.target` are nullified after an event callback is invoked.

Essentially, **`SyntheticEvent` cannot be used asynchronously**, because the event will no longer exist after the event callback has been invoked.

This is a problem, knowing that <a href='http://www.duncanleung.com/avoiding-react-setstate-pitfalls/' target='_blank'>React's `setState()` behavior is asynchronous</a>.

However, what if I want to use `event.target` within `setState()`?

```js{4-5}
  handleChange(e) {
    this.setState((prevState, props) => {
      return {
        username: e.target.value     // Attempting to use e.target.value
                                     // within setState()
      }
    })
  }

  render() {
    return (
        <input
          type="text"
          value={this.state.username}
          onChange={this.handleChange}
        />
    )
  }
}
```

## Solution 1: Use React `event.persist()`

Using `event.target` to construct a new state is a common pattern, and React has <a href='https://facebook.github.io/react/docs/events.html#event-pooling' target='_blank'>provided a solution with `event.persist()`</a>.

Calling `event.persist()` on the event removes the synthetic event from the pool and allows references to the event to be retained asynchronously.
js

```js{2}
  handleChange(e) {
    e.persist();

    this.setState((prevState, props) => {
      return {
        username: e.target.value
      }
    })
  }
```

## Solution 2: Cache `event.target`

Another solution is to cache the result of `event.target` within the event handler, and reference this cached value within the `setState()` callback.

```js{2}
  handleChange(e) {
    let inputValue = e.target.value;  // Cache the value of e.target.value

    this.setState((prevState, props) => {
      return {
        username: inputValue
      }
    })
  }
```
