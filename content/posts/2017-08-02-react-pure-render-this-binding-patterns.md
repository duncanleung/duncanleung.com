---
date: 2017-08-02
title: Pure render() 'this' Binding Patterns in React
thumbnail: "../thumbnails/react.png"
slug: react-pure-render-this-binding-patterns
template: post
categories:
  - React

tags:
  - javascript
  - react
---

Another React caveat that I have come across, is to **keep the `render()` method _pure_**.

Let's take a look, specifically relating to patterns on binding the `this` context for class methods.

## I. Quick Overview on Pure `render()`

The motivation behind keeping the `render()` method pure is to <a href='https://facebook.github.io/react/docs/react-component.html#shouldcomponentupdate' target='_blank'>avoid issues when using `shouldComponentUpdate()`</a>, and `React.PureComponent`, which work by <a href='https://facebook.github.io/react/docs/react-api.html#react.purecomponent' target='_blank'>performing shallow comparison checks</a>.

The guidelines of a pure `render()` is:

- The contents of the `render()` method **should not create new arrays, objects, or functions.**
  - A new array, object, or function instance within `render()` will cause the shallow comparison to always fail. The Component will always re-render.
- **That state is not mutated** within `setState()`.
  - A mutated state will not create a new state object, causing the shallow comparison to always succeed. The Component will not re-render.

### Side Comment: Necessity of pure `render()` patterns?:

_Pure `render()` patterns seem to only have benefits if you are utilizing the `shouldComponentUpdate()` method, or `React.PureComponent`._

_Pure `render()` patterns are considered a "nice to have", but they are not mandatory in writing functioning (and for the most part, performant) React apps._

_React will actually handle the performance of most, small, React apps perfectly fine._

**_Following a pure `render()` pattern may provide an easier transition, when `shouldComponentUpdate()` or `React.PureComponent` is actually needed._**

**_In either case, it's good to understand what a pure/non-pure pattern implies in how the code functions. Let's dig in more..._**

## II. `this` Binding in React `render()`

Most of the discussion, around maintaining pure `render()` methods, is regarding the `this` context binding within a `render()` method.

Assume the base case:

- Form Component with an ES6 class.
- State Object, with the property `name`, and value of `Joe`
- `handleClick()` method that `console.log(this.state.name)`.
- `render()` method that just displays the button.

How should we attach `handleClick()` to the button, with a correctly bound `this` to the context of the Form Component instance?

```js{12,18}
class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "Joe"
    };
  }

  handleClick() {
    // Uncaught TypeError: Cannot read  property 'state' of null
    console.log(this.state.name);
  }

  render() {
    return (
      // How to bind 'this.handleClick' to Form Component instance?
      <button onClick={this.handleClick()}>Click Me</button>
    );
  }
}
```

## Problem: Binding `this`

The problem originates from ES6 classes not automatically binding the, `this`, context for methods on the class.

Without explicit `this` binding, when `<button> Click Me </button>` is clicked, the `this` context within the attached event handler, `handleClick()`, no longer points to the Form Component instance and we get the error:

```terminal
Uncaught TypeError: Cannot read property 'state' of null
```

### Aside: When to pass `props` into `super()`?

I noticed there were code samples on various blog articles that differ in passing and omitting `props` into the `super()` method.

As a standard, the React team <a href='https://facebook.github.io/react/docs/state-and-lifecycle.html#adding-local-state-to-a-class' target='_blank'>recommends</a>:

**_"Class components should always call the base constructor with props"_**.

For the curious minds: Apparently, passing `props` into `super()` **allows access to `this.props` in the `constructor()`.**

Interestingly, if you omit passing `props` into `super()`, it does not affect access to `this.props` outside of the `constructor()` (ex. `render()`, `componentDidMount()`, etc. will still have access to `this.props`).

```js{3,11}
// Not recommended, omitting props.
constructor() {
  super();

  ...
}


// Recommended: Always call the base constructor with props.
constructor(props) {
  super(props);

  ...
}
```

## III. Non-Pure `render()` Patterns - Binding `this`

**_Note:_** _Most articles and tutorials I've seen commonly use these two non-pure patterns because of the succinct syntax. Using a non-pure pattern is absolutely fine for those situations. Again, most small React apps will perform perfectly fine using these non-pure `render()` patterns._

**To reiterate, a pure `render()` should not create new functions within `render()`.**

The following two non-pure patterns, using `.bind` and arrow functions, **return a new function every time the Component re-renders**. This will cause problems when trying to utilize `shouldComponentUpdate()` and `React.PurecComponent`.

### 1. Calling `bind()` in `render()` - Non Pure `render()` Pattern

A common solution to resolve `this` binding context is <a href='https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind' target='_blank'>to use `bind()`</a>. This Javascript native method _creates a new function_ that has its `this` keyword set to the provided context.

```js{12,18}
class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "Joe"
    };
  }

  handleClick() {
    // 'this' context in handleClick() bound to Form Component instance
    console.log(this.state.name);
  }

  render() {
    return (
      // Binding 'this'
      <button onClick={this.handleClick.bind(this)}>Click Me</button>
    );
  }
}
```

### 2. Arrow Functions - Non Pure `render()` Pattern

Another common solution to resolve `this` binding context, is to use arrow functions.

However, we are still returning a new instance of `handleClick()` from the arrow function every time the Component is re-rendered.

```js{12,18}
class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "Joe"
    };
  }

  handleClick() {
    // 'this' context in handleClick() bound to Form Component instance
    console.log(this.state.name);
  }

  render() {
    return (
      // Binding 'this.handleClick'
      <button onClick={() => this.handleClick()}>Click Me</button>
    );
  }
}
```

**Note:** Using arrow functions in `render()` is popular because it serves as a _"useful"_ and convenient way to pass in arguments to an event handler. We'll touch on this more below.

```js{17}
class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "Joe"
    };
  }

  handleClick(name) {
    console.log(name);
  }

  render() {
    return (
      // Binding 'this', and passing in an argument
      <button onClick={() => this.handleClick(this.state.name)}>
        Click Me
      </button>
    );
  }
}
```

## IV. Pure `render()` Patterns - Binding `this`

The following pure `render()` patterns do not create new function instances within `render()`, allowing the shallow comparison check to work correctly.

### 1. Calling `bind()` in the Constructor - Pure `render()` Pattern

This solution still utilizes `bind()`, however, we assign the context bound function in the constructor of the Component.

```js{10,15}
class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "Joe"
    };

    // Binding 'this'
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // 'this' context in handleClick() bound to Form Component instance
    console.log(this.state.name);
  }

  render() {
    return <button onClick={this.handleClick}>Click Me</button>;
  }
}
```

### 2. Arrow Function Class Method- Pure `render()` Pattern

This solution takes advantage of a stage-2 experimental feature, <a href='https://babeljs.io/docs/plugins/transform-class-properties/' target='_blank'>Arrow Function Class Methods</a>, allowing arrow functions to be used as class methods to preserve the `this` context of your method.

**Note:** Class properties are currently <a href='https://babeljs.io/docs/plugins/preset-stage-2/' target='_blank'>stage-2</a> and require an additional Babel plugin. I've included my `.babelrc`, `webpack.config.js`, and `package.json` at the end of the article for reference.

```js{13}
class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "Joe"
    };
  }

  // Arrow Function Method
  handleClick = () => {
    // 'this' context in handleClick() bound to Form Component instance
    console.log(this.state.name);
  };

  render() {
    return <button onClick={this.handleClick}>Click Me</button>;
  }
}
```

### 3. Autobinding with `React.createClass` - Pure `render()` Pattern

ES6 Class syntax is the current standard for writing React (the React docs have also switched over to use ES6 Class syntax). However, when using the traditional syntax of `React.createClass`, the `this` context of methods in the Component are actually automatically bound.

```js{10}
var Form = React.createClass({
  getInitialState() {
    return {
      name: "Joe"
    };
  },

  handleClick() {
    // 'this' context in handleClick() bound to Form Component instance
    console.log(this.state.name);
  },

  render() {
    return <button onClick={this.handleClick} />;
  }
});
```

## V. Passing Arguments to Methods in `render()`

This is an interesting problem - how do you keep the `render()` method pure, while passing arguments to event handlers?

### 1. Non Pure `render()`: Passing Arguments with Arrow Functions

There's nothing special here. An easy way to pass arguments to a method within `render()`, is to use arrow functions.

However, this is a non-pure pattern.

```js{17}
class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "Joe"
    };
  }

  handleClick(name) {
    console.log(name);
  }

  render() {
    return (
      // Binding 'this', and passing in an argument
      <button onClick={() => this.handleClick(this.state.name)}>
        Click Me
      </button>
    );
  }
}
```

### 2. Pure `render()`: Passing Arguments using Child Components

The concept of this pattern is to create a separate Component, `<Button />` with its own event handler, `wrapperHandler()`.

`wrapperHandler()` can call the parent's event handler, `handleClick()`, and pass in any arguments:

```js{6}
// Create a child Component

const Button = props => {
  const wrapperHandler = () => {
    // Pass in arguments to the original event handler 'props.handleClick'
    props.handleClick(props.name);
  };

  return <button onClick={wrapperHandler}>Click Me</button>;
};
```

With this pattern, we can ensure that the `render()` method remains pure, and we avoid creating new function instances on each render.

In the parent Component, we render an instance of the `<Button />` Component we just created, and pass in the original event handler and any arguments, as `props`.

Note that the method, `handleClick()`, still needs to have its `this` context correctly bound. In this example, I chose to do the binding in the `constructor()`.

```js{9,20,22}
class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "joe"
    };

    this.handleClick = this.handleClick.bind(this); // Binding 'this'
  }

  handleClick(name) {
    console.log(name);
  }

  render() {
    return (
      <Button
        // Pass 'this.handleClick' as a prop called, 'handleClick'
        handleClick={this.handleClick}
        // Pass the argument as a prop called, 'name'
        name={this.state.name}
      />
    );
  }
}
```

The above example is pretty simple. Here's another example in <a href='https://codesandbox.io/s/oY825BRxK' target='_blank'>React CodeSandbox</a> that further illustrates this pattern.

<iframe src="https://codesandbox.io/embed/oY825BRxK?view=editor" style="width:100%; height:1600px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Appendix: Using Babel Stage-2 Presets

<div class="filename">webpack.config.js</div>

```js
// Specify webpack to use the 'babel-loader' module, for .js file types.

var path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./app/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader"
      },
      {
        exclude: /(node_modules)/,
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "app/index.html"
    })
  ]
};
```

<div class="filename">.babelrc</div>

```bash
// Include "stage-2", under "presets".


{
  "presets": ["env", "react", "stage-2"]
}
```

<div class="filename">package.json</div>

```json
// Add "babel-preset-stage-2" as a Dev Dependency.

"devDependencies": {
  "babel-core": "^6.25.0",
  "babel-loader": "^7.1.1",
  "babel-preset-env": "^1.6.0",
  "babel-preset-react": "^6.24.1",
  "babel-preset-stage-2": "^6.24.1",
  "css-loader": "^0.28.4",
  "html-webpack-plugin": "^2.29.0",
  "prop-types": "^15.5.10",
  "style-loader": "^0.18.2",
  "webpack": "^3.3.0",
  "webpack-dev-server": "^2.5.1"
},
"dependencies": {
  "react": "^15.6.1",
  "react-dom": "^15.6.1"
}
```
