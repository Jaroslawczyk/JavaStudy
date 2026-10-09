Теперь пишем в файл: `OutputStream` и `FileOutputStream`, режим дозаписи. Затем — буферизация (`BufferedInputStream`/`BufferedOutputStream`), которая ускоряет чтение в сотни раз, метод `flush()`, и класс `Scanner` для ввода из консоли.

## Таймкоды видео

- {{t j2 5:59:38}} — запись в файл: `OutputStream`
- {{t j2 6:00:18}} — `FileOutputStream` в try-with-resources
- {{t j2 6:00:46}} — `write(names.getBytes())`
- {{t j2 6:01:37}} — файл перезаписывается при каждом запуске
- {{t j2 6:01:46}} — дозапись: второй параметр `append = true`
- {{t j2 6:02:12}} — `BufferedInputStream` и `BufferedOutputStream`
- {{t j2 6:02:48}} — как работает буфер в 8 КБ
- {{t j2 6:03:35}} — замер: 9,5 с без буфера → 35 мс с буфером
- {{t j2 6:06:26}} — запись через буфер
- {{t j2 6:06:47}} — данные в буфере попадут в файл при `close()` или `flush()`
- {{t j2 6:07:23}} — класс `Scanner`
- {{t j2 6:07:53}} — `System.in` и `System.out`
- {{t j2 6:08:40}} — `nextLine()`
- {{t j2 6:09:37}} — `nextInt()`: сумма двух чисел
- {{t j2 6:10:50}} — ввели строку вместо числа — программа падает
- {{t j2 6:11:07}} — домашнее задание: ввод имён до «stop»
- {{t j2 6:11:48}} — разбор решения
- {{t j2 6:13:09}} — экранирование кавычек `\"`

## Запись в файл

```java
String names = "John Nick Helen\n";
try (OutputStream out = new FileOutputStream(file, true)) {   // true = дописывать
    out.write(names.getBytes(StandardCharsets.UTF_8));
} catch (IOException e) {
    e.printStackTrace();
}
```

- Без второго параметра (или с `false`) файл **перезаписывается** при открытии.
- `write(int)` пишет один байт, `write(byte[])` — массив, `write(byte[], off, len)` — часть массива.
- `getBytes()` без аргумента использует кодировку по умолчанию — указывайте `UTF_8` явно.

## Буферизация

Буферизированный поток — обёртка, которая обращается к ОС крупными порциями (по умолчанию 8192 байта), а вам отдаёт байты из своей памяти:

```java
try (InputStream in = new BufferedInputStream(new FileInputStream(file))) {
    int b;
    while ((b = in.read()) != -1) { … }      // read() теперь берёт байт из буфера
}
```

В видео чтение большого файла по одному байту ускорилось с 9,5 секунд до 35 миллисекунд — **без изменения логики чтения**.

При записи `BufferedOutputStream` копит данные в буфере и пишет на диск, когда буфер полон. Оставшееся в буфере попадёт в файл при `close()` или явном **`flush()`**. Забыли закрыть поток — потеряли последние данные.

:::interview "Вопрос с собеседования"
**Какие классы ускоряют чтение и запись за счёт буфера?** — `BufferedInputStream`, `BufferedOutputStream` для байтов и `BufferedReader`, `BufferedWriter` для символов. Они сокращают число системных вызовов, читая/записывая блоками.
:::

## Scanner и консоль

- `System.out` — `PrintStream` (наследник `OutputStream`), вывод в консоль.
- `System.in` — `InputStream`, ввод с клавиатуры.
- `System.err` — поток ошибок (в IDE — красным).

```java
Scanner scanner = new Scanner(System.in);
System.out.print("Enter A: ");
int a = scanner.nextInt();
System.out.print("Enter B: ");
int b = scanner.nextInt();
System.out.println("Sum: " + (a + b));
```

Методы `nextLine()`, `next()` (слово), `nextInt()`, `nextDouble()`, `hasNextInt()`… блокируют поток, пока пользователь не введёт данные. Ввели «abc» вместо числа — `InputMismatchException`.

:::warning "Ловушка nextInt() + nextLine()"
`nextInt()` читает число, но оставляет в буфере перевод строки. Следующий `nextLine()` сразу вернёт пустую строку. Решения: после `nextInt()` вызвать лишний `nextLine()`, либо всегда читать `nextLine()` и парсить `Integer.parseInt(...)`. Перед `nextInt()` удобно проверять `hasNextInt()`.
:::

:::outdated "IO.readln и IO.println (Java 25)"
Для учебных программ в Java 25 появился класс `java.lang.IO` (JEP 512): `String name = IO.readln("Имя: "); IO.println("Привет, " + name);` — без `Scanner` и `System.out`. Вместе с «компактными» исходниками (`void main()`) это стандартный стиль первых программ; в рабочем коде консольный ввод встречается редко.
:::

## Что не рассказано в видео

- **Символьная запись:** `Files.writeString(path, text, StandardOpenOption.APPEND, StandardOpenOption.CREATE)`, `Files.newBufferedWriter(path)`, `PrintWriter` с `printf`.
- **`PrintStream` не бросает `IOException`** — ошибки проверяют через `checkError()`. Поэтому `System.out.println` не требует `try`.
- **Атомарная запись:** пишите во временный файл и переименовывайте `Files.move(tmp, target, ATOMIC_MOVE)` — тогда файл не останется «наполовину записанным» при сбое.

## Домашнее задание

:::task video "Ввод имён до stop — из видео"
Программа просит ввести имя снова и снова, пока не введут `stop`. Каждое имя дописывается в файл (не перезаписывая старые запуски). После `stop` выведите все сохранённые имена из файла. {{t j2 6:11:07}}
??? Подсказка
`new BufferedOutputStream(new FileOutputStream(file, true))`, цикл `while (!next.equals("stop"))`, после каждого имени — `"\n"`. Чтение — отдельным try-with-resources после записи. Разбор: {{t j2 6:11:48}}
:::

:::task easy "Таблица умножения в файл"
Запишите таблицу умножения 10×10 в файл `table.txt` через `PrintWriter`/`printf` с выравниванием колонок, затем прочитайте и выведите файл.
:::

:::task medium "Безопасный ввод числа"
Напишите метод `int readInt(Scanner sc, String prompt, int min, int max)`, который повторяет вопрос, пока пользователь не введёт целое число в диапазоне. Никаких падений на «abc» и пустой строке.
:::

:::task hard "Журнал с ротацией"
Напишите `SimpleLogger`, который дописывает строки с временем в `app.log` через `BufferedWriter`; когда файл превышает 1 МБ, переименовывает его в `app.1.log` (сдвигая старые до `app.5.log`) и начинает новый. Нагрузите 4 потоками — запись должна быть потокобезопасной, строки не должны перемешиваться. (В реальных проектах для этого есть Logback/Log4j2 — см. [Логирование](#/extra/logging).)
:::
