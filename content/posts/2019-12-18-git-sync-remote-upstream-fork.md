---
date: 2019-12-18
title: "Sync a Git Remote Fork with Upstream"
template: post
thumbnail: "../thumbnails/git.png"
slug: git-sync-remote-upstream-fork
categories:
  - Git

tags:
  - git
---

I've been working on open-source projects, which requires forking the open-source repository and making changes locally.

Before opening pull requests, it's important to get the latest version from the original open-source repository, and ensure that there are no conflicts with any of my local changes.

Here are some notes on syncing a fork with the upstream repository.

See: <a href='https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/syncing-a-fork' target='_blank'>GitHub Docs: Syncing a fork</a>

## Set Up an Upstream Remote for a Local Git Repository

Configure a remote `upstream` that points to the upstream (original) repository in Git. This is needed to sync changes you make in a fork with the original repository.

#### 1. Check the remotes for your repository:

```terminal
$ git remote -v

> origin  https://github.com/YOUR_USERNAME/YOUR_FORK.git (fetch)
> origin  https://github.com/YOUR_USERNAME/YOUR_FORK.git (push)
```

#### 2. Specify a new remote, `upstream`, repository:

```terminal
$ git remote add upstream https://github.com/ORIGINAL_OWNER/ORIGINAL_REPOSITORY.git
```

#### 3. Verify the new `upstream` repository has been added to your remotes:

```terminal
$ git remote -v

> origin    https://github.com/YOUR_USERNAME/YOUR_FORK.git (fetch)
> origin    https://github.com/YOUR_USERNAME/YOUR_FORK.git (push)
> upstream  https://github.com/ORIGINAL_OWNER/ORIGINAL_REPOSITORY.git (fetch)
> upstream  https://github.com/ORIGINAL_OWNER/ORIGINAL_REPOSITORY.git (push)

```

## Sync a Fork: Keep it Up-to-Date with the Upstream Repository

#### 1. Check out your fork's local master branch:

```terminal
$ git checkout master

> Switched to branch 'master'
```

#### 2. Fetch the branches and their commits from the upstream repository.

_Commits to `master` will be stored in a local branch, `upstream/master`._

```terminal
$ git fetch upstream

> remote: Counting objects: 75, done.
> remote: Compressing objects: 100% (53/53), done.
> remote: Total 62 (delta 27), reused 44 (delta 9)
> Unpacking objects: 100% (62/62), done.
> From https://github.com/ORIGINAL_OWNER/ORIGINAL_REPOSITORY
>  * [new branch]      master     -> upstream/master
```

#### 3. Merge changes from `upstream/master` into your local `master` branch.

_This syncs your fork's master branch with the upstream repository._

```terminal
$ git merge upstream/master

> Updating a422352..5fdff0f
> Fast-forward
>  README                    |    9 -------
>  README.md                 |    7 ++++++
>  2 files changed, 7 insertions(+), 9 deletions(-)
>  delete mode 100644 README
>  create mode 100644 README.md
```

#### 4. To update your fork on GitHub, you must push your changes.

_Syncing your fork only updates your local copy of the repository._

```terminal
$ git push origin master
```
