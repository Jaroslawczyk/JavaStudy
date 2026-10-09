**Overloading** means several methods or constructors with the same name but different parameters. This lesson also gives a first look at `static` and at calling one method from another.

## Video timestamps

- {{t j1 2:25:13}} — what method overloading is
- {{t j1 2:25:37}} — the `multiple(int, int)` method
- {{t j1 2:26:53}} — the error when passing `double`
- {{t j1 2:27:24}} — the overloaded `multiple(double, double)`
- {{t j1 2:28:15}} — <kbd>Ctrl+P</kbd> shows all variants
- {{t j1 2:28:30}} — `multiple(int)` — the square of a number
- {{t j1 2:29:31}} — meeting `static`
- {{t j1 2:30:59}} — calling a static method through the class name
- {{t j1 2:31:17}} — `Math.sqrt`, `Math.abs` — static and overloaded
- {{t j1 2:32:55}} — overload only methods with similar meaning
- {{t j1 2:33:36}} — rules: parameters must differ, not the return type
- {{t j1 2:34:29}} — constructor overloading: a cube and a box
- {{t j1 2:37:10}} — a no-arg constructor
- {{t j1 2:38:13}} — calling a method from a method instead of duplicating code
- {{t j1 2:39:22}} — homework: the `Monster` class

## Method overloading

```java
public class Calc {
    static int multiple(int a, int b) {
        return a * b;
    }

    static double multiple(double a, double b) {
        return a * b;
    }

    static int multiple(int a) {
        return a * a;
    }
}
```

```java
Calc.multiple(6, 5);       // 30   → multiple(int, int)
Calc.multiple(6.3, 5.8);   // 36.54 → multiple(double, double)
Calc.multiple(5);          // 25   → multiple(int)
```

The compiler picks the version by the **number and types of arguments**. Many JDK methods work like this: `Math.abs` exists in four variants — for `int`, `long`, `float`, `double`; `System.out.println` — for every type.

### Rules

- Overloaded methods must differ in the **number** of parameters, their **types** or the **order of types**.
- **The return type alone is not enough**: `int f(int a)` and `double f(int a)` is a compile error.
- Parameter names don't matter.

:::tip "Principle of least surprise"
Overload only methods that do **the same thing** for different inputs. A `multiple(int, int)` that multiplies and a `multiple(double, double)` that subtracts will compile, but they'll confuse everyone using your code.
:::

## A first look at static

The `multiple` methods don't use any object fields — they only need their parameters. Creating an object just for them is pointless, so they are declared `static` and called through the class name: `Calc.multiple(5)`. That's exactly how you've already called `Math.sqrt(36)`.

`static` is covered in detail in the lesson on static members.

## Constructor overloading

```java
public class Box {
    double width, height, length;

    Box(double width, double height, double length) {
        this.width = width;
        this.height = height;
        this.length = length;
    }

    Box(double size) {           // a cube
        this(size, size, size);  // calling another constructor beats copying code
    }

    Box() {                      // an empty box
        this(0);
    }

    double volume() {
        return width * height * length;
    }

    void showVolume() {
        System.out.println("Volume: " + volume());   // calling a method from a method
    }
}
```

```java
new Box(10).showVolume();          // 1000.0
new Box(15, 20, 25).showVolume();  // 7500.0
new Box().showVolume();            // 0.0
```

:::note "About public"
In the video the author notes that he sometimes writes `public` before a constructor "out of habit" and promises to explain it later — access modifiers come two lessons later.
:::

## What the video doesn't cover

### How the compiler picks an overload

Without an exact match, the compiler tries **widening** the arguments:

```java
Calc.multiple(5, 2.0);   // int 5 widens to double → multiple(double, double) = 10.0
```

Search order: exact match → primitive widening → autoboxing (`int` → `Integer`) → varargs. If two variants fit equally well — an "ambiguous method call" error.

### Overloading ≠ overriding

| | Overloading | Overriding |
|---|---|---|
| Where | In one class (or a subclass) | In a subclass |
| Signature | Different parameters | Same signature |
| When it's resolved | At compile time (static binding) | At run time (dynamic binding) |

Overriding comes in the inheritance lesson; binding in the [Static vs Dynamic Binding](#/extra/binding) article.

### The Math.abs trap

```java
Math.abs(Integer.MIN_VALUE);   // -2147483648 — the absolute value doesn't fit into int!
```

A classic overflow example that sometimes shows up in interviews.

## Homework

:::task video "Monster — from the video"
Create a `Monster` class with fields for the number of eyes, legs and arms. The no-arg constructor sets all fields to 2 ("an ordinary monster looks like a human"). Three more constructors: with the number of eyes; with eyes and arms; with all three (missing values = 2). A `voice()` method prints "Voice"; the overload `voice(int n)` prints "Voice" n times; the overload `voice(int n, String word)` prints the given word n times. {{t j1 2:39:22}}
??? Hint
Let every "short" constructor call the fullest one via `this(...)`: `Monster(int eyes) { this(eyes, 2, 2); }`. Likewise `voice()` can call `voice(1)`, and `voice(int n)` can call `voice(n, "Voice")`.
:::

:::task easy "Areas of shapes"
Create an `Area` class with static overloaded methods: `area(double r)` — circle, `area(double a, double b)` — rectangle, `area(double a, double b, double c)` — triangle via Heron's formula.
:::

:::task medium "Max for everyone"
Write overloaded static `max` methods: for two `int`s, three `int`s, an `int[]` array and two `double`s. The three-number version must reuse the two-number one.
:::

:::task hard "Which overload is called?"
Declare `print(int x)`, `print(long x)`, `print(Integer x)`, `print(Object x)`, `print(int... x)`, each printing its own name. Call `print(5)`, `print(5L)`, `print((short) 5)`, `print(Integer.valueOf(5))`, `print("5")`, `print()`. **Predict** the output first, then check and explain the selection order.
??? Hint
Order: exact match → primitive widening (`short` → `int`) → boxing → varargs. `print("5")` goes to `Object`, `print()` only to varargs.
:::
