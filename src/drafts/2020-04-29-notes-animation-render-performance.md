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

## requestAnimationFrame()

`requestAnimationFrame`

`cancelAnimationFrame`

```javascript
const box = document.getElementById("animate");
box.addEventListener("click", (e) => {
  moveElement(200, 100, e.target);
});

function moveElement(duration, distance, element) {
  // Create a closure and store the value of `start`
  // when moveElement() was first called
  const start = performance.now();

  function move(currentTime) {
    // The animation progression is a function of time
    // Get the percentage of time that has elapsed
    const elapsed = currentTime - start;
    const progress = elapsed / duration;

    // Calculate amountToMoveas a function of
    // how much progress of the total distance
    const amountToMove = progress * distance;

    element.style.transform = `translateX(${amountToMove}px)`;

    // If not met End Condition - call again
    if (amountToMove < distance) {
      requestAnimationFrame(move);
    }
  }

  requestAnimationFrame(move);
}
```
