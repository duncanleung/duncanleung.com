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

## Remove duplicates from a string()

```javascript
const str = "This is is a test test string";

removeDuplicate(str); // This is a test string
```

```javascript
function removeDuplicate(str) {
  const strArray = str.split(" ");
  const dedupedSet = new Set(strArray);

  return Array.from(dedupedSet).join(" ");
}
```

```javascript
function removeDuplicate(str) {
  const strArray = str.split(" ");
  const dedupedArray = [];

  for (const item of strArray) {
    if (!dedupedArray.includes(item)) {
      dedupedArray.push(item);
    }
  }

  return dedupedArray.join(" ");
}
```

## Flatten an Array

```javascript
const multiDArray = [1, 2, [3, 4, [5, 6, 7], 8], 9, 10];

console.log(flatten(multiDArray));
// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

function flatten(arr) {
  return arr.reduce((acc, curr) => {
    if (Array.isArray(curr)) {
      acc = acc.concat(flatten(curr));
    } else {
      acc.push(curr);
    }

    return acc;
  }, []);
}
```
