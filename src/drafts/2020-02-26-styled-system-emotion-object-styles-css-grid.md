---
date: 2020-02-15
title: Using Python with Context Manager
template: post
thumbnail: "../thumbnails/python.png"
slug: styled-system-emotion-object-styles-css-grid
categories:
  - Python
tags:
  - python
---

Pseudo Selector

```javascript
css({
  pb: 7,
  position: "relative",
  ":last-child": {
    "span::before": {
      content: "none",
    },
    pb: 0,
  },
});

css({
  "&::before": {
    content: '""',
    position: "absolute",
    borderLeft: "1px solid",
    borderLeftColor: "gray.light",
    left: "18px",
    bottom: -8,
    height: "100%",
  },
  backgroundColor: "secondary.medium",
  color: "white",
  border: "1px",
  borderColor: "gray.lightest",
  borderWidth: "4px",
  borderRadius: "50%",
  p: "3px 11px",
  mr: "10px",
});
```

CSS Grid

```jsx
<Grid
  gridTemplateColumns={{
    default: `'1fr'
              '1fr`,
    sm: '1fr 2fr',
  }}
>
```
