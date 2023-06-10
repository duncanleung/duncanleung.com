---
date: 2023-06-08
title: Go Function Arguments are Pass by Value
template: post
thumbnail: "../thumbnails/go.png"
slug: go-function-arguments-passed-by-value
categories:
  - Go (Golang)
tags:
  - backend
---

Knowing how Go handles function arguments helps us to understand the behavior of the language.

In Go, all function arguments are passed by value (a copy of the value is passed to a function, not a reference to the original value itself).

In practice, this means that inside the function, any changes made to this copy of the value does not affect the original variable.

There are also some particular things to keep in mind when dealing with different types of data:

# Passing integers into a function

Integers are passed by value into a function.

To illustrate this, in the example below, `modifyInt()` can't change the original value of `num` to 5 because only a copy of the value of `num` is passed to it.

```
func modifyInt(i int) {
    i = 5
}

func main() {
    num := 10
    modifyInt(num)

    fmt.Println(num) // prints 10, num is not modified
}
```

```
   Main function                          modifyInt function
------------------                        ---------------
|                 |                       |              |
| num := 10       | -- num's value 10 --> |  i := 10     |
|                 |                       |  i = 5       |
| modifyInt(num)  |                       |              |
|                 |                       ---------------
| fmt.Println(num)|
|                 |
------------------

```

# Passing pointers to modify the original value

By passing a pointer to a function, the function gets a copy of the pointer, and not a reference to the original pointer.

The the "copy of the pointer" points to the same memory location as the original value, and any changes made to the data in the memory location that the pointer points to will affect the original data.

Inside the function, to modify the value that this "copy of the pointer" is pointing to, it first needs to be dereferenced `*i`. After dereferencing it, a new value can be assigned to the memory location that `i` points to with `*i = 5`.

```
func modifyIntPointer(i *int) {
    *i = 5
}

func main() {
    num := 10
    modifyIntPointer(&num)

    fmt.Println(num) // prints 5, num has been modified
}
```

```
   Main function                      modifyIntPointer function
------------------                        ---------------
|                 |                       |              |
| num := 10       | -- address of num --> |  i := &num   |
|                 |                       |  *i = 5      |
| modifyInt(&num) |                       |              |
|                 |                       ---------------
| fmt.Println(num)|
|                 |
------------------

```

# Passing pointers to indicate optional values

In addition to allowing modifying the original value in a calling function, passing a pointer is also used to indicate that function parameter is optional.

By accepting a pointer, `nil` can be passed as a function argument to indicate the absence of a value.

However, inside the function, a nil check is needed if the pointer is nil before dereferencing it.

# Passing slices into a function

Note: Go uses a data structure called a "slice header" when dealing with slices, which includes:

- a pointer to an "array"
- The "length" of the array
- The "capacity" of the array

When a slice is passed as an argument into a function, the slice header is passed by value (copied), but the underlying array it points to is not.

Practically, this means that changes can be made to the original slice --by indexing a specific element in the slice--. This is because both the original "slice header" and the copy "slice header" point to the same underlying array.

Here, `modifySlice` can change an element the original slice. Although a copy of the slice header is passed in, it still points to the same underlying array.

```
func modifySlice(s []int) {
    s[0] = 5
}

func main() {
    slice := []int{1, 2, 3}
    modifySlice(slice)

    fmt.Println(slice) // prints [5, 2, 3], slice is modified
}
```

However, any operations in the function that assign a new slice to the variable will --not-- affect the original slice.

This is because the function is working with a copy of the slice header, and the original slice still points to the old underlying array.

For example, using `append()` in Go creates a new underlying array.

```
func appendSlice(s []int) {
    s = append(s, 4)
}

func main() {
    slice := []int{1, 2, 3}
    appendSlice(slice)

    fmt.Println(slice) // prints [1, 2, 3], slice is not modified
}
```

# Passing a slice pointer to modify the original

By passing a "pointer to a slice" to a function, the modifications to the slice will affect the original slice.

This works because a reference to the original slice header is passed, so when you append to the slice in `appendSlicePointer`, you're modifying the original slice header, and the change is reflected in the original.

```
func appendSlicePointer(s *[]int) {
    *s = append(*s, 4)
}

func main() {
    slice := []int{1, 2, 3}
    appendSlicePointer(&slice)

    fmt.Println(slice) // prints [1, 2, 3, 4], slice is modified
}
```

It should be noted, that it is more idiomatic in Go to return the updated slice from the function rather than modifying it in place through a pointer:

```
func modifySlice(s []int) []int {
    return append(s, 4)
}

func main() {
    slice := []int{1, 2, 3}
    slice = modifySlice(slice)

    fmt.Println(slice) // prints [1, 2, 3, 4], slice is modified
}
```

# Passing strings into a function

Note: Strings are immutable in Go, so a string can't be modified within the function like with an array or a slice. Attempting to change a string in a function will result in a compile-time error.

For example, this will not work:

```
str[0] = 'i' // compile-time error
```

Go also uses a data structure called a "string descriptor" when dealing with strings, which includes:

- a read-only slice of bytes with a pointer to an underlying array of characters (bytes)
- the length of the array

When a string is passed as an argument into a function, the string descriptor is passed by value (copied), but the underlying array of bytes is not.

This makes passing strings efficient, as the actual sequence of bytes that make up the string are not copied.

In this example, a copy of the string descriptor for `s` is passed to `printStr`, but the array of bytes that contains the characters "hello" is not copied.

```
func printStr(str string) {
    fmt.Println(str)
}

func main() {
    s := "hello"
    printStr(s)
}
```

# Passing a string pointer to modify the original

Although the string that a pointer points to is immutable, the pointer itself is not.

By passing a "pointer to a string" to a function, you can "change" the string that the pointer variable points to.

```
func changeStringPointer(s *string) {
    newString := "new value"
    *s = newString
}

func main() {
    original := "original value"
    changeStringPointer(&original)

    fmt.Println(original) // prints "new value"
}
```

Again, it should be noted, that it is more idiomatic in Go to return the new string from the function rather than changing it in place through a pointer.

# Passing structs into a function

Structs are passed by value into a function.

To illustrate this, in the example below, `modifyPerson()` can't change the original value of `p.age` to 30 because only a copy of the value of `p` is passed to it.

```
type person struct {
	name string
	age  int
}

func modifyPerson(p person) {
	p.age = 30
}

func main() {
	p := person{name: "John", age: 25}
	modifyPerson(p)

	fmt.Println(p) // prints {John 25}, p.age is not modified
}
```

# Passing a struct pointer to modify the original

By passing a "pointer to a struct" to a function, the modifications to the struct will affect the original struct.

This works because even though `modifyPersonPointer()` only receives a copy of the pointer, the pointer still points to the same original data.

Note: `modifyPersonPointer()` does not need to dereference the pointer to the struct to modify the original struct.

For example:

```
func modifyPersonPointer(p *person) {
    (*p).age = 30 // Don't do this
}
```

Go allows you to write `p.age`, and Go does the dereference automatically when you access a field of the struct.

```
func modifyPersonPointer(p *person) {
    p.age = 30
}
```

```
type person struct {
    name string
    age  int
}

func modifyPersonPointer(p *person) {
    p.age = 30
}

func main() {
    p := person{name: "John", age: 25}
    modifyPersonPointer(&p)

    fmt.Println(p) // prints {John 30}, p.age is modified
}
```

# Passing pointers to optimize performance

For complex types (structs), if you pass it directly, the whole structure will be copied. But if you pass a pointer to the structure, only the pointer will be copied which can improve performance.
