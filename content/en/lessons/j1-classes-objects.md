We start **object-oriented programming (OOP)** — Java's central idea. We see how a class differs from an object, create our own `Box` class with fields and learn what reference variables are.

## Video timestamps

- {{t j1 1:49:19}} — what OOP is
- {{t j1 1:49:42}} — class vs object: the dog example
- {{t j1 1:50:49}} — fields and methods — class members
- {{t j1 1:51:05}} — class declaration syntax
- {{t j1 1:51:51}} — a class doesn't need a `main` method
- {{t j1 1:52:00}} — practice: the OOP project, the `Main` class
- {{t j1 1:52:27}} — the `Box` class with width, height, length fields
- {{t j1 1:53:25}} — a variable for an object
- {{t j1 1:54:03}} — creating an object: `new Box()`
- {{t j1 1:54:40}} — accessing fields with a dot
- {{t j1 1:55:59}} — every object has its own copies of the fields
- {{t j1 1:57:42}} — reformatting code with <kbd>Ctrl+Alt+L</kbd>
- {{t j1 1:59:11}} — why these variables are called references
- {{t j1 1:59:22}} — two variables — one object
- {{t j1 2:00:23}} — homework

## Class and object

A **class** is a template, a blueprint: a description of the properties and behaviour objects have. An **object** (an instance of a class) is a concrete thing built from that blueprint.

> "A dog is an animal with four legs, a tail and fur that barks" — that's a **class**.
> Rex from your yard — black, small, named Rex — is an **object**.

A class consists of **members**:

- **fields** (instance variables) — data: length, name, age;
- **methods** — actions: compute the volume, bark (next lesson).

```java
public class Box {
    double width;
    double height;
    double length;
}
```

## Creating objects

```java
public class Main {
    public static void main(String[] args) {
        Box myBox = new Box();      // create an object and store a reference to it
        myBox.height = 10.2;        // fields are accessed with a dot
        myBox.length = 15;
        myBox.width = 11.3;

        double volume = myBox.height * myBox.width * myBox.length;
        System.out.println("Box volume: " + volume);   // 1728.9…
    }
}
```

- `Box myBox` declares a variable of type `Box` (empty for now).
- `new Box()` creates a new object in memory. `new` always means "create a new one".
- Every object keeps **its own copies of the fields**: changing `box2`'s size doesn't affect `box3`.

:::note "One public class — one file"
`Box` lives in `Box.java`, and `Main` in `Main.java`. A class without `main` can't be "run" — its objects are created and used from other classes.
:::

## Reference variables

The variables `myBox`, `box2`, `box3` store not the objects themselves but **references** (addresses) to them:

```java
Box box3 = new Box();
box3.height = 10; box3.width = 10; box3.length = 10;

Box box4 = box3;        // NOT a new box: a second reference to the same object
box4.height = 100;

System.out.println(box3.height);   // 100 — box3 changed too!
```

```text
box3 ──┐
       ├──►  [ Box: height=100, width=10, length=10 ]
box4 ──┘
```

Important consequences:

- `box3 == box4` compares **references** — `true`, it's one object. Two different boxes with equal sizes won't be equal with `==` (remember strings and `equals`).
- Primitives (`int`, `double`…) hold a **value**, and `int b = a;` is a copy.

## What the video doesn't cover

### Where objects live: stack and heap

- **The stack** holds methods' local variables: primitives and *references*. It's cleaned automatically when a method returns.
- **The heap** holds every object created with `new`.
- **The Garbage Collector** removes objects from the heap automatically once no references to them remain. In Java you don't free memory by hand as in C/C++.

### null and NullPointerException

```java
Box box = null;          // the variable points nowhere
box.height = 5;          // NullPointerException!
```

`null` is an "empty reference". Accessing a field or method through `null` is the most common Java error. Since Java 14 the message is detailed: `Cannot assign field "height" because "box" is null`.

### Default field values

Unlike local variables, an object's fields get default values: numbers `0`, `boolean` `false`, references `null`. So `new Box()` creates a box with sizes `0.0`.

### The four OOP principles

They are asked about in almost every interview — here's a quick guide; each is covered in detail in later lessons:

| Principle | Essence |
|---|---|
| **Encapsulation** | Data and methods live together in a class; implementation details are hidden (`private`) |
| **Inheritance** | A new class extends an existing one (`extends`) and reuses its code |
| **Polymorphism** | One interface — many implementations; a subclass object is used where the parent is expected |
| **Abstraction** | Keep what matters, hide the rest (abstract classes, interfaces) |

:::outdated "Data classes today — record"
For classes that only hold data (like `Box` or the homework's `Person`), Java 16 introduced **records** — a compact form where the constructor, accessors, `equals`, `hashCode` and `toString` are generated automatically:

```java
public record Person(String name, int age, double weight) { }
```

But first make sure you understand ordinary classes — records are discussed in the [Records](#/extra/records) article.
:::

## Homework

:::task video "Average age — from the video"
Create a `Person` class with name, age and weight fields. In `main` create five `Person` variables, fill their fields and print the average age. {{t j1 2:00:23}}
??? Hint
The average age is the sum of the ages divided by 5. Divide by `5.0` to get a decimal result. Even handier: put the people into an array `Person[] people = {p1, p2, p3, p4, p5};` and sum in a for-each loop.
:::

:::task easy "Book"
Create a `Book` class with `title`, `author`, `year`, `pages` fields. Create two books and print them as "Author — "Title" (year), N pages".
:::

:::task medium "References and copies"
Create `Box a = new Box();` sized 1×2×3, then `Box b = a;` and `Box c = new Box();` with the same sizes. Print `a == b`, `a == c`. Change `b.width` and print `a.width`. Explain every result and draw the reference diagram.
:::

:::task medium "The oldest"
Create an array of five `Person` objects and find the oldest and the lightest person. Print their names.
??? Hint
Store a **reference** to the person found, not the age: `Person oldest = people[0];` and in the loop `if (p.age > oldest.age) oldest = p;`.
:::

:::task hard "Points on a plane"
Create a `Point` class with `x` and `y` fields (`double`). Create an array of 5 points, find the pair of points with the largest distance between them (distance is `Math.hypot(x2 - x1, y2 - y1)`) and print their coordinates and the distance.
??? Hint
Go over all pairs with two nested loops: `for (int i = 0; i < n; i++) for (int j = i + 1; j < n; j++)`.
:::
