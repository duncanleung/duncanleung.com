---
slug: 'react-hooks-pitfalls'
title: '5 Tips to Help You Avoid React Hooks Pitfalls'
date: '2019-08-05'
author: 'Kent C. Dodds'
description: "_Let's explore some hook gotchas and how to avoid them._"
categories:
  - 'react'
keywords:
  - 'react hooks'
banner: './images/banner.jpg'
bannerCredit:
  'Photo by [Simon Matzinger](https://unsplash.com/photos/twukN12EN7c)'
---

import {HiddenBugApp, RevealedBugApp, FixedBugApp} from './components'

The [React Hooks](https://reactjs.org/hooks) feature was
[proposed in October 2018](https://www.youtube.com/watch?v=dpw9EHDh2bM) and
[released](https://reactjs.org/blog/2019/02/06/react-v16.8.0.html) ~4 months
later in February 2019. Since then, people have been rapidly learning and
adopting hooks in their production codebases because hooks drastically simplify
the management of state and side effects in applications.

It definitely took its rightful place as "the new hotness." But as hot as it is,
React Hooks require a bit of a change in the way you think about React Component
Lifecycles, State, and Side Effects and it can be easy to fall into problematic
scenarios if you're not thinking about React Hooks properly. So let's look a bit
at what pitfalls you could come across and how you can change your thinking so
you avoid them.

## Pitfall 1: Starting without a good foundation

[The React Hooks documentation](https://reactjs.org/hooks) is brilliant and I
strongly recommend you give it a read through, especially the
[FAQ](https://reactjs.org/docs/hooks-faq.html) which has a LOT of helpful
information. So give yourself a good hour or two and just read the docs without
touching your keyboard. It'll give you a great overview of hooks conceptually
and save you a lot of time.

Also, don't skip
[the React Conf talks by Sophie, Dan, and Ryan that introduce hooks](https://www.youtube.com/watch?v=dpw9EHDh2bM).

To avoid the first pitfall: **Read the docs and the FAQ 📚**

## Pitfall 2: Not using (or ignoring) the ESLint plugin

Around the time Hooks was released, the
[`eslint-plugin-react-hooks`](https://github.com/facebook/react/tree/master/packages/eslint-plugin-react-hooks)
package was built and released. It has two rules: "rules of hooks" and
"exhaustive deps." The default recommended configuration of these rules is to
set "rules of hooks" to an error, and the "exhaustive deps" to a warning.

I strongly advise that you install, use, and follow these rules. It will not
only catch real bugs that you can easily miss, but it will also teach you things
about your code and hooks in the process (not to mention the awesome auto-fix
feature).

I've talked with a lot of people who are annoyed by the exhaustive deps plugin,
so let me quickly demonstrate a scenario where ignoring that plugin can lead to
a bug:

Imagine you have one screen that shows a list of dogs, and when you click on a
dog, it takes you to another page that shows the information for that dog.
Something like this:

<HiddenBugApp />

Ok, so for the details page we make a `DogInfo` component which accepts a
`dogId` prop and fetches the dog's information:

```javascript
function DogInfo({dogId}) {
  const [dog, setDog] = useState(null)
  // imagine you also have loading/error states. omitting to save space...

  useEffect(() => {
    getDog(dogId).then(d => setDog(d))
  }, []) // 😱

  return <div>{/* render the dog info here */}</div>
}
```

We feel comfortable omitting dependencies in the array there because this
request should only be made on mount. And with the way things are today we'll be
ok. But now let's imagine that the UI changes a bit and we start listing a
"related dogs" UI on this page. We're going to have a bug and clicking on the
related dog won't update the dog information, even though the component is
re-rendered! Observe (click "Poodle" then under "Related Dogs" click
"Bernedoodle" and notice no change occurs):

<RevealedBugApp />

So it's triggering a re-render of our `DogInfo` with a new `dogId`, but because
we provided an empty array of dependencies, our effect is not re-running.

So let's add that dependency:

```jsx {7}
function DogInfo({dogId}) {
  const [dog, setDog] = useState(null)
  // imagine you also have loading/error states. omitting to save space...

  useEffect(() => {
    getDog(dogId).then(d => setDog(d))
  }, [dogId]) // ✅

  return <div>{/* render the dog info here */}</div>
}
```

Most excellent. Here's how it works now:

<FixedBugApp />

Here's the key takeaway from this example: If it really will never change, then
there's no harm in including it anyway. Also, if you think it will never change
and it does, including it will help you avoid bugs.

There are a lot of other situations which are more nasty and harder to
identify/explain (like, if you skip adding a function to the dependencies list
you could be calling a stale closure). Just trust me, every time I thought "oh,
I don't need to follow the rule this time" I later regretted disabling it
because I was wrong.

Please do note that sometimes the rule is incapable of performing static
analysis on your code properly thanks to limitations of static analysis tools
like ESLint. I believe this is why it's recommended to set the exhaustive deps
rule to "warn" instead of "error." When this happens, the plugin will tell you
so in the warning. I recommend that you try to restructure your code a bit to
avoid that warning (please favor explicitness over cleverness). If that won't
work, then disabling the plugin is your escape hatch so you can keep working.

To avoid the second pitfall: **Install, use, and follow the ESLint plugin 👨‍🏫**

## Pitfall 3: Thinking in Lifecycles

For as long as React has been popular (before hooks), we had a nice and clear
component API that made it easy for us to tell React _when_ it should do certain
things:

```jsx
class LifecycleComponent extends React.Component {
  constructor() {
    // initialize component instance
  }
  componentDidMount() {
    // run this code when the component is first added to the page
  }
  componentDidUpdate(prevProps, prevState) {
    // run this code when the component is updated on the page
  }
  componentWillUnmount() {
    // run this code when the component is removed from the page
  }
  render() {
    // call me anytime you need some react elements...
  }
}
```

Writing components like this still works (and will for the foreseeable future),
and it worked really well for many years. Hooks come with a lot of benefits, but
one of my favorites is that it makes your components more declarative in that it
allows you to stop thinking about "when things should happen in the lifecycle of
the component" (which doesn't matter all that much) and more about "when things
should happen in relation to state changes" (which matters much more).

So now we have:

```jsx
function HookComponent() {
  React.useEffect(() => {
    // This side effect code is here to synchronize the state of the world
    // with the state of this component.
    return function cleanup() {
      // And I need to cleanup the previous side-effect before running a new one
    }
    // So I need this side-effect and it's cleanup to be re-run...
  }, [when, any, ofThese, change])

  React.useEffect(() => {
    // this side effect will re-run on every single time this component is
    // re-rendered to make sure that what it does is never stale.
  })

  React.useEffect(() => {
    // this side effect can never get stale because
    // it legitimately has no dependencies
  }, [])

  return /* some beautiful react elements */
}
```

Ryan Florence put it really well another way:

https://twitter.com/ryanflorence/status/1125041041063665666

The reason I love this so much is because it naturally helps me avoid bugs. So
often I have found I had a bug in my code because I forgot to handle a prop or
state update in `componentDidUpdate`, and when I did remember, I would often
forget to cleanup the previous side-effect before starting up the new one (for
example, if you make an HTTP request, but a prop changes before that request
completes, you should cancel the previous request).

With React Hooks, you do still kinda think about when side effects should run,
but you're not thinking about component Lifecycles, you're thinking about
synchronizing the state of the side-effects with the state of the application.
Grasping that requires a little bit of unlearning, but it's such a powerful idea
that once you wrap your head around it, you will naturally experience fewer bugs
in your apps thanks to the design of the API.

So when you're thinking: "Hey, my dependencies list needs to be `[]`" don't do
that because you think it only needs to run on mount, do it because you know
that the stuff it's doing will never get stale.

To avoid this pitfall: **Don't think about Lifecycles, think about synchronizing
side effects to state 🔄**

## Pitfall 4: Overthinking performance

For some reason when some people see this, they freak out:

```jsx
function MyComponent() {
  function handleClick() {
    console.log('clicked some other component')
  }
  return <SomeOtherComponent onClick={handleClick} />
}
```

There are 2 reasons people worry about this:

1. We're defining the function inside the component, meaning it's getting
   re-defined every single time `<MyComponent />` is rendered
2. We're passing that newly defined function as a prop to
   `<SomeOtherComponent />` which means it can't be optimized properly with
   `React.memo`, `React.PureComponent`, or `shouldComponentUpdate` and will
   suffer from "unnecessary re-renders"

For the first point, JavaScript engines (even those on low-end mobile devices)
are extremely fast at defining functions. You're very unlikely to run into a
problem with (re-)defining too many functions.

For the second point, "unnecessary re-renders" are not necessarily bad for
performance. Just because a component re-renders, doesn't mean the DOM will get
updated (updating the DOM can be slow). React does a great job at optimizing
itself so you don't have to do weird things to your code to make it fast. It's
fast by default.

If your app's unnecessary re-renders are causing your app to be slow, first
investigate why renders are slow. If rendering your app is so slow that a few
extra re-renders produces a noticeable slow-down, then you'll likely still have
performance problems when you hit "necessary re-renders." Once you fix what's
making the render slow, you may find that unnecessary re-renders aren't causing
problems for you anymore.

If you do determine that unnecessary re-renders are causing you performance
problems, then you can unpack the built-in performance optimization APIs that
React has available to you like `React.memo`, `React.useMemo`, and
`React.useCallback`. Learn more from my blog post
[useMemo and useCallback](/blog/usememo-and-usecallback). Remember that
sometimes you can apply performance optimizations and your app actually runs
slower! So measure first!

Also remember that the [production version of react is faster than the development version](https://reactjs.org/docs/optimizing-performance.html#use-the-production-build)

To avoid this pitfall: **Know that React is fast by default and do some digging
before applying performance optimizations pre-maturely 🏎💨**

## Pitfall 5: Overthinking the testing of hooks

I've noticed some people are concerned that they need to rewrite their tests
along with all of their components when they refactor to hooks. This may or may
not be true depending on how your tests were written.

To borrow from my post
["React Hooks: What's going to happen to my tests?"](/blog/react-hooks-whats-going-to-happen-to-my-tests),
if you've written your tests like this:

```jsx
test('setOpenIndex sets the open index state properly', () => {
  // using enzyme
  const wrapper = mount(<Accordion items={[]} />)
  expect(wrapper.state('openIndex')).toBe(0)
  wrapper.instance().setOpenIndex(1)
  expect(wrapper.state('openIndex')).toBe(1)
})
```

Then you can look at this as a great opportunity to improve your tests! You will
definitely need to scrap that test and instead write it like this:

```jsx
test('can open accordion items to see the contents', () => {
  const hats = {title: 'Favorite Hats', contents: 'Fedoras are classy'}
  const footware = {
    title: 'Favorite Footware',
    contents: 'Flipflops are the best',
  }
  const items = [hats, footware]
  // using React Testing Library
  const {getByText, queryByText} = render(<Accordion items={items} />)

  expect(getByText(hats.contents)).toBeInTheDocument()
  expect(queryByText(footware.contents)).toBeNull()

  fireEvent.click(getByText(footware.title))

  expect(getByText(footware.contents)).toBeInTheDocument()
  expect(queryByText(hats.contents)).toBeNull()
})
```

The key difference here is that the previous is testing the implementation
details of the component and the new one is not. Whether your component is
implemented via Hooks or as a class is an implementation detail of the
component. Therefore, if your test is written in such a way that reveals that
(like using `.state()` or `.instance()`), then refactoring your component to
hooks will naturally cause your test to break.

But the end-user doesn't care about whether your components are written with
hooks or classes. They just care about being able to interact with what those
components render to the screen. So if your tests interact with what's being
rendered, then it doesn't matter how that stuff gets rendered to the screen,
it'll all work whether you're using classes or hooks.

You can learn more about this from
[Testing Implementation Details](/blog/testing-implementation-details) and
[Avoid the Test User](/blog/avoid-the-test-user).

So, to avoid this pitfall: **Avoid testing implementation details 🔬**

## Conclusion:

To review, here are the bits of advice I'd like to give you to help you avoid
some of the pitfalls of hooks:

1. Read the docs and the FAQ 📚
2. Install, use, and follow the ESLint plugin 👨‍🏫
3. Don't think about Lifecycles, think about synchronizing side effects to state
   🔄
4. Know that React is fast by default and do some digging before applying
   performance optimizations pre-maturely 🏎💨
5. Avoid testing implementation details 🔬

I hope that's helpful to you! Hooks have made my apps less buggy and made me
more productive. While it cannot be denied that hooks have a learning curve
(that can be sharper if you've been using React for a while), it's well worth
the investment.
