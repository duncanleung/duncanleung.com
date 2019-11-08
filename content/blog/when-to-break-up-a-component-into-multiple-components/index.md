---
slug: when-to-break-up-a-component-into-multiple-components
title: When to break up a component into multiple components
date: '2019-07-19'
author: Kent C. Dodds
description:
  _At what point does it make sense to break a single component into multiple
  components?_
categories:
  - react
keywords:
  - javascript
  - react
banner: ./images/banner.jpg
bannerCredit:
  'Photo by [Samuel Scrimshaw](https://unsplash.com/photos/kp_87tExCwI) on
  [Unsplash](https://unsplash.com/search/photos/broken)'
---

Current Available Translations:

- [Korean](https://edykim.com/ko/post/when-to-break-up-a-component-into-multiple-components)

Did you know that you could write any React Application as a single React
Component? There's absolutely nothing technically stopping React from putting
your entire application into one giant component. Your function would be HUGE.
There'd be a TON of hooks for state and side-effects, but it's totally possible.

If you tried this though you'd face a few problems:

1.  Performance would probably suffer: Every state change results in a re-render
    of the entire application.
2.  Code sharing/reusability would be... not easy. At least if you made it a
    class component, which you might have to do if you wanted to use
    `componentDidCatch` to handle runtime errors. If you were allowed to use
    `react-error-boundary` so you could use hooks, then it would be
    _considerably_ easier. But... I digress...
3.  State would be a challenge: Knowing which pieces of state and event handlers
    went with what parts of JSX would make your head hurt 😬 and lead to some
    hard to track down bugs 🐜 (This is one benefit of the separation of
    concerns).
4.  Testing would be 100% integration:
    [Not necessarily an altogether bad thing](/blog/write-tests), but it would
    be pretty tough to test edge cases and keep things isolated to the parts
    that you're trying to test, so you would suffer big-time from over-testing
    (which is [a common mistake in E2E testing](/blog/common-testing-mistakes)).
5.  Working together on the codebase with multiple engineers would just be
    terrible. Can you imagine the git diffs and merge conflicts?!
6.  Using third party component libraries would be... ummm... impossible? If
    we're writing everything as a single component third party libraries is at
    odds with that goal! And even if we allowed using third party components,
    what about HOCs like [react-emotion](https://emotion.sh)? Not allowed!
    (Besides, you should [use the `css` prop](https://emotion.sh/docs/css-prop)
    anyway 😉).
7.  Encapsulating imperative abstractions/APIs in a more declarative component
    API wouldn't be allowed either meaning that the imperative API would be
    littered throughout the lifecycle hooks of our one giant component, leading
    to harder to follow code. (Again, unless you're using hooks, in which case
    you could group relevant hooks together, making it easier to manage, but
    still a bit of a nightmare).

These are the reasons that we write custom components. It allows us to solve
these problems.

I've had a question on my AMA for a while:
[Best ways/patterns to split app into components](https://github.com/kentcdodds/ama/issues/399).
And this is my answer: "When you experience one of the problems above, that's
when you break your component into multiple smaller components. NOT BEFORE."
Breaking a single component into multiple components is what's called
"abstraction." Abstraction is awesome, but
[every abstraction comes with a cost](/blog/aha-programming), and you have to be
aware of that cost and the benefits before you take the plunge

> _["Duplication is far cheaper than the wrong abstraction."](https://www.sandimetz.com/blog/2016/1/20/the-wrong-abstraction)
> — [Sandi Metz](https://twitter.com/sandimetz)._

So I don't mind if the JSX I return in my component function gets really long.
Remember that JSX is just a bunch of JavaScript expressions using the
declarative APIs given by components. Not a whole lot can go wrong with code
like that and it's much easier to keep that code as it is than breaking out
things into a bunch of smaller components and start
[Prop Drilling](/blog/prop-drilling) everywhere.

### Conclusion

So feel free to break up your components into smaller ones, but don't be afraid
of a growing component until you start experiencing real problems. It's WAY
easier to maintain it until it needs to be broken up than maintain a pre-mature
abstraction. Good luck!
