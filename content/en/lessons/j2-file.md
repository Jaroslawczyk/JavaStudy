A new section — **input/output and working with files**. We start with the `File` class: how to describe a path, check existence, create a file and folders, list files with a filter. And straight away we look at the modern replacement — `java.nio.file.Path` and `Files`.

## Video timestamps

- {{t j2 5:18:00}} — a new section: I/O streams
- {{t j2 5:18:47}} — `new File("folder1/file1.txt")`
- {{t j2 5:19:42}} — `File` only describes a path; the file may not exist
- {{t j2 5:20:01}} — `exists()`
- {{t j2 5:20:10}} — `isDirectory()` and `isFile()`
- {{t j2 5:20:57}} — `createNewFile()` and `IOException`
- {{t j2 5:21:15}} — error: the folder doesn't exist
- {{t j2 5:21:46}} — `mkdir()`
- {{t j2 5:22:47}} — nested folders: `mkdir()` vs `mkdirs()`
- {{t j2 5:23:56}} — `list()` and `listFiles()`
- {{t j2 5:25:28}} — filters: `FilenameFilter` and `FileFilter`
- {{t j2 5:26:45}} — homework: paths of files starting with "a"
- {{t j2 5:27:13}} — the solution

## The File class

```java
File file = new File("folder1/file1.txt");   // a path relative to the working directory
System.out.println(file.getName());           // file1.txt — even if the file doesn't exist
System.out.println(file.exists());            // false
```

A `File` object is a **path**, not the file itself. Creating the object does nothing on disk.

| Method | What it does |
|---|---|
| `exists()`, `isFile()`, `isDirectory()` | Checks |
| `createNewFile()` | Create an empty file (`false` if it exists; `IOException` if the folder is missing) |
| `mkdir()` | Create **one** folder (the parent must exist) |
| `mkdirs()` | Create the whole chain of folders |
| `delete()` | Delete a file or an **empty** folder |
| `renameTo(other)` | Rename/move |
| `length()`, `lastModified()` | Size in bytes, modification time |
| `getName()`, `getPath()`, `getAbsolutePath()`, `getParentFile()` | Parts of the path |
| `list()` / `listFiles()` | Names (`String[]`) / objects (`File[]`) of a folder's contents |

```java
File dir = new File("folder1/folder2/folder3");
dir.mkdirs();                                        // the whole hierarchy
new File(dir, "a1.txt").createNewFile();             // the (parent, name) constructor

File[] aFiles = dir.listFiles((d, name) -> name.startsWith("a"));   // FilenameFilter
for (File f : aFiles) System.out.println(f.getAbsolutePath());
```

`FilenameFilter` receives the folder and the name, `FileFilter` — a `File` object. Both are functional interfaces, so they're written as lambdas.

:::warning "Check the result"
`mkdir`, `delete`, `renameTo` don't throw on failure — they return `false`. `listFiles()` returns `null` if the path isn't a folder or there's no access. The old API makes it easy to "silently" ignore errors — one reason NIO.2 appeared.
:::

:::outdated "File → Path and Files (Java 7+)"
The `File` class from Java 1.0 still lives, but new code uses **NIO.2** (`java.nio.file`): clear exceptions (`NoSuchFileException`, `AccessDeniedException`), symbolic links, attributes, copying and tree walking.

```java
Path dir = Path.of("folder1", "folder2", "folder3");   // Path.of — Java 11 (Paths.get before)
Files.createDirectories(dir);
Path file = dir.resolve("a1.txt");
Files.createFile(file);
Files.writeString(file, "Hello");                       // Java 11
String text = Files.readString(file);
Files.copy(file, dir.resolve("copy.txt"), StandardCopyOption.REPLACE_EXISTING);
try (Stream<Path> s = Files.list(dir)) {               // a stream — close it!
    s.filter(p -> p.getFileName().toString().startsWith("a"))
     .forEach(p -> System.out.println(p.toAbsolutePath()));
}
Files.walk(root), Files.find(...), Files.deleteIfExists(file)
```
Converting between the two worlds: `file.toPath()` and `path.toFile()`.
:::

## What the video doesn't cover

- **Path separators.** Windows uses `\`, Linux/macOS `/`. Java understands `/` everywhere; to build paths use `Path.of(a, b)` or `new File(parent, child)`, not string concatenation.
- **Relative paths** are resolved against the process's working directory (`System.getProperty("user.dir")`) — in an IDE that's usually the project root, and when running a JAR — the folder you ran it from.
- **Temporary files:** `Files.createTempFile("prefix", ".txt")`.
- **Security:** don't build a path from user input without checks — a *path traversal* attack (`../../etc/passwd`). Check `path.normalize().startsWith(baseDir)`.

## Homework

:::task video "Files starting with a — from the video"
Create the hierarchy `folder1/folder2/folder3`, and in the last folder several files with different names (`a1.txt`, `a2.txt`, `b1.txt`…). Print the absolute paths of files whose names start with `a`. {{t j2 5:26:45}}
??? Hint
`mkdirs()`, then `listFiles((dir, name) -> name.startsWith("a"))` and `getAbsolutePath()`. Solution: {{t j2 5:27:13}}
:::

:::task easy "File info"
A program takes a path and prints: whether it exists, file or folder, the size, the modification date (via `Instant.ofEpochMilli`), the absolute path and the parent. Make two versions: on `File` and on `Path`/`Files`.
:::

:::task medium "Folder size"
Compute the total size of all files in a folder **recursively** in two ways: your own recursion over `listFiles()`, and `Files.walk(...).filter(Files::isRegularFile).mapToLong(...)`. Print the size in KB/MB and the 5 largest files.
:::

:::task hard "A downloads sorter"
Write a utility that sorts files from a folder into subfolders by extension (`images`, `docs`, `archives`, `other`), creating folders as needed. Running it again must not break anything; on a name clash add a `(1)` suffix. Use `Files.move` and handle NIO exceptions.
:::
