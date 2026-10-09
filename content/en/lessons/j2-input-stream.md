Reading data from a file. Everything on a computer is bytes, so the basic reading tool is a **byte stream** — `InputStream`. We cover `FileInputStream`, the `read()` method, the duty to close resources and the **try-with-resources** construct that does it automatically.

## Video timestamps

- {{t j2 5:31:01}} — reading files: everything is made of bytes
- {{t j2 5:31:47}} — the abstract class `InputStream` and `FileInputStream`
- {{t j2 5:32:34}} — creating a file with text (Latin letters only for now)
- {{t j2 5:33:27}} — `read()`: a byte 0–255 or −1 at the end
- {{t j2 5:34:43}} — reading in a loop, casting to `char`
- {{t j2 5:35:14}} — a stream must be closed: `close()`
- {{t j2 5:35:57}} — closing in `finally`: clunky
- {{t j2 5:37:02}} — try-with-resources
- {{t j2 5:37:40}} — works with any `Closeable`/`AutoCloseable`
- {{t j2 5:38:11}} — lesson summary
- {{t j2 5:38:36}} — homework: a file of names
- {{t j2 5:39:05}} — the solution

## InputStream and FileInputStream

A "stream" here is neither a `Thread` nor a Stream API `Stream` but a sequence of bytes read in order.

```java
try (InputStream in = new FileInputStream("file1.txt")) {
    int b = in.read();                  // 0..255, or -1 — no more data
    while (b != -1) {
        System.out.print((char) b);     // for Latin text, byte = character
        b = in.read();
    }
} catch (IOException e) {
    e.printStackTrace();
}
```

Why does `read()` return an `int` and not a `byte`? A Java byte is signed (−128…127), so a real `-1` byte (`0xFF`) couldn't be told apart from "end of file". So the value is returned in the 0–255 range, and −1 is a special signal.

## Closing resources

An open stream holds an operating-system resource (a file descriptor). Unclosed streams are a leak: one day the OS refuses to open new files, and on Windows an open file can't be deleted.

Before Java 7 people wrote:

```java
InputStream in = null;
try {
    in = new FileInputStream(file);
    // reading…
} catch (IOException e) {
    e.printStackTrace();
} finally {
    if (in != null) {
        try { in.close(); } catch (IOException e) { e.printStackTrace(); }
    }
}
```

## try-with-resources (Java 7+)

```java
try (InputStream in = new FileInputStream(file);
     OutputStream out = new FileOutputStream(copy)) {   // several resources separated by ;
    in.transferTo(out);                                  // Java 9: copying in one line
}
```

- Resources are closed **automatically** on leaving the block — both on normal completion and on an exception.
- They're closed **in reverse order** of declaration.
- A resource must implement **`AutoCloseable`** (the video says `Closeable` — its I/O sub-interface; both work).
- If an exception occurs both in the body and in `close()`, the second isn't lost — it's attached as **suppressed**: `e.getSuppressed()`.
- Since Java 9 you can list an already declared effectively final variable: `try (in) { … }`.

:::interview "Interview question"
**What is try-with-resources and why is it needed?** — A construct in which the resources declared in parentheses after `try` are automatically closed via `close()` when the block is left. It works with any `AutoCloseable`. It replaces the clunky `finally` with a `null` check and handles exceptions from closing correctly (suppressed).
:::

## What the video doesn't cover

- **`readAllBytes()`** (Java 9) reads the whole stream into an array; also **`readNBytes(n)`** (11), **`transferTo(out)`** (9).
- **The hierarchy:** `InputStream` ← `FileInputStream`, `ByteArrayInputStream`, `BufferedInputStream`, `ObjectInputStream`, `System.in`… Wrappers (decorators) add capabilities to a base stream — the **Decorator** pattern.
- **Modern for text files:** `Files.readString(path)` or `Files.readAllLines(path)` — open, read and close in one line.

## Homework

:::task video "A file of names — from the video"
Create a folder with a file in it and write (by hand) a few names in Latin letters. Read the file via `FileInputStream` in try-with-resources and print its contents to the console. {{t j2 5:38:36}}
??? Hint
`new File(dir, "names.txt")` creates a file inside the folder. Read with `read()` until −1. Solution: {{t j2 5:39:05}}
:::

:::task easy "Counting bytes"
Count how many bytes a file has and how many of them are line breaks (`'\n'`). Compare the result with `file.length()` / `Files.size(path)`.
:::

:::task medium "Your own resource"
Write a class `Connection implements AutoCloseable` that prints "opened"/"closed". Use two of them in one try-with-resources and throw an exception both in the body and in `close()`. Print the main exception and `getSuppressed()`. In what order were the resources closed?
:::

:::task hard "Copying a file"
Write `copy(Path src, Path dst)` in three ways: byte by byte with `read()`/`write(int)`, via a `byte[8192]` buffer, via `in.transferTo(out)`. Compare the time on a 100 MB file and verify the copies by their SHA-256 hash (`MessageDigest`).
:::
