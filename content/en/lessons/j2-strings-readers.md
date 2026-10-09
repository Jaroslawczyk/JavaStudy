Three topics in one lesson: why strings must not be glued in a loop (`String` is immutable) and what to use instead — `StringBuilder`; how a buffer speeds up reading dozens of times; and why Cyrillic turns into gibberish — **encodings** and the `Reader` classes.

## Video timestamps

- {{t j2 5:41:34}} — collecting what we read into a string with `+=`
- {{t j2 5:42:25}} — don't do this: `String` is immutable
- {{t j2 5:43:52}} — `StringBuilder` and `append()`
- {{t j2 5:44:59}} — `StringBuffer` — the thread-safe counterpart
- {{t j2 5:45:33}} — a big Lorem Ipsum file (12 MB)
- {{t j2 5:46:57}} — byte-by-byte reading: almost 51 seconds
- {{t j2 5:47:27}} — `read(byte[])`: reading a whole array at once
- {{t j2 5:49:12}} — 1.5 seconds — 30–40 times faster
- {{t j2 5:49:44}} — "garbage" from the previous read in the buffer
- {{t j2 5:51:07}} — `new String(array, 0, count)`
- {{t j2 5:51:45}} — Cyrillic breaks with byte-by-byte reading
- {{t j2 5:52:43}} — a `Reader` reads characters, not bytes
- {{t j2 5:53:06}} — `InputStreamReader` — a wrapper over `InputStream`
- {{t j2 5:54:13}} — specifying the encoding: `StandardCharsets.UTF_8`
- {{t j2 5:54:54}} — lesson summary
- {{t j2 5:55:31}} — homework: names starting with "A"
- {{t j2 5:56:22}} — the solution
- {{t j2 5:57:56}} — `split(" ")`

## String is immutable

```java
String s = "Hello";
s = s + " world";     // the old object didn't change — a NEW "Hello world" was created
```

Concatenating in a loop creates a new string on every iteration and copies everything accumulated into it — O(n²) operations for a text of length n and a mountain of garbage for the GC.

```java
StringBuilder sb = new StringBuilder();
for (…) sb.append((char) b);         // modifies an internal buffer
String result = sb.toString();
```

| | `String` | `StringBuilder` | `StringBuffer` |
|---|---|---|---|
| Mutable | ❌ | ✅ | ✅ |
| Thread-safe | ✅ (immutable) | ❌ | ✅ (`synchronized`) |
| When | almost always | building a string in one thread | practically never |

:::interview "Interview question"
**How do `StringBuilder` and `StringBuffer` differ?** — Both are mutable strings. `StringBuffer`'s methods are synchronised (thread-safe, slower), `StringBuilder`'s aren't. Modern code uses `StringBuilder`: building one string from several threads is almost never needed.
:::

:::note "And `+` outside a loop?"
`String s = a + ":" + b;` is fine. The compiler optimises a single concatenation (since Java 9 via `invokedynamic`/`StringConcatFactory`). The problem is only accumulation in a loop. To join a collection there's `String.join(", ", list)` and `Collectors.joining`.
:::

## Reading into an array

Each `read()` is a call into the operating system, and that's expensive. `read(byte[])` fills a whole array in one call:

```java
try (InputStream in = new FileInputStream(file)) {
    byte[] buffer = new byte[8192];                 // a multiple of 1024
    StringBuilder sb = new StringBuilder();
    int count;
    while ((count = in.read(buffer)) > 0) {
        sb.append(new String(buffer, 0, count));    // only the part that was read!
    }
}
```

`read(byte[])` returns **how many bytes were read** (the last time — fewer than the array size, then −1). If you build a string from the whole array, "garbage" from the previous read ends up at the end ({{t j2 5:49:44}}).

## Encodings and Reader

A character ≠ a byte. In **UTF-8** Latin letters take 1 byte, Cyrillic 2, emoji 4. When you read byte by byte and cast `(char) b`, each byte of a Cyrillic letter becomes a separate "character" — you get gibberish.

A `Reader` reads **characters**: it decodes bytes according to the encoding itself.

```java
try (Reader reader = new InputStreamReader(new FileInputStream(file), StandardCharsets.UTF_8)) {
    char[] buffer = new char[128];                  // for a Reader — char[], not byte[]
    StringBuilder sb = new StringBuilder();
    int count;
    while ((count = reader.read(buffer)) > 0) {
        sb.append(buffer, 0, count);
    }
}
```

`InputStreamReader` is a **bridge** from bytes to characters: it wraps any `InputStream`.

:::outdated "UTF-8 is the default only since Java 18"
The video says readers use UTF-8 by default. That's true **from Java 18** (JEP 400). Before that the default was the platform encoding: on a Russian Windows — `windows-1251`, and the same code produced gibberish on one machine and worked on another. A rule for any version: **always specify the encoding explicitly** — `StandardCharsets.UTF_8`.
:::

:::warning "The danger of new String(buffer, 0, count) for UTF-8"
If you read a UTF-8 file as **bytes** in chunks and turn each chunk into a string, a multi-byte character can be cut by the buffer boundary — you'll get `�`. For text, read through a `Reader` (it respects character boundaries) or read the whole file at once.
:::

## What the video doesn't cover

- **`BufferedReader.readLine()`** — the classic line-by-line reading; `reader.lines()` — a stream of lines.
- **Modern:** `Files.readString(path)` (UTF-8 by default), `Files.readAllLines`, `Files.lines` (a lazy stream, close it in try-with-resources), `Files.newBufferedReader(path, charset)`.
- **`String.split` takes a regular expression:** `split(".")` returns an empty array — the dot must be escaped `split("\\.")`; for whitespace `split("\\s+")` is more reliable. More in the article [Regex](#/extra/regex).

## Homework

:::task video "Names starting with A — from the video"
Create a file of names on one line separated by spaces. Read it via a `Reader` into a `char[]` array, build a string, `split(" ")` it into an array, keep the names starting with "A" with a stream and print them. {{t j2 5:55:31}}
??? Hint
`Arrays.stream(names).filter(n -> n.startsWith("A")).forEach(System.out::println)`. Solution: {{t j2 5:56:22}}
:::

:::task easy "What += costs"
Build a 100,000-character string with `+=` and with `StringBuilder`. Measure the time with `System.nanoTime()`. Then with `String.join` and `Collectors.joining`.
:::

:::task medium "Make gibberish yourself"
Write the string "Привет, мир" to a file in `windows-1251` (`Files.writeString(path, s, Charset.forName("windows-1251"))`). Read it as UTF-8, as windows-1251 and as ISO-8859-1. Explain what you got in each case and how many bytes the file takes in each encoding.
:::

:::task hard "Text statistics"
Read a big text (UTF-8, Russian) line by line via `BufferedReader` and compute: the number of lines, words and characters, the most frequent letter and the 10 longest words. Compare the time with `Files.readString` + the Stream API. Make sure the results match and Cyrillic causes no problems.
:::
