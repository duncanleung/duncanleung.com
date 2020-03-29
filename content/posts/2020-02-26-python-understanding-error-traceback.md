---
date: 2020-02-15
title: Understanding the Python Error Traceback
template: post
thumbnail: "../thumbnails/python.png"
slug: python-understanding-error-traceback
categories:
  - Python
tags:
  - python
---

reading from the bottom up

- First, we’ll see the exception that was thrown, along with its class ValueError.
- Next, we’ll see the code that caused the Exception.
- One line up from that, we’ll see the path and the file the exception originated in, as well as the line number to look on.

```terminal
Traceback (most recent call last):
  File ".../example/exceptions.py", line 2, in <module>
    int("abc")
ValueError: invalid literal for int() with base 10: 'abc'
```

---

Using `as` to Access The Exception

assign a label to the exception
exception will be assigned to the variable you specified
log out the error message

<div class="filename">example.py</div>

```python
try:
    int("a")
except ValueError as error:
    print(f"Something went wrong. Message: {error}")

print("Reached end of the program.")
```

```terminal
(env) $ python exceptions.py
Something went wrong. Message: invalid literal for int() with base 10: 'a'
Reached end of the program.
```

---

Using try and except to catch Exceptions

<div class="filename">example.py</div>

```python
try:
    int("a")
except ValueError:
    print("Oops, couldn't convert that value into an int!")

print("Reached end of the program.")
```

```terminal
(env) $ python exceptions.py
Oops, couldn't convert that value into an int!
Reached end of the program.
```
