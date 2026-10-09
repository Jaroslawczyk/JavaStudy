Preparing for collections: we revisit `import`, meet the **wrapper classes** (`Integer`, `Double`, `Boolean`…) and autoboxing, and learn to turn strings into numbers (`parseInt`) and cut parts out of strings (`substring`).

## Video timestamps

- {{t j1 3:43:13}} — what's still missing before collections
- {{t j1 3:43:23}} — `import` and classes from other packages
- {{t j1 3:44:05}} — `import java.util.ArrayList`
- {{t j1 3:44:48}} — automatic import: <kbd>Alt+Enter</kbd> and completion
- {{t j1 3:45:12}} — why `Math` and `String` need no import: `java.lang`
- {{t j1 3:46:06}} — wrapper classes
- {{t j1 3:46:50}} — autoboxing
- {{t j1 3:47:16}} — use primitives wherever possible
- {{t j1 3:47:28}} — all eight wrappers
- {{t j1 3:49:04}} — string → number: `Integer.parseInt`
- {{t j1 3:50:50}} — `Boolean.parseBoolean`
- {{t j1 3:51:48}} — `substring`: cutting out part of a string
- {{t j1 3:53:57}} — homework

## Wrapper classes

Every primitive type has a **reference counterpart** — a wrapper class:

| Primitive | Wrapper |
|---|---|
| `byte` | `Byte` |
| `short` | `Short` |
| `int` | `Integer` |
| `long` | `Long` |
| `float` | `Float` |
| `double` | `Double` |
| `char` | `Character` |
| `boolean` | `Boolean` |

Why we need them:

- **Collections store only objects**: `ArrayList<int>` won't compile; you need `ArrayList<Integer>` (next lesson).
- A wrapper can be `null` — "no value" (e.g. an optional database column).
- Useful static methods and constants: `Integer.parseInt`, `Integer.MAX_VALUE`, `Character.isDigit`, `Double.compare`.

### Autoboxing and unboxing

```java
Integer a = 5;        // autoboxing: int → Integer
int b = a + 10;       // unboxing: Integer → int
```

The compiler inserts `Integer.valueOf(5)` and `a.intValue()` for you. Convenient, but **not free**: objects get created and memory is spent. So the video's rule is right — **use primitives wherever possible**.

## String → number

```java
String s1 = "1000";
String s2 = "2000";
System.out.println(s1 + s2);                 // 10002000 — string concatenation!

int n1 = Integer.parseInt(s1);
int n2 = Integer.parseInt(s2);
System.out.println(n1 + n2);                 // 3000

double d = Double.parseDouble("166.3");
long l = Long.parseLong("9000000000");
boolean b = Boolean.parseBoolean("false");   // false
```

:::warning "NumberFormatException"
`Integer.parseInt("12a")`, `Integer.parseInt("")` and `Double.parseDouble("166,3")` throw a `NumberFormatException` — the program crashes. Note: in Java the decimal separator is a **dot**, so "166,3" must be fixed first: `s.replace(',', '.')`.
:::

`Boolean.parseBoolean` returns `true` only for the string `"true"` (case-insensitively: `"TRUE"` and `"True"` also give `true`); anything else gives `false`. There's no `parse` method for `char`: take a character with `s.charAt(0)`.

The reverse — number to string: `String.valueOf(42)`, `Integer.toString(42)` or `"" + 42`.

## substring — part of a string

```java
String s = "This is Igor, he is a programmer";
String name = s.substring(8, 12);  // "Igor" — from index 8 inclusive to 12 EXCLUSIVE
String tail = s.substring(8);      // "Igor, he is a programmer" — from 8 to the end
```

The "start inclusive, end exclusive" rule holds almost everywhere in Java (`substring`, `subList`, `Arrays.copyOfRange`, `IntStream.range`). Handy: the result's length is `end - start`.

## What the video doesn't cover

:::outdated "new Integer(5) is no longer used"
Old code contains `new Integer(5)`, `new Double(3.14)`. These constructors have been deprecated since Java 9 and marked for removal (`forRemoval`) since Java 16. Use `Integer.valueOf(5)` or simply autoboxing: `Integer x = 5;`.
:::

### Trap: comparing wrappers with ==

```java
Integer a = 127, b = 127;
System.out.println(a == b);        // true  — values from -128 to 127 are cached
Integer c = 128, d = 128;
System.out.println(c == d);        // false — different objects!
System.out.println(c.equals(d));   // true
```

Like strings, wrappers are compared with `equals`. A popular interview question ("Integer cache").

### Trap: unboxing null

```java
Integer count = null;
int x = count;        // NullPointerException during unboxing
```

### Searching instead of "magic" indexes

Hard-coded indexes (`substring(8, 12)`) break as soon as the text changes. Finding positions is more reliable:

```java
int start = s.indexOf(" is ") + 4;
int end = s.indexOf(",", start);
String name = s.substring(start, end);
```

Or split the string: `s.split(" ")`, `s.split("\\. ")`. Complex parsing calls for regular expressions — see the [Regular Expressions](#/extra/regex) article.

## Homework

:::task video "Parsing a sentence about a person — from the video"
Create a `Man` class with private fields `String name`, `String position`, `int age`, `double height` and an all-fields constructor. In `main` you have the string `"This is Ivan. He is 34 years old. His height is 166,3 cm. Position programmer"`. Extract the data into separate variables, create a `Man` object and print all fields through getters. {{t j1 3:53:57}}
??? Hint
Split the string by `". "` — you get 4 parts. Take what you need from each with `substring`/`split(" ")`. The number: `Integer.parseInt("34")`. The height: `Double.parseDouble("166,3".replace(',', '.'))`.
:::

:::task easy "String calculator"
The user enters two numbers as strings (with `Scanner.nextLine()`). Print their sum, difference, product and quotient. If the input isn't a number, detect it beforehand (`s.matches("-?\\d+")`) and print a clear message.
:::

:::task medium "A list of numbers from a string"
Given the string `"12, 7, 33, -5, 18"`, turn it into an `int[]` and find the sum, minimum and maximum.
??? Hint
`String[] parts = s.split(",\\s*");` — the separator is "a comma and any spaces". Then `Integer.parseInt(parts[i])`.
:::

:::task hard "See the Integer cache"
Write a program that checks `Integer.valueOf(i) == Integer.valueOf(i)` for numbers from −200 to 200 and prints the range where the result is `true`. Then run it with the JVM flag `-XX:AutoBoxCacheMax=1000` and explain the change. Why is comparing wrappers with `==` a bug even if "it works in tests"?
:::
