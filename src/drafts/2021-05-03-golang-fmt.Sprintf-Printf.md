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

## fmt.Sprintf()

- creates a clear code that neatly divides what is (relatively) constant from what is variable
- avoiding a verbose string concatenations

* provide a format string and list of arguments (i.e., variables and/or values)

```go
myString := fmt.Sprintf("Results: %s and more: %s.", results, more)
```

## verbs

- for formatting many variable types and ways of precisely adjusting the formatting

* %v
* formats any variable type and formats it in the default style for that type
* not as precise about what it does
* experimenting, and debugging

```go
a := 5
b := "Hello"
c := false
fmt.Printf("%v %v %v", a, b, c) // prints: 5 Hello false
```

- %s
- formats string
- doesn’t interpret the string

```go
a := "strömmar"
fmt.Printf("Don't cross the %s\n", a)
// prints: Don't cross the strömmar
```

- %q
- formats values (i.e., arguments) with quotes
- need quoted and quote-escaped values

```go
a := "Hello"
b := 5
c := "6"
d := `"Hello"`
fmt.Printf("%q %q %q %q", a, b, c, d)
// prints: "Hello" '\x05' "6" "\"Hello\""
```

- %d
- formats base-10 integer number

```go
a := 5
b := 4815162342
fmt.Printf("%d %d", a, b)
// prints: 5 4815162342
```

- %t
- formats boolean value

```go
a := true
b := !a
fmt.Printf("%t %t", a, b)
// prints: true false
```

## Argument Index

- `%[<argument index>]<verb>`
- `%[1]d` and `%[2]q`

```go
red := "Red"
orange := "Orange"
blue := "Blue"
fmt.Printf("%[1]s %[3]s %[2]s\n", red, orange, blue)
// prints: Red Blue Orange
// value list = red, orange, blue
// %[1]s refers to 1st value in the list, red
// %[3]s refers to 3rd value in the list, blue
// %[2]s refers to 2nd value in the list, orange
```

- include arguments only once in the list and, if necessary, refer to the value multiple times

```go
a := "Do"
b := "De"
c := "Da"
fmt.Printf("%[2]s %[1]s %[1]s %[1]s, %[2]s %[3]s %[3]s %[3]s\n", a, b, c)
// prints: De Do Do Do, De Da Da Da
```
