Closing the gaps before collections: **`static`** in detail (class members, not object members), **`final`** (immutability), constants, renaming with <kbd>Shift+F6</kbd> and variable-length arguments (varargs). And finally we break `public static void main(String[] args)` down word by word.

## Video timestamps

- {{t j1 3:11:24}} — revisiting `static`
- {{t j1 3:11:47}} — the `MyMath` class and the static `square` method
- {{t j1 3:13:24}} — circle circumference and a `pi` field
- {{t j1 3:14:33}} — a static method can't see non-static fields
- {{t j1 3:14:52}} — a static field
- {{t j1 3:15:38}} — a "sloppy programmer" changes `pi`
- {{t j1 3:17:49}} — shared static state breaks someone else's method
- {{t j1 3:18:22}} — `final`: can be assigned only once
- {{t j1 3:18:57}} — `static final` constants are written in UPPERCASE
- {{t j1 3:19:34}} — rename everywhere: <kbd>Shift+F6</kbd>
- {{t j1 3:20:16}} — a `sum` method with any number of arguments
- {{t j1 3:21:13}} — variable-length arguments `int... numbers`
- {{t j1 3:23:12}} — what every word in `public static void main` means

## static — belongs to the class

| | Non-static (instance) | Static (`static`) |
|---|---|---|
| Belongs to | A specific object | The class as a whole — one for all |
| Call | `box.volume()` | `MyMath.square(20)` |
| Needs an object? | Yes | No |
| Access to instance fields | Yes | **No** — an object may not even exist |

```java
public class MyMath {
    private static final double PI = 3.14;

    public static int square(int number) {
        return number * number;
    }

    public static double length(double radius) {
        return 2 * PI * radius;
    }

    public static double area(double radius) {
        return PI * radius * radius;
    }
}
```

```java
System.out.println(MyMath.square(20));    // 400
System.out.println(MyMath.length(10));    // 62.8
```

:::warning "A static method can't see instance fields"
If `pi` is declared as an ordinary field (`private double pi = 3.14;`), then `return 2 * pi * radius;` in a static method won't compile: `non-static variable pi cannot be referenced from a static context`. A static method is called **without an object**, so it has no particular object's fields.
:::

## The danger of shared mutable state

A static field is **one per program**. In the video a "sloppy programmer" writes `pi = 10;` inside his `area` method — and after that **your** `length` method starts returning wrong values. One method quietly broke another through a shared field.

## final — assigned only once

```java
private static final double PI = 3.14;
PI = 10;   // compile error: cannot assign a value to final variable PI
```

- **A constant** = `static final`. Name it in `UPPER_SNAKE_CASE`: `PI`, `MAX_SIZE`, `DEFAULT_TIMEOUT`.
- Making a constant `public` is harmless — it can't be changed anyway (that's how `Math.PI` works). But if outside access isn't needed — `private`.

## Variable-length arguments (varargs)

```java
public static int sum(int... numbers) {   // inside, numbers is an ordinary int[]
    int sum = 0;
    for (int number : numbers) {
        sum += number;
    }
    return sum;
}
```

```java
MyMath.sum();                // 0
MyMath.sum(1);               // 1
MyMath.sum(1, 2, 3, 4);      // 10
MyMath.sum(new int[]{5, 5}); // 10 — an array works too
```

Rules: there can be only **one** varargs parameter and it must be the **last**: `format(String pattern, Object... args)`.

## public static void main(String[] args) — word by word

| Word | Meaning |
|---|---|
| `public` | Accessible from anywhere — the JVM must call it |
| `static` | No objects exist yet when the program starts, so the entry point mustn't need one |
| `void` | The method returns nothing |
| `main` | The name the JVM looks for as the entry point |
| `String[] args` | The array of command-line arguments |

:::note "About command-line arguments"
The author says he never used `args` in his whole career. In web development that's indeed rare, but in command-line tools, scripts, Docker containers and Spring Boot (`--server.port=9090`) arguments are used all the time.
:::

## What the video doesn't cover

### A static field as an object counter

The classic example of a useful static field:

```java
public class User {
    private static int count = 0;   // shared by all objects
    private final int id;

    public User() {
        count++;
        id = count;
    }

    public static int getCount() {
        return count;
    }
}
```

### All the meanings of final

| Where | Meaning |
|---|---|
| `final` variable/field | Assigned exactly once |
| `final` parameter | Can't be reassigned inside the method |
| `final` method | Can't be **overridden** in a subclass |
| `final` class | Can't be **extended** (e.g. `String`, `Integer`) |

Important: `final` on a reference forbids changing the **reference**, not the object's contents: `final int[] arr = {1, 2}; arr[0] = 100;` compiles.

### Utility classes

Classes made only of static methods (`Math`, `Arrays`, `Collections`) are declared `final` with a `private` constructor so nobody creates their objects:

```java
public final class MyMath {
    private MyMath() { }   // no objects needed
    // only static methods
}
```

### Static imports

```java
import static java.lang.Math.PI;
import static java.lang.Math.sqrt;

double r = sqrt(PI);   // without "Math."
```

Handy in tests (`assertEquals`), but don't overuse — it becomes unclear where a method comes from.

### Why static state is avoided

Mutable static fields are effectively global variables: they make testing harder and are dangerous with multithreading. Constants (`static final`) and pure static functions are fine; mutable `static` only with a good reason.

## Homework

The video has no task here (the author suggests resting before collections), so these exercises are ours.

:::task easy "Unit converter"
Create a utility class `Converter` with constants (`KM_IN_MILE = 1.609344`, `CM_IN_INCH = 2.54`) and static methods `milesToKm`, `kmToMiles`, `inchesToCm`. Make the class `final` with a `private` constructor.
:::

:::task easy "Average of any count"
Write `static double average(double... values)`. What should the empty call `average()` return? Choose a behaviour (0, `NaN` or an exception) and justify it.
:::

:::task medium "Counter and ID"
Implement a `User` class with a static counter: every new user gets a unique `id` (1, 2, 3…), and `User.getCount()` returns how many users were created. Create 5 users and print their `id`s.
:::

:::task hard "Break it and fix it"
Reproduce the experiment from the video: a class with a static **non-final** `pi` field and two static methods, one of which changes `pi`. Show how calling one method breaks the other's result. Then fix it: a `final` constant, or better — `Math.PI`. Explain why mutable static state is especially dangerous when methods are called from several threads at once.
:::
