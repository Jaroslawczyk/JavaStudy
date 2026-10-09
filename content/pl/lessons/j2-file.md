Nowy dział — **wejście-wyjście i praca z plikami**. Zaczynamy od klasy `File`: jak opisać ścieżkę, sprawdzić istnienie, utworzyć plik i foldery, pobrać listę plików z filtrem. I od razu patrzymy na współczesny zamiennik — `java.nio.file.Path` i `Files`.

## Znaczniki czasu wideo

- {{t j2 5:18:00}} — nowy dział: strumienie wejścia-wyjścia
- {{t j2 5:18:47}} — `new File("folder1/file1.txt")`
- {{t j2 5:19:42}} — `File` opisuje tylko ścieżkę, pliku może nie być
- {{t j2 5:20:01}} — `exists()`
- {{t j2 5:20:10}} — `isDirectory()` i `isFile()`
- {{t j2 5:20:57}} — `createNewFile()` i `IOException`
- {{t j2 5:21:15}} — błąd: folder nie istnieje
- {{t j2 5:21:46}} — `mkdir()`
- {{t j2 5:22:47}} — zagnieżdżone foldery: `mkdir()` vs `mkdirs()`
- {{t j2 5:23:56}} — `list()` i `listFiles()`
- {{t j2 5:25:28}} — filtry: `FilenameFilter` i `FileFilter`
- {{t j2 5:26:45}} — zadanie domowe: ścieżki plików na „a”
- {{t j2 5:27:13}} — omówienie rozwiązania

## Klasa File

```java
File file = new File("folder1/file1.txt");   // ścieżka względem folderu roboczego
System.out.println(file.getName());           // file1.txt — nawet jeśli pliku nie ma
System.out.println(file.exists());            // false
```

Obiekt `File` to **ścieżka**, a nie sam plik. Utworzenie obiektu niczego na dysku nie robi.

| Metoda | Co robi |
|---|---|
| `exists()`, `isFile()`, `isDirectory()` | Sprawdzenia |
| `createNewFile()` | Utworzyć pusty plik (`false`, jeśli już jest; `IOException`, jeśli brak folderu) |
| `mkdir()` | Utworzyć **jeden** folder (rodzic musi istnieć) |
| `mkdirs()` | Utworzyć cały łańcuch folderów |
| `delete()` | Usunąć plik lub **pusty** folder |
| `renameTo(other)` | Zmienić nazwę/przenieść |
| `length()`, `lastModified()` | Rozmiar w bajtach, czas modyfikacji |
| `getName()`, `getPath()`, `getAbsolutePath()`, `getParentFile()` | Części ścieżki |
| `list()` / `listFiles()` | Nazwy (`String[]`) / obiekty (`File[]`) zawartości folderu |

```java
File dir = new File("folder1/folder2/folder3");
dir.mkdirs();                                        // cała hierarchia
new File(dir, "a1.txt").createNewFile();             // konstruktor (rodzic, nazwa)

File[] aFiles = dir.listFiles((d, name) -> name.startsWith("a"));   // FilenameFilter
for (File f : aFiles) System.out.println(f.getAbsolutePath());
```

`FilenameFilter` dostaje folder i nazwę, `FileFilter` — obiekt `File`. Oba są interfejsami funkcyjnymi, więc pisze się je lambdą.

:::warning "Sprawdzaj wynik"
`mkdir`, `delete`, `renameTo` przy niepowodzeniu nie rzucają wyjątku, tylko zwracają `false`. `listFiles()` zwraca `null`, jeśli ścieżka nie jest folderem lub brak dostępu. W starym API łatwo „po cichu” zignorować błąd — jeden z powodów, dla których powstało NIO.2.
:::

:::outdated "File → Path i Files (Java 7+)"
Klasa `File` z Javy 1.0 żyje, ale w nowym kodzie używa się **NIO.2** (`java.nio.file`): zrozumiałe wyjątki (`NoSuchFileException`, `AccessDeniedException`), dowiązania symboliczne, atrybuty, kopiowanie i przechodzenie drzewa.

```java
Path dir = Path.of("folder1", "folder2", "folder3");   // Path.of — Java 11 (wcześniej Paths.get)
Files.createDirectories(dir);
Path file = dir.resolve("a1.txt");
Files.createFile(file);
Files.writeString(file, "Hello");                       // Java 11
String text = Files.readString(file);
Files.copy(file, dir.resolve("copy.txt"), StandardCopyOption.REPLACE_EXISTING);
try (Stream<Path> s = Files.list(dir)) {               // strumień — zamykać!
    s.filter(p -> p.getFileName().toString().startsWith("a"))
     .forEach(p -> System.out.println(p.toAbsolutePath()));
}
Files.walk(root), Files.find(...), Files.deleteIfExists(file)
```
Przejście między światami: `file.toPath()` i `path.toFile()`.
:::

## Czego nie ma w wideo

- **Separatory ścieżek.** W Windows `\`, w Linux/macOS `/`. Java rozumie `/` wszędzie; do budowania ścieżek używaj `Path.of(a, b)` lub `new File(parent, child)`, a nie sklejania napisów.
- **Ścieżki względne** liczy się od folderu roboczego procesu (`System.getProperty("user.dir")`) — w IDE to zwykle katalog główny projektu, a przy uruchamianiu JAR — folder, z którego go uruchomiono.
- **Pliki tymczasowe:** `Files.createTempFile("prefix", ".txt")`.
- **Bezpieczeństwo:** nie sklejaj ścieżki z danych użytkownika bez sprawdzenia — atak *path traversal* (`../../etc/passwd`). Sprawdzaj `path.normalize().startsWith(baseDir)`.

## Zadanie domowe

:::task video "Pliki na literę a — z wideo"
Utwórz hierarchię `folder1/folder2/folder3`, w ostatnim folderze — kilka plików o różnych nazwach (`a1.txt`, `a2.txt`, `b1.txt`…). Wypisz ścieżki bezwzględne plików, których nazwy zaczynają się na `a`. {{t j2 5:26:45}}
??? Podpowiedź
`mkdirs()`, potem `listFiles((dir, name) -> name.startsWith("a"))` i `getAbsolutePath()`. Omówienie: {{t j2 5:27:13}}
:::

:::task easy "Informacje o pliku"
Program przyjmuje ścieżkę i wypisuje: czy istnieje, plik czy folder, rozmiar, datę modyfikacji (przez `Instant.ofEpochMilli`), ścieżkę bezwzględną i rodzica. Zrób dwie wersje: na `File` i na `Path`/`Files`.
:::

:::task medium "Rozmiar folderu"
Policz łączny rozmiar wszystkich plików w folderze **rekurencyjnie** na dwa sposoby: własną rekurencją po `listFiles()` i przez `Files.walk(...).filter(Files::isRegularFile).mapToLong(...)`. Wypisz rozmiar w KB/MB i 5 największych plików.
:::

:::task hard "Sortownik pobranych plików"
Napisz narzędzie, które rozkłada pliki z folderu do podfolderów według rozszerzenia (`images`, `docs`, `archives`, `other`), tworząc foldery w razie potrzeby. Ponowne uruchomienie niczego nie może zepsuć, przy konflikcie nazw — dodawaj sufiks `(1)`. Użyj `Files.move` i obsłuż wyjątki NIO.
:::
