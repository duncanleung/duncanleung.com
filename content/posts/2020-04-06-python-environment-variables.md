---
date: 2020-04-06
title: Load Python Environment Variables
template: post
thumbnail: "../thumbnails/python.png"
slug: load-python-environment-variables-dotenv
categories:
  - Python
tags:
  - python
---

Declare persistent environment variables in Python virtual environments with [`python-dotenv`](https://pypi.org/project/python-dotenv/).

`python-dotenv` allows specifying environment variables in `.env` (dot-env) files.

### 1. Create a .env file

<div class="filename">.env</div>

```
CLIENT_ID="duncan-1234509876"
CLIENT_SECRET="duncan-xxxxxxxxxxxxxxxx"
```

### 2. Import and Call python-dotenv

<div class="filename">print_env.py</div>

```python
# Import load_dotenv from dotenv
from dotenv import load_dotenv

# Run load_dotenv() to make the .env file accessible as your source of environment variables
load_dotenv()
```

### 3. Access the Environment Variables

<div class="filename">print_env.py</div>

```python
from dotenv import load_dotenv
import os

load_dotenv()

client = os.getenv("CLIENT_ID")
secret = os.getenv("CLIENT_SECRET")

def print_env():
    print(f'Client id: {client}')
    print(f'Secret id: {secret}')

if __name__ == "__main__":
    print_env()
```
