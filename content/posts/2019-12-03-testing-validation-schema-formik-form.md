---
date: 2019-12-03
title: Testing ValidationSchema Formik Forms
template: post
thumbnail: "../thumbnails/jest.png"
slug: testing-validation-schema-formik-form
categories:
  - Testing
tags:
  - formik
  - react-testing-library
  - jest
---

## Testing ValidationSchema Formik Forms

I needed to test a form `PersonalInfoForm.tsx` that included a validation schema for field validation, but was running into a warning when I was programatically changing input values with Jest and react-testing-library.

```terminal
Warning: An update to Formik inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

...
...
```

## Problem: Formik Validation and `act(...)`

I was already wrapping the `fireEvent` methods in `act(...)` from react-testing-library, so I wasn't sure what the issue was.

Interestingly, if I removed my `validationSchema`, the warning would go away.

<div class="filename">PersonalInfoForm.test.js</div>

```js{49-56}
import React from 'react';
import { act, RenderResult, fireEvent, wait } from '@testing-library/react';

import PersonalInfoForm from '../PersonalInfoForm';

describe('PersonalInfoForm', () => {

  describe('Form Interaction', () => {
  //Arrange--------------
  // Set up variables accessible in tests
  let wrapper: RenderResult;
  let street1Node: HTMLInputElement;
  let cityNode: HTMLInputElement;
  let stateNode: HTMLInputElement;
  let zipCodeNode: HTMLInputElement;
  let submitButtonNode: HTMLInputElement;
  let handleSubmit: () => void;

      beforeEach(() => {
        handleSubmit = jest.fn();

        const initialValues = {
          city: '',
          monthlyAmount: '',
          moveInDate: '', // MM-DD-YYYY
          state: '',
          street1: '',
          street2: '',
          residenceType: 'RENT' as ResidenceType,
          zipCode: '',
        };

        const props = {
          submitLogin,
          initialValues: initialValues,
          onSubmit: handleSubmit,
        };

        wrapper = render(<PersonalInfoForm {...props} />);

        street1Node = wrapper.getByLabelText(/Address Line 1/) as HTMLInputElement;
        cityNode = wrapper.getByLabelText(/City/) as HTMLInputElement;
        stateNode = wrapper.getByLabelText(/State/) as HTMLInputElement;
        zipCodeNode = wrapper.getByLabelText(/Zip Code/) as HTMLInputElement;
        submitButtonNode = wrapper.getByText('Next') as HTMLInputElement;

        //Act--------------
        // Change the input values
        act(()=> {
          fireEvent.change(street1Node, { target: { value: '1231 Warner Ave' } });
          fireEvent.change(cityNode, { target: { value: 'Tustin' } });
          fireEvent.change(stateNode, { target: { value: 'CA' } });
          fireEvent.change(zipCodeNode, { target: { value: '92780' } });

          fireEvent.click(submitButtonNode);
        });
      });

      test('Submits', () => {
        //Assert--------------
        expect(handleSubmit).toHaveBeenCalledTimes(1);
      });

  });
});

```

<div class="filename">PersonalInfoForm.tsx</div>

```tsx{45-77,107}
import React, { useCallback } from "react";
import { Form, Formik, FormikHelpers, FormikState } from "formik";

import * as Yup from "yup";

import { Button } from "~/components/Button";
import {
  FieldWrapper,
  Input,
  NumberInput,
  StateSelect
} from "~/components/Input";
import { Row, Col } from "~/components/Grid";
import { Box } from "~/components/Box";

import { logger } from "~/utilities";

type Address = {
  city: string;
  state: string;
  street1: string;
  street2: string;
  zipCode: string;
};

type ResidenceMeta = {
  /** format: MM-DD-YYYY */
  moveInDate: string;
  monthlyAmount: string;
  residenceType: ResidenceType;
};

export type FormValues = Address & ResidenceMeta;

type Props = {
  initialValues: FormValues;
  onSubmit: (formValues: FormValues) => void;
  submitButtonText?: string;
};

const addressRegex = /^[a-zA-Z0-9][a-zA-Z0-9 .,-]*$/;
const currentDate = new Date();
const yearRange = 75;

const validationSchema = Yup.object().shape({
  residenceType: Yup.string().required("Required."),
  street1: Yup.string()
    .min(2, "Must be at least ${min} characters.")
    .max(60, "Must be no more than ${max} characters.")
    .matches(
      addressRegex,
      "May only contain hyphens, periods, commas or alphanumeric characters."
    )
    .required("Required."),
  street2: Yup.string()
    .nullable()
    .max(60, "Must be no more than ${max} characters.")
    .matches(addressRegex, {
      excludeEmptyString: true,
      message:
        "May only contain hyphens, periods, commas or alphanumeric characters."
    }),
  city: Yup.string()
    .max(20, "Must be no more than ${max} characters.")
    .matches(
      addressRegex,
      "May only contain hyphens, periods, commas or alphanumeric characters."
    )
    .required("Required."),
  state: Yup.string().required("Required."),
  zipCode: Yup.number()
    // lowest zip code is 00501 https://facts.usps.com/map/#fact147
    .min(501, "Invalid zip code.")
    // highest zip code is 99950 https://facts.usps.com/map/#fact148
    .max(99950, "Invalid zip code.")
    .required("Required.")
});

export const PersonalInfoForm: React.FunctionComponent<Props> = ({
  initialValues,
  onSubmit,
  submitButtonText = "Next",
  ...props
}) => {
  const handleSubmit = useCallback(
    async function submitApi(
      values: FormValues,
      actions: FormikHelpers<FormValues>
    ) {
      actions.setSubmitting(true);

      try {
        onSubmit(values);
      } catch (e) {
        setError(e);
      }

      actions.setSubmitting(false);
    },
    [onSubmit]
  );

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, actions) => handleSubmit(values, actions)}
      validationSchema={validationSchema}
    >
      {({ isSubmitting, setValues, setTouched, values, touched }) => (
        <Form {...props} noValidate>
          <Row form>
            <Col xs={12}>
              <FieldWrapper
                type="text"
                name="street1"
                required
                label="Address Line 1"
                placeholder="Street Name"
                disabled={isSubmitting}
              >
                <Input />
              </FieldWrapper>
            </Col>
          </Row>

          <Row form>
            <Col xs={12}>
              <FieldWrapper
                type="text"
                name="street2"
                label="Address Line 2"
                placeholder="Apt, Suite, Bldg #"
                disabled={isSubmitting}
              >
                <Input />
              </FieldWrapper>
            </Col>
          </Row>

          <Row form>
            <Col xs={6}>
              <FieldWrapper
                type="text"
                name="city"
                label="City"
                placeholder="City"
                disabled={isSubmitting}
                required
              >
                <Input />
              </FieldWrapper>
            </Col>
            <Col xs={6}>
              <FieldWrapper
                name="state"
                label="State"
                placeholder="State"
                disabled={isSubmitting}
                required
              >
                <StateSelect />
              </FieldWrapper>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <FieldWrapper
                name="zipCode"
                label="Zip Code"
                placeholder="12345"
                disabled={isSubmitting}
                maxLength={5}
                required
              >
                <NumberInput />
              </FieldWrapper>
            </Col>
          </Row>

          <Box>
            <Button disabled={isSubmitting} type="submit">
              submitButtonText
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default PersonalInfoForm;
```

## Solution

[In the Formik source code](https://github.com/jaredpalmer/formik/blob/master/src/Formik.tsx#L516-L546), `setValues` and `setFieldValues` both use the hook `useEventCallback`. Formik validation is async, and so `useEventCallback` returns a `Promise`.

Because our form has validation as defined by the `validationSchema`, the test and `act(...)` needs to `await` on the promise to resolve.

<div class="filename">Formik.tsx - Line: 516-546</div>

```ts{5}
const setValues = useEventCallback((values: Values) => {
    dispatch({ type: 'SET_VALUES', payload: values });
    return validateOnChange
      ? validateFormWithLowPriority(state.values)
      : Promise.resolve();
```

So back in the test file `PersonalInfoForm.test.js`, we need to `await` on `act(...)` so that the async validations can resolve:

<div class="filename">PersonalInfoForm.test.js</div>

```js{7,14}
describe("Form Interaction", async () => {
  //...
  //...

  //Act--------------
  // Change the input values
  await act(async () => {
    fireEvent.change(street1Node, { target: { value: "1231 Warner Ave" } });
    fireEvent.change(cityNode, { target: { value: "Tustin" } });
    fireEvent.change(stateNode, { target: { value: "CA" } });
    fireEvent.change(zipCodeNode, { target: { value: "92780" } });

    fireEvent.click(submitButtonNode);
  });
});
```
