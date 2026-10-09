We systematise **exceptions**: the `Throwable` hierarchy, checked and unchecked exceptions, `throws` and when to handle what. At the end — the `finalize()` method, which interviewers ask about even though it's long obsolete.

## Video timestamps

- {{t j2 7:06:49}} — what kinds of exceptions there are
- {{t j2 7:07:19}} — division by zero: `ArithmeticException` at runtime
- {{t j2 7:08:01}} — runtime / unchecked exceptions
- {{t j2 7:08:13}} — `ArrayIndexOutOfBoundsException`, `NullPointerException`
- {{t j2 7:09:23}} — they all extend `RuntimeException`
- {{t j2 7:09:39}} — checked exceptions
- {{t j2 7:10:34}} — `throws`: propagating an exception further
- {{t j2 7:11:42}} — `throws` on `main`
- {{t j2 7:13:05}} — `Exception`, `Throwable`, `Error`
- {{t j2 7:13:38}} — `OutOfMemoryError`
- {{t j2 7:14:25}} — the `finalize()` method
- {{t j2 7:15:13}} — what it was for and why it isn't used
- {{t j2 7:15:52}} — experiment: `finalize` during garbage collection

## The hierarchy

```
Throwable
├── Error                    — JVM problems: OutOfMemoryError, StackOverflowError
└── Exception
    ├── RuntimeException     — unchecked: NPE, IllegalArgumentException, ArithmeticException,
    │                          IndexOutOfBoundsException, ClassCastException…
    └── (everything else)    — checked: IOException, SQLException, InterruptedException…
```

| | Checked | Unchecked |
|---|---|---|
| Extends | `Exception` (not `RuntimeException`) | `RuntimeException` or `Error` |
| The compiler requires handling | ✅ `try-catch` or `throws` | ❌ |
| Cause | external circumstances: a missing file, the network went down | a programmer's mistake or invalid arguments |
| What to do | handle or propagate deliberately | fix the code (not catch it) |

## throws

```java
private static InputStream open(File file) throws FileNotFoundException {
    return new FileInputStream(file);        // not handled here — the caller decides
}

public static void main(String[] args) {
    try {
        open(new File("data.txt"));
    } catch (FileNotFoundException e) {
        System.out.println("File not found: " + e.getMessage());
    }
}
```

`throws` in the signature is part of the method's contract: the caller must handle it or propagate it further. If it's propagated out of `main`, the exception crashes the program with a stack trace — acceptable for learning examples, not in real code.

:::interview "Interview question"
**How do checked and unchecked exceptions differ?** — The compiler forces you to handle checked ones (subclasses of `Exception` other than `RuntimeException`) or declare them in `throws`; they describe expected external failures. Unchecked ones (`RuntimeException` and subclasses) needn't be handled; usually they're bugs in the code. `Error` is a JVM failure and isn't caught. The common ancestor is `Throwable`.
:::

## Good practices (not from the video)

- **Don't swallow exceptions:** an empty `catch` or just `e.printStackTrace()` in production loses information. Log it (`log.error("…", e)`) or rethrow.
- **Wrap with a cause:** `throw new ServiceException("Failed to load order " + id, e);` — the original stack trace is kept (`getCause()`).
- **Multi-catch (Java 7):** `catch (IOException | SQLException e)`.
- **Catch specific types**, not `Exception`/`Throwable`.
- **Your own exceptions:** `class OrderNotFoundException extends RuntimeException` — modern frameworks (Spring) mostly use unchecked ones and turn errors into HTTP responses centrally.
- **Helpful NullPointerExceptions** (Java 14+): the message says exactly what was `null`: `Cannot invoke "String.length()" because "user.name" is null`.

## finalize()

The `Object.finalize()` method was called by the garbage collector **before** removing an object — intended for releasing resources.

Why it's not used:
- **You don't know when** it will be called, or whether at all (the GC may not run before the program ends).
- It slows down garbage collection, an object can be "resurrected", and exceptions in it are silently ignored.
- It's a source of vulnerabilities (the finalizer attack).

:::outdated "finalize() is deprecated for removal (JEP 421, Java 18)"
`finalize()` was deprecated back in Java 9, and since Java 18 it's **deprecated for removal** (JEP 421); finalization can be disabled with the `--finalization=disabled` flag. Replacements:
- **try-with-resources** and `AutoCloseable` — deterministic resource release (the main way);
- **`java.lang.ref.Cleaner`** (Java 9) — a safety net in case `close()` was forgotten.
:::

:::interview "Interview question"
**What is `finalize()` for?** — It was called by the GC before destroying an object to release resources. Neither the timing nor the call itself is guaranteed, so you can't rely on it; the method is obsolete and deprecated for removal (JEP 421). Use try-with-resources and `Cleaner`.
:::

## Homework

The video has no tasks — here are our own.

:::task easy "Classify them"
For each exception, state checked/unchecked/error and a typical cause: `IOException`, `NumberFormatException`, `InterruptedException`, `ConcurrentModificationException`, `StackOverflowError`, `CloneNotSupportedException`, `IllegalStateException`. Trigger each in code.
:::

:::task medium "Your own exceptions"
A money-transfer service: `InsufficientFundsException` (checked — the client can top up the account) and `AccountNotFoundException` (unchecked). The `transfer` method propagates the first one, and the calling code prints a clear message. Wrap a low-level error in your own exception with a cause and print the whole `getCause()` chain.
:::

:::task hard "Cleaner instead of finalize"
Create a class `NativeBuffer implements AutoCloseable` that "allocates a resource" (prints) and releases it in `close()`. Register a safety-net action via `Cleaner` that runs if `close()` was forgotten. Show both scenarios: try-with-resources, and a forgotten object + `System.gc()`. Why must the cleanup action not reference the object itself?
:::
