---
date: 2021-06-30
title: Find and Kill Process on Port 3000
template: post
thumbnail: "../thumbnails/bash.png"
slug: find-kill-process-port-3000-mac
categories:
  - macOS
tags:
  - macos
  - process
---

I was running into an issue running my React app locally where the default port was previously used and unreleased.

```terminal
❯ yarn dev
yarn run v1.22.10


Port 3000 is already in use.
```

You may also see a similar `EADDRINUSE` error if a node processes is trying to use an occupied port:

```terminal
Error: listen EADDRINUSE: address already in use :::3000
```

## Solution

We can find and kill the process running on port `tcp:3000` with the command:

(I am running macOS Big Sur 11.4).

```bash
$ lsof -t -i tcp:3000 | xargs kill
```

- `lsof`: List open files
- `-t`: Terse output with process identifiers only (output can be piped)
- `i`: Selects the listing of files where the address matches
- `tcp:3000`: The address at TCP port 3000
- `|`: Pipe the output on the left to the command on the right
- `xargs`: Build and execute lines
- `kill`: Kill a process by PID
