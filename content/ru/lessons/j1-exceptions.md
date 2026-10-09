**Исключение (exception)** — сигнал о том, что что-то пошло не так: деление на ноль, неверный формат числа, выход за границы массива. Учимся перехватывать исключения через `try-catch-finally`, чтобы программа не падала, — и разбираем то, что в видео не вошло: иерархию, проверяемые исключения, `throw`/`throws` и try-with-resources.

## Таймкоды видео

- {{t j1 5:10:14}} — тема урока: обработка исключений
- {{t j1 5:10:42}} — деление `7 / 0` роняет программу
- {{t j1 5:11:38}} — читаем лог: `ArithmeticException: / by zero`
- {{t j1 5:12:01}} — конструкция `try-catch`
- {{t j1 5:12:38}} — исключение — это объект
- {{t j1 5:13:41}} — все исключения наследуются от `Exception`
- {{t j1 5:14:11}} — `NumberFormatException` при `parseInt`
- {{t j1 5:14:49}} — после исключения остаток блока `try` пропускается
- {{t j1 5:15:24}} — несколько блоков `catch`
- {{t j1 5:16:57}} — ловим всё: `catch (Exception e)`
- {{t j1 5:17:54}} — порядок `catch` важен: сначала частные, потом общие
- {{t j1 5:19:20}} — блок `finally`
- {{t j1 5:20:05}} — `finally` выполняется всегда
- {{t j1 5:20:38}} — домашнее задание

## try-catch

```java
int a = 0;
try {
    int b = 7 / a;                          // здесь бросается исключение
    int i = Integer.parseInt("12ab");       // до этой строки дело не дойдёт
    System.out.println("Не выведется");
} catch (ArithmeticException e) {
    System.out.println("На ноль делить нельзя");
} catch (NumberFormatException e) {
    System.out.println("Ошибка преобразования");
} finally {
    System.out.println("Мы в блоке finally");   // выполнится в любом случае
}
System.out.println("Привет");                   // программа продолжает работу
```

Как это работает:

1. Код в `try` выполняется построчно.
2. Как только брошено исключение, **оставшийся код в `try` пропускается**.
3. Java ищет первый `catch`, тип которого подходит к исключению (с учётом наследования), и выполняет его.
4. `finally` выполняется **всегда** — было исключение или нет. Его используют, чтобы освободить ресурсы: закрыть файл, соединение с сетью или базой.
5. Если подходящего `catch` нет — исключение «летит» выше, и если его никто не поймает, программа завершится с трассировкой стека (stack trace).

:::warning "Порядок catch"
Сначала ловят **частные** исключения, потом **общие**. Если первым поставить `catch (Exception e)`, то следующий `catch (ArithmeticException e)` не скомпилируется: `exception ArithmeticException has already been caught` — до него ничего не дойдёт.
:::

## Иерархия исключений

```text
Throwable
├── Error                      — сбои JVM: OutOfMemoryError, StackOverflowError (не ловят)
└── Exception                  — ПРОВЕРЯЕМЫЕ (checked): IOException, SQLException…
    └── RuntimeException       — НЕПРОВЕРЯЕМЫЕ (unchecked):
        ├── ArithmeticException
        ├── NullPointerException
        ├── IllegalArgumentException
        │   └── NumberFormatException
        ├── IndexOutOfBoundsException
        │   └── ArrayIndexOutOfBoundsException
        └── ClassCastException
```

## Что не рассказано в видео

### Проверяемые и непроверяемые исключения

- **Checked** (наследники `Exception`, но не `RuntimeException`) — компилятор **заставляет** их обработать: либо `try-catch`, либо объявить `throws` в сигнатуре. Пример: чтение файла бросает `IOException`.
- **Unchecked** (`RuntimeException` и наследники) — обычно ошибки программиста: `null`, неверный индекс. Обрабатывать не обязательно — лучше исправить код.

```java
public String readFirstLine(Path path) throws IOException {   // «я могу бросить IOException»
    return Files.readAllLines(path).get(0);
}
```

Это классический вопрос на собеседованиях: «Чем checked отличаются от unchecked?»

### Бросить исключение самому: throw

```java
public void setAge(int age) {
    if (age <= 0) {
        throw new IllegalArgumentException("Возраст должен быть положительным: " + age);
    }
    this.age = age;
}
```

### Своё исключение

```java
public class InsufficientFundsException extends RuntimeException {
    public InsufficientFundsException(double needed) {
        super("Недостаточно средств, не хватает: " + needed);
    }
}
```

### Несколько типов в одном catch (Java 7+)

```java
try {
    …
} catch (ArithmeticException | NumberFormatException e) {
    System.out.println("Ошибка вычисления: " + e.getMessage());
}
```

### try-with-resources (Java 7+)

Вместо закрытия ресурса в `finally` — автоматическое закрытие всего, что реализует `AutoCloseable`:

```java
try (Scanner scanner = new Scanner(Path.of("data.txt"))) {
    while (scanner.hasNextLine()) {
        System.out.println(scanner.nextLine());
    }
} catch (IOException e) {
    System.out.println("Не удалось прочитать файл: " + e.getMessage());
}   // scanner.close() вызовется автоматически
```

Подробно — во второй части курса, в разделе о работе с файлами.

### Антипаттерны

:::warning "Не глотайте исключения"
В видео есть пример `catch (Exception e) { }` с пустым телом — «поймать всё и ничего не делать». Для демонстрации нормально, в реальном коде — **одна из худших практик**: ошибка исчезает бесследно, и потом невозможно понять, почему программа ведёт себя странно. Как минимум логируйте: `log.error("Не удалось …", e)` (логирование — статья [Logging](#/extra/logging)).
:::

- Не ловите `Exception`/`Throwable` «на всякий случай» — ловите то, что умеете обработать.
- Не используйте исключения вместо `if`: проверить `a != 0` дешевле и понятнее, чем ловить `ArithmeticException`.
- `e.printStackTrace()` — для учебы; в проектах — логгер.
- Не делайте `return` в `finally`: он «перебивает» и результат, и исключение из `try`.

## Домашнее задание

:::task video "Выход за пределы массива — из видео"
Создайте ситуацию, в которой будет брошено `ArrayIndexOutOfBoundsException` (например, обращение к 11-му элементу массива из 10 или к индексу −1). Обработайте его в `try-catch` и выведите «Выход за пределы массива». {{t j1 5:20:38}}
:::

:::task easy "Безопасный ввод числа"
Пользователь вводит строку; программа пытается превратить её в `int`. Если не получилось — просит ввести ещё раз, пока не будет введено корректное число (цикл + `try-catch (NumberFormatException)`).
:::

:::task medium "Своё исключение для счёта"
Используйте класс `BankAccount` из прошлых уроков. Метод `withdraw` бросает ваше `InsufficientFundsException` (наследник `RuntimeException`) с суммой, которой не хватает. В `main` обработайте его и выведите понятное сообщение. Затем сделайте исключение **проверяемым** (наследник `Exception`) и посмотрите, что потребует компилятор.
:::

:::task hard "Порядок выполнения"
Напишите метод с `try`, `catch` и `finally`, в каждом из которых есть `System.out.println` и `return` с разными значениями. Вызовите его, когда исключение бросается и когда нет. Предскажите, что вернётся и что напечатается, затем проверьте. Объясните, почему `return` в `finally` считается ошибкой.
??? Подсказка
`finally` выполняется даже после `return` в `try`. Если в `finally` тоже есть `return`, он заменит значение из `try` и «проглотит» исключение — поэтому IDEA подсвечивает такой код предупреждением.
:::
