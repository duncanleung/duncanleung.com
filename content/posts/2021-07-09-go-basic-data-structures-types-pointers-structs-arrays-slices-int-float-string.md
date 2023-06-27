---
date: 2021-07-09
title: Basic Data Structures in Go
template: post
thumbnail: "../thumbnails/go.png"
slug: go-basic-data-structures-types-pointers-structs-arrays-slices-int-float-string
categories:
  - Go (Golang)
tags:
  - backend
---

Understanding what Go values look like in memory helps us to understand which operations are expensive.

### Basic Types

#### Integers

Go has several integer types:

- `int8`: -128 to 127
- `int16`: -2^15 to 2^15 - 1 (-32,768 to 32,767)
- `int32`: -2^31 to 2^31 - 1 (-2,147,483,648 to 2,147,483,647)
- `int64`: -2^63 to 2^63 - 1 (-9,223,372,036,854,775,808 to 9,223,372,036,854,775,807)
- `int`: A generic integer is platform dependent (32 bits wide on a 32-bit system and 64-bits wide on a 64-bit system)

```go
i := 12

+------+
|  12  | int
+------+
```

In the above example:

- variable `i` has type `int`
- `i` is represented in memory as a single 32-bit word (on a 32 bit system)

```go
j := int32(12)

+------+
|  12  | int32
+------+
```

In the above example:

- variable `j` has type `int32` (explicitly converts to `int32`)
- `i` and `j` have the same memory layout

```go
i := 12
j := int32(12)

i == j
// invalid operation: i == j (mismatched types int and int32)

i == int(j)
// true
```

In the above example:

- `i` and `j` have different types and needs an explicit type conversion to type `int` to be compared

#### Bytes and Runes

Go also has two integer type aliases: `byte` and `rune`.

Go doesn't have a `char` data type, so `byte` and `rune` data types are used to distinguish characters from integer values.

#### Bytes

A `byte` is an alias for `uint8` and represents ASCII characters.

To create a `byte`, the type has to be specified:

```go
var byteLetter byte = 'a'

fmt.Printf("%c = %d", byteLetter, byteLetter) // a = 97
```

In the above example:

- In memory, the character `'a'` is of type `byte` and is converted to an integer ASCII value `97`.

#### Runes

A `rune` is an alias for `int32` and represents Unicode UTF-8 encoded characters.

A `rune` is the default character type in Go when a character is declared with single quotes:

```go
var runeLetter rune = 'a'

fmt.Printf("%c = %U", runeLetter, runeLetter) // a = U+0061
```

In the above example:

- In memory, the character `'a'` is of type `rune` and is converted to the hexadecimal (integer) unicode codepoint value of `0061`.

#### Floats

Go has two floating point types `float32` and `float64` to store numbers with a decimal.

The default type for floating point values is `float64`.

```go
f := float32(2.33)

+--------+
|  2.33  | float32
+--------+
```

In the above example:

- variable `f` has type `float32`
- `f` has the same memory footprint as `int32` but a different internal layout

### Arrays

```go
language := [6]byte{'g', 'o', 'l', 'a', 'n', 'g'}

+-----+-----+-----+-----+-----+-----+
|  g  |  o  |  l  |  a  |  n  |  g  | [6]byte
+-----+-----+-----+-----+-----+-----+
```

In the above example:

- variable `language` has type `[6]byte` and is an array of 6 `byte`s
- `language` is represented in memory as 6 bytes

```go
primes := [3]int{2, 3, 5}

+-----+-----+-----+
|  2  |  3  |  5  | [3]byte
+-----+-----+-----+
```

In the above example:

- variable `primes` has type `[3]int` and is an array of 3 `int`s
- `primes` is represented in memory as 3 bytes

### Pointers

Go also gives the programmer control over pointers. Understanding pointers is important for building systems that perform well.

Providing control over basic memory layouts allows the ability to control:

- The total size of a given collection of data structures
- The number of allocations
- The memory access patterns.

### Structs

Fields in a struct are laid out side-by-side in memory:

```go
type Point struct{ X, Y int }
```

In the above example:

- A `struct` type named `Point` is declared
- `Point` is represented in memory as two adjacent `int`

```go
type Point struct{ X, Y int }

var p = Point{10, 20}
+------+------+
|  10  |  20  | Point
+------+------+
```

In the above example:

- variable `p` has type `Point`
- `p` is constructed with a composite `struct` literal

```go
type Point struct{ X, Y int }

var pp *Point = &Point{10, 20}
+-----+
|  +  | *Point
+--|--+
   |
   v
   +------+------+
   |  10  |  20  | Point
   +------+------+
```

In the above example:

- variable `pp` has type `*Point`
- `pp` is a pointer to a unique variable initialized with the composite literal `&Point{10, 20}`
- A pointer `*Point` is generated when we take the address of the composite literal `&Point{10, 20}`

```go
type Rect1 struct{ Min, Max Point }

r1 := Rect1{Point{10, 20}, Point{50, 60}}
+------+------+------+------+
|  10  |  20  |  50  |  60  | Rect1
+------+------+------+------+
```

In the above example:

- A `struct` type named `Rect1` is declared
- `Rect1` is represented in memory by two `Point` fields, which is four adjacent `int`

```go
type Rect2 struct{ Min, Max *Point}

r1 := Rect1{&Point{10, 20}, &Point{50, 60}}
+-----+-----+
|  +  |  +  | *Point
+--|--+--|--+
   |     |
   |     v
   |     +------+------+
   |     |  50  |  60  |  Point
   |     +------+------+
   v
   +------+------+
   |  10  |  20  | Point
   +------+------+
```

In the above example:

- A `struct` type named `Rect2` is declared
- `Rect2` is represented in memory by two `*Point` fields

### Strings

A `string` is represented in memory as a 2-word structure containing:

- A pointer to the string
- The length

A `string` is immutable and multiple strings can share the same storage.

It should be noted, slicing a string does not allocate or copy the underlying data:

- Slicing creates a new 2-word structure that points to the same byte sequence, and corresponding length
- This also means the entire original underlying data is kept even if the slice only takes a subset

```go
s := "hello"

  ptr   len
+-----+-----+
|  +  |  5  | string
+--|--+-----+
   |
   v
   +---+---+---+---+---+
   | h | e | l | l | o | [5]byte
   +---+---+---+---+---+
           ^
           |
           |  t := s[2:3]
           |
        +--|--+-----+
        |  +  |  1  | string
        +-----+-----+
          ptr   len
```

In the above example:

- The slice operation created a new 2-word structure
- It points to the same byte sequence as the original underlying string data structure

### Slices

A `slice` data structure is a section of an array and is represented in memory as a 3-word structure containing:

- A pointer to the first element
- The length (is the upper bound for index operations x[i])
- The capacity (is the upper bound for slice operations x[i:j])

Slicing an array also does not allocate or copy the underlying data:

- A new 3-word structure is created that points to the same array, corresponding length, and capacity

```go
x := []int{1, 3, 5, 7}

  ptr   len   cap
+-----+-----+-----+
|  +  |  4  |  4  | []int
+--|--+-----+-----+
   |
   v
   +-----+-----+-----+-----+
   |  1  |  3  |  5  |  7  | [4]int
   +-----+-----+-----+-----+
```

In the above example:

- Evaluating the composite literal `[]int{1, 3, 5, 7}`
  - Creates a new array containing 4 values
  - Sets the fields of the slice `x` to describe the array
    - `len(x) == 4`
    - `cap(x) == 4`

```go
x := []int{1, 3, 5, 7}

  ptr   len   cap
+-----+-----+-----+
|  +  |  4  |  4  | []int
+--|--+-----+-----+
   |
   v
   +-----+-----+-----+-----+
   |  1  |  3  |  5  |  7  | [4]int
   +-----+-----+-----+-----+
          ^
          |
          |  y := x[1:3] // [3 5]
          |
       +--|--+-----+-----+
       |  +  |  2  |  4  | []int
       +-----+-----+-----+
         ptr   len   cap
```

In the above example:

- The slice expression `x[1:3]` does not allocate more data: it writes the fields of a new slice structure, `y`, to refer to the same array.
- The length is 2
  — `y[0]` and `y[1]` are the only valid indexes
- The capacity is 4
  — `y[0:4]` is a valid slice expression

### New

`new` and `make` are two data structure creation functions:

- `new`
  - `new(T)` returns `*T`, a pointer
  - `new` returns a pointer to zeroed memory
  - A pointer allows Go programs to dereference implicitly (the arrows in the diagrams)

```go
type Point struct{ X, Y int }

new(Point)
  ptr
+-----+
|  +  | *Point
+--|--+
   |
   v
   +-----+-----+
   |  0  |  0  | Point
   +-----+-----+


point := new(Point)
Println(*point)      // {0 0}
```

In the above example:

- `new(Point)` returns a pointer to the zeroed memory of of a type `Point`
- The values are initialized to: `{0 0}`

```go
type Point struct{ X, Y int }
type Rect1 struct{ Min, Max Point }

new(Rect1)

  ptr
+-----+
|  +  | *Rect1
+--|--+
   |
   v
   +-----+-----+-----+-----+
   |  0  |  0  |  0  |  0  | Rect1
   +-----+-----+-----+-----+


rect1 := new(Rect1)
Println(*rect1)      // {{0 0} {0 0}}
```

In the above example:

- `new(Rect1)` returns a pointer to the zeroed memory of of a type `Rect1`
- The values are initialized to: `{{0 0} {0 0}}`

```go
type Point struct{ X, Y int }
type Rect2 struct{ Min, Max *Point}

new(Rect2)

  ptr
+-----+
|  +  | *Rect2
+--|--+
   |
   v ptr   ptr
   +-----+-----+
   |  +  |  +  | *Point
   +--|--+--|--+
      v     v
     nil    nil


rect2 := new(Rect2)
Println(*rect2)      // {<nil> <nil>}
```

In the above example:

- `new(Rect2)` returns a pointer to the zeroed memory of of a type `Rect2`
- The values are initialized to: `{<nil> <nil>}`

```go
new([]int)

  ptr
+-----+
|  +  | *[]int
+--|--+
   |
   v ptr   len   cap
   +-----+-----+-----+
   |  +  |  0  |  0  | []int (slice)
   +--|--+-----+-----+
      |
      v
      +-+
      | | [0]int (array)
      +-+


data := new([]int)
Println(len(*data)) // 0
Println(cap(*data)) // 0
Println(*data)      // []
```

### Make

`make` is another data structure creation function:

- `make`
  - `make(T, args)` returns an ordinary `T`, not a pointer
  - `make` returns a complex structure

```go
make([]int, 0)

  ptr   len   cap
+-----+-----+-----+
|  +  |  0  |  0  | []int (slice)
+--|--+-----+-----+
   |
   v
   +-+
   | | [0]int (array)
   +-+


makeData := new([]int)
Println(len(makeData)) // 0
Println(cap(makeData)) // 0
Println(makeData)      // []
```

In the above example:

- `new(Rect2)` returns a pointer to the zeroed memory of of a type `Rect2`
- The values are initialized to: `{<nil> <nil>}`

```go
make([]int, 2, 5)

  ptr   len   cap
+-----+-----+-----+
|  +  |  2  |  5  | []int (slice)
+--|--+-----+-----+
   |
   v
   +-----+-----+-----+-----+-----+
   |  0  |  0  |  0  |  0  |  0  | [5]int (array)
   +-----+-----+-----+-----+-----+


make([]int, 2, 5)
Println(len(makeData)) // 2
Println(cap(makeData)) // 5
Println(makeData)      // [0 0]
```
