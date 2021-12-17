---
date: 2021-12-16
title: "Recover from a git push --force"
template: post
thumbnail: "../thumbnails/git.png"
slug: recover-accidental-git-push-force
categories:
  - Git

tags:
  - git
---

I was collaborating with a teammate on the same feature branch and wanted to `git rebase` update the branch with `develop`.

```bash
// Trying to rebase update our branch with develop

$ git checkout develop
$ git pull

$ git checkout feature/our-collab-branch
$ git rebase develop
$ git push --force
```

I then realized that there were changes I hadn't pulled from `origin feature/our-collab-branch`, and I had accidentally overwritten my teammate's commits with the `git push --force`.

Yipes!

## Recovering from an accidental git push --force

Fortunately git doesn't discard commits even with a `git push --force`.
Since we still had the original branch in our remote, none of the commits are actually lost.

We can use `git reflog show` to show the reference logs (hence, "reflog"), which is a record of the recent actions when the tips of the branches were updated.

After we get the SHA-1 checksum of the commit before our `git push --force`, we can recreate the branch and push the branch back to the remote.

```bash
// Show the reference logs
$ git reflog show remotes/origin/feature/our-collab-branch

971cf78 (HEAD -> feature/our-collab-branch, origin/feature/our-collab-branch) remotes/origin/feature/our-collab-branch@{0}: update by push
7138c46 remotes/origin/feature/our-collab-branch@{1}: update by push

// Recreate the feature/our-collab-branch branch
$ git checkout 7138c46
$ git branch -D feature/our-collab-branch

$ checkout -b feature/our-collab-branch
$ git push origin HEAD --force
```

Whew! Now we've restored the branch to the state before my `git push --force`
