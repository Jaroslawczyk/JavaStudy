The remaining primitive types: the decimal `float` and `double`, the character `char` and the logical `boolean`. Plus comparison operations and the logical operators `&&`, `||`, `!`.

## Video timestamps

- {{t j1 43:55}} — floating-point numbers: `float` and `double`
- {{t j1 44:45}} — task: circle area from the radius
- {{t j1 46:50}} — the `f` suffix for `float`
- {{t j1 47:32}} — homework: the hypotenuse via Pythagoras' theorem
- {{t j1 47:48}} — square root `Math.sqrt`
- {{t j1 49:09}} — the `char` type and the character table
- {{t j1 50:03}} — two ways to set a `char`: a code or a character in quotes
- {{t j1 51:34}} — arithmetic with `char`
- {{t j1 51:58}} — the `boolean` type
- {{t j1 53:19}} — a `boolean` variable in an `if` condition
- {{t j1 54:16}} — negation `!`
- {{t j1 54:51}} — the six comparison operators, the `=` vs `==` mistake
- {{t j1 55:56}} — logical operators `||` (OR) and `&&` (AND)
- {{t j1 58:36}} — a joint task: sleep, walk or read (without `else`)
- {{t j1 59:38}} — the solution

## float and double

| Type | Size | Precision | Literal |
|---|---|---|---|
| `float` | 4 bytes | ~7 significant digits | `3.14f` (the `f` suffix is required) |
| `double` | 8 bytes | ~15–16 significant digits | `3.14` (all decimal literals are `double` by default) |

The decimal separator in code is a **dot**, not a comma.

```java
double r = 10.8;
double pi = 3.14;
double s = pi * r * r;
System.out.println("Circle area = " + s);   // 366.2496...
```

:::outdated "float or double?"
The video advises: "if you need 1–2 decimal places, use `float`". Today's accepted practice is different: **always use `double` by default**. Saving 4 bytes almost never matters, and `float`'s precision is easily eaten up even by simple computations. `float` is used in graphics, games and huge numeric arrays (machine learning).
:::

:::tip "Use Math.PI"
Instead of `3.14` write `Math.PI` (3.141592653589793): more precise and clearer.
:::

### Why 0.1 + 0.2 ≠ 0.3

```java
System.out.println(0.1 + 0.2);         // 0.30000000000000004
System.out.println(0.1 + 0.2 == 0.3);  // false
```

Decimal numbers are stored in **binary** (the IEEE 754 standard), and 0.1 in binary is an infinite fraction, like 1/3 in decimal. Hence the rules:

- **Never store money in `double`/`float`** — use `BigDecimal` or whole numbers of cents (`long`).
- Don't compare decimals with `==`; compare with a tolerance: `Math.abs(a - b) < 1e-9`.

### Division by zero with decimals

```java
System.out.println(10.0 / 0);    // Infinity
System.out.println(0.0 / 0);     // NaN (Not a Number)
```

Unlike `int`, no exception is thrown.

## char — a character

A `char` holds **one character** in single quotes. Internally it is a number — the character code in the **Unicode** table (UTF-16), which is why `char` is formally an integer type (0 … 65,535).

```java
char ch1 = 89;      // the code of 'Y'
char ch2 = 'Y';     // the character itself
System.out.println(ch1 + " " + ch2);   // Y Y
ch1 += 1;
System.out.println(ch1);               // Z
```

:::note "ASCII and Unicode"
The video talks about the ASCII table. More precisely: Java uses **Unicode**, and the first 128 Unicode codes match ASCII (Latin letters, digits, punctuation). Cyrillic and Polish letters are there too: `'Ж'` = 1046, `'ł'` = 322. Emoji don't fit into a single `char` — they need a pair of `char`s (a surrogate pair).
:::

Useful `Character` methods: `Character.isDigit(c)`, `Character.isLetter(c)`, `Character.toUpperCase(c)`.

## boolean — the logical type

A `boolean` holds only `true` or `false`. That's exactly what comparison operations return:

```java
int temp = 26;
boolean isHot = temp > 25;   // true

if (isHot) {
    System.out.println("Air conditioner on");
}
if (!isHot) {                // ! means "NOT"
    System.out.println("Air conditioner off");
}
```

### Comparison operators

`<`, `<=`, `>`, `>=`, `==` (equal), `!=` (not equal).

:::warning "= and =="
`=` is assignment, `==` is comparison. `if (temp = 25)` is a compile error (unlike C, Java won't compile it: the result is an `int`, not a `boolean`). But `if (isHot = true)` does compile and is always true — a dangerous typo. That's why booleans are checked simply as `if (isHot)`, without `== true`.
:::

### Logical operators

| Operator | Name | `true` when… |
|---|---|---|
| `&&` | AND | both conditions are true |
| `\|\|` | OR | at least one is true |
| `!` | NOT | the condition is false |
| `^` | exclusive OR (XOR) | exactly one is true |

```java
int time = 24;
boolean late = time >= 23;
if (!isHot || late) {
    System.out.println("Air conditioner off");
}
```

## The "sleep, walk or read" task

Without `else`, every condition in its own variable:

```java
int time = 19;
boolean isGoodWeather = true;
boolean late = time >= 23 || time <= 5;

if (late) {
    System.out.println("Sleep");
}
if (!late && isGoodWeather) {
    System.out.println("Go for a walk");
}
if (!late && !isGoodWeather) {
    System.out.println("Read a book");
}
```

## What the video doesn't cover

### Short-circuit evaluation

`&&` and `||` evaluate the right side **only when needed**: in `a && b`, if `a == false`, `b` is not evaluated. This allows safe code: `if (count != 0 && sum / count > 10)` — no division by zero. The `&` and `|` operators on booleans always evaluate both sides — they are rarely used.

### Operator precedence

`!` → arithmetic → comparisons → `==`/`!=` → `&&` → `||` → `?:` → assignments. When in doubt, use parentheses: `(a && b) || c` is unambiguous.

### Converting decimals to integers

```java
double d = 9.99;
int i = (int) d;                 // 9 — the fractional part is dropped
long rounded = Math.round(d);    // 10 — mathematical rounding
double f = Math.floor(-2.5);     // -3.0 — down
double c = Math.ceil(2.1);       // 3.0 — up
```

### Useful Math methods

`Math.sqrt`, `Math.pow(2, 10)`, `Math.abs`, `Math.max/min`, `Math.round`, `Math.hypot(a, b)` — the hypotenuse in one call (but do the homework with `sqrt` first!).

## Homework

:::task video "Hypotenuse — from the video"
Given the legs `a` and `b` of a right triangle, print the hypotenuse `c` using Pythagoras' theorem: c = √(a² + b²). {{t j1 47:32}}
??? Hint
```java
double a = 3, b = 4;
double c = Math.sqrt(a * a + b * b);   // 5.0
```
:::

:::task easy "Celsius → Fahrenheit"
Convert a temperature from Celsius to Fahrenheit: F = C × 9/5 + 32. Check with 36.6 °C (should give 97.88). Why do `c * 9 / 5` and `9 / 5 * c` give different results when `c` is an `int`?
:::

:::task easy "Character codes"
Print the codes of `'A'`, `'Z'`, `'a'`, `'0'`, `'Ж'`, `'ł'` and the character after `'A'` using `char` arithmetic.
??? Hint
To see a code, cast to `int`: `(int) 'A'` → 65. To get the next character: `(char) ('A' + 1)` → `B`.
:::

:::task medium "Leap year"
Write the leap-year rule as **one** logical expression stored in `boolean isLeap`: divisible by 4 but not by 100, or divisible by 400. Check 1900 (no), 2000 (yes), 2024 (yes), 2026 (no).
??? Hint
`boolean isLeap = (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;`
:::

:::task hard "Does the triangle exist"
Given three sides (`double`), determine with separate `boolean` variables whether the triangle exists (each side is less than the sum of the other two), and whether it is equilateral, isosceles and right-angled. Account for `double` imprecision when checking the right angle.
??? Hint
Right-angled: `Math.abs(a*a + b*b - c*c) < 1e-9` for the largest side `c`. Find the largest side with `Math.max` first.
:::
