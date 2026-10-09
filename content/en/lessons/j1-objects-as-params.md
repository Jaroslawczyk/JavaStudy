Method parameters and return values can be not only primitives but also **objects**. We learn to compare objects with a method returning `-1 / 0 / 1`, write a copy constructor and methods that create new objects.

## Video timestamps

- {{t j1 2:41:00}} — objects as parameters and return values
- {{t j1 2:41:18}} — a `compare(Box box)` method that prints the result
- {{t j1 2:44:43}} — `compare` returns an `int`: 1, −1, 0
- {{t j1 2:46:48}} — the variant with one `result` variable and one `return`
- {{t j1 2:47:31}} — handling the result with `switch`
- {{t j1 2:49:02}} — a constructor that takes another box (a copy constructor)
- {{t j1 2:50:38}} — equal sizes ≠ the same object
- {{t j1 2:51:22}} — a method that returns a new box: `increase()`
- {{t j1 2:53:36}} — a universal `increase(int i)`
- {{t j1 2:54:34}} — homework

## An object as a parameter

```java
public class Box {
    private double width, height, length;

    public Box(double width, double height, double length) {
        this.width = width;
        this.height = height;
        this.length = length;
    }

    public double volume() {
        return width * height * length;
    }

    /** 1 — this box is bigger, -1 — smaller, 0 — equal volume */
    public int compare(Box box) {
        double thisVolume = volume();
        double boxVolume = box.volume();
        if (thisVolume > boxVolume) {
            return 1;
        } else if (thisVolume < boxVolume) {
            return -1;
        }
        return 0;
    }
}
```

The **calling object** is the one the method was called on (`box1` in `box1.compare(box2)`); it's available as `this`. The object passed in is the `box` parameter.

```java
int result = box1.compare(box2);
switch (result) {
    case -1 -> System.out.println("Our box is smaller");
    case 0  -> System.out.println("The boxes are equal");
    case 1  -> System.out.println("Our box is bigger");
}
```

The "negative / 0 / positive" convention is a Java standard: that's how `compareTo` works for strings, numbers and every object implementing the `Comparable` interface. Later you'll implement it to sort your own objects.

:::tip "Don't reinvent number comparison"
There are ready-made methods for comparing numbers: `return Double.compare(volume(), box.volume());` — one line instead of three `if`s, and it handles special values such as `NaN` correctly.
:::

## A copy constructor

```java
public Box(Box other) {
    this.width = other.width;     // inside the class, private fields of another object of the same class are accessible
    this.height = other.height;
    this.length = other.length;
}
```

```java
Box box1 = new Box(10, 10, 10);
Box box2 = new Box(box1);          // a NEW box with the same sizes
System.out.println(box1 == box2);  // false — different objects
```

Changing `box1` no longer affects `box2` — unlike `Box box2 = box1;`.

## A method that returns an object

```java
public Box increase(int i) {
    return new Box(width * i, height * i, length * i);
}
```

```java
Box box1 = new Box(10, 10, 10);
Box box2 = box1.increase(2);
System.out.println(box1.volume());   // 1000.0
System.out.println(box2.volume());   // 8000.0 — each dimension ×2, volume ×8
```

The method doesn't change the calling object but returns a **new** one — that's how `String.toUpperCase()`, `BigDecimal.add()` and `LocalDate.plusDays()` work. It's the basis of immutable objects.

## What the video doesn't cover

### One return or several?

The author shows two styles: several `return`s (early exit) and a single `result` variable with one `return` at the end. Modern standards (Google Java Style, most teams) **allow several returns** — the code is shorter and has no "extra" states. What matters is one consistent style per project.

### Copying: shallow and deep

If a field is itself an object (say, a box has a `Color color` field), a copy constructor writing `this.color = other.color` makes a **shallow** copy: both boxes reference the same colour object. For a **deep** copy you must copy the nested object too: `this.color = new Color(other.color)`.

Using `Object`'s `clone()` for this isn't recommended (it's considered a flawed API) — a copy constructor or a static `copyOf` method is more reliable.

### null as a parameter

Calling `box1.compare(null)` crashes with a `NullPointerException` at `box.volume()`. Public methods often validate parameters right away: `Objects.requireNonNull(box, "box must not be null");`.

## Homework

:::task video "Sum of boxes — from the video"
In `Box`, create a method that takes another box and returns a **new** one: its length = the calling box's length + the passed box's length, and the same for width and height. Add a constructor taking **two** boxes that does the same. Check that the result's volume is bigger than the sum of the two volumes, and demonstrate everything in `main`. {{t j1 2:54:34}}
??? Hint
The two-box constructor can reuse the sizes constructor: `public Box(Box a, Box b) { this(a.width + b.width, a.height + b.height, a.length + b.length); }`, and the method is just `return new Box(this, other);`.
:::

:::task easy "Comparing people"
A `Person` class (name, age) with an `int compareByAge(Person other)` method returning −1/0/1. Create three people and print who is older in each pair.
:::

:::task medium "Segment"
A `Point(x, y)` class and a `Segment` class with two point fields. Methods: `double length()`, `Point middle()` (returns a new midpoint), `boolean isLongerThan(Segment other)`. Add a copy constructor `Segment(Segment other)` making a **deep** copy of the points, and prove it in code.
:::

:::task hard "The biggest box"
Write a static method `Box largest(Box... boxes)` returning the box with the largest volume (use `compare`), and a method `Box[] sortedByVolume(Box[] boxes)` returning a **new** sorted array without modifying the original (implement the sort yourself, e.g. selection or bubble sort).
??? Hint
Copy the array first with `Arrays.copyOf(boxes, boxes.length)` and sort the copy. For an empty array `largest` could return `null` — or, better, throw an `IllegalArgumentException`.
:::
