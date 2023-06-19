---
date: 2023-06-08
title: JSON Encoding and Decoding in Go
template: post
thumbnail: "../thumbnails/go.png"
slug: go-json-encoding-and-decoding
categories:
  - Go (Golang)
tags:
  - backend
---

## Serialization and Deserialization

In programming, when we cross a process boundary in our system the data is transferred as a sequence of bytes (e.g. sending data from one process to another, either within the same machine or on different machine).

Upon receipt of the data we need to convert that back into a data structure in the programming language we are in.

In Go, we are mapping between the types in the serialization format, and the types in Go.

### Serialization (marshalling):

Serialization is the process of taking a data structure in your language and converting it to a sequence of bytes.

### Deserialization (unmarshalling):

Deserialization is the process of taking a sequence of bytes, and converting it back into a data structure in your language.

Understanding this serialization/deserialization mapping is important because there are always edge cases where the types in our programming language doesn't match the types in the serialization format.

For example, there is a time typing Go, which represents a current timestamp, but this type does not exist in JSON. To encode time in JSON, it either needs to be encoded as an integer (usually the number of seconds or milliseconds since epoch) or as a string (usually as ISO 8601)

## JSON Serialization

JSON is one of the most common serialization formats used. Here are the mappings between JSON and Go:

```
  JSON        | Go
+-------------+----------------------------------------------------+
| true/false  | true / false                                       |
| string      | string                                             |
| null        | nil                                                |
| number      | float64 (default), float32, int8, int16, int32...  |
| array       | []any ([]interface{})                              |
| object      | map[string]any, struct                             |
+-------------+----------------------------------------------------+
```

### JSON: string <-> Go: string

JSON strings are already UTF-8 encoded, which matches the string encodings in Go.

### JSON: null <-> Go: nil

`null` in JSON maps to `nil` in Go. Note that `nil` in Go is only used for pointers.

### JSON: number <-> Go: float64

By default, if you don't give hints to the Go JSON encoder or decoder, Go is going to decode numbers to `float64`.

### JSON: array <-> Go: []any ([]interface{})

Arrays in Go are a slice of a "specific type". However, JSON is dynamic so arrays in JSON can contain any combination of types.

If we want this flexibility in Go, we need to define an array with the `any` type (or before Go 1.18, an empty interface).

### JSON: object <-> Go: map[string]any, struct

JSON objects can be decoded into either a `map[string]interface{}` (for arbitrary JSON objects) or a specific struct in Go (when you know the structure of the JSON object).

# Go net/http Package

We'll use the `net/http` package to practically explore JSON encoding and decoding in Go.

```go
func main() {
    name, repos, err := githubInfo("duncanleung")
}

func githubInfo(login string) (string, int, error) {
	url := fmt.Sprintf("https://api.github.com/users/%s", url.PathEscape(login))
	resp, err := http.Get(url)
}
```

## Note: Error Handling in Go

One of the differences between Go and other languages like JavaScript is that Go doesn't have exceptions and instead Go returns a value signifying there was an error.

The philosophy behind this is that errors are just values and should be treated as such. This allows us to check for errors explicitly, and handle them in a way that makes sense for our program.

Although some developer find this pattern repetitive, this pattern enforces defensive programming and forces Go developers to explicitly think the error case all the time.

```go
func main() {
    name, repos, err := githubInfo("duncanleung")
    if err != nil {
        log.Fatalf("error: %s", err)
    }
}
```

`log.Fatalf()` prints the error message and exits the program with exit code 1. It is the same as:

```go
// log.Fatalf("error: %s", err)

log.Printf("error: %s", err)
os.Exit(1)
```

## Note: HTTP Status Codes

In Go, we need to also check if the HTTP status code is in the 200 range.

In other languages, this is usually done with exceptions, but in Go an HTTP `error` means the connection to the server failed, or we got an invalid HTTP response.

Even if the HTTP status code is 400 or 500, Go will not return an error, and we need to explicitly check the HTTP status code.

```go
if resp.StatusCode != http.StatusOK {
    log.Fatalf("error: %s", resp.Status)
}
```

## Converting the Response Body to a Go Structure

When reading from HTTP `resp.Body` we get a sequence of bytes that needs to be converted into a Go structure.

`resp.Body` is of type `io.ReadCloser`, which is a combination of two interfaces <a href='https://pkg.go.dev/io#Reader' target='_blank'>`io.Reader`</a> and <a href='https://pkg.go.dev/io#Closer' target='_blank'>`io.Closer`</a> and is used by Go's HTTP client to:

1. read data from a stream
2. close a stream

```go
type Closer interface {
	Close() error
}
```

The `io.Closer` is an interface: meaning the concrete type behind it should implement it and it should have a method called `Close` that returns an `error`.

```go
type Reader interface {
	Read(p []byte) (n int, err error)
}
```

The `io.Reader` is an interface: meaning the concrete type behind it should implement it and it should have a method called `Read` that gets a slice of bytes to fill, and returns two things:

1. How many bytes it managed to fill
2. and if there was an error

## Encoding and Decoding JSON API in Go

There are two ways to decode JSON in Go:

1. io.Reader: `json.NewDecoder(r io.Reader) *json.Decoder`
   When we have an `io.Reader` (like `resp.Body`), we can use `json.NewDecoder` to create a `*json.Decoder` that can decode JSON from the `io.Reader`.

2. []byte: `json.Unmarshal(data []byte, v any) error`
   When we have a slice of bytes (like from a database or a file), we can use `json.Unmarshal` to decode JSON from the slice of bytes.

There are two ways to encode JSON in Go:

1. io.Writer: `json.NewEncoder(w io.Writer) *json.Encoder`
   When we have an `io.Writer` (like `os.Stdout`), we can use `json.NewEncoder` to create a `*json.Encoder` that can encode JSON to the `io.Writer`.

2. []byte: `json.Marshal(v any) ([]byte, error)`
   When we want to encode JSON to a slice of bytes (like for a database or a file), we can use `json.Marshal` to encode JSON to the slice of bytes.

In our example, we have an `io.Reader` (`resp.Body`) and we want to decode JSON from it, so we'll use `json.NewDecoder`:

```go
func githubInfo(login string) (string, int, error) {
	url := fmt.Sprintf("https://api.github.com/users/%s", url.PathEscape(login))
	resp, err := http.Get(url)
	if err != nil {
		return "", 0, err
	}

	if resp.StatusCode != http.StatusOK {
		resp.Body.Close()
		return "", 0, fmt.Errorf("github info: %s", resp.Status)
	}

	dec := json.NewDecoder(resp.Body)
}
```

To help the `json.Decoder`, we need to define a type that is used for decoding. `json.Decoder` will use this type to reference the fields and their type to know how to decode the JSON (eg: a JSON `number` -> should be a Go `int`).

```go
type Reply struct {
    Name         string
    Public_Repos int
}
```

In this struct, the fields will be capitalized to make them public, and `json.Decoder` will try to match them with a corresponding lowercase JSON field name.

If we want the mapping to be explicit, we can use struct tags to tell `json.Decoder` how to map the JSON field name to the struct field name.

```go
type Reply struct {
    Name         string `json:"name"`
    Public_Repos int    `json:"public_repos"`
}
```

Putting this all together:

```go
func githubInfo(login string) (string, int, error) {
	url := fmt.Sprintf("https://api.github.com/users/%s", url.PathEscape(login))
	resp, err := http.Get(url)
	if err != nil {
		return "", 0, err
	}

	if resp.StatusCode != http.StatusOK {
		resp.Body.Close()
		return "", 0, fmt.Errorf("github info: %s", resp.Status)
	}

	var r struct {
		Name     string `json:"name"`
		NumRepos int    `json:"public_repos"`
	}
	dec := json.NewDecoder(resp.Body)
	if err := dec.Decode(&r); err != nil {
		return "", 0, err
	}

	return r.Name, r.NumRepos, nil
}
```
