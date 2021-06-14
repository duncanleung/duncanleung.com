---
date: 2020-05-05
title: Switch the AWS Profile for Serverless CLI
template: post
thumbnail: "../thumbnails/serverless.png"
slug: use-multiple-aws-profiles-aws-cli-serverless
categories:
  - Serverless
tags:
  - serverless
  - aws-cli
---

Some useful commmands you will need to build your goloang binary and deploy to aws-ec2

### build golang

```
$ GOOS=linux GOARCH=amd64 go build -o [binary-name]
```

- type `go env` to check your environment variables
- `GOOS` stands for Go OS, depends on what ec2 machine you rent, you might have different os setting
- `GOARCH` stands for Go Archetecture
- `-o` only allowed when compiling a single package, define the name of output file

### securely copy binary to ssh machine

```
$ scp -i /path/to/[your].pem [binary-name] ubuntu@[public-DNS]:/home/ubuntu/[binary-name]
```

- `scp` stands for secure copy
- `-i` stands for identity
- `:` for root folder or `:/home/ubuntu/[binary-name]` for more complex routes

### setup services for the machin

#### ssh login

```
$ ssh -i /path/to/[your].pem ubuntu@[public-DNS]
```

#### Change mode of file to 700

```
$ sudo chmod 700 [name-of-binary-file]
```

#### create service

```
$ sudo nano /etc/systemd/system/[filename].service
```

as following

```
  [Unit]
  Description=Go Server

  [Service]
  ExecStart=/home/<username>/<path-to-exe>/<exe>
  WorkingDirectory=/home/<username>/<exe-working-dir>
  User=root
  Restart=always

  [Install]
  WantedBy=multi-user.target
```

#### control the service

- Add the service to systemd.
  - `sudo systemctl enable [filename].service`
- Activate the service.
  - `sudo systemctl start [filename].service`
- Check if systemd started it.
  - `sudo systemctl status [filename].service`
- Stop systemd if so desired.
  - `sudo systemctl stop [filename].service`

=======================

# Deploying our session example

1. change your port number from 8080 to 80

1. create your binary

- GOOS=linux GOARCH=amd64 go build -o [some-name]

1. SSH into your server

- ssh -i /path/to/[your].pem ubuntu@[public-DNS]:

1. create directories to hold your code

- for example, "wildwest" & "wildwest/templates"

1. copy binary to the server

1. copy your "templates" to the server

- scp -i /path/to/[your].pem templates/\* ubuntu@[public-DNS]:/home/ubuntu/templates

1. chmod permissions on your binary

1. Run your code

- sudo ./[some-name]
- check it in a browser at [public-IP]

# Persisting your application

To run our application after the terminal session has ended, we must do the following:

1. Create a configuration file
   - sudo nano /etc/systemd/system/`<filename>`.service

```
[Unit]
Description=Go Server

[Service]
ExecStart=/home/<username>/<path-to-exe>/<exe>
WorkingDirectory=/home/<username>/<exe-working-dir>
User=root
Group=root
Restart=always

[Install]
WantedBy=multi-user.target
```

1. Add the service to systemd.
   - sudo systemctl enable `<filename>`.service
1. Activate the service.
   - sudo systemctl start `<filename>`.service
1. Check if systemd started it.
   - sudo systemctl status `<filename>`.service
1. Stop systemd if so desired.
   - sudo systemctl stop `<filename>`.service

# FOR EXAMPLE

```
[Unit]
Description=Go Server

[Service]
ExecStart=/home/ubuntu/cowboy
WorkingDirectory=/home/ubuntu
User=root
Group=root
Restart=always

[Install]
WantedBy=multi-user.target
```
