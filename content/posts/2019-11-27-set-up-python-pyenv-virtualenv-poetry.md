---
date: 2019-11-27
title: "Setting Up Python: pyenv, pyenv-virtualenv, poetry"
template: post
thumbnail: "../thumbnails/python.png"
slug: set-up-python-pyenv-virtualenv-poetry
categories:
  - Python
tags:
  - python
---

These are steps to install and set up Python on a Mac.

Skip to the sections below:

- [Version Manager: pyenv](#pyenv-python-version-manager)
- [Virtual Environment: pyenv-virtualenv](#pyenv-virtualenv-virtual-environment)
- [Package Manager: poetry](#poetry-package-manager)

Additional reference on alternative choices: [Real Python: An Effective Python Environment](https://realpython.com/effective-python-environment)

## pyenv: Python Version Manager

Docs: [GitHub - pyenv/pyenv](https://github.com/pyenv/pyenv)

A Python Version Manager allows usage of different version of python, and manages which Python to use in the current session, globally, or on a per-project basis.

#### [Prep: Mac OS X]: Install Xcode Command Line Tools

```bash
$ sudo rm -rf /Library/Developer/CommandLineTools

$ xcode-select --install
```

When running Mojave or higher (10.14+) you will also need to install the [additional SDK headers](https://developer.apple.com/documentation/xcode_release_notes/xcode_10_release_notes#3035624):

```bash
$ sudo installer -pkg /Library/Developer/CommandLineTools/Packages/macOS_SDK_headers_for_macOS_10.14.pkg -target /
```

#### Install pyenv

```bash
$ brew update
$ brew install openssl readline sqlite3 xz zlib
$ brew install pyenv
```

### Update .bash_profile or .zshrc

Add `pyenv init` to your shell to enable shims and autocompletion.

Make sure `eval “$(pyenv init -)”` is placed toward the end of the shell configuration file since it manipulates `PATH` during the initialization.

```bash
$ echo -e ‘if command -v pyenv 1>/dev/null 2>&1; then\n  eval “$(pyenv init -)”\nfi’ >> ~/.zshenv
```

Restart your shell so the path changes take effect and begin using pyenv.

```bash
$ exec "$SHELL"
```

### pyenv Workflow Commands

Dosc: [Command Reference](https://github.com/pyenv/pyenv#command-reference)

Make `3.7.4` globally available so there is no messing with our system python:

```bash
$ pyenv versions

$ pyenv install --list
$ pyenv install 3.7.4

$ pyenv global 3.7.4
```

## pyenv-virtualenv: Virtual Environment

Docs: [GitHub - pyenv/pyenv-virtualenv](https://github.com/pyenv/pyenv-virtualenv)

A Python Virtual Environment Manager allows setting different projects with its own set of version dependencies.
When a package is installed in a virtual environment, it is kept in isolation from other Python environments you may have.

### Install pyenv-virtualenv

```bash
$ brew install pyenv-virtualenv
```

### Update .bash_profile or .zshrc

```bash
$ echo 'eval "$(pyenv virtualenv-init -)"' >> ~/.zshenv
```

### pyenv-virtualenv Workflow Commands

Docs: [Command Reference](https://github.com/pyenv/pyenv-virtualenv#usage)

#### Set up a new virtual environment and activate it

```bash
# Create virtual environment
$ pyenv virtualenv 3.7.4 my-env

# Activate virtual environment
$ pyenv activate my-env

# Exit virtual environment
(my-env)$ pyenv deactivate
```

#### Set up new virtual environments within a directory

`pyenv-virtualenv` allows configuring a virtual environment using the `pyenv local` command and have `pyenv-virtualenv` auto-activate the right environments as you switch to different directories

When entering into the directory, `pyenv` will also activate the new-project virtual environment, and will deactivate the virtual environment on exiting the directory.

```bash{8,14,23}
# Set up two new virtual environments, env1 and env2
$ pyenv virtualenv 3.7.4 env1
$ pyenv virtualenv 3.7.4 env2

# Set up the env1 virtual environment in a new directory
$ mkdir proj1
$ cd proj1
$ pyenv local env1
(env1)$ # env1 virtual environment is now active in this directory

# Set up the env2 virtual environment in a new directory
(env1)$ mkdir ../proj2
(env1)$ cd ../proj2
$ pyenv local env2

# Check that the proj2 directory has the env2 virtual environment activated
(env2)$ pyenv versions
  system
  3.7.4
  3.7.4/envs/env2
  3.7.4/envs/env2
  env1
* env2 (set by /Users/duncanleung/proj2/.python-version)
```

#### Check the \$PATH variable

The correct installation should reference the \$PATH from `.../.pyenv/shims/python`.

```terminal
$ which Python
  /Users/MACHINE_NAME/.pyenv/shims/python
```

If the \$PATH is referencing `/usr/bin/python` then `pyenv-virtualenv` needs to be added to the shell in `~/.zshenv` or `~/.bash_profile`.

```terminal
$ which Python
  /usr/bin/python
```

Check the version of python to see if the correct version is being used.

```terminal
$ python --version
  Python 3.7.4
```

If

### Delete an existing virtualenv

```bash{2}
$ pyenv virtualenvs
$ pyenv uninstall env1
```

## Poetry: Package Manager

Docs: [GitHub - poetry](https://github.com/sdispater/poetry)

Package managers work in tandem with virtual environments, isolating the packages you install in one Python environment from another.

Package manager generally create a lock file to act as a snapshot of the precise set of packages installed, including direct dependencies as well as their sub-dependencies.

poetry also creates a `pyproject.toml` file which contains metadata about the project as well as dependency versions.

poetry has a benefit over pipenv because it keeps track of which packages are subdependencies, allowing cleaner uninstalls to also remove dependencies of a package

### Install

Install poetry

```bash
$ curl -sSL https://raw.githubusercontent.com/sdispater/poetry/master/get-poetry.py | python

$ source $HOME/.poetry/env
```

Install tab completions for poetry

```bash
# Bash (macOS/Homebrew)
poetry completions bash > $(brew --prefix)/etc/bash_completion.d/poetry.bash-completion
```

### Update poetry

```bash
poetry self:update
```

### poetry Workflow Commands

Docs: [Command Reference](https://github.com/sdispater/poetry#commands)

Install packages with `poetry add`.

Install dev dependency packages with `poetry add --dev`

```bash
# Install the requests package and its dependencies
$ poetry add requests

# Uninstall the requests package and its dependencies
$ poetry remove requests
```
