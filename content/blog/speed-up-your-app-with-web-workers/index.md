---
slug: 'speed-up-your-app-with-web-workers'
title: 'Speed up your App with Web Workers'
date: '2019-10-04'
author: 'Kent C. Dodds'
description: '_How to get started using web workers for practical use cases_'
categories:
  - 'javascript'
keywords:
  - 'react'
  - 'performance'
  - 'web workers'
banner: './images/banner.jpg'
bannerCredit:
  'Photo by [Matthew Brodeur](https://unsplash.com/photos/eJ9mX6yEbAw)'
---

I remember when I started learning about threads in Java. My college professor
pulled up iTunes, hit play on a song and said: "if it weren't for threads, I
wouldn't be able to click any of these buttons at the same time iTunes is
playing this music."

JavaScript is single-threaded. This means that any JavaScript environment will
not run multiple lines of JavaScript in the same process simultaneously (the
browser handles audio-playback separate from the thread it gives you for your
JavaScript which is why your code can run while music is playing in the
browser). The single threaded-ness of JavaScript drastically simplifies a lot of
programming in JavaScript, but it does come with some drawbacks.

One of the most significant of these drawbacks comes in the form of user
experience. To illustrate my point, go ahead and open a new tab to twitter.com
and open your browser DevTools console. Then copy/paste this and hit enter:

```javascript
while (true) {}
```

Can you interact with the web page anymore? No? That's because your code is
keeping the JavaScript thread so busy just hanging out in that infinite while
loop that no other JavaScript can do anything. (If you're stuck and you can't
close that tab, my apologies. In Chrome you can stop the tab by going to "More
tools" -> "Task Manager" and selecting the tab and clicking "End Process").

So the moral of the story is don't use infinite loops in your code right? Well,
I think we all can agree on that, but I've got a stronger, more practical point
to this. What if you have some code that takes a long time to run? Maybe it's...
I don't know... Mining bitcoin or something. With some kinds of computations,
there's only so much performance optimization you can do before you just hit the
limits of the machine that's running your code. So are your users just stuck
with a really bad experience using your website whenever that code has to run?
No!

## Enter Web Workers

You know how you can have multiple tabs open in your browser? Each one of those
tabs is running the JavaScript for that page in its own thread. So just because
JavaScript is single-threaded, doesn't mean the browser can't spin up multiple
threads to run different JavaScript files.

[Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)
are a browser standard that enables you to do just that! And you can even
communicate between those different threads (with some limitations, which we
won't get into in this post).

## Super Simple Start to Web Workers

Here you go:

```html
<!-- index.html -->
<script src="main.js"></script>
```

```javascript
// main.js
const worker = new Worker('worker.js')
worker.postMessage('Hello Worker')
worker.onmessage = e => {
  console.log('main.js: Message received from worker:', e.data)
}
// if you want to "uninstall" the web worker then use:
// worker.terminate()
```

```javascript
// worker.js
this.onmessage = e => {
  console.log('worker.js: Message received from main script', e.data)
  this.postMessage('Hello main')
}
```

You can preview this here (open your console):
[super-simple-web-worker.netlify.com](https://super-simple-web-worker.netlify.com)

There you go. You can now run your bitcoin miner without locking up the main
thread! In fact, in the Chrome DevTools Sources tab, it shows that we have
another thread:

![Chrome DevTools Sources tab showing a thread titled worker.js](./images/devtools.png)

You can even put a breakpoint in your code and debug it like you're used to.
Neat!

## Practical use

I remember when Web Workers became a thing. And I guess it was longer ago than I
remember because IE10 supports Web Workers. So if you have to support a browser
that's not supporting Web Workers then I'm sorry, I just don't know what to tell
you.

For the rest of us, how do we go from this simple one-file setup to something
that will scale well/support/modules/etc? Well, my favorite solution to this is
[`workerize`](https://github.com/developit/workerize) by
[Jason Miller](https://github.com/developit):

![Workerize logo](./images/workerize.jpg)

It's awesome, but even more awesome is the sibling project by Jason called
[`workerize-loader`](https://github.com/developit/workerize-loader) which is a
webpack loader for workerize which basically means you can put any module (and
the modules that it imports) into a webworker.

It's really easy to use too. I teach about this in
[my React Performance workshop](/workshops/react-performance). There are a few
exercises that show you how to optimize a client-side search input component
which allows you to do a filter of thousands of cities using
[`match-sorter`](https://github.com/kentcdodds/match-sorter) and
[`Downshift`](https://github.com/downshift-js/downshift).

We have a module that has the whole list of cities and exposes a `getItems`
function which accepts the user's input and then returns an array of the
matching cities.

That workshop material uses `react-scripts` (create-react-app). Here's some of
the code from my material:

```javascript
// eslint-disable-next-line import/no-webpack-loader-syntax
import makeFilterCitiesWorker from 'workerize!./filter-cities'

const {getItems} = makeFilterCitiesWorker()

export {getItems}
```

The `workerize!` thing in the import statement is a fancy webpack syntax to tell
webpack to treat that module specially (specifically to pipe it through the
`workerize-loader` so Jason can do his magic on it to get it into a web worker).

Putting the `getItems` code into a web worker did wonders to speed up my demo.
One catch to this is that before `getItems` was synchronous, but communication
between the main thread and a worker thread is asynchronous, so I had to alter
my app code a little bit to handle the asynchrony, but it was totally worthwhile
and improved the user experience a lot.

## Conclusion

I hope this helps you out! I have a feeling that we don't use web workers as
much as we probably could/should, so profile your app and see whether there are
any hot-spots in your JavaScript code that could benefit from a separate thread.
Good luck!
