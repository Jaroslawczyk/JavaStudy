A **constructor** is a special method called when an object is created with `new`. It sets the initial field values right away so you can't forget any of them.

## Video timestamps

- {{t j1 2:18:13}} — why constructors are needed
- {{t j1 2:18:34}} — constructor syntax
- {{t j1 2:18:49}} — a no-arg constructor: default sizes of 10
- {{t j1 2:19:43}} — `new Box()` is a constructor call
- {{t j1 2:19:52}} — the default constructor Java creates
- {{t j1 2:21:12}} — a constructor with parameters
- {{t j1 2:21:58}} — `this` in a constructor
- {{t j1 2:22:29}} — why the no-arg constructor "disappeared"
- {{t j1 2:22:53}} — argument order: <kbd>Ctrl+P</kbd>
- {{t j1 2:23:10}} — generating a constructor: <kbd>Alt+Insert</kbd>
- {{t j1 2:23:49}} — homework

## Syntax

```java
public class Box {
    double width;
    double height;
    double length;

    Box(double width, double height, double length) {   // name = class name, no return type
        this.width = width;
        this.height = height;
        this.length = length;
    }

    double volume() {
        return width * height * length;
    }
}
```

```java
Box box = new Box(10, 15, 20);   // the constructor runs automatically
System.out.println(box.volume()); // 3000.0
```

How a constructor differs from a method:

- its name **exactly matches** the class name;
- **no return type** — not even `void` (if you write `void Box()`, it's an ordinary method, not a constructor!);
- it's called only through `new` (or from another constructor via `this(...)`/`super(...)`).

## The default constructor

If you **write no constructors at all**, the compiler adds an empty no-arg constructor — that's why `new Box()` worked before. Fields then get default values (`0`, `false`, `null`).

:::warning "The default constructor disappears"
As soon as you declare **any** constructor of your own (e.g. with parameters), Java **no longer creates** the default one. `new Box()` stops compiling — either pass arguments or declare a no-arg constructor yourself.
:::

## Generating in IntelliJ IDEA

<kbd>Alt+Insert</kbd> (macOS: <kbd>⌘N</kbd>) → **Constructor** → select fields (with <kbd>Ctrl</kbd> or <kbd>Shift</kbd>) → OK. Getters/setters, `equals()`, `hashCode()` and `toString()` are generated the same way.

## What the video doesn't cover

### Calling one constructor from another: this(...)

To avoid duplicating code across constructors (overloading comes in the next lesson), one constructor calls another:

```java
Box(double size) {
    this(size, size, size);   // must be the first statement*
}
```

\* Before Java 25 a `this(...)`/`super(...)` call had to be the **first** line. Since Java 25 (JEP 513, "flexible constructor bodies") you can validate arguments and even assign fields before it, but you still can't read fields or call methods of the object being constructed.

### Validating arguments

The constructor is the best place to prevent an "invalid" object from being created:

```java
Box(double width, double height, double length) {
    if (width <= 0 || height <= 0 || length <= 0) {
        throw new IllegalArgumentException("Sizes must be positive");
    }
    this.width = width;
    this.height = height;
    this.length = length;
}
```

Exceptions are covered in detail in the exceptions lesson.

### Immutable objects

If fields are marked `final`, they must be assigned exactly once — in the constructor. Such an object can't change after creation (immutable), which makes code safer, especially with multithreading:

```java
public class Point {
    private final double x;
    private final double y;

    public Point(double x, double y) {
        this.x = x;
        this.y = y;
    }
}
```

### Object initialisation order

1. Memory for the object, fields = default values.
2. Field initialisers (`double width = 10;`) and initializer blocks `{ … }` — in source order.
3. The constructor body.

More in the [Initializer blocks](#/extra/initializer-blocks) article.

### Constructors in real projects

- **Lombok**: the `@NoArgsConstructor`, `@AllArgsConstructor`, `@RequiredArgsConstructor` annotations generate constructors at compile time.
- A **record** (Java 16+) gets an all-fields constructor automatically.
- In Spring, dependencies are injected **through the constructor** (constructor injection) — the recommended way.

## Homework

:::task video "Employee — from the video"
Create an `Employee` class with name, position and salary fields and a constructor initialising all of them. Add a method with an `int months` parameter that returns a string: "Employee Ivan, position programmer, earned 600000 in the last 12 months" (amount = salary × months). In `main` create an employee (Ivan, programmer, 50,000), call the method with 12 and print the result. {{t j1 2:23:49}}
:::

:::task easy "Student"
A `Student` class with `name`, `group`, `averageGrade` fields and an all-fields constructor. Create three students and print their data. Generate the constructor with <kbd>Alt+Insert</kbd>.
:::

:::task medium "Guarding against bad data"
Add validation to the `Employee` constructor: the name isn't blank (`isBlank()`), the salary isn't below a minimum (define a constant). Throw an `IllegalArgumentException` with a clear message on violation. Try to create a "bad" employee and read the error message.
:::

:::task hard "Immutable fraction"
Create an immutable `Fraction` class (numerator and denominator are `final`). In the constructor reduce the fraction (via GCD) and move the sign to the numerator; a zero denominator is forbidden. Add `plus(Fraction other)` and `times(Fraction other)` methods returning a **new** fraction, and `toString()` like `"3/4"`.
??? Hint
GCD with Euclid's algorithm: `while (b != 0) { int t = a % b; a = b; b = t; } return Math.abs(a);`. Sum: `a/b + c/d = (a*d + c*b) / (b*d)` — the constructor then reduces the result itself.
:::
