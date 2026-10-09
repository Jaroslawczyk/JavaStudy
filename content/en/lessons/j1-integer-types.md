Java has eight **primitive types**. This lesson covers the four integer ones (`byte`, `short`, `int`, `long`), overflow and type casting — automatic and manual.

## Video timestamps

- {{t j1 32:10}} — the eight primitive types and their four categories
- {{t j1 33:08}} — integers: `byte`, `short`, `int`, `long`
- {{t j1 34:55}} — task: how many kilometres light travels in N days
- {{t j1 37:32}} — the `incompatible types` error
- {{t j1 38:08}} — expression type = the largest type in it
- {{t j1 38:47}} — where the negative number came from: overflow
- {{t j1 39:04}} — overflow with `byte`: 127 + 1 = −128
- {{t j1 40:29}} — why `long distance` is still negative
- {{t j1 41:23}} — automatic (widening) type conversion
- {{t j1 42:19}} — manual (narrowing) casting: `(byte) a`

## Java primitive types

| Category | Types |
|---|---|
| Integers | `byte`, `short`, `int`, `long` |
| Floating point | `float`, `double` |
| Characters | `char` |
| Logical | `boolean` |

All other types (`String`, arrays, your classes) are **reference types** — more on them later.

## Integer types

| Type | Size | Range | When it's used |
|---|---|---|---|
| `byte` | 1 byte | −128 … 127 | Files, networking, binary data |
| `short` | 2 bytes | −32,768 … 32,767 | Almost never (saving memory in huge arrays) |
| `int` | 4 bytes | −2,147,483,648 … 2,147,483,647 (≈ ±2.1 billion) | **The default** for whole numbers |
| `long` | 8 bytes | ≈ ±9.2 × 10¹⁸ | Big numbers: time in milliseconds, IDs, money in cents |

Exact limits are available as constants: `Integer.MAX_VALUE`, `Integer.MIN_VALUE`, `Long.MAX_VALUE`, `Byte.MIN_VALUE`, etc.

```java
byte b = 120;
short s = 3_500;
int i = 950_000;
long l = 9_000_000_000L;   // L at the end — a long literal
```

:::warning "The L suffix"
A number written in code has type `int` by default. A literal larger than 2.1 billion without the `L` suffix is a compile error: `integer number too large`. Use an uppercase `L`: a lowercase `l` is easily confused with the digit one.
:::

## Overflow

If a result doesn't fit into the type, Java **does not report an error** — the value "wraps around" to the other end of the range:

```java
byte b = 127;
b++;
System.out.println(b);          // -128

int big = Integer.MAX_VALUE;    // 2147483647
System.out.println(big + 1);    // -2147483648
```

It's like an old car's odometer: after 999,999 comes 000,000. That's how numbers are stored in **two's complement**.

## The video task: light in N days

```java
int days = 1000;
int speed = 300_000;                  // km/s
int seconds = days * 24 * 60 * 60;    // 86,400,000 — fits into int
long distance = speed * seconds;      // LOGIC ERROR: the result is negative!
```

Why is `distance` negative even though it's a `long`? The expression `speed * seconds` is computed **as `int`** (both operands are `int`), overflows, and only then is the corrupted value widened to `long`.

**The fix** — make at least one operand `long` *before* multiplying:

```java
long distance = (long) speed * seconds;   // cast before multiplying
// or
long distance = 300_000L * seconds;       // a long literal
```

:::tip "Rule"
The type of an arithmetic expression is the "widest" operand type (but never narrower than `int`). So order matters: `(long) a * b` is correct, `(long) (a * b)` is too late — the overflow already happened inside the parentheses.
:::

## Type casting

### Automatic (widening)

A smaller type safely becomes a larger one — no data loss:

```text
byte → short → int → long → float → double
           char ↗
```

```java
byte a = 10;
int b = a;       // OK, automatic
long c = b;      // OK
```

### Manual (narrowing)

Larger to smaller — only explicitly, and the programmer is responsible:

```java
int a = 15;
byte b = (byte) a;        // 15 — fits
int big = 300;
byte broken = (byte) big; // 44 — extra bits are dropped!
```

## What the video doesn't cover

### byte and short arithmetic always yields int

```java
byte x = 10, y = 20;
byte sum = x + y;           // ERROR: x + y is an int
byte sum2 = (byte) (x + y); // OK
x += 5;                     // OK! compound operators cast automatically
```

### Guarding against overflow

`Math.addExact`, `Math.multiplyExact` and `Math.toIntExact` throw an exception instead of silently producing a wrong result:

```java
long distance = Math.multiplyExact((long) speed, seconds);
int safe = Math.addExact(Integer.MAX_VALUE, 1);   // ArithmeticException: integer overflow
```

### When even long is not enough

For arbitrarily large integers there is `java.math.BigInteger` (and `BigDecimal` for exact decimals):

```java
BigInteger factorial = BigInteger.ONE;
for (int n = 2; n <= 50; n++) {
    factorial = factorial.multiply(BigInteger.valueOf(n));
}
System.out.println(factorial);   // 30414093201713378043612608166064768844377641568960512000000000000
```

### Other number bases in literals

```java
int hex = 0xFF;          // 255 — hexadecimal
int bin = 0b1010_1010;   // 170 — binary
int oct = 017;           // 15 — octal (a leading 0 is a trap!)
```

### Integer wrappers

Every primitive has a wrapper class: `Integer`, `Long`, `Byte`, `Short`. They are needed for collections and provide useful methods such as `Integer.parseInt("42")`. Details in the wrappers lesson.

## Homework

The video has no separate task here — the author recommends practising type casting. These exercises are for that.

:::task easy "Range table"
Print the minimum and maximum values of `byte`, `short`, `int` and `long` using the wrapper classes' `MIN_VALUE` / `MAX_VALUE` constants.
:::

:::task easy "Fix the light program"
Rewrite the program from the video so that the distance light travels in 1000 days is computed correctly. Answer: 25,920,000,000,000 km.
:::

:::task medium "Catch the overflow"
Compute `Integer.MAX_VALUE * 2` in three ways: "as is" in `int`, with a cast to `long` and with `Math.multiplyExact`. Explain each result.
??? Hint
In `int` you get `-2`: 2,147,483,647 × 2 = 4,294,967,294, which is 2³² more than fits, so the result wrapped around.
:::

:::task hard "Factorials"
Print the factorials of 1 to 25 in a `long`. Find the first `n` where the result becomes wrong (hint: check that `fact / n == previous`), then rewrite the computation with `BigInteger`.
??? Hint
20! = 2,432,902,008,176,640,000 still fits into a `long`, 21! no longer does. Loops come two lessons later — if this is too hard now, come back after the loops lesson.
:::
