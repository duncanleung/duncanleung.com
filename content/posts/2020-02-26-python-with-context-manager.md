---
date: 2020-02-15
title: Using Python with Context Manager
template: post
thumbnail: "../thumbnails/python.png"
slug: python-with-context-manager
categories:
  - Python
tags:
  - python
---

Opening a file would look something like this:
you always want to call close() on your open file object once you’re done with it, so that your program doesn’t leave open file handles dangling
program exits or crashes before you can close a file
remembering to close()

Context managers can contain code that auto-magically provisions a resource before your code runs, and cleans up afterward
wrapper around a block of code that depends on some resource
safer way of handling resources
close your file for you, even if your code hits an exception inside the context manager

```python
# Open a file for reading
>>> my_file = open("my_file.txt")

# Open a file for reading or writing
# This will replace any existing file
>>> my_file = open("my_file.txt", "w")

# Open a file for reading or writing
# This will append to the end of any existing file
>>> my_file = open("my_file.txt", "a")
```

```python
>>> with open("my_file.text") as my_file:
...     contents = my_file.read()
```
