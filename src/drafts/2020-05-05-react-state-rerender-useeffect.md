---
date: 2020-05-05
title: Switch the AWS Profile for Serverless CLI
template: post
thumbnail: "../thumbnails/serverless.png"
slug: use-multiple-aws-profiles-aws-cli-serverless
categories:
  - Serverless
tags:
  - serverless
  - aws-cli
---

## Old mental model

mount/update/unmount mental model

Don't think of writing effect that behave differently depending on whether the component renders for the first time or not

doesn't matter whether we rendered with props A, B, and C, or if we rendered with C immediately

there may be some temporary differences (e.g. while we’re fetching data)

eventually the end result should be the same.

## React synchronizes the DOM according to our current props and state

mindset of useEffect, things are synchronized by default
Side effects become a part of the React data flow
synchronize props and state to some side effect

no distinction between a “mount” or an “update” when rendering.

think of effects in a similar way.

useEffect lets you synchronize things outside of the React tree according to our props and state.

```javascript
function Greeting({ name }) {
  useEffect(() => {
    document.title = "Hello, " + name;
  });
  return <h1 className="Greeting">Hello, {name}</h1>;
}
```

## Each Render Has Its Own Props and State

Inside any particular render, props and state forever stay the same.
any values using them (including the event handlers).
even async functions inside an event handler will “see” the same count value.

count variable does not change inside a component render.
It’s the effect function itself that’s different on every render.

count is just a number

It only embeds a number value into the render output

That number is provided by React. When we setCount, React calls our component again with a different count value.

The first time our component renders, the count variable we get from useState() is 0. When we call setCount(1), React calls our component again. This time, count will be 1. And so on:

```javascript
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

Whenever we update the state, React calls our component.

Each render result “sees” its own counter state value which is a constant inside our function.

the count constant inside any particular render doesn’t change over time. It’s our component that’s called again — and each render “sees” its own count value that’s isolated between renders.

count is constant within a particular component render.

### Each Render Has Its Own Event Handlers

count variable does not change inside a component render.
It’s the handler function itself that’s different on every render.

Each version “sees” the count value from the render that it “belongs” to:

shows an alert with the count after three seconds:

```javascript
function Counter() {
  const [count, setCount] = useState(0);

  function handleAlertClick() {
    setTimeout(() => {
      alert("You clicked on: " + count);
    }, 3000);
  }

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
      <button onClick={handleAlertClick}>Show alert</button>
    </div>
  );
}
```

event handler captures the count at the time of the click

each render returns its own “version” of handleAlertClick. Each of those versions “remembers” its own count:

count value is constant for every particular call to our function component.

our function gets called once per each render, and every one of those times the count value inside of it is constant and set to a particular value (state for that render).

Event handlers “see” the count state from the render that they “belong” to because count is a variable in their scope.

## Each Render Has Its Own Effects

send only the minimal necessary information from inside the effects into a component

effect functions belong to a particular render in the same way that event handlers do.

count variable does not change inside a component render.
It’s the effect function itself that’s different on every render.

there is one conceptual effect in the component (updating the document title),
But it is represented by a different function on every render

each effect function “sees” props and state from the particular render it “belongs” to.

Each version “sees” the count value from the render that it “belongs” to:

```javascript
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

React remembers the effect function you provided
runs it after flushing changes to the DOM and letting the browser paint the screen.

## useEffect Cleanup

props “seen” by the first render effect’s cleanup is {id: 10}.

```javascript
// First render, props are {id: 10}
function Example() {
  // ...
  useEffect(
    // Effect from first render
    () => {
      ChatAPI.subscribeToFriendStatus(10, handleStatusChange);
      // Cleanup for effect from first render
      return () => {
        ChatAPI.unsubscribeFromFriendStatus(10, handleStatusChange);
      };
    }
  );
  // ...
}

// Next render, props are {id: 20}
function Example() {
  // ...
  useEffect(
    // Effect from second render
    () => {
      ChatAPI.subscribeToFriendStatus(20, handleStatusChange);
      // Cleanup for effect from second render
      return () => {
        ChatAPI.unsubscribeFromFriendStatus(20, handleStatusChange);
      };
    }
  );
  // ...
}
```

## Read the latest value

want to read the latest rather than captured value inside some callback defined in an effect. The easiest way to do it is by using refs

```javascript
function Counter() {
  const [count, setCount] = useState(0);
  const latestCount = useRef(count);

  useEffect(() => {
    // Set the mutable latest value
    latestCount.current = count;
    setTimeout(() => {
      // Read the mutable latest value
      console.log(`You clicked ${latestCount.current} times`);
    }, 3000);
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

## DEpendencies

deps should contain every value used by the effect so React knows when to re-run the effect

only uses name and nothing else from the render scope

React will skip the effect if each of these values is the same between the current and the previous time this effect ran

"there’s nothing to synchronize"

all values from inside your component that are used by the effect must be there
props, state, functions — anything in your component

## Fetching Data

```javascript
function SearchResults() {
  async function fetchData() {
    // ...
  }

  useEffect(() => {
    fetchData();
  }, []); // Is this okay? Not always -- and there's a better way to write it.

  // ...
}
```

## Infinite loop call useEffect

The solution to that problem is not to remove a dependency

### dependency array to include all the values inside the component that are used inside the effect

oops: interval would be cleared and set again whenever the count changes

```javascript
useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1);
  }, 1000);
  return () => clearInterval(id);
}, [count]);
```

### second strategy is to change our effect code so that it wouldn’t need a value that changes more often than we want

### techniques for removing dependencies

### don't have effect doesn’t read the counter value from the render scope anymore

what are we using count for?

```javascript
useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1);
  }, 1000);
  return () => clearInterval(id);
}, [count]);
```

update state based on the previous state, we can use the functional updater form of setState

React already knows the current count. All we needed to tell React is to increment the state

tell React about how the state should change

```javascript
useEffect(() => {
  const id = setInterval(() => {
    setCount((c) => c + 1);
  }, 1000);
  return () => clearInterval(id);
}, []);
```

### useReducer

find yourself writing setSomething(something => ...), it’s a good time to consider using a reducer instead

decouple expressing the “actions” that happened in your component from how the state updates in response to them.

Instead of reading the state inside an effect, it dispatches an action that encodes the information about what happened

### Move function inside effect

If you only use some functions inside an effect, move them directly into that effect:

aren’t using anything from the outer scope of the component in our effect.

makes sense to refetch the data when the query changes

design of useEffect forces you to notice the change in our data flow and choose how our effects should synchronize it

```javascript
function SearchResults() {
  const [query, setQuery] = useState("react");

  useEffect(() => {
    function getFetchUrl() {
      return "https://hn.algolia.com/api/v1/search?query=" + query;
    }

    async function fetchData() {
      const result = await axios(getFetchUrl());
      setData(result.data);
    }

    fetchData();
  }, [query]); // ✅ Deps are OK

  // ...
}
```

## Move Function Outside Function Component

if a function doesn’t use anything from the component scope, you can hoist it outside the component and then freely use it inside your effects:

no need to specify it in deps because it’s not in the render scope and can’t be affected by the data flow

```javascript
// ✅ Not affected by the data flow
function getFetchUrl(query) {
  return "https://hn.algolia.com/api/v1/search?query=" + query;
}

function SearchResults() {
  useEffect(() => {
    const url = getFetchUrl("react");
    // ... Fetch data and do something ...
  }, []); // ✅ Deps are OK

  useEffect(() => {
    const url = getFetchUrl("redux");
    // ... Fetch data and do something ...
  }, []); // ✅ Deps are OK

  // ...
}
```

## useCallback

With useCallback, functions can fully participate in the data flow. We can say that if the function inputs changed, the function itself has changed

useful when a function is both passed down and called from inside an effect in some children
Or if you’re trying to prevent breaking memoization of a child component

make the function itself only change when necessary

if query changes, getFetchUrl will also change, and we will re-fetch the data

```javascript
function SearchResults() {
  const [query, setQuery] = useState("react");

  // ✅ Preserves identity until query changes
  const getFetchUrl = useCallback(() => {
    return "https://hn.algolia.com/api/v1/search?query=" + query;
  }, [query]); // ✅ Callback deps are OK

  useEffect(() => {
    const url = getFetchUrl();
    // ... Fetch data and do something ...
  }, [getFetchUrl]); // ✅ Effect deps are OK

  // ...
}
```

changes to props like props.fetchData can propagate down automatically
