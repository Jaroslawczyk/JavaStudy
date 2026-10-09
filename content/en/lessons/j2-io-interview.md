An "interview" on I/O and serialisation. The author takes a few questions from each subsection — real interviewers do the same. The answers are extended with the modern API (NIO.2).

## Video timestamps

- {{t j2 6:51:12}} — start of the interview
- {{t j2 6:51:28}} — files and folders
- {{t j2 6:52:07}} — `InputStream`, `OutputStream`, `Reader`, `Writer`
- {{t j2 6:52:52}} — buffers and `RandomAccessFile`
- {{t j2 6:53:13}} — serialisation, `transient`, `Externalizable`
- {{t j2 6:54:44}} — try-with-resources
- {{t j2 6:55:21}} — end of the section

## Questions

:::task video "1. How do you create a new file?"
{{t j2 6:51:28}}
??? Answer
`new File(path).createNewFile()` (the folder must exist). Modern: `Files.createFile(Path.of(path))` or straight away `Files.writeString(path, text)`.
:::

:::task video "2. How do you create a folder?"
{{t j2 6:51:35}}
??? Answer
`mkdir()` — one folder, `mkdirs()` — the whole chain. NIO: `Files.createDirectory` / `Files.createDirectories`.
:::

:::task video "3. How do you list the files in a folder?"
{{t j2 6:51:46}}
??? Answer
`list()` — an array of names, `listFiles()` — an array of `File`s; both take a filter. NIO: `Files.list(dir)` (a stream, close it) or `Files.walk` for a recursive walk.
:::

:::task video "4. What do InputStream, OutputStream, Reader, Writer have in common and how do they differ?"
{{t j2 6:52:07}}
??? Answer
All are abstract I/O classes. `InputStream`/`OutputStream` work with **bytes**, `Reader`/`Writer` with **characters** (they take the encoding into account). `InputStream`/`Reader` are input, `OutputStream`/`Writer` are output.
:::

:::task video "5. How do you turn a file's data into a byte stream?"
{{t j2 6:52:33}}
??? Answer
`new FileInputStream(file)` or `Files.newInputStream(path)`.
:::

:::task video "6. Which classes speed up reading/writing with a buffer?"
{{t j2 6:52:39}}
??? Answer
`BufferedInputStream`, `BufferedOutputStream`, `BufferedReader`, `BufferedWriter`.
:::

:::task video "7. Why do we need RandomAccessFile?"
{{t j2 6:52:52}}
??? Answer
Random access to a file's contents: `seek()` moves the pointer, and you can read and overwrite data at any position.
:::

:::task video "8. What are serialisation and deserialisation?"
{{t j2 6:53:13}}
??? Answer
Serialisation converts an object (an object graph) into a stream of bytes; deserialisation creates an object from a stream of bytes.
:::

:::task video "9. What conditions must hold for an object to be serialisable?"
{{t j2 6:53:33}}
??? Answer
The class implements `Serializable` or `Externalizable`; all non-static fields are serialisable or `transient`; the first non-serialisable ancestor has an accessible no-arg constructor.
:::

:::task video "10. What is the transient keyword for?"
{{t j2 6:53:58}}
??? Answer
It excludes a field from serialisation; after restore the field has its default value. Used for passwords, caches, non-serialisable resources (connections, streams).
:::

:::task video "11. How do Serializable and Externalizable differ?"
{{t j2 6:54:03}}
??? Answer
`Serializable` is a marker, serialisation is automatic, the constructor isn't called on read. With `Externalizable` you implement `writeExternal`/`readExternal` yourself, and a public no-arg constructor is called on read.
:::

:::task video "12. What is try-with-resources?"
{{t j2 6:54:44}}
??? Answer
The construct `try (resources) { … }`: resources (`AutoCloseable`) are closed automatically in reverse order on leaving the block; exceptions from `close()` are added as suppressed.
:::

## Extra questions (not from the video)

:::task easy "What is serialVersionUID?"
Why declare it by hand?
??? Answer
A class version number the JVM compares during deserialisation. The automatic one depends on the class structure and the compiler, so any change breaks compatibility. An explicit declaration (`@Serial private static final long serialVersionUID = 1L;`) gives you control over version compatibility.
:::

:::task medium "java.io vs java.nio"
How do they differ?
??? Answer
`java.io` is a stream-based, blocking API (bytes/characters in order). `java.nio` (Java 1.4) — buffers and channels, non-blocking I/O with selectors, memory-mapped files. NIO.2 (Java 7, `java.nio.file`) — `Path`, `Files`, tree walking, attributes, watching folders (`WatchService`).
:::

:::task medium "Why is it important to specify the encoding?"
Give an example of a bug.
??? Answer
Without an explicit encoding, before Java 18 the platform one was used (on a Russian Windows — windows-1251), and a file written on one machine was read as gibberish on another. Since Java 18 the default is UTF-8, but an explicit `StandardCharsets.UTF_8` makes code portable and clear.
:::

:::task hard "Why is deserialisation dangerous?"
And how do you protect yourself?
??? Answer
`readObject()` can create objects of any serialisable class on the classpath; crafted data triggers method chains (gadget chains) up to code execution. Protection: don't deserialise untrusted data, use an `ObjectInputFilter` with an allow-list of classes, switch to explicit formats (JSON, Protobuf).
:::
