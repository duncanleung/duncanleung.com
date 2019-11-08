---
slug: 'how-to-enable-react-concurrent-mode'
title: 'How to Enable React Concurrent Mode'
date: '2019-11-04'
author: 'Kent C. Dodds'
description:
  "_Concurrent Mode is an enormous improvement for user experience and developer
  experience. Here's how you enable it._"
categories:
  - 'react'
keywords:
  - 'react'
  - 'Concurrent Mode'
  - 'async react'
banner: './images/banner.jpg'
bannerCredit: 'Photo by [Marc Schulte](https://unsplash.com/photos/a2g3LM0cGFg)'
---

React's new [Concurrent Mode](https://reactjs.org/concurrent) has just been
published in the
[experimental release channel](https://reactjs.org/blog/2019/10/22/react-release-channels.html).
It's the result of years of research and that shows. If you'd like to learn more
about why it's so cool, definitely watch
[Dan Abramov's talk at JSIceland](https://www.youtube.com/watch?v=nLF0n9SACd4).
And people have started playing around with it and seeing some nice perf wins
out of the box.

All that said, please remember that this _is_ experimental. The experimental
release channel does not honor semver (so code relying on it could break
unexpectedly) and there could definitely be bugs. But early experimentation has
been promising for many and I suggest that you try it out in your own app.

## Step 1

**Get it installed.**

First, to enable Concurrent Mode, you'll need to have a version of React that
supports this. At the time of this writing, React and React DOM are at version
`16.11.0` which does not support Concurrent Mode. So we'll need to install the
`experimental` version:

```bash
npm install react@experimental react-dom@experimental
# or: yarn add react@experimental react-dom@experimental
```

## Step 2

**Make sure your app works without changing anything else.**

Run your app, run your build, run your tests/type checking. If there are _new_
errors in the console that weren't there before, then those _might_ be bugs in
React and you should try to make a minimal reproduction (preferably in a
codesandbox) and
[open a new issue on the React repo](https://github.com/facebook/react/issues/new).

Often we skip this step, but I think it's important to make sure that if there
are problems you know which step these problems started at! Good advice in
general I'd say 😉

## Step 3

**Enable Concurrent Mode.**

In the entry file of your project, you probably have something that looks like
this:

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'

const rootEl = document.getElementById('root')
ReactDOM.render(<App />, rootEl)
```

To enable Concurrent Mode, you'll use a new
[`createRoot`](https://reactjs.org/docs/concurrent-mode-reference.html#createroot)
API:

```jsx {6-8}
import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'

const rootEl = document.getElementById('root')
// ReactDOM.render(<App />, rootEl)
const root = ReactDOM.createRoot(rootEl)
root.render(<App />)
```

That's it.

## Step 4

**Make sure your app works without changing anything else.**

Run your app, run your build, run your tests/type checking. If there are _new_
errors in the console that weren't there before, then those _might_ be bugs in
React and you should try to make a minimal reproduction (preferably in a
codesandbox) and
[open a new issue on the React repo](https://github.com/facebook/react/issues/new).

If that looks familiar, it's because I copy/pasted it from step 2 😂

In this case however, if things are broken or you have new errors in the
console. It may be because there's code in your app that's using features not
supported in Concurrent Mode (like String Refs, Legacy Context, or
`findDOMNode`).

Also please note that all the lifecycle methods that have the `unsafe_` prefix
are now _actually_ unsafe and you will experience bugs using those.

## Step 5

Try out Concurrent Mode. There are two primary things that Concurrent Mode
enables for us:

1. Time Slicing
2. Suspense for everything asynchronous

If you have some user interaction in your app that you know is slow, try that
out and if it's less janky, that's time slicing at work (watch Dan's talk linked
above for more about this).

You can try refactoring one of your asynchronous interactions to suspense, or
just try adding this to somewhere in your app:

```jsx
const TRANSITION_CONFIG = {
  timeoutMs: 3000, // 🐨 Play with this number a bit...
}
function SuspenseDemo() {
  const [greetingResource, setGreetingResource] = React.useState(null)
  const [startTransition, isPending] = React.useTransition(TRANSITION_CONFIG)

  function handleSubmit(event) {
    event.preventDefault()
    const name = event.target.elements.nameInput.value
    startTransition(() => {
      setGreetingResource(createGreetingResource(name))
    })
  }

  return (
    <div>
      <strong>Suspense Demo</strong>
      <form onSubmit={handleSubmit}>
        <label htmlFor="nameInput">Name</label>
        <input id="nameInput" />
        <button type="submit">Submit</button>
      </form>
      <ErrorBoundary>
        <React.Suspense fallback={<p>loading greeting</p>}>
          <Greeting greetingResource={greetingResource} isPending={isPending} />
        </React.Suspense>
      </ErrorBoundary>
    </div>
  )
}

function Greeting({greetingResource, isPending}) {
  return (
    <p style={{opacity: isPending ? 0.4 : 1}}>
      {greetingResource ? greetingResource.read() : 'Please submit a name'}
    </p>
  )
}

// 🐨 make this function do something else. Like an HTTP request or something
function getGreeting(name) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(`Hello ${name}!`)
      // 🐨 try rejecting instead... (make sure to comment out the resolve call)
      // reject(new Error(`Oh no. Could not load greeting for ${name}`))
    }, 1500) // 🐨 play with this number a bit
  })
}

// 🚨 This should NOT be copy/pasted for production code and is only here
// for experimentation purposes. The API for suspense (currently throwing a
// promise) is likely to change before suspense is officially released.
function createGreetingResource(name) {
  let status = 'pending'
  let result
  let suspender = getGreeting(name).then(
    greeting => {
      status = 'success'
      result = greeting
    },
    error => {
      status = 'error'
      result = error
    },
  )
  return {
    read() {
      if (status === 'pending') throw suspender
      if (status === 'error') throw result
      if (status === 'success') return result
    },
  }
}

class ErrorBoundary extends React.Component {
  state = {error: null}
  static getDerivedStateFromError(error) {
    return {error}
  }
  componentDidCatch() {
    // log the error to the server
  }
  tryAgain = () => this.setState({error: null})
  render() {
    return this.state.error ? (
      <div>
        There was an error. <button onClick={this.tryAgain}>try again</button>
        <pre style={{whiteSpace: 'normal'}}>{this.state.error.message}</pre>
      </div>
    ) : (
      this.props.children
    )
  }
}
```

[Play with this on codesandbox instead](https://codesandbox.io/s/concurrent-mode-suspense-playground-unekx)

One thing that I've found is that the suspense APIs are pretty low-level, so
there's a lot of code needed to make it work well. But the cool thing is that
these are atomic features which work really well within an abstraction and can
be easily shared. So once you've got that abstraction, you're golden. It's
awesome.

## Step 6

**Undo all your changes.**

Reinstall the last stable version you had installed before, and restore the old
`ReactDOM.render` you had before. Concurrent Mode is experimental, and even if
it doesn't look like there are problems, shipping experimental software as
foundational as React is ill-advised. The React docs even suggest that depending
on the size of your app and the third party libraries you're using, you may
never be able to ship Concurrent Mode (Facebook currently has no plans to enable
Concurrent Mode on the old Facebook.com).

Remember also that we as a community are just starting to play around with this
stuff, so there are still a lot of unknowns around trade-offs for different
approaches. It's an exciting time. But if you value stability, then maybe
pretend Concurrent Mode and suspense don't exist for a little while.

## Step 7

**Enable Strict Mode.**

Apps that don't pass Strict Mode are unlikely to work well in Concurrent Mode.
So if you want to work toward enabling Concurrent Mode on your app, then enable
Strict Mode. One nice thing about Strict Mode is (unlike Concurrent Mode) it's
incrementally adoptable. So you can apply Strict Mode to only the part of your
codebase that you know is compliant and then iterate to full support over time.

Read more about this on my blog:
[How to Enable React Strict Mode](/blog/react-strict-mode).

## Conclusion

I'm really looking forward to the stable release of Concurrent Mode and Suspense
for data fetching. It's going to be even cooler when frameworks and libraries
take advantage of these new features. As awesome as React Hooks were for the
React ecosystem, I think that Concurrent Mode will be more impactful for both
developer experience and the end user.

Enjoy experimenting!
