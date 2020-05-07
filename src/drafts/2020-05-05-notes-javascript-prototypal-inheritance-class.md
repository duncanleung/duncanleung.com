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

## Explain prototypal inheritance

Prototypal inheritance is used in JavaScript’s OOP construct to share methods among Class instances

When accessing properties on an object, the JavaScript will traverse the Prototype chain, starting on the object itself, and moving up the prototype chain, until it reaches the baseline Object, and finally, `null`

- `Object.create(prototypeObject)` - Creates a new object with it’s `.prototype` pointing to the `prototypeObject`

## Pseudoclassical OOP (Function Constructors)

```javascript
function Animal(name) {
  this.speed = 0;
  this.name = name;
}

Animal.prototype = {
  // recreate the constructor property manually
  constructor: Animal,

  run(speed) {
    this.speed = speed;
    console.log(`${this.name} runs with speed ${this.speed}`);
  }

  stop() {
    this.speed = 0;
    console.log(`${this.name} is standing still`);
  }
};

const dog = new Animal("Ned");
const cat = new Animal("Fifi");

dog.run(10); // Ned runs with speed 10
dog.stop(); // Ned is standing still
```

## Classical OOP

```javascript
class Animal {
  constructor(name) {
    this.speed = 0;
    this.name = name;
  }

  run(speed) {
    this.speed = speed;
    console.log(`${this.name} runs with speed ${this.speed}`);
  }

  stop() {
    this.speed = 0;
    console.log(`${this.name} is standing still`);
  }
}

const dog = new Animal("Ned");
const cat = new Animal("Fifi");

dog.run(10); // Ned runs with speed 10
dog.stop(); // Ned is standing still
```

## \_\_proto\_\_ vs [[Prototype]]

`prototype`: property of a class constructor

- mechanism by which you assign [[Prototype]] properties to objects, since you can't access them directly other than with the non-standard `__proto__` property

`__proto__` / `[[Prototype]]`: property of a class instance

- is used when resolving an object's properties
- If an object doesn't have a property, its `[[Prototype]]` is checked, and then that object's `[[Prototype]]`, and so on, until either a property is found or you hit the end of the prototype chain.

The `__proto__` is considered outdated and somewhat deprecated (in browser-only part of the JavaScript standard).

The modern methods are:

- `Object.create(proto[, descriptors])` – creates an empty object with given proto as `[[Prototype]]` and optional property descriptors.
- `Object.getPrototypeOf(obj)` – returns the `[[Prototype]]` of obj.
- Object.setPrototypeOf(obj, proto) – sets the `[[Prototype]]` of obj to proto.

## The "new" Operator

```javascript
// When an object instance `dog` is created from  `new Animal()`:
const dog = new Animal("Ned");

function Animal(name) {
  // const this = Object.create(Animal.prototype)

  // 1. Create a new object `this`
  // 2. Set `this.__proto__` to Animal.prototype

  this.speed = 0;
  this.name = name;

  // return this
}

// "Assign `dog`'s [[Prototype]] to this object":
Animal.prototype = {
  constructor: Animal,

  run(speed) {
    ...
  }

  stop() {
    ...
  }
};
```

## The Prototype Chain: Prototypal Inheritance

```javascript
// Prototype Chain
                      null
                       ▲
                       |
                       |
          Object.prototype
          (Object)
          ┌─────────────────────────┐
          | constructor: Object     |
          | toString: function      |
          | ...                     |
          └─────────────────────────┘
                      |
    ┌─────────────────┴──────────────────┐
    |                                    |
Function.prototype                       |
(Object)                                 |
┌──────────────────┐                     |
| call: function   |                     |
| apply: function  |                     |
| ...              |                     |
└──────────────────┘                     |
     ▲                                   |
     |  [[Prototype]]                    |  [[Prototype]]
     |                                   |

Animal(name)                        Animal.prototype
(Function Constructor)              (Object)
┌──────────────────┐               ┌───────────────────────┐
│ this.name = name;│   prototype   │  constructor: Animal  │
│                  | ------------► |  run: function        |
└──────────────────┘               |  stop: function       |
                                   └───────────────────────┘
                                         ▲
                                         |
                                         | [[Prototype]]
                                         |
    ┌────────────────────────────────────┴──┐

const dog = new Animal("Ned")      const cat = new Animal("Fifi")
dog                                cat
(Object)                           (Object)
┌───────────────┐                 ┌───────────────┐
| name: "Ned"   |                 | name: "Fifi"  |
|               |                 |               |
└───────────────┘                 └───────────────┘
```

## The Prototype Chain: Subclass Inheritance

```javascript
// Prototype Chain

Animal(name)                        Animal.prototype
(Constructor)                       (Object)
┌──────────────────┐               ┌───────────────────────┐
│ this.name = name;│   prototype   │  constructor: Animal  │
│                  | ------------► |  run: function        |
└──────────────────┘               |  stop: function       |
                                   └───────────────────────┘
                                         ▲
                                         | [[Prototype]]
                                         | (extends Animal)
                                         |
Dog(name)                           Dog.prototype
(Constructor)                       (Object)
┌───────────────────┐              ┌───────────────────────┐
│ callDogs: function│   prototype  │  constructor: Dog     │
│                   | -----------► |  bark: function       |
└───────────────────┘              |  slowDown: function   |
                                   └───────────────────────┘
                                         ▲
                                         | [[Prototype]]
                                         |

                                    const dog = new Animal("Ned")
                                    dog
                                    (Object)
                                    ┌───────────────┐
                                    | name: "Ned"   |
                                    |               |
                                    └───────────────┘
```

## Extending Functionality with "super"

`super()`:

derived constructor must call super in order to execute its parent (non-derived) constructor, otherwise the object for this won’t be created

```javascript
class Animal {
  constructor(name) {
    this.speed = 0;
    this.name = name;
  }

  run(speed) {
    this.speed = speed;
    console.log(`${this.name} runs with speed ${this.speed}`);
  }

  stop() {
    this.speed = 0;
    console.log(`${this.name} is standing still`);
  }
}

class Dog extends Animal {
  constructor(name) {
    super(name);
  }

  static callDogs(...args) {
    if (args.length > 0) {
      args.forEach((dog) => {
        console.log(`Come home, ${dog.name}... `);
      });
    }
  }

  bark() {
    super.stop();
    console.log(`${this.name} says "woof woof"`);
  }

  slowDown() {
    setTimeout(() => super.stop(), 1000);
  }
}

let dog = new Dog("Ned");

dog.bark(); // Ned is standing still. Ned says "woof woof"

// The inherited methods are still available
dog.run(10); // Ned runs with speed 10
dog.stop(); // Ned is standing still
```

```javascript
function Animal(name) {
  this.speed = 0;
  this.name = name;
}

Animal.prototype = {
  // recreate the constructor property manually
  constructor: Animal,

  run(speed) {
    this.speed = speed;
    console.log(`${this.name} runs with speed ${this.speed}`);
  },

  stop() {
    this.speed = 0;
    console.log(`${this.name} is standing still`);
  },
};

function Dog(name) {
  Animal.call(this, name);
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;
Dog.prototype.bark = function() {
  Animal.prototype.stop.call(this);
  console.log(`${this.name} says "woof woof"`);
};
Dog.prototype.slowDown = function() {
  setTimeout(() => Animal.prototype.stop.call(this), 1000);
};

Dog.callDogs = function(...args) {
  if (args.length > 0) {
    args.forEach((dog) => {
      console.log(`Come home, ${dog.name}... `);
    });
  }
};
// ===================
let dog = new Dog("Ned");
dog.bark(); // Ned is standing still. Ned says "woof woof"

// The inherited methods are still available
dog.run(10); // Ned runs with speed 10
dog.stop(); // Ned is standing still

Dog.callDogs(dog);
```
