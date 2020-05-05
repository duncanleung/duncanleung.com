---
date: 2020-04-27
title: Notes on Javascript Function Invocation and "this"
template: post
thumbnail: "../thumbnails/javascript.png"
slug: javascript-invocation-this
categories:
  - Javascript
tags:
  - interview-prep
  - javascript
---

## Implement debounce

```javascript
function debounce(fn, delay) {
  let setTimeoutId = null;

  return function() {
    if (setTimeoutId) {
      clearTimeout(setTimeoutId);
    }

    const setTimeoutId = setTimeout(() => {
      fn.call(this);

      setTimeoutId = null;
    }, delay);
  };
}

const debouncedFn = debounce(() => {}, 500);

// When an action is happening, keep pushing back the start time
// When there is a delay for x seconds, then fire the function
```
