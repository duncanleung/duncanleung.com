---
slug: introducing-the-react-testing-library
title: "Introducing the react-testing-library \U0001F410"
date: '2018-04-02'
author: Kent C. Dodds
description:
  _A simpler replacement for enzyme that encourages good testing practices._
keywords:
  - react
  - javascript
  - testing
banner: ./images/banner.jpg
bannerCredit:
  'Photo by [Rob Potter](https://unsplash.com/photos/mrZVkCKyaPk) on
  [Unsplash](https://unsplash.com/search/photos/goat)'
---

Two weeks ago, I wrote
[a new library](https://github.com/testing-library/react-testing-library)! I've
been thinking about it for a while. But two weeks ago I started getting pretty
serious about it:

https://twitter.com/kentcdodds/status/974278185540964352

Read on to get an idea of what I mean by "damaging practices."

### [react-testing-library](https://github.com/testing-library/react-testing-library)

![The library emoji is the goat. No particular reason...](./images/0.png)

> Simple and complete React DOM testing utilities that encourage good testing
> practices.

### The problem

You want to write maintainable tests for your React components. As a part of
this goal, you want your tests to avoid including implementation details of your
components and rather focus on making your tests give you the confidence for
which they are intended. As part of this, you want your testbase to be
maintainable in the long run so refactors of your components (changes to
implementation but not functionality) don't break your tests and slow you and
your team down.

### This solution

The `react-testing-library` is a very light-weight solution for testing React
components. It provides light utility functions on top of `react-dom` and
`react-dom/test-utils`, in a way that encourages better testing practices. It's
primary guiding principle is:

https://twitter.com/kentcdodds/status/977018512689455106

So rather than dealing with instances of rendered react components, your tests
will work with actual DOM nodes. The utilities this library provides facilitate
querying the DOM in the same way the user would. Finding for elements by their
label text (just like a user would), finding links and buttons from their text
(like a user would). It also exposes a recommended way to find elements by a
`data-testid` as an "escape hatch" for elements where the text content and label
do not make sense or is not practical.

This library encourages your applications to be more accessible and allows you
to get your tests closer to using your components the way a user will, which
allows your tests to give you more confidence that your application will work
when a real user uses it.

This library is a replacement for [enzyme](http://airbnb.io/enzyme). While you
_can_ follow these guidelines using enzyme itself, enforcing this is harder
because of all the extra utilities that enzyme provides (utilities which
facilitate testing implementation details). Read more about this in
[the FAQ](https://github.com/testing-library/react-testing-library/blob/master/README.md#faq).

Also, while the React Testing Library is intended for react-dom, you can use
[React Native Testing Library](https://testing-library.com/docs/native-testing-library/intro)
which has a very similar API.

**What this library is not**:

1.  A test runner or framework
2.  Specific to a testing framework (though we recommend Jest as our preference,
    the library works with any framework, and even
    [in codesandbox](https://codesandbox.io/s/5z6x4r7n0p)!)

## Examples

### Basic Example

```jsx
// hidden-message.js
import React from 'react'

// NOTE: React Testing Library works with React Hooks _and_ classes just as well
// and your tests will be the same however you write your components.
function HiddenMessage({children}) {
  const [showMessage, setShowMessage] = React.useState(false)
  return (
    <div>
      <label htmlFor="toggle">Show Message</label>
      <input
        id="toggle"
        type="checkbox"
        onChange={e => setShowMessage(e.target.checked)}
        checked={showMessage}
      />
      {showMessage ? children : null}
    </div>
  )
}

export default HiddenMessage

// __tests__/hidden-message.js
// these imports are something you'd normally configure Jest to import for you
// automatically. Learn more in the setup docs: https://testing-library.com/docs/react-testing-library/setup#cleanup
import '@testing-library/jest-dom/extend-expect'
// NOTE: jest-dom adds handy assertions to Jest and is recommended, but not required

import React from 'react'
import {render, fireEvent} from '@testing-library/react'
import HiddenMessage from '../hidden-message'

test('shows the children when the checkbox is checked', () => {
  const testMessage = 'Test Message'
  const {queryByText, getByLabelText, getByText} = render(
    <HiddenMessage>{testMessage}</HiddenMessage>,
  )

  // query* functions will return the element or null if it cannot be found
  // get* functions will return the element or throw an error if it cannot be found
  expect(queryByText(testMessage)).toBeNull()

  // the queries can accept a regex to make your selectors more resilient to content tweaks and changes.
  fireEvent.click(getByLabelText(/show/i))

  // .toBeInTheDocument() is an assertion that comes from jest-dom
  // otherwise you could use .toBeDefined()
  expect(getByText(testMessage)).toBeInTheDocument()
})
```

### Practical Example

```jsx
// login.js
import React from 'react'

function Login() {
  const [state, setState] = React.useReducer((s, a) => ({...s, ...a}), {
    resolved: false,
    loading: false,
    error: null,
  })

  function handleSubmit(event) {
    event.preventDefault()
    const {usernameInput, passwordInput} = event.target.elements

    setState({loading: true, resolved: false, error: null})

    window
      .fetch('/api/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          username: usernameInput.value,
          password: passwordInput.value,
        }),
      })
      .then(r => r.json())
      .then(
        user => {
          setState({loading: false, resolved: true, error: null})
          window.localStorage.setItem('token', user.token)
        },
        error => {
          setState({loading: false, resolved: false, error: error.message})
        },
      )
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="usernameInput">Username</label>
          <input id="usernameInput" />
        </div>
        <div>
          <label htmlFor="passwordInput">Password</label>
          <input id="passwordInput" type="password" />
        </div>
        <button type="submit">Submit{state.loading ? '...' : null}</button>
      </form>
      {state.error ? <div role="alert">{state.error.message}</div> : null}
      {state.resolved ? (
        <div role="alert">Congrats! You're signed in!</div>
      ) : null}
    </div>
  )
}

export default Login

// __tests__/login.js
// again, these first two imports are something you'd normally handle in
// your testing framework configuration rather than importing them in every file.
import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import {render, fireEvent} from '@testing-library/react'
import Login from '../login'

test('allows the user to login successfully', async () => {
  // mock out window.fetch for the test
  const fakeUserResponse = {token: 'fake_user_token'}
  jest.spyOn(window, 'fetch').mockImplementationOnce(() => {
    return Promise.resolve({
      json: () => Promise.resolve(fakeUserResponse),
    })
  })

  const {getByLabelText, getByText, findByRole} = render(<Login />)

  // fill out the form
  fireEvent.change(getByLabelText(/username/i), {target: {value: 'chuck'}})
  fireEvent.change(getByLabelText(/password/i), {target: {value: 'norris'}})

  fireEvent.click(getByText(/submit/i))

  // just like a manual tester, we'll instruct our test to wait for the alert
  // to show up before continuing with our assertions.
  const alert = await findByRole('alert')

  // .toHaveTextContent() comes from jest-dom's assertions
  // otherwise you could use expect(alert.textContent).toMatch(/congrats/i)
  // but jest-dom will give you better error messages which is why it's recommended
  expect(alert).toHaveTextContent(/congrats/i)
  expect(window.localStorage.getItem('token')).toEqual(fakeUserResponse.token)
})
```

The most important takeaway from this example is:

> **The test is written in such a way that resembles how the user is using your
> application.**

Let's explore this further...

Let's say we have a `GreetingFetcher` component that fetches a greeting for a
user. It might render some HTML like this:

```jsx
<div>
  <label for="name-input">Name</label>
  <input id="name-input" />
  <button>Load Greeting</button>
  <div data-testid="greeting-text" />
</div>
```

So the functionality is: Set the name, click the "Load Greeting" button, and a
server request is made to load greeting text with that name.

In your test you'll need to find the `<input />` so you can set its `value` to
something. Conventional wisdom suggests you could use the `id` property in a CSS
selector: `#name-input`. But is that what the user does to find that input?
Definitely not! They look at the screen and find the input with the label "Name"
and fill that in. So that's what our test is doing with `getByLabelText`. It
gets the form control based on its label.

Often in tests using enzyme, to find the "Load Greeting" button you might use a
CSS selector or even find by component `displayName` or the component
constructor. But when the user wants to load the greeting, they don't care about
those implementation details, instead they're going to find and click the button
that says "Load Greeting." And that's exactly what our test is doing with the
`getByText` helper!

In addition, the `wait` resembles exactly what the users does. They wait for the
greeting text to appear, however long that takes. In our tests we're mocking
that out so it happens basically instantly, but our test doesn't actually care
how long it takes. We don't have to use a `setTimeout` in our test or anything.
We simply say: "Hey, wait until the `greeting-text` node appears." (Note, in
this case it's using a `data-testid` attribute which is an escape hatch for
situations where it doesn't make sense to find an element by any other
mechanism.
[A `data-testid` is definitely better then alternatives.](/blog/making-your-ui-tests-resilient-to-change)

### High-level Overview API

Originally, the library only provided `queryByTestId` as a utility as suggested
in my blog post
"[Making your UI tests resilient to change](/blog/making-your-ui-tests-resilient-to-change)".
But thanks to feedback on that blog post from
[Bergé Greg](https://twitter.com/neoziro) as well as inspiration from
[a fantastic (and short!) talk](https://youtu.be/qfnkDyHVJzs?t=5h39m19s) by
[Jamie White](https://twitter.com/jgwhite), I added several more and now I'm
even happier with this solution.

You can read more about the library and its APIs in
[the official docs](https://github.com/testing-library/react-testing-library).
Here's a high-level overview of what this library gives you:

- [`Simulate`](https://github.com/testing-library/react-testing-library/blob/fd2df8d18652786a95bce34741180137f9d2cef2/README.md#simulate):
  a re-export from the `Simulate` utility from
  [the](https://reactjs.org/docs/test-utils.html#simulate)
  [`react-dom/test-utils`](https://reactjs.org/docs/test-utils.html#simulate)
  [](https://reactjs.org/docs/test-utils.html#simulate)
  [`Simulate`](https://reactjs.org/docs/test-utils.html#simulate)
  [object](https://reactjs.org/docs/test-utils.html#simulate).
- [`wait`](https://github.com/testing-library/react-testing-library/blob/fd2df8d18652786a95bce34741180137f9d2cef2/README.md#wait):
  allows you to wait for a non-deterministic period of time in your tests.
  Normally you should
  [mock out API requests](https://github.com/testing-library/react-testing-library/blob/master/src/__tests__/fetch.js)
  or
  [animations](https://github.com/testing-library/react-testing-library/blob/master/src/__tests__/mock.react-transition-group.js),
  but even if you're dealing with immediately resolved promises, you'll need
  your tests to wait for the next tick of the event loop and `wait` is really
  good for that. (Big shout out to
  [Łukasz Gozda Gandecki](https://twitter.com/lgandecki) who
  [introduced this](https://github.com/testing-library/react-testing-library/issues/21)
  as a replacement for the (now deprecated)`flushPromises` API).
- [`render`](https://github.com/testing-library/react-testing-library/blob/fd2df8d18652786a95bce34741180137f9d2cef2/README.md#render):
  This is the meat of the library. It's fairly simple. It creates a `div`with
  `document.createElement`, then uses `ReactDOM.render` to render to that `div`.

The `render` function returns the following objects and utilities:

- [`container`](https://github.com/testing-library/react-testing-library/blob/fd2df8d18652786a95bce34741180137f9d2cef2/README.md#container):
  The `div` your component was rendered to
- [`unmount`](https://github.com/testing-library/react-testing-library/blob/fd2df8d18652786a95bce34741180137f9d2cef2/README.md#unmount):
  A simple wrapper over `ReactDOM.unmountComponentAtNode`to unmount your
  component (to facilitate easier testing of `componentWillUnmount` for
  example).
- [`getByLabelText`](https://github.com/testing-library/react-testing-library/blob/fd2df8d18652786a95bce34741180137f9d2cef2/README.md#getbylabeltexttext-textmatch-options-selector-string---htmlelement):
  Get a form control associated to a label
- [`getByPlaceholderText`](https://github.com/testing-library/react-testing-library/blob/fd2df8d18652786a95bce34741180137f9d2cef2/README.md#getbyplaceholdertexttext-textmatch-htmlelement):
  Placeholders aren't proper alternatives to labels, but if this makes more
  sense for your use case it's available.
- [`getByText`](https://github.com/testing-library/react-testing-library/blob/fd2df8d18652786a95bce34741180137f9d2cef2/README.md#getbytexttext-textmatch-htmlelement):
  Get any element by its text content.
- [`getByAltText`](https://github.com/testing-library/react-testing-library/blob/fd2df8d18652786a95bce34741180137f9d2cef2/README.md#getbyalttexttext-textmatch-htmlelement):
  Get an element (like an `<img`) by it's `alt` attribute value.
- [`getByTestId`](https://github.com/testing-library/react-testing-library/blob/fd2df8d18652786a95bce34741180137f9d2cef2/README.md#getbytestidtext-textmatch-htmlelement):
  Get an element by its `data-testid` attribute.

Each of those `get*` utilities will throw a useful error message if no element
can be found. There's also an associated `query*` API for each which will return
`null`instead of throwing an error which can be useful for asserting that an
element is _not_ in the DOM.

Also, for these `get*` utilities, to find a matching element, you can pass:

- a case-insensitive substring: `lo world` matches `Hello World`
- a regex: `/^Hello World$/` matches `Hello World`
- a function that accepts the text and the element:
  `(text, el) => el.tagName === 'SPAN' && text.startsWith('Hello')` would match
  a span that has content that starts with `Hello`

### Custom Jest Matchers

Thanks to [Anto Aravinth Belgin Rayen](https://github.com/antoaravinth), we have
some handy custom Jest matchers as well:

- [`toBeInTheDOM`](https://github.com/testing-library/react-testing-library/blob/fd2df8d18652786a95bce34741180137f9d2cef2/README.md#tobeinthedom):
  Assert whether an element present in the DOM or not.
- [`toHaveTextContent`](https://github.com/testing-library/react-testing-library/blob/fd2df8d18652786a95bce34741180137f9d2cef2/README.md#tohavetextcontent):
  Check whether the given element has a text content or not.

> Note: now these have been extracted to
> [jest-dom](https://github.com/testing-library/jest-dom) which is maintained by
> [Ernesto García](https://github.com/gnapse)

### Conclusion

A big feature of this library is that it doesn't have utilities that enable
testing implementation details. It focuses on providing utilities that encourage
good testing and software practices. I hope that by using
[the](https://github.com/testing-library/react-testing-library)
[`react-testing-library`](https://github.com/testing-library/react-testing-library)your
React testbases are easier to understand and maintain.
