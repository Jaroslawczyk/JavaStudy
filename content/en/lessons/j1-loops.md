A **loop** repeats actions while a condition holds. Instead of a thousand `println` lines — three lines of a loop. We cover `while`, `do-while`, `for`, the `++`/`--` operators and `break`.

## Video timestamps

- {{t j1 1:02:40}} — what a loop is
- {{t j1 1:03:34}} — increment `++` and decrement `--`
- {{t j1 1:04:54}} — task: print the numbers from 1 to 1000
- {{t j1 1:05:23}} — the `while` loop
- {{t j1 1:07:35}} — an infinite loop: what happens without `i++`
- {{t j1 1:08:15}} — leaving a loop early: `break`
- {{t j1 1:09:09}} — task: even numbers from 1000 down to 0
- {{t j1 1:10:52}} — task: the average of the numbers 0 to 100
- {{t j1 1:14:14}} — the `do-while` loop
- {{t j1 1:16:36}} — the `for` loop
- {{t j1 1:18:11}} — task: numbers from 1000 to 0 divisible by 3
- {{t j1 1:19:14}} — homework

## Increment and decrement

```java
int a = 10;
a = a + 1;   // 11
a += 1;      // 12
a++;         // 13 — increment: +1
a--;         // 12 — decrement: −1
```

## The while loop

```java
int i = 1;
while (i <= 1000) {
    System.out.println(i);
    i++;
}
```

The order: **check the condition → if true, run the body → check again**. As soon as the condition becomes `false`, the loop ends and the program moves on.

:::warning "Infinite loop"
If you forget `i++`, the condition `i <= 1000` stays true forever and the program never stops. In IDEA stop it with the red ■ Stop button (<kbd>Ctrl+F2</kbd>).
:::

### break — early exit

```java
int i = 1;
while (i <= 1000) {
    if (i == 5) {
        break;          // leave the loop immediately
    }
    System.out.println(i);   // 1 2 3 4
    i++;
}
```

## The do-while loop

It runs the body first and checks the condition afterwards — so the body runs **at least once**:

```java
int a = 0;
do {
    System.out.println("Hello");   // printed once
} while (a > 0);                   // the ; after while is required
```

It's used rarely — e.g. "keep asking for input until the user enters a valid value".

## The for loop

Best when **the number of repetitions is known**:

```java
for (int i = 0; i < 100; i++) {
    System.out.println(i);   // 0 … 99
}
```

The parentheses hold three parts separated by `;`:

1. **Initialisation** — runs once: `int i = 0`
2. **Condition** — checked before each step: `i < 100`
3. **Update** — runs after each step: `i++`

```java
// Numbers from 1000 down to 0 divisible by 3
for (int i = 1000; i >= 0; i--) {
    if (i % 3 == 0) {
        System.out.println(i);
    }
}
```

The fourth kind of loop — **for-each** — comes in the arrays lesson.

## The task: average of 0 to 100

```java
int sum = 0;
int count = 1;
while (count <= 100) {
    sum += count;
    count++;
}
float result = sum / (float) count;   // the cast — otherwise integer division
System.out.println(result);           // 50.0
```

:::note "A subtlety in the video's solution"
The numbers from 0 to 100 are **101** numbers, their sum is 5050, and the average is 5050 / 101 = 50. The video's code gives the right answer because `count` equals 101 after the loop. But the explanation "divide by 100" is inaccurate: if the task were about 1 to 100, the correct answer would be 5050 / 100 = **50.5**. Always check what the counter equals *after* the loop!
:::

## What the video doesn't cover

### continue — skip a step

```java
for (int i = 1; i <= 10; i++) {
    if (i % 2 == 0) {
        continue;            // jump straight to the next iteration
    }
    System.out.println(i);   // 1 3 5 7 9
}
```

### The step doesn't have to be 1

Instead of checking a remainder, it's often simpler to step by the right amount:

```java
for (int i = 1000; i >= 0; i -= 2) {   // only even numbers — no if
    System.out.println(i);
}
```

### i++ vs ++i

```java
int a = 5;
int b = a++;   // b = 5, a = 6 — postfix: return the value, then increment
int c = ++a;   // c = 7, a = 7 — prefix: increment, then return
```

In a `for` loop there's no difference. Inside expressions there is — better not to mix `++` into complex expressions.

### Counter scope

The variable `i` declared in `for (int i = …)` exists only inside the loop. After the loop it is gone — this protects against accidental use.

### Nested loops and labels

```java
for (int row = 1; row <= 9; row++) {
    for (int col = 1; col <= 9; col++) {
        System.out.print(row * col + "\t");
    }
    System.out.println();
}
```

To leave two loops at once, use a label: `outer: for (…) { for (…) { break outer; } }`. More often it's better to move the loops into a method and `return`.

### Which loop to choose

| Situation | Loop |
|---|---|
| Known number of repetitions / iterating over indexes | `for` |
| Repeat while a condition holds (unknown count) | `while` |
| The body must run at least once | `do-while` |
| Go over every element of an array/collection | `for-each` (next lesson) |
| Functional-style collection processing | Stream API (part 2 of the course) |

## Homework

:::task video "Odd numbers divisible by 5 — from the video"
Print all odd numbers from 100 to 1000 inclusive that are divisible by 5. {{t j1 1:19:14}}
??? Hint
The brute-force solution: `for` from 100 to 1000 with the condition `i % 2 != 0 && i % 5 == 0`. A smarter one: odd multiples of 5 end in 5, so `for (int i = 105; i <= 1000; i += 10)`.
:::

:::task easy "Multiplication table"
Print the multiplication table for 7: `7 x 1 = 7` … `7 x 10 = 70`.
:::

:::task easy "Digit sum"
Given any positive integer (e.g. 98,765), compute the sum of its digits (35) using a `while` loop.
??? Hint
While the number is greater than zero: add `n % 10` to the sum and do `n /= 10`.
:::

:::task medium "Guess the number"
The program "thinks of" a number from 1 to 100 (`int secret = (int) (Math.random() * 100) + 1;`). The user enters guesses via `Scanner`, and the program answers "higher", "lower" or "you got it in N tries". Use `do-while`.
:::

:::task medium "FizzBuzz"
Print the numbers 1 to 100, but print `Fizz` for multiples of 3, `Buzz` for multiples of 5 and `FizzBuzz` for multiples of both. A classic interview task.
??? Hint
The order of checks matters: check `i % 15 == 0` first.
:::

:::task hard "Prime numbers"
Print all primes from 2 to 1000 and their count (it should be 168). Then optimise: test divisors only up to `√n`, and skip even numbers greater than 2 entirely.
??? Hint
For each `n` the inner loop looks for a divisor `d` from 2 while `d * d <= n`. If found, the number is composite — `break`. Use `boolean isPrime = true;` before the inner loop.
:::
