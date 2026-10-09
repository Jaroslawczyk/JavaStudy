A short lesson: an overview of the character I/O classes (`Reader`/`Writer` and their subclasses) and **`RandomAccessFile`** — a file with random access, where you can "jump" to any position and read or overwrite data. In the homework — a book "reader" that shows a page by its number.

## Video timestamps

- {{t j2 6:16:51}} — recap: byte streams and buffers
- {{t j2 6:17:42}} — character streams: `Reader`, `Writer`, `FileReader`, `FileWriter`
- {{t j2 6:18:01}} — `BufferedReader`, `BufferedWriter`, `InputStreamReader`, `OutputStreamWriter`
- {{t j2 6:18:30}} — task: read data from the middle of a file
- {{t j2 6:19:23}} — `RandomAccessFile` and the `"r"`, `"rw"` modes
- {{t j2 6:20:11}} — `seek()`: jumping to a position
- {{t j2 6:20:24}} — `writeBytes()`: asterisks in the middle of a file
- {{t j2 6:21:19}} — reading from position 5000 and going back to the start
- {{t j2 6:22:43}} — homework: a page by its number
- {{t j2 6:23:39}} — the solution

## A map of the I/O classes

| | Input | Output |
|---|---|---|
| **Bytes** (abstract) | `InputStream` | `OutputStream` |
| File | `FileInputStream` | `FileOutputStream` |
| Buffer | `BufferedInputStream` | `BufferedOutputStream` |
| **Characters** (abstract) | `Reader` | `Writer` |
| File | `FileReader` | `FileWriter` |
| Buffer | `BufferedReader` (`readLine`) | `BufferedWriter` (`newLine`) |
| Bytes ↔ characters bridge | `InputStreamReader` | `OutputStreamWriter` |
| Objects | `ObjectInputStream` | `ObjectOutputStream` |

Wrappers nest inside each other (the Decorator pattern):

```java
try (BufferedReader reader = new BufferedReader(
        new InputStreamReader(new FileInputStream(file), StandardCharsets.UTF_8))) {
    String line;
    while ((line = reader.readLine()) != null) {
        System.out.println(line);
    }
}
```

:::outdated "FileReader/FileWriter and the encoding"
Before Java 11 `FileReader`/`FileWriter` couldn't take an encoding — they used the platform one (see the [encodings lesson](#/lessons/j2-strings-readers)). Since Java 11 there are constructors `new FileReader(file, StandardCharsets.UTF_8)`. Even simpler — `Files.newBufferedReader(path)` / `Files.newBufferedWriter(path)` (UTF-8 by default).
:::

## RandomAccessFile

Ordinary streams read strictly sequentially and can't go back. `RandomAccessFile` keeps a **position pointer** that you can move:

```java
try (RandomAccessFile raf = new RandomAccessFile(file, "rw")) {   // "r" — read only
    raf.seek(10);                    // go to byte 10
    raf.writeBytes("*****");         // overwrite 5 bytes (not insert!)

    raf.seek(5000);
    byte[] buffer = new byte[1024];
    int count = raf.read(buffer);
    System.out.println(new String(buffer, 0, count, StandardCharsets.UTF_8));

    raf.seek(0);                     // back to the start
    System.out.println("Length: " + raf.length() + ", position: " + raf.getFilePointer());
}
```

- Writing into the middle **overwrites** bytes; it doesn't push the file apart.
- There are methods for primitives: `readInt`, `writeLong`, `readDouble`… — handy for binary formats with fixed-length records (a home-made database, indexes).
- `"rws"`/`"rwd"` — synchronous writes to disk on every change.

:::interview "Interview question"
**Why is `RandomAccessFile` needed?** — For random access to a file's contents: `seek()` moves the pointer to the desired position, where you can read and modify data without re-reading the file from the start.
:::

## What the video doesn't cover

- **`FileChannel`** (NIO) — the modern alternative: `channel.position(n)`, reading into a `ByteBuffer`, `transferTo` between channels without copying into Java memory.
- **Memory-mapped files:** `channel.map(READ_ONLY, 0, size)` — the file is mapped into memory and the OS loads pages on demand. Many databases and message brokers work this way (Kafka, for example, relies heavily on the page cache).
- **The position is in bytes, not characters.** In UTF-8 you can't jump to "character number 1000" without reading everything before it — `seek` may land in the middle of a multi-byte character.

## Homework

:::task video "A book page — from the video"
Create a big text file. The program asks for a page number (page = 3000 bytes) and prints its text; on `stop` it exits. Use `RandomAccessFile` and `Scanner`. {{t j2 6:22:43}}
??? Hint
`raf.seek((page - 1) * 3000L)`, read into a `byte[3000]`, print `new String(buf, 0, count)`. Solution: {{t j2 6:23:39}}
:::

:::task easy "The last 10 lines"
Like `tail`: print the last 10 lines of a big file without reading it all. Move backwards from the end of the file with `seek` in 4 KB blocks, counting `'\n'`s.
:::

:::task medium "A file of fixed-length records"
Store 1000 records `(int id, double balance)` in a binary file — 12 bytes each. Write methods `read(int index)` and `updateBalance(int index, double value)` that jump straight to the record with `seek(index * 12L)`. Check that changing one record doesn't touch its neighbours.
:::

:::task hard "Paging UTF-8"
Improve the reader: a page is 3000 bytes, but a boundary must not cut a multi-byte UTF-8 character. Hint: UTF-8 continuation bytes look like `10xxxxxx` (`(b & 0xC0) == 0x80`) — move the page boundary back until you hit the start of a character. Test on Russian text.
:::
