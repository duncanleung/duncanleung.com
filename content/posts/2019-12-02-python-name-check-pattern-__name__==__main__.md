---
date: 2019-12-02
title: "What is, if __name__ == “__main__”:"
template: post
thumbnail: "../thumbnails/python.png"
slug: python-name-check-pattern-__name__==__main__
categories:
  - Python
tags:
  - python
---

I primarily work in JavaScript, and I was confused about this common `__name__` check pattern at the bottom of many python files.

<div class="filename">script.py</div>

```python
# Module code here
...
...

if __name__ == "__main__":
  # some conditional code that usually runs the module's code directly
```

## The `__name__` Check Pattern: `if __name__ == “__main__”:`

The `__name__` check provides flexibility to allow `.py` script files to be run in two modes:

- Run the script as the main program itself.
- Run the script as an imported module by another program.

This is a useful pattern for:

- Allow a library module to be run in script mode. Usually for running unit tests or a demo.
- Allows a main program script to include additional APIs for special use cases.

## Background: The Python Interpreter

### Setting up Special Variables

When the Python interpreter reads a source file, it:

- Sets a few special variables. One of these is `__name__`.
- Executes all of the code found in the file.

## Running Python Code

There are two ways that `.py` files are run:

1. Run as the main file

2. Imported as a module from another file

To illustrate this, we have two example python files:

- `utils.py`
- `main.py`

<div class="filename">utils.py</div>

```python
def func():
    print("func() in utils.py")

print("top-level in utils.py")

if __name__ == "__main__":
    print("utils.py is being run directly")
else:
    print("utils.py is being imported into another module")
```

<div class="filename">main.py</div>

```python
import utils

print("top-level in main.py")
utils.func()

if __name__ == "__main__":
    print("main.py is being run directly")
else:
    print("main.py is being imported into another module")
```

### 1. When Your `utils.py` Module Is the Main Program

If you are running your module (the source file) as the main program, e.g.

```terminal
$ python utils.py

top-level in utils.py
utils.py is being run directly
```

The interpreter will assign the hard-coded string `"__main__"` to the `__name__` variable, and the corresponding conditional block will run.

<div class="filename">utils.py</div>

```python{9-10}

# It's as if the interpreter inserts this at the top
# of your module when run as the main program.
__name__ = "__main__"
...
...



if __name__ == "__main__":
    print("utils.py is being run directly")
else:
    print("utils.py is being imported into another module")
```

### 2. When Your Module Is Imported By Another Program

If you are running your module as an import from another program, e.g.

```terminal
$ python main.py

top-level in utils.py
utils.py is being imported into another module
top-level in main.py
func() in utils.py
main.py is being run directly
```

The interpreter will assign the name you import the module by (e.g. `"utils"`) to the `__name__` variable.

<div class="filename">utils.py</div>

```python{11-12}

# It's as if the interpreter inserts this at the top
# of your module when run as the main program.
__name__ = "utils"
...
...



if __name__ == "__main__":
    print("utils.py is being run directly")
else:
    print("utils.py is being imported into another module")
```
