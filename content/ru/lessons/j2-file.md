Новый раздел — **ввод-вывод и работа с файлами**. Начинаем с класса `File`: как описать путь, проверить существование, создать файл и папки, получить список файлов с фильтром. И сразу смотрим на современную замену — `java.nio.file.Path` и `Files`.

## Таймкоды видео

- {{t j2 5:18:00}} — новый раздел: потоки ввода-вывода
- {{t j2 5:18:47}} — `new File("folder1/file1.txt")`
- {{t j2 5:19:42}} — `File` описывает только путь, файла может не быть
- {{t j2 5:20:01}} — `exists()`
- {{t j2 5:20:10}} — `isDirectory()` и `isFile()`
- {{t j2 5:20:57}} — `createNewFile()` и `IOException`
- {{t j2 5:21:15}} — ошибка: папки не существует
- {{t j2 5:21:46}} — `mkdir()`
- {{t j2 5:22:47}} — вложенные папки: `mkdir()` vs `mkdirs()`
- {{t j2 5:23:56}} — `list()` и `listFiles()`
- {{t j2 5:25:28}} — фильтры: `FilenameFilter` и `FileFilter`
- {{t j2 5:26:45}} — домашнее задание: пути файлов на «a»
- {{t j2 5:27:13}} — разбор решения

## Класс File

```java
File file = new File("folder1/file1.txt");   // путь относительно рабочей папки
System.out.println(file.getName());           // file1.txt — даже если файла нет
System.out.println(file.exists());            // false
```

Объект `File` — это **путь**, а не сам файл. Создание объекта ничего не делает на диске.

| Метод | Что делает |
|---|---|
| `exists()`, `isFile()`, `isDirectory()` | Проверки |
| `createNewFile()` | Создать пустой файл (`false`, если уже есть; `IOException`, если нет папки) |
| `mkdir()` | Создать **одну** папку (родитель должен существовать) |
| `mkdirs()` | Создать всю цепочку папок |
| `delete()` | Удалить файл или **пустую** папку |
| `renameTo(other)` | Переименовать/переместить |
| `length()`, `lastModified()` | Размер в байтах, время изменения |
| `getName()`, `getPath()`, `getAbsolutePath()`, `getParentFile()` | Части пути |
| `list()` / `listFiles()` | Имена (`String[]`) / объекты (`File[]`) содержимого папки |

```java
File dir = new File("folder1/folder2/folder3");
dir.mkdirs();                                        // вся иерархия
new File(dir, "a1.txt").createNewFile();             // конструктор (родитель, имя)

File[] aFiles = dir.listFiles((d, name) -> name.startsWith("a"));   // FilenameFilter
for (File f : aFiles) System.out.println(f.getAbsolutePath());
```

`FilenameFilter` получает папку и имя, `FileFilter` — объект `File`. Оба — функциональные интерфейсы, поэтому пишутся лямбдой.

:::warning "Проверяйте результат"
`mkdir`, `delete`, `renameTo` при неудаче не бросают исключение, а возвращают `false`. `listFiles()` возвращает `null`, если путь не папка или нет доступа. Старый API легко «молча» проигнорировать ошибку — одна из причин, почему появился NIO.2.
:::

:::outdated "File → Path и Files (Java 7+)"
Класс `File` из Java 1.0 жив, но в новом коде используют **NIO.2** (`java.nio.file`): понятные исключения (`NoSuchFileException`, `AccessDeniedException`), символические ссылки, атрибуты, копирование и обход дерева.

```java
Path dir = Path.of("folder1", "folder2", "folder3");   // Path.of — Java 11 (раньше Paths.get)
Files.createDirectories(dir);
Path file = dir.resolve("a1.txt");
Files.createFile(file);
Files.writeString(file, "Hello");                       // Java 11
String text = Files.readString(file);
Files.copy(file, dir.resolve("copy.txt"), StandardCopyOption.REPLACE_EXISTING);
try (Stream<Path> s = Files.list(dir)) {               // стрим — закрывать!
    s.filter(p -> p.getFileName().toString().startsWith("a"))
     .forEach(p -> System.out.println(p.toAbsolutePath()));
}
Files.walk(root), Files.find(...), Files.deleteIfExists(file)
```
Переход между мирами: `file.toPath()` и `path.toFile()`.
:::

## Что не рассказано в видео

- **Разделители путей.** В Windows `\`, в Linux/macOS `/`. Java понимает `/` везде; для сборки путей используйте `Path.of(a, b)` или `new File(parent, child)`, а не конкатенацию строк.
- **Относительные пути** считаются от рабочей папки процесса (`System.getProperty("user.dir")`) — в IDE это обычно корень проекта, а при запуске JAR — папка, откуда запустили.
- **Временные файлы:** `Files.createTempFile("prefix", ".txt")`.
- **Безопасность:** не склеивайте путь из пользовательского ввода без проверки — атака *path traversal* (`../../etc/passwd`). Проверяйте `path.normalize().startsWith(baseDir)`.

## Домашнее задание

:::task video "Файлы на букву a — из видео"
Создайте иерархию `folder1/folder2/folder3`, в последней папке — несколько файлов с разными именами (`a1.txt`, `a2.txt`, `b1.txt`…). Выведите абсолютные пути файлов, имена которых начинаются на `a`. {{t j2 5:26:45}}
??? Подсказка
`mkdirs()`, затем `listFiles((dir, name) -> name.startsWith("a"))` и `getAbsolutePath()`. Разбор: {{t j2 5:27:13}}
:::

:::task easy "Информация о файле"
Программа принимает путь и печатает: существует ли, файл или папка, размер, дату изменения (через `Instant.ofEpochMilli`), абсолютный путь и родителя. Сделайте две версии: на `File` и на `Path`/`Files`.
:::

:::task medium "Размер папки"
Посчитайте общий размер всех файлов в папке **рекурсивно** двумя способами: своей рекурсией по `listFiles()` и через `Files.walk(...).filter(Files::isRegularFile).mapToLong(...)`. Выведите размер в КБ/МБ и 5 самых больших файлов.
:::

:::task hard "Сортировщик загрузок"
Напишите утилиту, которая раскладывает файлы из папки по подпапкам по расширению (`images`, `docs`, `archives`, `other`), создавая папки при необходимости. Повторный запуск не должен ничего ломать, конфликт имён — добавлять суффикс `(1)`. Используйте `Files.move` и обработайте исключения NIO.
:::
