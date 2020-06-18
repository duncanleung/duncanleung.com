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

# jank

## 60fps

- 1second / 60fps = 16.6ms to do javascript execution work
- 10ms in reality (browser uses resources too)

## Render Process

Javascript > Style > Layout > Paint > Composite

- JavaScript
  JavaScript is used to handle work that result in visual changes (animate, sorting a data set, adding DOM elements)

(CSS Animations, Transitions, and the Web Animations API also cause visual changes)

- Style calculations

  The process of figuring out which CSS rules apply to which elements based on matching selectors
  .headline or .nav > .nav\_\_item.

  Once rules are known, they are applied and the final styles for each element are calculated.

- Layout
  After the browser knows which rules apply to an element
  Calculates how much space it takes up and where it is on screen.

the process can be quite involved for the browser.
One element can affect others:
the width of the <body> element typically affects its children’s widths, all the way up and down the DOM tree

- Paint
  The process of filling in pixels. (drawing out text, colors, images, borders, and shadows, essentially every visual part of the elements.)
  The drawing is typically done onto multiple layers.

- Compositing.
  The process of combining the multiple Paint layers on to the screen in the correct order so that the page renders correctly.

  This is important for elements that overlap.

## 3 Ways Rendering Pipeline is Triggered

https://csstriggers.com/

### Changing a "layout" property

```
JS / CSS > Style > Layout > Paint > Composite
```

a “layout” property change is caused by modifying an element’s geometry:

- width
- height
- position with left or top

The browser will check all the other elements layout and “reflow” the page.

Any affected areas of the page will need to be repainted, and the final painted elements will need to be composited back together.

### Changing a "paint" property

```
JS / CSS > Style >        > Paint > Composite
```

a “paint only” property change is caused by modifying an element's:

- background image
- text color
- shadows

Paint only property changes do not affect the layout of the page.

The browser can skip layout, and will do a paint to the screen.

### Changing a "composite" property

```
JS / CSS > Style >        >       > Composite
```

a "composite only" change does not requires layout nor paint:

- transform
- opacity
- promoting moving elements with: `will-change` or `translateZ`

Position: `transform: translate(npx, npx);`
Scale: `transform: scale(n);`
Rotation: `transform: rotate(ndeg);`
Skew: `transform: skew(X|Y)(ndeg);`
Matrix: `transform: matrix(3d)(...);`
Opacity: `opacity: 0...1;`

The browser jumps to compositing.

This is the cheapest and most desirable for tasks like animations or scrolling.

# ==================== Optimizing

## Optimizing Computed Style Calculation

Computed Style Calculations can be optimized by:

- Reducing the complexity of CSS selectors (use class-centric methods like BEM).
- Reduce the number of elements which style calculations must be calculated.

```css
/* BAD: Complex style calculation 
Browser must know about all other elements when computing "nth-last-child"
*/
.box:nth-last-child(-n + 1) .title {
  /* styles */
}

/* BETTER  */
.final-box-title {
  /* styles */
}
```

Computed style calculation is the process when the browser recalculates element styles. These often cause a "layout" (reflow) of the page.

Computed style calculations occurs when changes happen to the DOM through:

- adding and removing elements
- changing attributes, classes
- animation

Computed Style Calculation Process

1. The browser creates a set of matching selectors (which classes, pseudo-selectors and IDs apply to each element)
2. Taking the style rules associated with each selector and determining the final styles for an element.

Read More: <a href='https://developers.google.com/web/fundamentals/performance/rendering/reduce-the-scope-and-complexity-of-style-calculations#measure_your_style_recalculation_cost' target='_blank'>Measuring Style Recalculation Cost</a>

## Optimizing Layout

Layout can be optimized by:

- Reducing the number of elements that require layout.
- Reducing the complexity of those layouts.
- Avoiding forced synchronous layouts (reading style values).
- Avoiding layout thrashing (makeing style changes).

```css
.box {
  width: 20px;
  height: 20px;
}

/**
 * Changing width and height
 * triggers layout.
 */
.box--expanded {
  width: 200px;
  height: 350px;
}
```

Layout occurs when changes happen to the geometry of DOM elements:

- changing the size of an element
  - CSS properties
  - the element's contents
  - The size of it's parent element
- changing the location of an element in the page

Variables affecting Layout Performance

- The number of DOM elements on the page; you should avoid triggering layout wherever possible.
- Assess layout model performance; new Flexbox is typically faster than older Flexbox or float-based layout models.

browser figures out the geometric information for elements:
