---
date: 2020-02-17
title: Conditional Types to Infer Props from Emotion `as` Prop
template: post
thumbnail: "../thumbnails/typescript.png"
slug: typescript-generics-emotion-styled-component-as-prop
categories:
  - TypeScript
tags:
  - typescript
  - emotion
---

## Problem: How to Infer the Rendered Component's Props when Using Emotion's `as` Prop

I was working with my teammate, <a href='https://github.com/riley-rangel' target='_blank'>Riley Rangel</a>, to provide a better developer experience on a `<Button />` React component in our component library.

The `<Button />` uses the <a href="https://emotion.sh/docs/styled#as-prop" target="_blank">Emotion `as` prop / polymorphic prop</a> to allow rendering the `<Button />` as either a Gatsby `<Link />`, or a native HTML anchor element `<a>`.

Here's a stripped down version without <a href="https://styled-system.com/" target="_blank">styled-system</a> and any accessibility props:

<div class="filename">Button.tsx</div>

```typescript{13-14}
import React from "react";
import css from "@styled-system/css";
import styled from "@emotion/styled";
import { Link } from "gatsby";

const StyledButton = styled.button`
  // component styles
  // ...
`;

type Props = {
  as?: React.ComponentType | typeof Link | string;
  href?: string;
  to?: React.ComponentProps<typeof Link>["to"];
};

const Button: React.FC<Props> = ({ children, type = "button", ...props }) => {
  return <StyledButton {...props}>{children}</StyledButton>;
};

export default Button;
```

Using the `<Button />` component:

```typescript{1}
<Button as={Link} to="/login">
  Log In
</Button>
```

### Using TypeScript Optional Properties loses Intellisense help

The original type annotation sets `href` and `to` as optional properties, since these props are only required in certain cases.

However, we would still like Intellisense to let us know when these props are needed.

<div class="filename">Button.tsx</div>

```typescript{5-6}
//... taken from the above example

type Props = {
  as?: React.ComponentType | typeof Link | string;
  href?: string;
  to?: React.ComponentProps<typeof Link>["to"];
};
```

When rendering the component as a Gatsby `<Link />` component, we need to include the prop, `to`:

```typescript
<Button as={Link} to="some-internal-path" />
```

When rendering tthe component as a native HTML anchor element `<a>`, we need to include the attribute, `href`:

```typescript
<Button as="a" href="some-external-path" />
```

Also, it would be nice for TypeScript to yell at us when we mix up the props:

```typescript
<Button as='a' to='some-external-path' />
               ^^^^mixing the `to` prop on an anchor element
```

## Solution: Use TypeScript Conditional Types to Infer the Component's Type

### A quick aside on conditional types

<a href='https://www.typescriptlang.org/docs/handbook/advanced-types.html#conditional-types' target="_blank">Conditional Types</a> allows you to select one of two possible types based on a type-relationship condition.

```typescript
A extends B ? C : D
```

The main aspect of the conditional type is in the `extends` keyword.

`A extends B` checks whether `A` is assignable to `B`. Another way to think of this is whether:

- Does `A` have all of `B`'s properties? (`A` can still include more properties, but it must include all of `B`'s properties)
- Is `A` is a possibly-more-specific version of `B`

If `A` is assignable to `B` (`A extends B`), then the type is `C`. Otherwise, the type is `D`

A great in-depth explainer on conditional types written on the <a href='https://artsy.github.io/blog/2018/11/21/conditional-types-in-typescript/' target="_blank">Artsy Engineering blog</a>.

### Creating a Conditional Type for `Button`

In our case, we want TypeScript to check if the `as` prop is assignable to either:

- `React.ComponentType`: Assign the type `React.ComponentProps<T>`
- `typeof Link`: Assign the type `React.ComponentProps<T>`
- `"a"`: Assign the type `React.HTMLProps<T>`

<div class="filename">type-utils.tsx</div>

<!-- prettier-ignore-start -->
```typescript
type GetRenderComponentProps<T> = T extends React.ComponentType | typeof Link
  ? React.ComponentProps<T>
    : T extends "a" ? React.HTMLProps<T> : {};
```
<!-- prettier-ignore-end -->

### Creating a TypeScript Generic for the `as` Prop

The `as` prop is a generic (`E` for element), of type `RenderComponent`.

The `<Button />` component type annotation takes a Generic type `T` (this coincides with the generic Prop type annotation above).

The return type of the `<Button />` component is also depends on the Generic type `T`.

```typescript{4,7,8}
type RenderComponent = React.ComponentType | typeof Link | "a";

type Props<E extends RenderComponent> = {
  as?: E;
};

const Button = <T extends RenderComponent>(props: Props<T>):
    ReturnType<React.FC<Props<T>>> => {
      return (
        // Render the component
      );
};
```

### Creating the Intersection Type for the rendered element

Using the conditional type `GetRenderComponentProps`, we can now correctly create a type intersection.

This intesection now correctly resolves to the type depending on the type of element, `E`, passed into the `as` prop.

```typescript{3}
type Props<E extends RenderComponent> = {
  as?: E;
} & GetRenderComponentProps<E>;
```

## Solution:

<div class="filename">Button.tsx</div>

<!-- prettier-ignore-start -->
```typescript{11,13-15,17,22}
import React from "react";
import css from "@styled-system/css";
import styled from "@emotion/styled";
import { Link } from "gatsby";

const StyledButton = styled.button`
  // component styles
  // ...
`;

type RenderComponent = React.ComponentType | typeof Link | "a";

type Props<E extends RenderComponent> = {
  as?: E;
} & GetRenderComponentProps<E>;

const Button = <T extends RenderComponent>({
  as,
  children,
  type = "button",
  ...props
}: Props<T>): ReturnType<React.FC<Props<T>>> => {
  return (
    <StyledButton as={as} type={as ? undefined : type} {...props}>
      {children}
    </StyledButton>
  );
};

export default Button;
```
<!-- prettier-ignore-end -->
