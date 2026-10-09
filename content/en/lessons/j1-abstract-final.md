We reinforce inheritance with shapes and meet **abstract classes and methods** (`abstract`), multi-level inheritance and restrictions via **`final`** on methods and classes.

## Video timestamps

- {{t j1 4:30:06}} — the task: a figure, a rectangle and a triangle
- {{t j1 4:31:19}} — a `Figure` class with fields `a`, `b` and an `area()` method
- {{t j1 4:32:35}} — `Rect extends Figure`
- {{t j1 4:32:46}} — the error: the parent has no no-arg constructor
- {{t j1 4:33:49}} — overriding `area()` using getters
- {{t j1 4:34:11}} — `Triangle` and its third side `c`
- {{t j1 4:35:38}} — the area via Heron's formula
- {{t j1 4:38:02}} — the problem: forget to override — the area is 0
- {{t j1 4:38:18}} — an abstract method and an abstract class
- {{t j1 4:39:06}} — why you can't create "just a figure"
- {{t j1 4:40:14}} — the compiler demands an implementation: <kbd>Ctrl+I</kbd>
- {{t j1 4:41:23}} — multi-level inheritance: `ColorRect extends Rect`
- {{t j1 4:42:41}} — `final` on a method — no overriding
- {{t j1 4:43:35}} — `final` on a class — no inheritance
- {{t j1 4:43:51}} — the three uses of `final`

## An abstract class

```java
public abstract class Figure {
    private final double a;
    private final double b;

    public Figure(double a, double b) {
        this.a = a;
        this.b = b;
    }

    public abstract double area();      // no body — just a "promise"

    public final double getA() { return a; }
    public final double getB() { return b; }
}
```

```java
public class Rect extends Figure {
    public Rect(double a, double b) { super(a, b); }
    public Rect(double size) { super(size, size); }

    @Override
    public double area() {
        return getA() * getB();
    }
}

public class Triangle extends Figure {
    private final double c;

    public Triangle(double a, double b, double c) {
        super(a, b);
        this.c = c;
    }

    public Triangle(double size) {
        this(size, size, size);
    }

    @Override
    public double area() {                               // Heron's formula
        double p = (getA() + getB() + c) / 2;
        return Math.sqrt(p * (p - getA()) * (p - getB()) * (p - c));
    }
}
```

```java
Figure rect = new Rect(5, 10);
Figure triangle = new Triangle(10);
System.out.println(rect.area());       // 50.0
System.out.println(triangle.area());   // 43.30…
// new Figure(5, 5);                   // error: Figure is abstract; cannot be instantiated
```

### What abstract gives you

| | Abstract method | Abstract class |
|---|---|---|
| Syntax | `public abstract double area();` — no body | `public abstract class Figure` |
| Meaning | Every subclass **must** implement it | You can't create an object, only extend it |
| Rule | At least one abstract method → the class must be abstract | It may contain fields, constructors and regular methods |

An abstract class describes something that exists in reality only in concrete forms: there are no "just figures" — there are triangles, rectangles, circles. The compiler won't let you forget an implementation: a subclass without `area()` won't compile (unless it's `abstract` itself). <kbd>Ctrl+I</kbd> (Implement Methods) generates stubs.

## Multi-level inheritance

```java
public class ColorRect extends Rect {
    private final String color;

    public ColorRect(double a, double b, String color) {
        super(a, b);
        this.color = color;
    }
}
```

`ColorRect` is both a `Rect` and a `Figure`. `area()` needn't be overridden: `Rect`'s implementation is used.

## final on methods and classes

| Where | What it forbids | Example |
|---|---|---|
| Variable / field | Reassignment | `final double PI = 3.14;` |
| Method | Overriding in subclasses | `public final double getA()` |
| Class | Extending it | `public final class Rect`, `String`, `Integer` |

Why forbid: so nobody "breaks" behaviour that the rest of the code relies on. For instance, an overridden `getA()` that always returns 10 would confuse every user of the class.

## What the video doesn't cover

### An abstract class can have a constructor

A frequent interview question: "Does an abstract class have a constructor if you can't create its objects?" — **Yes**. It's called via `super(...)` from subclass constructors and initialises the shared fields.

### Polymorphism with shapes

```java
List<Figure> figures = List.of(new Rect(5, 10), new Triangle(10), new Rect(3));
double total = 0;
for (Figure f : figures) {
    total += f.area();           // the concrete shape's implementation is called
}
```

Polymorphism is covered in detail in the next lesson.

### The Template Method pattern

An abstract class often defines an **algorithm**, while subclasses supply the steps:

```java
public abstract class Report {
    public final void print() {          // final: the algorithm doesn't change
        printHeader();
        printBody();                      // the step defined by the subclass
        printFooter();
    }
    protected abstract void printBody();
    private void printHeader() { System.out.println("=== Report ==="); }
    private void printFooter() { System.out.println("=============="); }
}
```

### Restricting the hierarchy — sealed

Instead of `final` (nobody extends), you can allow only specific classes to extend — `sealed ... permits` (Java 17+), see the inheritance lesson.

## Homework

The author gave the task for this topic in the previous lesson, and this lesson is its walkthrough. Exercises to reinforce abstraction:

:::task easy "Circle"
Add a `Circle` class (radius) to the shape hierarchy. What about `Figure`'s `a` and `b` fields? Propose a solution: pass the radius as `a` and `b`, or redesign `Figure` so it has no sides at all.
??? Hint
The second option is cleaner: `Figure` only declares `abstract double area()` and, say, `abstract double perimeter()`, while subclasses keep their own sides.
:::

:::task medium "Perimeter and sorting"
Add an abstract `perimeter()` method to `Figure` and implement it everywhere. Create a list of 6 different shapes and print them sorted by area (sort manually or with `figures.sort(...)`).
:::

:::task medium "Template method"
Implement an abstract `Beverage` class with a `final` `prepare()` method: boil water → `brew()` → pour into a cup → `addCondiments()`. The `Tea` and `Coffee` subclasses implement the abstract steps. Make sure the order of steps can't be changed.
:::

:::task hard "Abstract transport"
Design an abstract `Vehicle` class (model, max speed, an abstract `double travelTime(double km)`, a `final` `describe()` method) with subclasses `Car`, `Bicycle`, `Train`, each with its own logic (e.g. a train has stops, a cyclist gets tired after 30 km). Make `Train` `final`. Compute who covers 100 km fastest and print a ranking.
:::
