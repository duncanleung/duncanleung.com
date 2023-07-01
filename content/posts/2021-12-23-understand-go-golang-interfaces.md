---
date: 2021-12-23
title: Understanding Interfaces in Go
template: post
thumbnail: "../thumbnails/go.png"
slug: understand-go-golang-interfaces
categories:
  - Go (Golang)
tags:
  - backend
---

## Interfaces

In programming languages, interfaces act as a contract that enables decoupling of types and help create more maintainable programs.

In Go, interfaces allow for polymorphism and provide a way to work with abstract types by just knowing about that type's behavior. This is called "Duck Typing"

**_If it walks like a duck and quacks like a duck, then it must be a duck._**

Do note that interfaces in Go differ from interfaces in other languages. In Go, interfaces only describe the expected behavior of a type - this means that Go interfaces are an abstract type and don't actually have any implementation.

### An Analogy for Go Interfaces

I really appreciated this analogy to understand Go interfaces - **A wall power socket and the electrical devices it allows to connect.**

<iframe width="560" height="315" src="https://www.youtube.com/embed/qJKQZKGZgf0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<br /><br />

Consider a wall power socket and some electrical devices that need electricity.

The amazing flexibility of a power socket is that it just "works" as long as an electrical device's plug shape fits. The power socket doesn't need to know anything about the electrical device connected to it.

This allows any electrical device to:

**1 ) Plug in** </br>
**2 ) Draw power**

For a power socket and an electrical device to work together, there needs to be a common contract between them - **this contract is the shape of the plug.**

**_In Go, this common "plug" shape is a Go interface._**

```
Wall power socket
 +---+
 || ||
 +---+


Electrical devices with a common "plug" shape

  _-_
 '---'                ___________
 |   |               |  .----.  o|
 |   |               | |      | o|
  \_/________        | |      | o|_________
 .'='.        )      |__`----`___|         )
 /o o\       /        `         `         /
'-----'  =D-'                         =D-'
```

Let's codify these statements. In this scenario, we have:

- The electrical device types
- A wall power socket type

There also needs to be:

- A common "way" (method) for each electrical device to draw power from the power socket.
- A common "plug shape" (Go interface) to describe how each electrical device can plug into to a power socket.

### The electrical devices

To start off, we can think about the electrical devices: a **blender** and a **microwave**.

To represent our electrical devices, we could use the following structs and struct instances:

```go{2,3}
// The type of electrical devices
type Blender struct{}
type Microwave struct{}

// The instances of these devices
var blender Blender
var microwave Microwave
```

Each electrical device should also able to draw power from the power socket.

To represent the behavior of drawing power, we could use the receiver functions:

- `func (b Blender) Draw(power int)`
- `func (m Microwave) Draw(power int)`

#### Receiver Functions

In Go, function receivers allow us to set a method on variables without having to deal with classes or inheritance:

```go{5,10}
type Blender struct{}
type Microwave struct{}

// Draw(power int) receiver function for the Blender type
func (b Blender) Draw(power int) {
        ^^^^^^^
}

// Draw(power int) receiver function for the Microwave type
func (m Microwave) Draw(power int) {
        ^^^^^^^^^
}
```

Any struct instances created from the `Blender` and `Microwave` types have access to a `Draw(power int)` method.

```go{6-7}
// The instances of these devices
var blender Blender
var microwave Microwave

// The instances of these devices have access to the method Draw(power int)
blender.Draw(40)
microwave.Draw(50)
```

### The wall outlet

To represent a wall power socket, we could use the following struct and struct instance:

```go{2}
// The type of the power socket
type PowerSocket struct {}

// The wallOutlet instance of the power socket
var wallOutlet PowerSocket
```

We also need to consider that a wall power socket has a finite power output.

Let's add a property `powerCapacity` to the `PowerSocket` struct to describe the maximum power out that an outlet can support.

```go{3}
// Socket has a max power capacity
type PowerSocket struct {
	powerCapacity int
}

wallOutlet := &PowerSocket{100}
```

#### Plugging in each electrical device

To represent the behavior of plugging in the `blender` into the `wallOutlet`, we could use a receiver function:

- `func (s *PowerSocket) PlugInBlender(blenderDevice Blender)`.

```go{2}
// PowerSockets can plug in any Blender
func (s *PowerSocket) PlugInBlender(blenderDevice Blender) error {
                      ^^^^^^^^^^^^^               ^^^^^^^
}

// The action of plugging in the blender instance
wallOutlet.PlugInBlender(blender)
```

However, this approach isn't very "universal". **This requires us to write another specific function to plug in other types of devices.**

The function `PlugInBlender(blenderDevice Blender)` only plugs in devices of type `Blender`, so to plug in the `microwave` into the `wallOutlet`, we need to create another function `func (s *PowerSocket) PlugInMicrowave(microwaveDevice Microwave)`.

```go{2}
// Plug in a Microwave to draw power from the PowerSocket
func (s *PowerSocket) PlugInMicrowave(microwaveDevice Microwave) error {
                      ^^^^^^^^^^^^^^^                 ^^^^^^^^^
}

// The action of plugging in the microwave instance
wallOutlet.PlugInMicrowave(microwave)
```

### Declaring the Appliance Interface: A common plug shape

In reality, a power socket can plug in any type of electrical device as long as it has the same "plug shape".

We want to describe a common "plug shape" so the power socket can support any type of electrical device - we could say, a general `Appliance` type.

**_In Go, this common "plug" shape is a Go interface._**

To declare an interface in Go, we describe the set of method signatures that should be implemented.

```go{2,4}
// Appliance represents an electrical device that can draw power.
type Appliance interface {
               ^^^^^^^^^
	Draw(power int)
}
```

The goal of declaring the `Appliance` interface type is to write a generalized `PlugIn(appliance Appliance)` receiver function for the `PowerSocket` type, to:

- Accept any devices that implement this `Appliance` interface type
- Allow all `Appliance` types to draw power from the power socket in a defined way

```go{2,6,7}
// Plug in any Appliance device to the power socket
func (s *PowerSocket) PlugIn(appliance Appliance) error {
                      ^^^^^^           ^^^^^^^^^
}

wallOutlet.PlugIn(blender)
wallOutlet.PlugIn(microwave)
```

### Implementing an Interface

#### A Note on Duck Typing

Go interfaces use "duck typing". Duck typing determines a "match" by looking at the behavior of the thing:

**_If it walks like a duck and quacks like a duck, then it must be a duck._**

For Go interfaces - Go determines that a struct "implements an interface" when the necessary function signatures exist on that struct.

If a device struct implements the `Draw(power int)` function signature, then it is considered to satisfy the `Appliance` interface.

#### I. Declare an Interface:

To declare an interface in Go, we describe the set of method signatures that should be implemented by a struct:

- Here, we declare a type `Appliance` interface.
- The `Appliance` interface implements the function signature, `Draw(power int)`.

```go{3}
// Appliance represents an electrical device that can draw power.
type Appliance interface {
	Draw(power int)
  ^^^^^^^^^^^^^^
}
```

#### II. Implement the `Appliance` interface:

To implement an interface, a struct needs implement the function signature of the interface.

- The two structs `Blender` and `Microwave` are said to **_"implement the `Appliance` interface"_** because their structs implement the `Draw(power int)` function signature.

```go{3,10,17}
// Appliance represents an electrical device that can draw power.
type Appliance interface {
	Draw(power int)
  ^^^^^^^^^^^^^^
}

type Blender struct{}
// The `Appliance` type is implemented because
// Blender struct implements the Draw(power int) function signature.
func (b Blender) Draw(power int) {
                 ^^^^^^^^^^^^^^
}

type Microwave struct{}
// The `Appliance` type is implemented because
// Microwave struct implements the Draw(power int) function signature.
func (m Microwave) Draw(power int) {
                   ^^^^^^^^^^^^^^
}
```

- The structs `Blender` and `Microwave` types implement the `Appliance` interface.
- The receiver function `func (s *PowerSocket) PlugIn(appliance Appliance)` can now be used on any type that implements the `Appliance` interface.

```go{2,22,26}
// Plug in any Appliance device to the power socket
func (s *PowerSocket) PlugIn(appliance Appliance) error {
                                       ^^^^^^^^^

  if s.powerCapacity <= 0 {
    return errors.New("PowerSocket has no capacity left")
  }

  powerToDraw := 10 // Let's say each device draws 10 units of power
  if s.powerCapacity < powerToDraw {
    return errors.New("PowerSocket does not have enough capacity for this appliance")
  }

  appliance.Draw(powerToDraw)
  s.powerCapacity -= powerToDraw
  fmt.Printf("PowerSocket capacity after plug in: %d\n", s.powerCapacity)

  return nil
}

// PlugIn a struct type `Blender` that implements the Appliance interface
wallOutlet.PlugIn(blender)
                  ^^^^^^^

// PlugIn a struct type `Microwave` that implements the Appliance interface
wallOutlet.PlugIn(microwave)
                  ^^^^^^^^^
```

By declaring and using the `Appliance` interface, the power socket just "works".

Any `PowerSocket` type can now accept all devices that implement the `Appliance` interface.

### The Power of Go Interfaces

The flexibility we gain from Go interfaces is that the power socket can now provide power to any `Appliance` type.

A power socket can power any device as long as the device has a `Draw(power int)` method.

```go{7}
type Refrigerator struct{}
func (r Refrigerator) Draw(power int) {
}

var refrigerator Refrigerator

wallOutlet.PlugIn(refrigerator)
```
