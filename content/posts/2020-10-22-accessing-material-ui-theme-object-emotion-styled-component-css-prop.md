---
date: 2020-10-22
title: Accessing Material UI Theme Object in Emotion JS
template: post
thumbnail: "../thumbnails/emotion-js.png"
slug: accessing-material-ui-theme-object-emotion-styled-component-css-prop
categories:
  - EmotionJS
tags:
  - emotion-js
  - material-ui
---

I've been working on a new React project using Material UI and Emotion JS, and the way to access the Theme object has always felt a bit wonky.

Although Material UI provides it's own styling solution with <a href='https://material-ui.com/styles/basics/#styled-components-api' target='_blank'>Styled Components</a> and <a href='https://material-ui.com/styles/basics/#hook-api' target='_blank'>Hook API</a>, we preferred Emotion's CSS prop and Styled Components API better.

Fortunately Material UI provides support for <a href='https://material-ui.com/guides/interoperability/#emotion' target='_blank'>Emotion JS and other style libraries</a>.

## Pass the Material UI Theme Object to Emotion's ThemeProvider

```jsx{9-15,20,23}
import { css } from '@emotion/core';
import { ThemeProvider } from 'emotion-theming';
import {
  createMuiTheme,
  ThemeProvider as MuiThemeProvider,
} from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#6772e5',
    },
  },
});

export default function EmotionTheme() {
  return (
    <MuiThemeProvider theme={theme}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </MuiThemeProvider>
  );
}
```

## Emotion Styled Components - Access Theme from props

The theme object is passed to `styled` as a prop, so object destructuring is used.

```js
import styled from '@emotion/styled'
import { IconButton } from '@material-ui/core'

const NotificationButton = styled(IconButton)`
  color: ${({ theme }) => theme.palette.gray.dark};
`
```

## Emotion CSS String Styles - Access Theme Object

The theme object is passed as a function param to the css prop.

```js
import React from 'react'
import { css } from '@emotion/core'
import { Box, Button } from '@material-ui/core'

const Card = () => {
  return (
    <Box>
      <Button
        css={(theme) => css`
          color: ${theme.palette.gray.dark};
        `}>
        Forgot Password
      </Button>
    </Box>
  )
}
```

## Access Material UI's Theme Breakpoints for Responsive Media Query Styles

```js
const CardHeader = styled.div`
  padding: 10px;

  ${({ theme }) => `${theme.breakpoints.up('lg')} {
    padding: 20px;
  }`}
`
```