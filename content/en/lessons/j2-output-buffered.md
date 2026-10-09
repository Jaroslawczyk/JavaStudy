Now we write to a file: `OutputStream` and `FileOutputStream`, append mode. Then — buffering (`BufferedInputStream`/`BufferedOutputStream`), which speeds up reading hundreds of times, the `flush()` method, and the `Scanner` class for console input.

## Video timestamps

- {{t j2 5:59:38}} — writing to a file: `OutputStream`
- {{t j2 6:00:18}} — `FileOutputStream` in try-with-resources
- {{t j2 6:00:46}} — `write(names.getBytes())`
- {{t j2 6:01:37}} — the file is overwritten on each run
- {{t j2 6:01:46}} — appending: the second parameter `append = true`
- {{t j2 6:02:12}} — `BufferedInputStream` and `BufferedOutputStream`
- {{t j2 6:02:48}} — how an 8 KB buffer works
- {{t j2 6:03:35}} — measurement: 9.5 s without a buffer → 35 ms with one
- {{t j2 6:06:26}} — writing through a buffer
- {{t j2 6:06:47}} — buffered data reaches the file on `close()` or `flush()`
- {{t j2 6:07:23}} — the `Scanner` class
- {{t j2 6:07:53}} — `System.in` and `System.out`
- {{t j2 6:08:40}} — `nextLine()`
- {{t j2 6:09:37}} — `nextInt()`: the sum of two numbers
- {{t j2 6:10:50}} — a string entered instead of a number — the program crashes
- {{t j2 6:11:07}} — homework: entering names until "stop"
- {{t j2 6:11:48}} — the solution
- {{t j2 6:13:09}} — escaping quotes `\"`

## Writing to a file

```java
String names = "John Nick Helen\n";
try (OutputStream out = new FileOutputStream(file, true)) {   // true = append
    out.write(names.getBytes(StandardCharsets.UTF_8));
} catch (IOException e) {
    e.printStackTrace();
}
```

- Without the second parameter (or with `false`) the file is **overwritten** on opening.
- `write(int)` writes one byte, `write(byte[])` — an array, `write(byte[], off, len)` — part of an array.
- `getBytes()` with no argument uses the default encoding — specify `UTF_8` explicitly.

## Buffering

A buffered stream is a wrapper that calls the OS in large chunks (8192 bytes by default) and hands you bytes from its own memory:

```java
try (InputStream in = new BufferedInputStream(new FileInputStream(file))) {
    int b;
    while ((b = in.read()) != -1) { … }      // read() now takes a byte from the buffer
}
```

In the video, reading a big file one byte at a time sped up from 9.5 seconds to 35 milliseconds — **without changing the reading logic**.

When writing, `BufferedOutputStream` accumulates data in a buffer and writes it to disk when the buffer is full. Whatever is left in the buffer reaches the file on `close()` or an explicit **`flush()`**. Forget to close the stream — lose the last data.

:::interview "Interview question"
**Which classes speed up reading and writing with a buffer?** — `BufferedInputStream`, `BufferedOutputStream` for bytes and `BufferedReader`, `BufferedWriter` for characters. They reduce the number of system calls by reading/writing in blocks.
:::

## Scanner and the console

- `System.out` — a `PrintStream` (a subclass of `OutputStream`), console output.
- `System.in` — an `InputStream`, keyboard input.
- `System.err` — the error stream (red in the IDE).

```java
Scanner scanner = new Scanner(System.in);
System.out.print("Enter A: ");
int a = scanner.nextInt();
System.out.print("Enter B: ");
int b = scanner.nextInt();
System.out.println("Sum: " + (a + b));
```

`nextLine()`, `next()` (a word), `nextInt()`, `nextDouble()`, `hasNextInt()`… block the thread until the user enters data. Typing "abc" instead of a number gives an `InputMismatchException`.

:::warning "The nextInt() + nextLine() trap"
`nextInt()` reads the number but leaves the line break in the buffer. The next `nextLine()` immediately returns an empty string. Solutions: call an extra `nextLine()` after `nextInt()`, or always read with `nextLine()` and parse with `Integer.parseInt(...)`. Checking `hasNextInt()` before `nextInt()` is handy.
:::

:::outdated "IO.readln and IO.println (Java 25)"
For learning programs Java 25 added the `java.lang.IO` class (JEP 512): `String name = IO.readln("Name: "); IO.println("Hello, " + name);` — no `Scanner` or `System.out`. Together with "compact" source files (`void main()`) it's the standard style for first programs; in production code console input is rare.
:::

## What the video doesn't cover

- **Writing characters:** `Files.writeString(path, text, StandardOpenOption.APPEND, StandardOpenOption.CREATE)`, `Files.newBufferedWriter(path)`, a `PrintWriter` with `printf`.
- **`PrintStream` doesn't throw `IOException`** — errors are checked via `checkError()`. That's why `System.out.println` needs no `try`.
- **Atomic writes:** write to a temporary file and rename it with `Files.move(tmp, target, ATOMIC_MOVE)` — then the file is never left "half-written" after a failure.

## Homework

:::task video "Entering names until stop — from the video"
The program asks for a name again and again until `stop` is entered. Each name is appended to a file (without overwriting previous runs). After `stop`, print all saved names from the file. {{t j2 6:11:07}}
??? Hint
`new BufferedOutputStream(new FileOutputStream(file, true))`, a loop `while (!next.equals("stop"))`, `"\n"` after each name. Read in a separate try-with-resources after writing. Solution: {{t j2 6:11:48}}
:::

:::task easy "A times table to a file"
Write a 10×10 multiplication table to `table.txt` via `PrintWriter`/`printf` with aligned columns, then read and print the file.
:::

:::task medium "Safe number input"
Write a method `int readInt(Scanner sc, String prompt, int min, int max)` that repeats the question until the user enters an integer within the range. No crashes on "abc" or an empty line.
:::

:::task hard "A rotating log"
Write a `SimpleLogger` that appends timestamped lines to `app.log` via a `BufferedWriter`; when the file exceeds 1 MB it renames it to `app.1.log` (shifting older ones up to `app.5.log`) and starts a new one. Load it with 4 threads — writing must be thread-safe and lines must not get mixed. (Real projects use Logback/Log4j2 for this — see [Logging](#/extra/logging).)
:::
