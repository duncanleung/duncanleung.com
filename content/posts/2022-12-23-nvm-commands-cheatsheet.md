---
date: 2022-12-23
title: NVM Commands Cheatsheet
template: post
thumbnail: "../thumbnails/node.png"
slug: nvm-commands-cheatsheet
categories:
  - NodeJS
tags:
  - nodejs
---

## Node Version Manager (NVM)

Node Version Manager (NVM) is a handy bash script to manage multiple active Node.js versions.


## Install NVM with Brew

I find the easiest way to get started is with Brew.

```
$ brew install nvm
```

And every so often, it's handy to update Brew, as well as upgrading the installed brew packages.

```
$ brew update && brew upgrade && brew cleanup
```

## Install a Version of NodeJS

```
$ nvm install <node_version>      // Install a specific NodeJS version
$ nvm install --lts               // Install latest LTS release of Node
$ nvm install-latest-npm          // Install latest NPM release only
```

## List Available NodeJS Releases for Download

```
$ nvm ls-remote
$ nvm ls-remote | grep -i "latest"
$ nvm ls-remote | grep -i "<node_version>"
```

## List Installed NodeJS Versions

```
$ nvm ls                          // Lists installed NodeJS versions with additional release info
```

## Switch a NodeJS Version

```
$ nvm use <node_version_or_alias>  // Switch to a specific version
$ nvm use --lts                    // Switch to the latest LTS NodeJS version
```

## Verifying NodeJS Version

```
$ node -v
$ npm -v
$ nvm -v
```

## Default to a NodeJS Version (Aliasing)

```
$ nvm alias default <node_version>        // Set default NodeJS version on a shell
$ nvm alias <alias_name> <node_version>   // Set user-defined alias to NodeJS versions 

$ nvm unalias <alias_name>                // Deletes the alias named <alias_name>
```

## Check the Path to the NodeJS Executable

```
$ nvm which <installed_node_version>      // path to a specific NodeJS executable
```

## Uninstall a Version of NodeJS

```
$ nvm uninstall <node_version>    // Uninstall a specific NodeJS version
$ nvm uninstall --lts             // Uninstall the latest LTS release of Node
```