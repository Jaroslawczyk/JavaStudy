Three small but very practical topics before multithreading: the **`Object`** class and its **`toString()`** method, string formatting with **`String.format`**, and random numbers with **`Math.random()`**.

## Video timestamps

- {{t j1 5:21:15}} — a few small topics before the last topic of level 1
- {{t j1 5:21:41}} — where text like `Box@1b6d3586` comes from
- {{t j1 5:21:53}} — every class extends `Object`
- {{t j1 5:22:47}} — the `toString()` method and its implicit call in `println`
- {{t j1 5:23:27}} — overriding `toString()` in `Box`
- {{t j1 5:25:29}} — joining strings with `+` is clumsy
- {{t j1 5:25:58}} — `String.format` and `%s`
- {{t j1 5:27:34}} — task: a dice
- {{t j1 5:27:50}} — `Math.random()` — a number from 0 to 1
- {{t j1 5:28:58}} — casting `double` to `int` drops the fractional part
- {{t j1 5:30:22}} — all on one line and why the parentheses matter
- {{t j1 5:32:18}} — homework

## Object and toString()

Every Java class (unless another parent is given) implicitly extends `java.lang.Object`. That's why even an empty class has `toString()`, `equals()`, `hashCode()`, `getClass()`…

`System.out.println(box)` implicitly calls `box.toString()`. `Object`'s implementation returns `ClassName@hash` — e.g. `Box@1b6d3586`, which tells a human nothing. Let's override it:

```java
@Override
public String toString() {
    return String.format("Width: %s%nLength: %s%nHeight: %s", width, length, height);
}
```

```java
System.out.println(box);
// Width: 10.0
// Length: 10.0
// Height: 10.0
```

<kbd>Alt+Insert</kbd> → **toString()** — IDEA generates the method in the format `Box{width=10.0, length=10.0, height=10.0}`.

## String.format

```java
String s = String.format("Hi, %s! You are %d, height %.1f cm", "Ivan", 34, 166.3);
// "Hi, Ivan! You are 34, height 166.3 cm" — the decimal separator depends on the system language
```

| Specifier | For | Example |
|---|---|---|
| `%s` | any value (calls `toString`) | `"%s"` → `Box{…}` |
| `%d` | an integer | `"%5d"` → `   42` |
| `%f`, `%.2f` | a decimal, with 2 digits | `"%.2f"` → `3.14` |
| `%n` | a line break (correct for the OS) | |
| `%,d` | digit grouping | `1,000,000` |
| `%-10s` | width 10, left-aligned | tables |

Since Java 15 there's a shorter form: `"Hi, %s!".formatted(name)`.

:::tip "Locale"
`%.1f` prints the decimal separator according to the system language: a comma in RU/PL, a dot in EN. If you always need a dot (e.g. for JSON or CSV): `String.format(Locale.ROOT, "%.1f", x)`.
:::

## Math.random() — a dice

```java
int dice = (int) (Math.random() * 6 + 1);   // 1…6
```

Step by step:

1. `Math.random()` — a `double` in **[0; 1)** (1 is excluded).
2. `* 6` → [0; 6).
3. `+ 1` → [1; 7).
4. `(int)` drops the fraction → 1, 2, 3, 4, 5 or 6.

:::warning "Parentheses are required"
`(int) Math.random() * 6 + 1` always gives **1**: the cast applies only to `Math.random()`, and `(int) 0.73` = 0. A cast has high precedence — wrap the whole expression in parentheses.
:::

The general formula for [min; max]: `(int) (Math.random() * (max - min + 1)) + min`.

## What the video doesn't cover

### Handier than Math.random()

```java
import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;

int a = new Random().nextInt(1, 7);                    // 1…6 (the two-argument method — Java 17+)
int b = ThreadLocalRandom.current().nextInt(10, 101);  // 10…100 — the best choice with multithreading
Random seeded = new Random(42);                         // the same sequence on every run — handy in tests
```

For cryptography (passwords, tokens) use only `java.security.SecureRandom`.

### equals and hashCode

Besides `toString()`, the `Object` methods most often overridden are `equals()` (comparison by contents) and `hashCode()` — always **together**, otherwise `HashSet`/`HashMap` misbehave. Covered in detail in part 2 of the course (writing your own `HashMap` and interview questions).

### records generate toString themselves

```java
record Point(int x, int y) { }
System.out.println(new Point(3, 4));   // Point[x=3, y=4]
```

## Homework

:::task video "A random number — from the video"
Write a program that prints a random number from 10 to 100 as the string "Random number: N. Try again", where the string is built with `String.format`. {{t j1 5:32:18}}
??? Hint
`int n = (int) (Math.random() * 91) + 10;` — 91 values (10 to 100 inclusive). Then `String.format("Random number: %d. Try again", n)`.
:::

:::task easy "toString for your classes"
Override `toString()` in the `Man`, `Dog` and `Employee` classes from earlier lessons. Put the objects into a `List` and print the list in one go with `System.out.println(list)` — note that `ArrayList` calls `toString()` on its elements by itself.
:::

:::task medium "Dice statistics"
Roll a dice 60,000 times and count how many times each face came up (an `int[7]` array). Print a table with `printf` including percentages (`%5.2f%%`). You should get about 16.67 % per face. Then "break" the dice by removing the parentheses and look at the result.
:::

:::task hard "Password generator"
Write `String generatePassword(int length)` returning a password of upper- and lowercase Latin letters, digits and the symbols `!@#$%`, where the password **must** contain at least one character from each group. Use `SecureRandom`. Explain why `Math.random()` is unsuitable for passwords.
??? Hint
First take one random character from each group, the rest from the combined set, then shuffle the result (e.g. with the Fisher–Yates algorithm). `Math.random()` is predictable: knowing a few values lets you reconstruct the next ones.
:::
