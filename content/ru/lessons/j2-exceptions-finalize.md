Систематизируем **исключения**: иерархия `Throwable`, проверяемые (checked) и непроверяемые (unchecked) исключения, `throws` и когда что обрабатывать. В конце — метод `finalize()`, о котором спрашивают на собеседованиях, хотя он давно устарел.

## Таймкоды видео

- {{t j2 7:06:49}} — какие бывают исключения
- {{t j2 7:07:19}} — деление на ноль: `ArithmeticException` во время выполнения
- {{t j2 7:08:01}} — runtime / unchecked исключения
- {{t j2 7:08:13}} — `ArrayIndexOutOfBoundsException`, `NullPointerException`
- {{t j2 7:09:23}} — все они наследуют `RuntimeException`
- {{t j2 7:09:39}} — проверяемые исключения (checked)
- {{t j2 7:10:34}} — `throws`: пробрасываем исключение дальше
- {{t j2 7:11:42}} — `throws` в `main`
- {{t j2 7:13:05}} — `Exception`, `Throwable`, `Error`
- {{t j2 7:13:38}} — `OutOfMemoryError`
- {{t j2 7:14:25}} — метод `finalize()`
- {{t j2 7:15:13}} — зачем он был нужен и почему его не используют
- {{t j2 7:15:52}} — эксперимент: `finalize` при сборке мусора

## Иерархия

```
Throwable
├── Error                    — проблемы JVM: OutOfMemoryError, StackOverflowError
└── Exception
    ├── RuntimeException     — unchecked: NPE, IllegalArgumentException, ArithmeticException,
    │                          IndexOutOfBoundsException, ClassCastException…
    └── (всё остальное)      — checked: IOException, SQLException, InterruptedException…
```

| | Checked | Unchecked |
|---|---|---|
| Наследует | `Exception` (не `RuntimeException`) | `RuntimeException` или `Error` |
| Компилятор требует обработать | ✅ `try-catch` или `throws` | ❌ |
| Причина | внешние обстоятельства: нет файла, сеть упала | ошибка программиста или неверные аргументы |
| Что делать | обработать или пробросить осознанно | исправить код (а не ловить) |

## throws

```java
private static InputStream open(File file) throws FileNotFoundException {
    return new FileInputStream(file);        // не обрабатываем здесь — пусть решает вызывающий
}

public static void main(String[] args) {
    try {
        open(new File("data.txt"));
    } catch (FileNotFoundException e) {
        System.out.println("Файл не найден: " + e.getMessage());
    }
}
```

`throws` в сигнатуре — часть контракта метода: вызывающий обязан обработать или пробросить дальше. Если пробросить из `main`, исключение уронит программу со стектрейсом — для учебных примеров допустимо, в реальном коде — нет.

:::interview "Вопрос с собеседования"
**Чем checked отличаются от unchecked?** — Checked (наследники `Exception`, кроме `RuntimeException`) компилятор заставляет обработать или объявить в `throws`; они описывают ожидаемые внешние сбои. Unchecked (`RuntimeException` и наследники) обрабатывать не обязательно, обычно это ошибки в коде. `Error` — сбои JVM, их не ловят. Общий предок — `Throwable`.
:::

## Хорошие практики (не из видео)

- **Не глотайте исключения:** пустой `catch` или только `e.printStackTrace()` в проде — потеря информации. Логируйте (`log.error("…", e)`) или пробросьте.
- **Оборачивайте с причиной:** `throw new ServiceException("Не удалось загрузить заказ " + id, e);` — сохраняется исходный стектрейс (`getCause()`).
- **Multi-catch (Java 7):** `catch (IOException | SQLException e)`.
- **Ловите конкретное**, а не `Exception`/`Throwable`.
- **Свои исключения:** `class OrderNotFoundException extends RuntimeException` — в современных фреймворках (Spring) чаще используют unchecked, а ошибки превращают в HTTP-ответы централизованно.
- **Helpful NullPointerExceptions** (Java 14+): сообщение указывает, что именно было `null`: `Cannot invoke "String.length()" because "user.name" is null`.

## finalize()

Метод `Object.finalize()` вызывался сборщиком мусора **перед** удалением объекта — задумывался для освобождения ресурсов.

Почему его не используют:
- **Неизвестно, когда** он вызовется и вызовется ли вообще (GC может не запуститься до конца программы).
- Замедляет сборку мусора, объект может «воскреснуть», исключения в нём молча игнорируются.
- Это источник уязвимостей (finalizer attack).

:::outdated "finalize() помечен на удаление (JEP 421, Java 18)"
`finalize()` объявлен устаревшим ещё в Java 9, а с Java 18 — **deprecated for removal** (JEP 421); финализацию можно отключить флагом `--finalization=disabled`. Замены:
- **try-with-resources** и `AutoCloseable` — детерминированное освобождение ресурсов (основной способ);
- **`java.lang.ref.Cleaner`** (Java 9) — страховка на случай, если `close()` забыли вызвать.
:::

:::interview "Вопрос с собеседования"
**Для чего нужен `finalize()`?** — Вызывался GC перед уничтожением объекта для освобождения ресурсов. Не гарантирован ни момент, ни сам вызов, поэтому полагаться на него нельзя; метод устарел и помечен на удаление (JEP 421). Используют try-with-resources и `Cleaner`.
:::

## Домашнее задание

В видео заданий нет — свои задачи.

:::task easy "Классифицируйте"
Для каждого исключения укажите checked/unchecked/error и типичную причину: `IOException`, `NumberFormatException`, `InterruptedException`, `ConcurrentModificationException`, `StackOverflowError`, `CloneNotSupportedException`, `IllegalStateException`. Вызовите каждое в коде.
:::

:::task medium "Свои исключения"
Сервис перевода денег: `InsufficientFundsException` (checked — клиент может пополнить счёт) и `AccountNotFoundException` (unchecked). Метод `transfer` пробрасывает первое, вызывающий код выводит понятное сообщение. Оберните низкоуровневую ошибку в своё исключение с причиной и выведите всю цепочку `getCause()`.
:::

:::task hard "Cleaner вместо finalize"
Сделайте класс `NativeBuffer implements AutoCloseable`, который «выделяет ресурс» (печать) и освобождает в `close()`. Зарегистрируйте страховочное действие через `Cleaner`, срабатывающее, если `close()` забыли. Покажите оба сценария: try-with-resources и забытый объект + `System.gc()`. Почему действие очистки не должно ссылаться на сам объект?
:::
