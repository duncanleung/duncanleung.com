---
date: 2018-10-15
title: Testing Formik 'onSubmit' with Jest
template: post
thumbnail: "../thumbnails/jest.png"
slug: testing-formik-form-onsubmit
categories:
  - Testing
  - Popular
tags:
  - formik
  - react-testing-library
  - jest
---

## Testing Forms with Jest and react-testing-library

I needed to test my `login.tsx` form submit, but was running into this error.

### Error:

```terminal
expect(jest.fn()).toHaveBeenCalledTimes(1)

Expected mock function to have been called one time, but it was called zero times.
```

## Problem: Submit Handler Isn't Being Called

For some reason the mock, `const submitLogin = jest.fn();` was not being called in the form.

Interestingly, putting the `submitLogin` handler directly on the button `onClick`, would actually call `submitLogin`.

<div class="filename">LoginFormComponent.test.tsx</div>

```tsx{30,53,57-58,69}
import React from "react";
import "jest-dom/extend-expect";
import {
  cleanup,
  fireEvent,
  render,
  RenderResult
} from "react-testing-library";

//Generate fake user data
import { generate } from "../../../../test-utils/test-utils";

import LoginFormComponent from "../LoginFormComponent";

afterEach(cleanup);

describe("LoginFormComponent", () => {
  describe("Submitting form", () => {
    //Arrange--------------
    // Set up variables accessible in tests
    let wrapper: RenderResult;
    let fakeUser: { email: string; password: string };
    let emailNode: HTMLInputElement;
    let passwordNode: HTMLInputElement;
    let loginButtonNode: HTMLInputElement;
    let submitLogin: () => void;

    beforeEach(() => {
      // Here's my submitHandler mock that isn't getting called
      submitLogin = jest.fn();

      const props = {
        submitLogin
      };

      wrapper = render(<LoginFormComponent {...props} />);

      fakeUser = generate.loginForm();
      emailNode = wrapper.getByPlaceholderText(
        "E-mail address"
      ) as HTMLInputElement;
      passwordNode = wrapper.getByPlaceholderText(
        "Password"
      ) as HTMLInputElement;
      loginButtonNode = wrapper.getByText("Login") as HTMLInputElement;

      //Act--------------
      // Change the input values
      fireEvent.change(emailNode, { target: { value: fakeUser.email } });
      fireEvent.change(passwordNode, { target: { value: fakeUser.password } });

      // This should submit the form?
      fireEvent.click(loginButtonNode);
    });

    test("Shows loading spinner", () => {
      // This test passes
      // so fireEvent.click(loginButtonNode) does work

      //Assert--------------
      expect(loginButtonNode).toHaveAttribute(
        "class",
        "ui facebook large fluid loading button" // Ugly, I know. I want to assert 'loading'
      );
    });

    test("Submits Login with email and password", () => {
      //Assert--------------
      expect(submitLogin).toHaveBeenCalledTimes(1); // <- Error. Doesn't get called
      expect(submitLogin).toHaveBeenCalledWith(fakeUser);
    });
  });
});
```

<div class="filename">LoginFormComponent.tsx</div>

```tsx{53}
import React from "react";

import { Formik, FormikProps, Field, FieldProps } from "formik";

import styled from "react-emotion";

import { Button, Form, Grid, Header, Image, Message } from "semantic-ui-react";

import UsernameInput from "../components/UsernameInput";
import PasswordInput from "../components/PasswordInput";

const LoginFormStyles = styled("div")({
  height: "50vh"
});

export interface FormValues {
  email: string;
  password: string;
}

interface ILoginFormProps {
  loginError?: string;
  submitLogin: (credentials: FormValues) => void;
}

export const LoginForm: React.SFC<ILoginFormProps> = ({
  loginError,
  submitLogin
}) => {
  return (
    <LoginFormStyles className="login-form">
      {loginError && (
        <Message negative>
          <Message.Header>Your login was unsuccessful</Message.Header>
          <p>Your username or password is invalid.</p>
        </Message>
      )}

      <Grid
        verticalAlign="middle"
        textAlign="center"
        style={{ height: "100%" }}
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Image inline={false} size="big" src="https://img.png" />
          <Header as="h2" color="blue" textAlign="center">
            Log-in to Lender Dealer Mapping Tool
          </Header>
          // Formik form starts here ========================================
          <Formik
            initialValues={{ email: "", password: "" }}
            onSubmit={(formValues: FormValues) => {
              submitLogin(formValues); // <--- This is where the submitLogin mock should be called
            }}
            render={(formikProps: FormikProps<FormValues>) => {
              return (
                <Form onSubmit={formikProps.handleSubmit}>
                  <Field
                    name="email"
                    render={(fieldProps: FieldProps<FormValues>) => {
                      return <UsernameInput {...fieldProps.field} />;
                    }}
                  />
                  <Field
                    name="password"
                    render={(fieldProps: FieldProps<FormValues>) => {
                      return <PasswordInput {...fieldProps.field} />;
                    }}
                  />
                  <Button
                    type="submit"
                    color="facebook"
                    fluid
                    size="large"
                    loading={formikProps.isSubmitting && !loginError}
                  >
                    Login
                  </Button>
                </Form>
              );
            }}
          />
        </Grid.Column>
      </Grid>
    </LoginFormStyles>
  );
};

export default LoginForm;
```

## Solution

Jest was completing the test without waiting for the Formik component to call its own onSubmit.

react-testing-library has a [wait API](https://github.com/kentcdodds/react-testing-library#wait)

```js
test("Submits Login with email and password", async () => {
  //Assert--------------
  await wait(() => {
    expect(submitLogin).toHaveBeenCalledTimes(1);
    expect(submitLogin).toHaveBeenCalledWith(fakeUser);
  });
});
```
