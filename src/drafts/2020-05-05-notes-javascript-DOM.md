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

## Iterate over data and create DOM list

https://codepen.io/jemyoung/pen/0817cc37159377752b6cd9bf70d40883?editors=1011

```html
<html>
  <body>
    <div>
      <div class="foods">
        Best foods
      </div>
    </div>
  </body>
</html>
```

```javascript
/*
  Hi there! Thanks for taking on this code test. The requirements are listed below:
  
  1. Create a "Foods" class or constructor that will take two arguements: a root element and a data object (foodData).
  2. Render all of the items in the data object into the DOM with the root element as the parent
  3. If the user clicks a food item, it should be removed from the list
  
  Rules:
  - Only vanilla JS
  - Feel free to use Google, Bing, DuckDuckGo to look things up
  - Time limit: 30 minutes
*/

/* DO NOT MODIFY */
const rootElement = document.querySelector(".foods");

const foodData = [
  {
    id: 1,
    image: "🌮",
    name: "taco",
  },
  {
    id: 2,
    image: "🍔",
    name: "burger",
  },
  {
    id: 3,
    image: "🍆",
    name: "eggplant",
  },
  {
    id: 4,
    image: "🍎",
    name: "apple",
  },
  {
    id: 5,
    image: "🥞",
    name: "pancakes",
  },
];
/* DO NOT MODIFY */

/** YOUR CODE BELOW **/
class Foods {
  constructor(rootElement, data) {
    this.rootElement = rootElement;
    this.data = data;
  }

  createList() {
    const fragment = document.createDocumentFragment();

    for (let item of this.data) {
      fragment.appendChild(this.createItems(item));
    }

    this.rootElement.appendChild(fragment);

    document.addEventListener("click", (e) => {
      const ele = e.target;
      if (ele.className === "food-item") {
        ele.remove();
      }
    });
  }

  createItems(item) {
    const node = document.createElement("div");
    node.innerText = `${item.image} ${item.name}`;
    node.className = "food-item";

    return node;
  }
}

const foodList = new Foods(rootElement, foodData);

foodList.createList();
```
