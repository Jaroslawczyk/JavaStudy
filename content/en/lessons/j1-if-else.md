So far programs ran line after line. The `if` statement lets you run code **only under a certain condition** — for example, turn on the air conditioner if the room is hot.

## Video timestamps

- {{t j1 25:26}} — why we need a conditional statement (the air-conditioner example)
- {{t j1 25:55}} — `if` syntax
- {{t j1 26:37}} — practice: the "Temperature" project
- {{t j1 28:22}} — what happens when the condition is false
- {{t j1 28:48}} — the `else` block
- {{t j1 29:32}} — `else if`: checking several conditions
- {{t j1 30:34}} — the final `else` — "no condition matched"
- {{t j1 31:34}} — homework

## Syntax

```java
if (condition) {
    // runs if the condition is true
} else if (otherCondition) {
    // runs if the first is false and this one is true
} else {
    // runs if all conditions are false
}
```

A **condition** is an expression whose result is `true` or `false`, e.g. `temp > 25`. The `boolean` type is covered in detail two lessons later.

## The video example

```java
public class Temperature {
    public static void main(String[] args) {
        int temp = 23;

        if (temp > 25) {
            System.out.println("Air conditioner on");
        } else if (temp < 22) {
            System.out.println("Air conditioner off");
        } else {
            System.out.println("Air conditioner does nothing");
        }
    }
}
```

| `temp` | What is checked | Output |
|---|---|---|
| 30 | `30 > 25` → true | Air conditioner on |
| 23 | `23 > 25` → false, `23 < 22` → false | Air conditioner does nothing |
| 21 | `21 > 25` → false, `21 < 22` → true | Air conditioner off |

Important: in an `if / else if / else` chain **exactly one branch** runs — the first one whose condition is true. The remaining checks are skipped.

## Comparison operators

| Operator | Meaning |
|---|---|
| `>` / `<` | greater / less than |
| `>=` / `<=` | greater or equal / less or equal |
| `==` | equal (two signs!) |
| `!=` | not equal |

## What the video doesn't cover

### Always use curly braces

If a branch has a single statement, braces are formally optional — but that is a common source of bugs:

```java
if (temp > 25)
    System.out.println("Turning on");
    System.out.println("Cooling");   // runs ALWAYS — the indentation lies!
```

The rule in most teams (and in Google Java Style): **always use braces**.

### Nested conditions

```java
if (temp > 25) {
    if (isNight) {
        System.out.println("Quiet mode");
    } else {
        System.out.println("Maximum cooling");
    }
}
```

Deep nesting is hard to read: combine conditions with the logical operators `&&` and `||` (see the `boolean` lesson) or move checks into methods.

### The ternary operator

A short form of `if-else` that **returns a value**:

```java
String status = temp > 25 ? "hot" : "normal";
```

Read it as "if `temp > 25` then `"hot"`, otherwise `"normal"`". Use it for simple cases and never nest ternaries.

### The switch statement

When one variable is compared against many values, `switch` is handier — see the lesson [Strings and switch](#/lessons/j1-strings-switch).

### Range boundaries

It is easy to get the boundaries wrong in the homework: "from 300 to 500" — including 300? 500? Always decide explicitly and test the program on **boundary values**: 99, 100, 299, 300, 500, 501.

## Homework

:::task video "What to buy for lunch — from the video"
You have some money in your pocket. More than 500 — buy pizza; 300 to 500 — shawarma; 100 to 300 — a hamburger; less than 100 — instant noodles. The program prints the product name. {{t j1 31:34}}
??? Hint
Check from the largest to the smallest — then each next `else if` needs only one boundary:
```java
int money = 350;
if (money > 500) {
    System.out.println("Pizza");
} else if (money >= 300) {
    System.out.println("Shawarma");
} else if (money >= 100) {
    System.out.println("Hamburger");
} else {
    System.out.println("Instant noodles");
}
```
:::

:::task easy "Even or odd"
Given a number, print "even" or "odd".
??? Hint
A number is even if the remainder of dividing by 2 is zero: `n % 2 == 0`. Careful with negatives: `-3 % 2 == -1`, so check `== 0`, not `== 1`.
:::

:::task easy "Max of three"
Given three numbers `a`, `b`, `c`, print the largest using only `if/else`. Then rewrite it with `Math.max`.
:::

:::task medium "Grade by score"
Convert a 0–100 score into a grade: 90–100 — "excellent", 75–89 — "good", 50–74 — "satisfactory", 0–49 — "fail". For values outside 0–100 print "invalid input". Test all boundary values.
:::

:::task hard "Quadratic equation"
Given integer coefficients `a`, `b`, `c` of `ax² + bx + c = 0`, print the number of roots and the roots themselves. Handle the case `a == 0` (the equation becomes linear) and the case when both `a` and `b` are zero.
??? Hint
The discriminant is `d = b*b - 4*a*c`. If `d > 0` there are two roots `(-b ± Math.sqrt(d)) / (2.0 * a)`, if `d == 0` one root, if `d < 0` no real roots. Note the `2.0` — otherwise the division would be integer division.
:::
