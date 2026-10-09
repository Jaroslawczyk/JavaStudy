Variables are the foundation of every program. We learn to declare variables, store integers of type `int` in them, do arithmetic and print the result.

## Video timestamps

- {{t j1 12:43}} — what a variable is (the toothbrush-case analogy)
- {{t j1 13:12}} — declaration and assignment
- {{t j1 14:07}} — the `int` type
- {{t j1 14:50}} — practice: a new project, the `IntegerManipulations` class
- {{t j1 16:26}} — assigning values, `c = a + b`
- {{t j1 17:38}} — printing a variable with a label (string concatenation)
- {{t j1 18:22}} — changing a variable's value
- {{t j1 19:15}} — integer division: `10 / 3 = 3`
- {{t j1 19:56}} — the remainder operator `%`
- {{t j1 20:31}} — compound operators `+=`, `*=`
- {{t j1 21:25}} — task: how many years, months and days are in 5000 days
- {{t j1 25:11}} — homework

## What a variable is

A **variable** is a named memory cell that holds a value. The author compares it to a toothbrush case: the case (variable) can be empty or hold a toothbrush (value), but you can't put a guitar into it — the type is fixed.

```java
int number;        // declaration: type + name
number = 5;        // assignment
int count = 10;    // declaration with initialisation
```

- First comes the **type** (`int`), then the **name**, then `;`.
- The `=` sign is **assignment**, not mathematical "equals": "put the value on the right into the variable on the left".
- A variable can be used only after it has been assigned a value — otherwise you get the compile error `variable might not have been initialized`.

## The int type and arithmetic

`int` stores whole numbers from roughly −2.1 billion to 2.1 billion.

```java
int a = 5;
int b = 7;
int c = a + b;
System.out.println("a + b = " + c);   // a + b = 12

c = c + 5;      // 17
c = c * 10;     // 170
```

| Operator | Operation | Example | Result |
|---|---|---|---|
| `+` | addition | `7 + 3` | `10` |
| `-` | subtraction | `7 - 3` | `4` |
| `*` | multiplication | `7 * 3` | `21` |
| `/` | division (for `int` — **integer** division) | `10 / 3` | `3` |
| `%` | remainder | `10 % 3` | `1` |

:::warning "Integer division"
If both operands are integers, the result is an integer too and the fractional part is **dropped** (not rounded!): `10 / 3 == 3`, `-7 / 2 == -3`. To get a fractional result, at least one operand must be a decimal: `10 / 3.0 == 3.333…` (see the lesson on decimal types).
:::

### Compound assignment operators

| Full form | Short form |
|---|---|
| `c = c + 5` | `c += 5` |
| `c = c - 5` | `c -= 5` |
| `c = c * 10` | `c *= 10` |
| `c = c / 2` | `c /= 2` |
| `c = c % 3` | `c %= 3` |

### String concatenation

The `+` operator with a string "glues" values together: `"c = " + c` → `"c = 170"`. Watch the order:

```java
int a = 5, b = 7;
System.out.println("Sum: " + a + b);    // Sum: 57  — glued as strings!
System.out.println("Sum: " + (a + b));  // Sum: 12  — parentheses compute the number first
System.out.println(a + b + " is the sum"); // 12 is the sum  — left to right: numbers first
```

## The video task: days → years, months, days

```java
public class Days {
    public static void main(String[] args) {
        int days = 5000;
        int years = days / 365;
        int months = (days % 365) / 31;
        int leftDays = days - years * 365 - months * 31;

        System.out.println("Total days: " + days);
        System.out.println("Years: " + years);
        System.out.println("Months: " + months);
        System.out.println("Days: " + leftDays);
    }
}
```

Result: 13 years, 8 months, 7 days. Note the "divide + remainder" technique: `/` gives the number of whole parts, `%` gives what's left. You will need it in the homework.

:::note
This is a teaching task: a year is always 365 days and a month is 31 days. For real dates Java has the `java.time` package (`Period`, `Duration`, `LocalDate`) that handles leap years and different month lengths. It is covered in the separate article [Date and Time](#/extra/date-time).
:::

## What the video doesn't cover

### Variable naming rules

- Allowed: letters, digits, `_` and `$`; you **cannot** start with a digit: `2count` is an error.
- Keywords are not allowed: `int class = 5;` is an error.
- Style: `lowerCamelCase` — `totalPrice`, `daysInMonth`. The name should explain the meaning: `d` is worse than `days`.

### Constants and `final`

```java
final int DAYS_IN_YEAR = 365;
DAYS_IN_YEAR = 366;   // compile error: the variable is final
```

`final` forbids reassignment. Move such "magic numbers" into constants with clear names.

### The var keyword (Java 10+)

```java
var days = 5000;      // the compiler infers the type int
```

`var` is not a "dynamic type": the type is determined once at compile time and never changes. Handy for long types, but beginners should write `int` explicitly.

### Underscores in numbers (Java 7+)

```java
int days = 5_000;
int million = 1_000_000;
```

In the video "5.000" is just how the number is spoken. In Java code a dot separates the **fractional** part, while digit groups are separated with `_`.

### Division by zero

```java
int x = 10 / 0;   // ArithmeticException: / by zero — the program crashes
```

### Keyboard input

In the video values are hard-coded. To make the program ask the user, use `Scanner`:

```java
import java.util.Scanner;

public class InputDemo {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter the number of seconds: ");
        int seconds = scanner.nextInt();
        System.out.println("You entered: " + seconds);
    }
}
```

Since Java 25 it is even simpler: `int seconds = Integer.parseInt(IO.readln("Enter seconds: "));`

## Homework

:::task video "Seconds → days, hours, minutes, seconds — from the video"
Create a class with a number of seconds; the program prints how many days, hours, minutes and seconds that is. {{t j1 25:11}}
??? Hint
A day has 86,400 seconds, an hour 3,600, a minute 60. Use "divide + remainder":
```java
int total = 100000;
int days = total / 86400;
int hours = total % 86400 / 3600;
int minutes = total % 3600 / 60;
int seconds = total % 60;
```
For 100,000 seconds: 1 day, 3 hours, 46 minutes, 40 seconds.
:::

:::task easy "Rectangle"
Store a rectangle's length and width in `int` variables and print the area and the perimeter with labels.
:::

:::task easy "Sum of digits"
Given a three-digit number such as `472`, print its digits separately and their sum (4 + 7 + 2 = 13) using only `/` and `%`.
??? Hint
The last digit is `n % 10`, the middle one `n / 10 % 10`, the first `n / 100`.
:::

:::task medium "Swapping values"
You have `int a = 3, b = 8;`. Swap the values so that `a == 8`, `b == 3`. First with a third variable, then **without** it, using arithmetic only.
??? Hint
Without a third variable: `a = a + b; b = a - b; a = a - b;`. Think about what happens with very large numbers (overflow is covered in the next lesson on integer types).
:::

:::task hard "Change in coins"
A customer must receive `n` cents (say 289). There are coins of 50, 20, 10, 5, 2, 1. Print how many coins of each value to give so that the number of coins is minimal. Then read `n` from the keyboard with `Scanner`.
??? Hint
This is a "greedy" algorithm: use the largest coins as much as possible, then the next ones for the remainder.
```java
int coins50 = n / 50;  n %= 50;
int coins20 = n / 20;  n %= 20;
// ...
```
For 289: 5×50, 1×20, 1×10, 1×5, 2×2, 0×1.
:::
