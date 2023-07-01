---
date: 2023-06-28
title: Allocating Memory in Go
template: post
thumbnail: "../thumbnails/go.png"
slug: allocating-memory-go
categories:
  - Go (Golang)
tags:
  - backend
---

It can be helpful to understand how memory is allocated when working in Go, as it will provide soe insight into how the Go runtime and garbage collector decides when to deallocate memory.

One interesting situation is when we return a pointer to a local variable in a function: does the local variable get allocated to the stack or the heap?

```go
type Item struct {
	X int
	Y int
}

func CreateItem(x, y int) (*Item, error) {
	if x < 0 || x > maxX || y < 0 || y > maxY {
		return nil, fmt.Errorf("%d/%d out of bounds %d/%d", x, y, maxX, maxY)
	}

	i := Item{
		X: x,
		Y: y,
	}
	return &i, nil
	   // ^^^ does it allocate to stack or heap?
}

const (
	maxX = 1000
	maxY = 600
)
```

```go
func main() {
	fmt.Println(CreateItem(10, 20))
}
```

## Allocating Memory

Memory allocation can happen on the stack or the heap:

Stack:

- Local variables for a function
- Parameters to a function

Heap:

- Variables that need to outlive the function

In Go, parameters to a function and local variables inside a function are normally allocated on the stack, and this memory pointer on the stack is freed up when the function returns.

However, on this line, `return &i, nil`, we are returning a pointer to a local variable. In some languages, this could be a problem because the local variable on the stack would be freed when the function returns, leading to a dangling pointer. However, Go handles this situation through "escape analysis".

## Escape Analysis

Go's "escape analysis" is a static analysis that determines if a variable will escape the function and outlive the function. Escape analysis allows a variable to be allocated on the heap so the variable won't be deallocated when `func CreateItem()` returns. Go's garbage collector will automatically deallocate the memory when there are no more references to the Item.

We can visualize this using the `-gcflags '-m'` flag to see what's moving into the heap.

```bash
$ go run -gcflags '-m' example.go
```

```bash
# command-line-arguments
./example.go:6:13: inlining call to fmt.Println
./example.go:19:2: moved to heap: i # <--- moved to heap
./example.go:16:25: ... argument does not escape
./example.go:16:55: x escapes to heap
./example.go:16:58: y escapes to heap
./example.go:16:61: maxX escapes to heap
./example.go:16:67: maxY escapes to heap
./example.go:6:13: ... argument does not escape

&{10 20} <nil>
```

It should be noted that when a variable is allocated on the heap, it will be slower than if it was allocated on the stack. This is because memory allocation on the heap involves finding a block of unused memory large enough to hold the new variable, and the garbage collector also needs to run to release any available memory.

However, we should never prematurely optimize our code. We should only optimize when we have a performance problem by using a profiler to determine where any performance problems are. It's always best to write code that is easy to read and understand.
