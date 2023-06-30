---
date: 2023-06-28
title: Methods in Go
template: post
thumbnail: "../thumbnails/go.png"
slug: methods-in-go
categories:
  - Go (Golang)
tags:
  - backend
---

## Methods

In Go, methods are functions that are attached to a type.

Here, we have a type called `Coordinates` and we have a method called `Move` that is attached to the `Coordinates` type.

```go
type Coordinates struct {
	X int
	Y int
}

func (i Coordinates) Move(x, y int) {
	i.X = x
	i.Y = y
}

func main() {
	i := Coordinates{
		Y: 10,
		X: 20,
	}
	fmt.Printf("i: %#v\n", i)

	i.Move(100, 200)
	fmt.Printf("i (move): %#v\n", i)
}
```

However, there is a small bug.

```bash
i: main.Coordinates{X:20, Y:10}
i (move): main.Coordinates{X:20, Y:10}
```

The `Move` method is not actually changing the value of `i`. This is because Go passes everything by value - that includes receivers.

To fix this, the method needs to be a pointer receiver.

```go
func (i *Coordinates) Move(x, y int) {
	i.X = x
	i.Y = y
}
```

```bash
i: main.Coordinates{X:20, Y:10}
i (move): main.Coordinates{X:100, Y:200}
```

When considering whether to use a pointer receiver or a value receiver, consider the following:

- Do I want to share the value (allows mutating the value)?
- Or should everyone have their own copy?

### A rule of thumb is:

Value Receiver:

- If using types that are like built in types (int, string, etc) use value receiver.
- If using your own types and they're not going to change, use value receiver.

Pointer Receiver:

- If using your own types and they're going to change, use pointer receiver.

However, it is recommended for consistency to use either pointer or value receivers for all methods on a type.

## Embedding

Go uses embedding to compose types together in a powerful yet simple way.

Embedding promotes simplicity and clarity in structuring code via composition. Inheritance, especially multiple inheritance, can lead to complex hierarchies and relationships between classes that are often difficult to understand and maintain.

Embedding also allows a struct to "borrow" fields and methods of another struct via composition. This means modifying or extend behavior can be done without modifying the original struct.

Here we define a `Player` type that has a `Name` and also embeds the `Coordinates` field. This means that the `Player` type will have access to the `Move` method.

It is important to clarify that embedding is not inheritance. The `Player` type does not inherit the `Move` method, it just has access to it.

```go
type Player struct {
	Name string
	Coordinates // embedded
}

func main() {
	p1 := Player {
		Name: "Player 1",
		Coordinates: Coordinates{
			X: 10,
			Y: 20,
		},
	}

	fmt.Printf("p1: %#v\n", p1)

	p1.Move(100, 200)
	fmt.Printf("p1: %#v\n", p1)
}
```

```bash
p1: main.Player{Name:"Player 1", Coordinates:main.Coordinates{X:10, Y:20}}
p1: main.Player{Name:"Player 1", Coordinates:main.Coordinates{X:100, Y:200}}
```

## Interfaces

If we want to define a function that can be used by multiple types, we can use an interface. An interface is a set of method signatures and if a type implements all the methods in the interface, then it is said to implement the interface.

```go
func moveAll(ms []mover, x, y int) {
	for _, m := range ms {
		m.Move(x, y)
	}
}
```

Here the function `moveAll` takes a slice of `mover` types and calls the `Move` method on each one. This means all the values in the slice must implement the `Move` method. In Go, we do this by defining an interface that has a single method called `Move`.

Note that in Go, the powerful thing about interfaces is that it defines what we need, not what we provide, so we can implement an interface without explicitly declaring it. If a type has all the methods defined in an interface, then it implements the interface.

In this case, the interface `mover` states that "I want something we can `Move()`". Now any type that has a `Move` method will implement the `mover` interface.

```go
type mover interface {
	Move(x, y int)
}
```

Because `i Coordinates` and `p Player` both have a `Move` method, they both implement the `mover` interface, and therefore can be passed into the `moveAll` function.

```go
func main() {
	i := Coordinates{
		Y: 10,
		X: 20,
	}

	p := Player {
		Name: "Player 1",
		Coordinates: Coordinates{
			X: 10,
			Y: 20,
		},
	}

	ms := []mover{
		&i,
		&p,
	}

	moveAll(ms, 100, 200)
}
```
