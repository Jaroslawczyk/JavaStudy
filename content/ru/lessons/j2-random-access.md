Короткий урок: сводка классов символьного ввода-вывода (`Reader`/`Writer` и их наследники) и **`RandomAccessFile`** — файл с произвольным доступом, где можно «перепрыгнуть» к любой позиции, прочитать или перезаписать данные. В домашнем задании — «читалка» книги по номеру страницы.

## Таймкоды видео

- {{t j2 6:16:51}} — повторяем: потоки байтов и буферы
- {{t j2 6:17:42}} — символьные потоки: `Reader`, `Writer`, `FileReader`, `FileWriter`
- {{t j2 6:18:01}} — `BufferedReader`, `BufferedWriter`, `InputStreamReader`, `OutputStreamWriter`
- {{t j2 6:18:30}} — задача: прочитать данные с середины файла
- {{t j2 6:19:23}} — `RandomAccessFile` и режимы `"r"`, `"rw"`
- {{t j2 6:20:11}} — `seek()`: переход к позиции
- {{t j2 6:20:24}} — `writeBytes()`: звёздочки в середине файла
- {{t j2 6:21:19}} — чтение с позиции 5000 и возврат в начало
- {{t j2 6:22:43}} — домашнее задание: страница по номеру
- {{t j2 6:23:39}} — разбор решения

## Карта классов ввода-вывода

| | Ввод | Вывод |
|---|---|---|
| **Байты** (абстрактные) | `InputStream` | `OutputStream` |
| Файл | `FileInputStream` | `FileOutputStream` |
| Буфер | `BufferedInputStream` | `BufferedOutputStream` |
| **Символы** (абстрактные) | `Reader` | `Writer` |
| Файл | `FileReader` | `FileWriter` |
| Буфер | `BufferedReader` (`readLine`) | `BufferedWriter` (`newLine`) |
| Мост байты ↔ символы | `InputStreamReader` | `OutputStreamWriter` |
| Объекты | `ObjectInputStream` | `ObjectOutputStream` |

Обёртки вкладываются друг в друга (паттерн Decorator):

```java
try (BufferedReader reader = new BufferedReader(
        new InputStreamReader(new FileInputStream(file), StandardCharsets.UTF_8))) {
    String line;
    while ((line = reader.readLine()) != null) {
        System.out.println(line);
    }
}
```

:::outdated "FileReader/FileWriter и кодировка"
До Java 11 у `FileReader`/`FileWriter` нельзя было указать кодировку — они брали системную (см. [урок о кодировках](#/lessons/j2-strings-readers)). С Java 11 есть конструкторы `new FileReader(file, StandardCharsets.UTF_8)`. Ещё проще — `Files.newBufferedReader(path)` / `Files.newBufferedWriter(path)` (UTF-8 по умолчанию).
:::

## RandomAccessFile

Обычные потоки читают строго последовательно и не умеют возвращаться назад. `RandomAccessFile` хранит **указатель позиции**, который можно двигать:

```java
try (RandomAccessFile raf = new RandomAccessFile(file, "rw")) {   // "r" — только чтение
    raf.seek(10);                    // перейти к байту 10
    raf.writeBytes("*****");         // перезаписать 5 байт (не вставить!)

    raf.seek(5000);
    byte[] buffer = new byte[1024];
    int count = raf.read(buffer);
    System.out.println(new String(buffer, 0, count, StandardCharsets.UTF_8));

    raf.seek(0);                     // снова в начало
    System.out.println("Длина: " + raf.length() + ", позиция: " + raf.getFilePointer());
}
```

- Запись в середину **перезаписывает** байты, а не раздвигает файл.
- Есть методы для примитивов: `readInt`, `writeLong`, `readDouble`… — удобно для бинарных форматов с записями фиксированной длины (база данных «на коленке», индексы).
- `"rws"`/`"rwd"` — синхронная запись на диск при каждом изменении.

:::interview "Вопрос с собеседования"
**Зачем нужен `RandomAccessFile`?** — Для произвольного доступа к содержимому файла: `seek()` перемещает указатель к нужной позиции, где можно читать и изменять данные, не перечитывая файл с начала.
:::

## Что не рассказано в видео

- **`FileChannel`** (NIO) — современная альтернатива: `channel.position(n)`, чтение в `ByteBuffer`, `transferTo` между каналами без копирования в Java-память.
- **Memory-mapped файлы:** `channel.map(READ_ONLY, 0, size)` — файл отображается в память, ОС подгружает страницы по требованию. Так работают многие базы данных и брокеры сообщений (например, Kafka активно опирается на page cache).
- **Позиция в байтах, а не в символах.** Для UTF-8 переход на «символ № 1000» невозможен без чтения всего, что до него, — `seek` может попасть в середину многобайтового символа.

## Домашнее задание

:::task video "Страница книги — из видео"
Создайте большой текстовый файл. Программа спрашивает номер страницы (страница = 3000 байт) и выводит её текст; при вводе `stop` завершается. Используйте `RandomAccessFile` и `Scanner`. {{t j2 6:22:43}}
??? Подсказка
`raf.seek((page - 1) * 3000L)`, читаем в `byte[3000]`, выводим `new String(buf, 0, count)`. Разбор: {{t j2 6:23:39}}
:::

:::task easy "Последние 10 строк"
Как `tail`: выведите последние 10 строк большого файла, не читая его целиком. Двигайтесь `seek` с конца файла назад блоками по 4 КБ, считая `'\n'`.
:::

:::task medium "Файл записей фиксированной длины"
Сохраните в бинарный файл 1000 записей `(int id, double balance)` — по 12 байт. Напишите методы `read(int index)` и `updateBalance(int index, double value)`, которые сразу прыгают к нужной записи через `seek(index * 12L)`. Проверьте, что изменение одной записи не трогает соседние.
:::

:::task hard "Постраничное чтение UTF-8"
Доработайте «читалку»: страница = 3000 байт, но граница не должна разрезать многобайтовый символ UTF-8. Подсказка: байты-продолжения UTF-8 имеют вид `10xxxxxx` (`(b & 0xC0) == 0x80`) — сдвигайте границу страницы назад, пока не попадёте на начало символа. Проверьте на русском тексте.
:::
