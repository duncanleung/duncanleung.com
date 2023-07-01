---
date: 2023-06-30
title: "Go Idioms: Accept Interfaces, Return Types"
template: post
thumbnail: "../thumbnails/go.png"
slug: go-idiom-accept-interfaces-return-types
categories:
  - Go (Golang)
tags:
  - backend
---

When writing functions or methods Go, it is idiomatic to accept interfaces and return types as it helps keep your Go code flexible, reusable, and robust against changes in implementation.

We'll discuss some examples of this idiom, but it should be noted that this is not a hard and fast rule. There are times when it makes sense to accept concrete types and return interfaces, or to accept interfaces and return concrete types. The important thing is to understand the tradeoffs and make the best decision for your particular situation.

### Accept Interfaces

Specify parameters as interfaces rather than concrete types makes your function more flexible and reusable because it can accept any type that fulfills the interface. Interfaces are a way to describe the behavior of an object. If something implements all the methods described in an interface, we say it implements the interface.

For example, if you have a function that needs to write to a stream, don't specify the parameter as a `*os.File` (a concrete type), specify it as `io.Writer` (an interface). That way, the function can write to any type that has a Write method, not just files.

### Return Types

When a function or method returns a value, it's often better to return a concrete (specific) type rather than an interface. Concrete types in Go are the actual implementations of a particular thing, such as a struct or int.

This approach provides more information to the caller about what exactly they're getting and allows them to use any methods or fields that are specific to the concrete type.

## Example: Return Types

Let's first look at an implementation that --doesn't-- follow the Go idiom.

Here we have a type `MyStore` and its methods, and an interface `Storer` that defines the methods that `MyStore` implements:

```go
type MyStore struct {
	// Absolute path to the base directory for storing data files.
	directoryPath string

	//...
}

func (s *MyStore) Read(key string) (string, error) {
	// Implementation

	return "", nil
}

type Storer interface {
	Read(key string) (value string, err error)
}
```

### Wrong: Returning an Interface

If we wanted a function that returns an instance of MyStore, we might think to implement it to return the interface:

```go
func NewMyStore() Storer {
	return &MyStore{directoryPath: "/tmp"}
}
```

However, this is not the best approach. The instance returned will only be able to use the methods defined in the interface, and not the methods defined in the concrete type.

For example, any instance returned from `NewMyStore()` would not have access to the `directoryPath` field:

```go
func main() {
	store := NewMyStore()
	store.directoryPath
}
```

```bash
Error: store.directoryPath undefined (type Storer has no field or method directoryPath)
```

Also, if we had another method, `Write`, that was defined in `MyStore` but not in `Storer`, we wouldn't be able to use it:

```go
func (s *MyStore) Write(key string, value string) error {
	// Implementation

	return nil
}
```

```go
func main() {
	store := NewMyStore()
	store.Write("key", "value")
}
```

```bash
Error: store.Write undefined (type Storer has no field or method Write)
```

### Correct: Returning a Concrete Type

Instead, we should return a concrete type. This way, the instance returned will have access to all the methods and fields defined in the concrete type, and future maintainers will know exactly what type they're getting.

```go
func NewMyStore() *MyStore {
	return &MyStore{directoryPath: "/tmp"}
}
```

Now, we can use the `directoryPath` field and any other methods defined in `MyStore`:

```go
	store := NewMyStore()
	fmt.Println(store.directoryPath)
	store.Write("key", "value")
```

## Example: Accepting Interfaces

Let's look at another implementation that --doesn't-- follow the Go idiom.

### Wrong: Accepting a Concrete Type

If we wanted to write a service that uses a store, we might think to implement it to accept a specific concrete type:

```go
func UseStore(s *MyStore, key string) (string, error) {
	return s.Read(key)
}
```

However, this is not the best approach for code reuse. The function `UseStore` will only be able to accept types of `MyStore`, even if another type implements a `Read` method.

For example, if we had another type, `YourStore`, that also implements the `Read` method, we wouldn't be able to pass an instance of `YourStore` to the `UseStore` service:

```go
type YourStore struct {
	// Absolute path to the base directory for storing data files.
	directoryPath string

	//...
}

func (s *YourStore) Read(key string) (string, error) {
	// Implementation

	return "", nil
}

func NewYourStore() *YourStore {
	return &YourStore{directoryPath: "/tmp"}
}
```

Now, if we tried to pass an instance of `YourStore` to the `UseStore` function, we would get an error:

```go
	store := NewYourStore()
	UseStore(store, "key")
```

```bash
Error: cannot use store (type *YourStore) as type *MyStore in argument to UseStore
```

We would have to duplicate the `UseStore` function to accept a `YourStore` type:

```go
func UseYourStore(s *YourStore, key string) (string, error) {
	return s.Read(key)
}
```

### Correct: Accepting an Interface

Instead, we should implement `UseStore` to accept an interface. This way, the function can accept any type that implements the interface, not just a specific concrete type.

```go
func UseStore(s Storer, key string, value string) error {
	return s.Read(key)
}
```

Now, we can pass any type that implements the `Storer` interface to the `UseStore` function:

```go
func main() {
	myStore := NewMyStore()
	UseStore(myStore, "key")

	yourStore := NewYourStore()
	UseStore(yourStore, "key")
}
```

## Real Examples

In the Kubernetes codebase, we can see this idiom used in many places. For example, the `store` package defines a `Store` interface that has methods for writing, and reading. It also defines a `FileStore` type that implements the `Store` interface:

```go
// Store provides the interface for storing keyed data.
type Store interface {
	// Write writes data with key.
	Write(key string, data []byte) error
	// Read retrieves data with key
	Read(key string) ([]byte, error)
	// Delete deletes data by key

	//...
}

// FileStore is an implementation of the Store interface which stores data in files.
type FileStore struct {
	// Absolute path to the base directory for storing data files.
	directoryPath string

  //...
}

// Write writes the given data to a file named key.
func (f *FileStore) Write(key string, data []byte) error {
	// Implementation

	return nil
}

// Read reads the data from the file named key.
func (f *FileStore) Read(key string) ([]byte, error) {
	// Implementation

	return bytes, err
}
```

In the `store` package, we can see that the `NewFileStore` function returns a concrete type, `*FileStore`, and not an interface:

```go
// NewFileStore returns an instance of FileStore.
func NewFileStore(path string, fs utilfs.Filesystem) (Store, error) {
	// Implementation

	return &FileStore{directoryPath: path}, nil
}
```

## Exceptions

There are times when it makes sense to accept concrete types and return interfaces, or to accept interfaces and return concrete types. The important thing is to understand the tradeoffs and make the best decision for your particular situation.

### Accepting Concrete Types

For example, if you need to access fields or methods that are specific to a concrete type, you should accept a concrete type. For example, if you need to access a field that is specific to `MyStore`, you should accept a `*MyStore` type.

### Returning Interfaces

For example, if you need to return a type that implements multiple interfaces, you should return an interface. For example, if you have a type that implements both `Storer` and `Logger`, you should return a `Storer` or `Logger` interface.
