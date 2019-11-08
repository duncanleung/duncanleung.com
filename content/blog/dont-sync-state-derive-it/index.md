---
slug: 'dont-sync-state-derive-it'
title: "Don't Sync State. Derive It!"
date: '2019-09-30'
author: 'Kent C. Dodds'
description:
  '_How to avoid state synchronization bugs and complexity with derived state._'
categories:
  - 'react'
keywords:
  - 'react'
  - 'state'
  - 'react hooks'
  - 'useState'
  - 'useReducer'
  - 'useMemo'
banner: './images/banner.jpg'
bannerCredit:
  'Photo by [Gabriel Gusmao](https://unsplash.com/photos/pMmw3ynuXHw)'
---

In [my Learn React Hooks workshop](/workshops/react-hooks) material, we have an
exercise where we build a tic-tac-toe game using React's `useState` hook (based
on the official React tutorial). Here's the finished version of that exercise:

https://codesandbox.io/s/github/kentcdodds/learn-react-hooks/tree/master/?fontsize=14&initialpath=%2Fisolated%2Fexercises-final%2F04.extra-1&module=%2Fsrc%2Fexercises-final%2F04.extra-1.js

We have a few variables of state. There's a `squares` state variable via
`React.useState`. There's also `nextValue`, `winner`, and `status` are each
determined by calling the functions `calculateNextValue`, `calculateWinner`, and
`calculateStatus`. `squares` is regular component state, but `nextValue`,
`winner`, and `status` are what are called "derived state." That means that
their value can be derived (or calculated) based on other values rather than
managed on their own.

There's a good reason that I wrote it the way I did. Let's find out the benefits
of derived state over state synchronization by reimplementing this with a more
naive approach. The fact is that all four variables are technically state so you
may automatically think that you need to use `useState` or `useReducer` for
them.

Let's start with `useState`:

```jsx
function Board() {
  const [squares, setSquares] = React.useState(Array(9).fill(null))
  const [nextValue, setNextValue] = React.useState(calculateNextValue(squares))
  const [winner, setWinner] = React.useState(calculateWinner(squares))
  const [status, setStatus] = React.useState(calculateStatus(squares))

  function selectSquare(square) {
    if (winner || squares[square]) {
      return
    }
    const squaresCopy = [...squares]
    squaresCopy[square] = nextValue
    const newNextValue = calculateNextValue(squaresCopy)
    const newWinner = calculateWinner(squaresCopy)
    const newStatus = calculateStatus(newWinner, squaresCopy, newNextValue)
    setSquares(squaresCopy)
    setNextValue(newNextValue)
    setWinner(newWinner)
    setStatus(newStatus)
  }

  // return beautiful JSX
}
```

So that's not all that bad. Where it becomes a real problem is what if we added
a feature to our tic-tac-toe game where you could select two squares at once?
What would we have to do to make that happen?

```jsx {23-38}
function Board() {
  const [squares, setSquares] = React.useState(Array(9).fill(null))
  const [nextValue, setNextValue] = React.useState(calculateNextValue(squares))
  const [winner, setWinner] = React.useState(calculateWinner(squares))
  const [status, setStatus] = React.useState(calculateStatus(squares))

  function selectSquare(square) {
    if (winner || squares[square]) {
      return
    }
    const squaresCopy = [...squares]
    squaresCopy[square] = nextValue

    const newNextValue = calculateNextValue(squaresCopy)
    const newWinner = calculateWinner(squaresCopy)
    const newStatus = calculateStatus(newWinner, squaresCopy, newNextValue)
    setSquares(squaresCopy)
    setNextValue(newNextValue)
    setWinner(newWinner)
    setStatus(newStatus)
  }

  function selectTwoSquares(square1, square2) {
    if (winner || squares[square1] || squares[square2]) {
      return
    }
    const squaresCopy = [...squares]
    squaresCopy[square1] = nextValue
    squaresCopy[square2] = nextValue

    const newNextValue = calculateNextValue(squaresCopy)
    const newWinner = calculateWinner(squaresCopy)
    const newStatus = calculateStatus(newWinner, squaresCopy, newNextValue)
    setSquares(squaresCopy)
    setNextValue(newNextValue)
    setWinner(newWinner)
    setStatus(newStatus)
  }

  // return beautiful JSX
}
```

The biggest problem with this is some of that state may fall out of sync with
the true component state (`squares`). It could fall out of sync because we
forget to update it for a complex sequence of interactions for example. If
you've been building React apps for a while, you know what I'm talking about.
It's no fun to have things fall out of sync.

One thing that _can_ help is to reduce duplication so that all relevant state
updates happen in one place:

```jsx {7-15,23,33}
function Board() {
  const [squares, setSquares] = React.useState(Array(9).fill(null))
  const [nextValue, setNextValue] = React.useState(calculateNextValue(squares))
  const [winner, setWinner] = React.useState(calculateWinner(squares))
  const [status, setStatus] = React.useState(calculateStatus(squares))

  function setNewState(newSquares) {
    const newNextValue = calculateNextValue(newSquares)
    const newWinner = calculateWinner(newSquares)
    const newStatus = calculateStatus(newWinner, newSquares, newNextValue)
    setSquares(newSquares)
    setNextValue(newNextValue)
    setWinner(newWinner)
    setStatus(newStatus)
  }

  function selectSquare(square) {
    if (winner || squares[square]) {
      return
    }
    const squaresCopy = [...squares]
    squaresCopy[square] = nextValue
    setNewState(squaresCopy)
  }

  function selectTwoSquares(square1, square2) {
    if (winner || squares[square1] || squares[square2]) {
      return
    }
    const squaresCopy = [...squares]
    squaresCopy[square1] = nextValue
    squaresCopy[square2] = nextValue
    setNewState(squaresCopy)
  }

  // return beautiful JSX
}
```

That's really improved our code duplication, and it wasn't that big of a deal
honestly. But this is a pretty simple example. Sometimes the derived state is
based on multiple variables of state that are updated in different situations
and we need to make sure that all our state is updated whenever the source state
is updated.

## The solution

What if I told you there's something better? If you've already read through the
codesandbox implementation above, you know what that solution is, but let's put
it right here now:

```jsx
function Board() {
  const [squares, setSquares] = React.useState(Array(9).fill(null))
  const nextValue = calculateNextValue(squares)
  const winner = calculateWinner(squares)
  const status = calculateStatus(winner, squares, nextValue)

  function selectSquare(square) {
    if (winner || squares[square]) {
      return
    }
    const squaresCopy = [...squares]
    squaresCopy[square] = nextValue
    setSquares(squaresCopy)
  }

  // return beautiful JSX
}
```

Nice! We don't need to worry about updating the derived state values because
they're simply calculated every render. Cool. Let's add that two squares at a
time feature:

```jsx {16-24}
function Board() {
  const [squares, setSquares] = React.useState(Array(9).fill(null))
  const nextValue = calculateNextValue(squares)
  const winner = calculateWinner(squares)
  const status = calculateStatus(winner, squares, nextValue)

  function selectSquare(square) {
    if (winner || squares[square]) {
      return
    }
    const squaresCopy = [...squares]
    squaresCopy[square] = nextValue
    setSquares(squaresCopy)
  }

  function selectTwoSquares(square1, square2) {
    if (winner || squares[square1] || squares[square2]) {
      return
    }
    const squaresCopy = [...squares]
    squaresCopy[square1] = nextValue
    squaresCopy[square2] = nextValue
    setSquares(squaresCopy)
  }

  // return beautiful JSX
}
```

Sweet! Before we had to concern ourselves with every single time we updated the
`squares` state to ensure we updated all of the other state properly as well.
But now we don't need to worry about it at all. It just works. No need for a
fancy function to handle updating all the derived state. We just calculate it on
the fly.

## What about `useReducer`?

`useReducer` doesn't suffer as badly from these problems. Here's how I might
implement this using `useReducer`:

```jsx
function calculateDerivedState(squares) {
  const winner = calculateWinner(squares)
  const nextValue = calculateNextValue(squares)
  const status = calculateStatus(winner, squares, nextValue)
  return {squares, nextValue, winner, status}
}

function ticTacToeReducer(state, square) {
  if (state.winner || state.squares[square]) {
    // no state change needed.
    // (returning the same object allows React to bail out of a re-render)
    return state
  }

  const squaresCopy = [...state.squares]
  squaresCopy[square] = state.nextValue

  return {...calculateDerivedState(squaresCopy), squares: squaresCopy}
}

function Board() {
  const [{squares, status}, selectSquare] = React.useReducer(
    ticTacToeReducer,
    Array(9).fill(null),
    calculateDerivedState,
  )

  // return beautiful JSX
}
```

This isn't the only way to do this, but the point here is that while we do still
"derive" state for `winner`, `nextValue`, and `status`, we're managing all of
that within the reducer which is the only place state updates can happen, so
falling out of sync is less likely.

That said, I find this to be a little more complex than our other solution
(especially if we want to add that "two squares at a time" feature). So if I
were building and shipping this in a production app, I'd go with what I've got
in that codesandbox.

## Derived state via props

State doesn't have to be managed internally to suffer from the state
synchronization problems. What if we had the `squares` state coming from a
parent component? How would we synchronize that state?

```jsx
function Board({squares, onSelectSquare}) {
  const [nextValue, setNextValue] = React.useState(calculateNextValue(squares))
  const [winner, setWinner] = React.useState(calculateWinner(squares))
  const [status, setStatus] = React.useState(calculateStatus(squares))

  // ... hmmm... we're no longer managing updating the squares state, so how
  // do we keep these variables up to date? useEffect? useLayoutEffect?
  // React.useEffect(() => {
  //   setNextValue... etc... eh...
  // }, [squares])
  //
  // Just call the state updaters when squares change
  // right in the render method?
  // if (prevSquares !== squares) {
  //   setNextValue... etc... ugh...
  // }
  //
  // I've seen people do all of these things... And none of them are great.

  // return beautiful JSX
}
```

The better way to do this is just to calculate it on the fly:

```javascript
function Board({squares, onSelectSquare}) {
  const nextValue = calculateNextValue(squares)
  const winner = calculateWinner(squares)
  const status = calculateStatus(squares)

  // return beautiful JSX
}
```

It's _way_ simpler, and it works really well.

P.S. Remember `getDerivedStateFromProps`? Well
[you probably don't need it](https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html)
but if you do and you want to do so with hooks, then calling the state updater
function during render is actually the correct way to do it.
[Learn more from the React Hooks FAQ](https://reactjs.org/docs/hooks-faq.html#how-do-i-implement-getderivedstatefromprops).

## What about performance?

I know you've been waiting for me to address this... Here's the deal. JavaScript
is really fast. I ran a benchmark on the `calculateWinner` function and this
resulted in 15 MILLION operations per second. So unless your tic-tac-toe players
are extremely fast at clicking around, there's no way this is going to be a
performance problem (and even if they could play that fast, I assure you that
you'll have other performance problems that will be lower hanging fruit for
you).

> Ok ok, I tried it on my phone and only got 4.3 million operations per second.
> And then I tried with a CPU 6x slowdown on my laptop and only got 2 million...
> I think we're still good.

That said, if you _do_ happen to have a function which _is_ computationally
expensive, then that's what `useMemo` is for!

```jsx {3-8}
function Board() {
  const [squares, setSquares] = React.useState(Array(9).fill(null))
  const nextValue = React.useMemo(() => calculateNextValue(squares), [squares])
  const winner = React.useMemo(() => calculateWinner(squares), [squares])
  const status = React.useMemo(
    () => calculateStatus(winner, squares, nextValue),
    [winner, squares, nextValue],
  )

  // return beautiful JSX
}
```

So there you go. An escape hatch for you to use once you've determined that some
code is actually computationally expensive for your users to run. Note that this
doesn't magically make those functions run faster. All it does is ensure that
they're not called unnecessarily. If this were our whole app, the only way for
the app to re-render is if `squares` changes in which case all of those
functions will be run anyway, so we've actually not accomplished much with this
"optimization." That's why I say: "Measure first!"

> [Learn more about `useMemo` and `useCallback`](/blog/usememo-and-usecallback)

Oh, and I'd like to mention that derived state can sometimes be even faster than
state synchronization because it will result in fewer unnecessary re-renders,
[which can be a problem sometimes](/blog/fix-the-slow-render-before-you-fix-the-re-render).

## What about MobX/Reselect?

[Reselect](https://github.com/reduxjs/reselect) (which you should _absolutely_
be using if you're using Redux) has memoization built-in which is cool. MobX has
this as well, but they also take it a step further with
["computed values"](https://mobx.js.org/refguide/computed-decorator.html) which
is basically an API to give you memoized and optimized derived state values.
What makes it even better than what we already have is that the computation is
only processed when it's accessed.

For (contrived) example:

```jsx {4}
function FavoriteNumber() {
  const [name, setName] = React.useState('')
  const [number, setNumber] = React.useState(0)
  const numberWarning = getNumberWarning(number)
  return (
    <div>
      <label>
        Your name: <input onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Your favorite number:{' '}
        <input
          type="number"
          onChange={e => setNumber(Number(e.target.value))}
        />
      </label>
      <div>
        {name
          ? `${name}'s favorite number is ${number}`
          : 'Please type your name'}
      </div>
      <div>{number > 10 ? numberWarning : null}</div>
      <div>{number < 0 ? numberWarning : null}</div>
    </div>
  )
}
```

Notice that we're calling `getNumberWarning`, but we're only using the result if
the number is too high or too low, so we may not actually need to call that
function at all. Now, it's unlikely this is problematic, but let's say for the
sake of argument that calling `getNumberWarning` is an application bottleneck.
This is where the computed values feature comes in handy.

If you're experiencing this a lot in your app, then I suggest you just jump into
using MobX (MobX folks will tell you there are a lot of other reasons to use it
as well), but we can solve this specific situation pretty easily ourselves:

```jsx {4-7,25,26}
function FavoriteNumber() {
  const [name, setName] = React.useState('')
  const [number, setNumber] = React.useState(0)
  const numberIsTooHigh = number > 10
  const numberIsTooLow = number < 0
  const numberWarning =
    numberIsTooHigh || numberIsTooLow ? getNumberWarning(number) : null
  return (
    <div>
      <label>
        Your name: <input onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Your favorite number:{' '}
        <input
          type="number"
          onChange={e => setNumber(Number(e.target.value))}
        />
      </label>
      <div>
        {name
          ? `${name}'s favorite number is ${number}`
          : 'Please type your name'}
      </div>
      <div>{numberIsTooHigh ? numberWarning : null}</div>
      <div>{numberIsTooLow ? numberWarning : null}</div>
    </div>
  )
}
```

Great! Now we don't need to worry about calling `numberWarning` when it's not
needed. But if that doesn't work well for your situation, then we could make a
custom hook do this magic for us. It's not exactly simple and it's a bit of a
hack (there's probably a better way to do it honestly), so I'm just going to put
this in a codesandbox and let you explore it if you want:

https://codesandbox.io/s/usecomputedvalue-custom-hook-mo5b4

It's sufficient to say that the custom hook allows us to do this:

```jsx {4-6,24,25}
function FavoriteNumber() {
  const [name, setName] = React.useState('')
  const [number, setNumber] = React.useState(0)
  const numberWarning = useComputedValue(() => getNumberWarning(number), [
    number,
  ])
  return (
    <div>
      <label>
        Your name: <input onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Your favorite number:{' '}
        <input
          type="number"
          onChange={e => setNumber(Number(e.target.value))}
        />
      </label>
      <div>
        {name
          ? `${name}'s favorite number is ${number}`
          : 'Please type your name'}
      </div>
      <div>{number > 10 ? numberWarning.result : null}</div>
      <div>{number < 0 ? numberWarning.result : null}</div>
    </div>
  )
}
```

And our `getNumberWarning` function is only called when the `result` is actually
used. Think of it like a `useMemo` that only runs the callback when the return
value is rendered.

I think there may be room to perfect and open source that. Feel free to do so
and then make a PR to this blog post to add a link to your published package 😉

Again, there's really not much reason to worry yourself over this kind of thing
in a normal scenario. But if you do have perf bottlenecks around and `useMemo`
isn't enough for you, then consider doing something like this or use MobX.

## Conclusion

Ok, so we got a little distracted overthinking performance for a second there.
The fact is that you can really simplify your app's state by considering whether
the state needs to be managed by itself or if it can be derived. We learned that
derived state can be the result of a single variable of state, or it can be
derived from multiple variables of state (some of which can also be derived
state itself).

So next time you're maintaining the state of your app and trying to figure out a
synchronization bug, think about how you could make it derived on the fly
instead. And in the few instances you bump into performance issues you can reach
to a few optimization strategies to help alleviate some of that pain. Good luck!
