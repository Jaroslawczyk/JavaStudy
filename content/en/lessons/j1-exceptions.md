An **exception** is a signal that something went wrong: division by zero, a malformed number, an index outside an array. We learn to catch exceptions with `try-catch-finally` so the program doesn't crash — and cover what the video leaves out: the hierarchy, checked exceptions, `throw`/`throws` and try-with-resources.

## Video timestamps

- {{t j1 5:10:14}} — today's topic: exception handling
- {{t j1 5:10:42}} — `7 / 0` crashes the program
- {{t j1 5:11:38}} — reading the log: `ArithmeticException: / by zero`
- {{t j1 5:12:01}} — the `try-catch` construct
- {{t j1 5:12:38}} — an exception is an object
- {{t j1 5:13:41}} — all exceptions extend `Exception`
- {{t j1 5:14:11}} — `NumberFormatException` from `parseInt`
- {{t j1 5:14:49}} — after an exception, the rest of the `try` block is skipped
- {{t j1 5:15:24}} — several `catch` blocks
- {{t j1 5:16:57}} — catching everything: `catch (Exception e)`
- {{t j1 5:17:54}} — `catch` order matters: specific first, general last
- {{t j1 5:19:20}} — the `finally` block
- {{t j1 5:20:05}} — `finally` always runs
- {{t j1 5:20:38}} — homework

## try-catch

```java
int a = 0;
try {
    int b = 7 / a;                          // the exception is thrown here
    int i = Integer.parseInt("12ab");       // this line is never reached
    System.out.println("Won't be printed");
} catch (ArithmeticException e) {
    System.out.println("You can't divide by zero");
} catch (NumberFormatException e) {
    System.out.println("Conversion error");
} finally {
    System.out.println("We're in the finally block");   // runs in any case
}
System.out.println("Hello");                            // the program keeps running
```

How it works:

1. The code in `try` runs line by line.
2. As soon as an exception is thrown, **the rest of the `try` code is skipped**.
3. Java looks for the first `catch` whose type matches the exception (inheritance included) and runs it.
4. `finally` runs **always** — exception or not. It's used to release resources: close a file, a network or database connection.
5. If no `catch` matches, the exception "flies" further up, and if nobody catches it, the program ends with a stack trace.

:::warning "catch order"
Catch **specific** exceptions first, **general** ones later. If `catch (Exception e)` comes first, the following `catch (ArithmeticException e)` won't compile: `exception ArithmeticException has already been caught` — nothing would ever reach it.
:::

## The exception hierarchy

```text
Throwable
├── Error                      — JVM failures: OutOfMemoryError, StackOverflowError (not caught)
└── Exception                  — CHECKED: IOException, SQLException…
    └── RuntimeException       — UNCHECKED:
        ├── ArithmeticException
        ├── NullPointerException
        ├── IllegalArgumentException
        │   └── NumberFormatException
        ├── IndexOutOfBoundsException
        │   └── ArrayIndexOutOfBoundsException
        └── ClassCastException
```

## What the video doesn't cover

### Checked and unchecked exceptions

- **Checked** (subclasses of `Exception` but not of `RuntimeException`) — the compiler **forces** you to handle them: either `try-catch` or declare `throws` in the signature. Example: reading a file throws `IOException`.
- **Unchecked** (`RuntimeException` and its subclasses) — usually programmer errors: `null`, a wrong index. Handling isn't required — better fix the code.

```java
public String readFirstLine(Path path) throws IOException {   // "I may throw an IOException"
    return Files.readAllLines(path).get(0);
}
```

A classic interview question: "How do checked and unchecked exceptions differ?"

### Throwing an exception yourself: throw

```java
public void setAge(int age) {
    if (age <= 0) {
        throw new IllegalArgumentException("Age must be positive: " + age);
    }
    this.age = age;
}
```

### Your own exception

```java
public class InsufficientFundsException extends RuntimeException {
    public InsufficientFundsException(double needed) {
        super("Insufficient funds, missing: " + needed);
    }
}
```

### Several types in one catch (Java 7+)

```java
try {
    …
} catch (ArithmeticException | NumberFormatException e) {
    System.out.println("Calculation error: " + e.getMessage());
}
```

### try-with-resources (Java 7+)

Instead of closing a resource in `finally` — automatic closing of anything implementing `AutoCloseable`:

```java
try (Scanner scanner = new Scanner(Path.of("data.txt"))) {
    while (scanner.hasNextLine()) {
        System.out.println(scanner.nextLine());
    }
} catch (IOException e) {
    System.out.println("Couldn't read the file: " + e.getMessage());
}   // scanner.close() is called automatically
```

Covered in detail in part 2 of the course, in the section on files.

### Anti-patterns

:::warning "Don't swallow exceptions"
The video shows `catch (Exception e) { }` with an empty body — "catch everything and do nothing". Fine for a demo, but in real code it's **one of the worst practices**: the error vanishes without a trace, and later it's impossible to understand why the program misbehaves. At the very least log it: `log.error("Failed to …", e)` (logging — the [Logging](#/extra/logging) article).
:::

- Don't catch `Exception`/`Throwable` "just in case" — catch what you can actually handle.
- Don't use exceptions instead of `if`: checking `a != 0` is cheaper and clearer than catching `ArithmeticException`.
- `e.printStackTrace()` is for learning; projects use a logger.
- Don't `return` from `finally`: it overrides both the result and any exception from `try`.

## Homework

:::task video "Array index out of bounds — from the video"
Create a situation that throws `ArrayIndexOutOfBoundsException` (e.g. accessing the 11th element of a 10-element array, or index −1). Handle it with `try-catch` and print "Index out of bounds". {{t j1 5:20:38}}
:::

:::task easy "Safe number input"
The user enters a string; the program tries to turn it into an `int`. If that fails, it asks again until a valid number is entered (a loop + `try-catch (NumberFormatException)`).
:::

:::task medium "A custom exception for an account"
Use the `BankAccount` class from earlier lessons. The `withdraw` method throws your `InsufficientFundsException` (a `RuntimeException` subclass) with the missing amount. Handle it in `main` and print a clear message. Then make the exception **checked** (extend `Exception`) and see what the compiler demands.
:::

:::task hard "Execution order"
Write a method with `try`, `catch` and `finally`, each containing a `System.out.println` and a `return` with different values. Call it when an exception is thrown and when it isn't. Predict what is returned and printed, then check. Explain why `return` in `finally` is considered a bug.
??? Hint
`finally` runs even after a `return` in `try`. If `finally` also has a `return`, it replaces the value from `try` and "swallows" any exception — which is why IDEA highlights such code with a warning.
:::
