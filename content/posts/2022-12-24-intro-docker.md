---
date: 2022-12-24
title: Intro to Docker
template: post
thumbnail: "../thumbnails/docker.png"
slug: intro-to-docker
categories:
  - Docker
tags:
  - docker
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
$ nvm install <node_version>      // Install a specific version
$ nvm install --lts               // Install the latest LTS release
$ nvm install-latest-npm          // Install latest NPM release only
```

## List Available Releases

```
$ nvm ls-remote
$ nvm ls-remote | grep -i "latest"
$ nvm ls-remote | grep -i "<node_version>"
```

## List Installed Versions

```
$ nvm ls
```

## Switch to a Version

```
$ nvm use <node_version_or_alias>  // Switch to a specific version
$ nvm use --lts                    // Switch to the latest LTS version
```

## Verifying NodeJS Version

```
$ node -v
$ npm -v
$ nvm -v
```

## Default to a NodeJS Version (Aliasing)

```
$ nvm alias default <node_version>        // Sets the default version on a shell
$ nvm alias <alias_name> <node_version>   // Sets a user-defined alias to a versions 

$ nvm unalias <alias_name>                // Deletes the alias named <alias_name>
```

## Check the Path to the NodeJS Executable

```
$ nvm which <installed_node_version>      // Path to a specific executable
```

## Uninstall a Version of NodeJS

```
$ nvm uninstall <node_version>    // Uninstall a specific version
$ nvm uninstall --lts             // Uninstall the latest LTS release
```