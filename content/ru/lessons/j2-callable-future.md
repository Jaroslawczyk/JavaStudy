Задачи чаще нужны не для вывода в консоль, а ради **результата**: загрузить имя пользователя, посчитать отчёт. Знакомимся с `Callable`, `Future` и методом `submit`, а ещё с `ThreadFactory` — способом настроить потоки пула (например, сделать их демонами).

## Таймкоды видео

- {{t j2 2:39:44}} — задача: таймер-демон в `ExecutorService`
- {{t j2 2:42:10}} — проблема: у `Runnable` нет `setDaemon`
- {{t j2 2:42:32}} — `ThreadFactory`: сами создаём потоки для пула
- {{t j2 2:44:13}} — задача: загрузка имени и возраста пользователя
- {{t j2 2:46:29}} — `run()` ничего не возвращает
- {{t j2 2:46:48}} — `submit()` возвращает `Future<T>`
- {{t j2 2:47:41}} — `Callable<T>` и метод `call()`
- {{t j2 2:48:39}} — `call()` может бросать проверяемые исключения
- {{t j2 2:49:01}} — `future.get()` ждёт результат
- {{t j2 2:50:46}} — мини-задание: загрузите возраст
- {{t j2 2:52:33}} — ловушка: таймер занял единственный поток пула
- {{t j2 2:53:15}} — итог: `execute` vs `submit`, `Runnable` vs `Callable`, `ThreadFactory`

## ThreadFactory: как пул создаёт потоки

Пул сам создаёт потоки, и вызвать у них `setDaemon` напрямую нельзя. Зато все фабрики `Executors` принимают `ThreadFactory`:

```java
ThreadFactory daemonFactory = runnable -> {
    Thread t = new Thread(runnable);
    t.setDaemon(true);
    t.setName("timer-" + t.threadId());
    return t;
};
ExecutorService executor = Executors.newFixedThreadPool(3, daemonFactory);
```

Каждая задача теперь выполняется в потоке-демоне. Через фабрику также задают имена потоков (очень помогает в логах и дампах), приоритеты, `UncaughtExceptionHandler`.

:::tip "Готовые билдеры"
С Java 21 фабрику можно получить из билдера: `Thread.ofPlatform().daemon().name("timer-", 0).factory()` — имена `timer-0`, `timer-1`… без ручного кода.
:::

## Callable и Future

```java
Future<String> futureName = executor.submit(() -> {   // Callable<String>
    Thread.sleep(5000);                               // имитация загрузки
    return "John";
});
Future<Integer> futureAge = executor.submit(() -> {
    Thread.sleep(4000);
    return 25;
});

String name = futureName.get();    // ждём результат (блокирует текущий поток)
int age = futureAge.get();
System.out.println("\nName: " + name + ", age: " + age);   // ~5 с, а не 9: задачи шли параллельно
```

| | `Runnable` | `Callable<V>` |
|---|---|---|
| Метод | `void run()` | `V call() throws Exception` |
| Результат | нет | есть |
| Проверяемые исключения | нельзя бросать | можно |

| | `execute(Runnable)` | `submit(Runnable / Callable)` |
|---|---|---|
| Возвращает | `void` | `Future<?>` / `Future<V>` |
| Исключение в задаче | печатается, поток пула умирает | сохраняется в `Future`, бросается из `get()` как `ExecutionException` |

Методы `Future`: `get()`, `get(timeout, unit)`, `isDone()`, `cancel(mayInterrupt)`, `isCancelled()`; с Java 19 — `resultNow()`, `exceptionNow()`, `state()`.

:::warning "Ловушка из видео: пул на один поток"
В видео таймер с бесконечным циклом занял единственный поток `newSingleThreadExecutor`, и задачи загрузки **никогда не начались** ({{t j2 2:52:33}}). Правило: долгоживущие задачи не должны делить ограниченный пул с короткими — иначе пул «голодает» (thread starvation). Отдельный пул для таймера или больше потоков.
:::

## Что не рассказано в видео

### invokeAll и invokeAny

```java
List<Callable<Integer>> tasks = List.of(() -> 1, () -> 2, () -> 3);
List<Future<Integer>> results = executor.invokeAll(tasks);   // ждёт все
Integer fastest = executor.invokeAny(tasks);                 // первый успешный
```

### CompletableFuture — асинхронные цепочки

`Future.get()` блокирует поток. `CompletableFuture` (Java 8) позволяет описать, **что делать, когда результат будет готов**, не блокируясь:

```java
CompletableFuture<String> name = CompletableFuture.supplyAsync(() -> loadName());
CompletableFuture<Integer> age = CompletableFuture.supplyAsync(() -> loadAge());

name.thenCombine(age, (n, a) -> n + ", " + a)
    .thenAccept(System.out::println)
    .exceptionally(ex -> { log(ex); return null; })
    .join();
```

Методы: `thenApply` (преобразовать), `thenCompose` (следующая асинхронная задача), `thenCombine` (объединить две), `allOf`/`anyOf`, `orTimeout` (Java 9).

### Structured concurrency (preview)

`StructuredTaskScope` позволяет запускать подзадачи как единое целое: если одна упала — остальные отменяются, а время жизни задач ограничено блоком. На 2026 год API всё ещё в **preview** и меняется от версии к версии — следите за JEP перед использованием.

## Домашнее задание

:::task video "Имя и возраст — из видео"
Через `ExecutorService` с фабрикой потоков-демонов запустите таймер с точками «загрузки», а также две задачи `Callable`: загрузку имени (5 с) и возраста (4 с). Выведите «Name: …, age: …» и убедитесь, что таймер остановился сам. {{t j2 2:50:46}}
??? Подсказка
Пул нужен минимум на 3 потока — один займёт бесконечный таймер. Разбор: {{t j2 2:51:05}}
:::

:::task easy "Сумма в Callable"
Разбейте сумму чисел от 1 до 100 000 000 на 4 части, посчитайте каждую в `Callable<Long>` через `invokeAll`, сложите результаты. Сверьте с формулой `n * (n + 1) / 2`.
:::

:::task medium "Таймаут и отмена"
Отправьте задачу, которая спит 10 секунд. Вызовите `future.get(2, SECONDS)`, поймайте `TimeoutException`, отмените задачу `cancel(true)` и докажите (выводом в `catch (InterruptedException)` внутри задачи), что она действительно прервана.
:::

:::task hard "Агрегатор цен на CompletableFuture"
Смоделируйте три «магазина», каждый возвращает цену товара с случайной задержкой 0.5–3 с (и иногда исключение). С помощью `CompletableFuture` запросите все три параллельно, проигнорируйте упавшие (`exceptionally`/`handle`), ограничьте каждый запрос 2 секундами (`completeOnTimeout`) и выведите минимальную цену. Общее время — не больше ~2 с.
:::
