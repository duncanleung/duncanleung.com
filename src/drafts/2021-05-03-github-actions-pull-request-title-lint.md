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

# ReadWriter Interface

two interfaces:

- Reader reads some bytes, and returns the number of bytes read.
- Writer does the same, but writes those bytes

Many other packages in the standard library implement either of these such as `http.Response.Body`, `net.Conn`, `os.File`, `bytes.Buffer`, etc...

```go
type Reader interface {
    Read(p []byte) (n int, err error)
}

type Writer interface {
    Write(p []byte) (n int, err error)
}
```

Implementation that is similar to JS

```go
package main

import (
    "os"
    "encoding/json"
)

type Person struct {
    Name string
    Age uint
    Occupation []string
}

func MakeBytes(p Person) []byte {
    b, _ := json.Marshal(p)
    return b
}

func main() {
    gandalf := Person{
        "Gandalf",
        56,
        []string{"sourcerer", "foo fighter"},
    }

    myFile, err := os.Create("output1.json")
    if err != nil {
        panic(err)
    }
    myBytes := MakeBytes(gandalf)
    myFile.Write(myBytes)
}
```

- create a write method for a simple struct
- we want to provide a read and write method, that the data can be stored or loaded
- this way we implement the reader and the writer interface.

```go
type Person struct {
 Id int
 Name string
 Age int
}
```

Reader interface

- The basic construct for reading bytes from a stream is the Reader interface:
- This interface is implemented throughout the standard library by everything from [network connections](https://golang.org/pkg/net/#Conn) to [files](https://golang.org/pkg/os#File) to [wrappers for in-memory slices](https://golang.org/pkg/bytes/#Reader) .
- works by passing a buffer, p, to the Read() method so that we can reuse the same bytes
- instead of returning a byte slice instead of accepting one as an argument - the reader avoids allocating a new byte slice on every Read() call

* Subtle rules - returns an io.EOF error as a normal part of usage when the stream is done - buffer isn’t guaranteed to be filled

```go

type Reader interface {
        Read(p []byte) (n int, err error)
}

```

- take a look at the defenition of the io.Writer interface:
- takes slice of byte as input and return the number of bytes written and an error variable.
- To implement the writer interface we just use the Write method
- use that method we need to transform our struct into a slice of byte
- There are many different formats to store such data. - say that we want to store our data as JSON. - So we need to encode our struct to that format.
- abstration is powerfull, because you can use every package which creates an io.Writer with your package
- your code you don’t have to decide how or where you write your data

```go
type Writer interface {
    Write(p []byte) (n int, err error)
}
```

- usage of io.Writer is the Go-way
- Step 1: transform the struc into slice of byte by using json.Marshal

* Step 2: use the Write method of the io.Writer interface

THIS IS WRONG - DOESNT IMPLEMENT THE SAME SIGNATURE

```go
func (p *Person) Write(w io.Writer) {
 b, _ := json.Marshal(*p)
 w.Write(b)
}
```

- benefit of passing a Writer interface, you can pass _anything_ which implements Write — that is not only a file but a http.ResponseWriter, for example, or stdout os.Stdout, without changing the struct methods.

* passing as parameter readers and writers makes your code more flexible, in part because so many functions use the Reader and Writer interface.

```go
// writes json representation of Person to Writer
func (p *Person) WriteJson(w io.Writer) error {
    b, err := json.Marshal(*p)
    if err != nil {
        return err
    }
    _, err = w.Write(b)
    if err != nil {
        return err
    }
    return err
}
```

```go
package main

import (
    "io"
    "os"
    "encoding/json"
)

type Person struct {
    Name string
    Age uint
    Occupation []string
}


func (p *Person) WriteJson(w io.Writer) error {
    b, err := json.Marshal(*p)
    if err != nil {
        return err
    }
    _, err = w.Write(b)
    if err != nil {
        return err
    }
    return err
}

func main() {
    gandalf := Person{
        "Gandalf",
        56,
        []string{"sourcerer", "foo fighter"},
    }

    myFile, err := os.Create("output2.json")
    if err != nil {
        panic(err)
    }
    gandalf.WriteJson(myFile)
}

```

- Would write to a **File**, http **Response**, a user’s **Stdout**, or even a simple **byte Buffer**; making testing a bit simpler.

* Writer is an interface -
* is a behavior of a data type,
* a predefined method that a type implements.
* Anything that implements the Write() method, then, is considered a writer.

#golang
