Создавать поток под каждую задачу — дорого и неудобно. В реальных программах потоки берут из **пула**, а для ожидания группы задач используют синхронизаторы. Знакомимся с `CountDownLatch` и `ExecutorService` — основой всей серверной многопоточности в Java.

## Таймкоды видео

- {{t j2 2:23:19}} — 10 задач в 10 потоках
- {{t j2 2:24:12}} — лямбда/анонимный класс видит только `final` и effectively final переменные
- {{t j2 2:25:18}} — как дождаться всех потоков: список и `join()` в цикле
- {{t j2 2:27:08}} — `CountDownLatch`: `countDown()` и `await()`
- {{t j2 2:29:13}} — 100 задач: создавать потоки дорого
- {{t j2 2:29:21}} — идея пула потоков: `ExecutorService`
- {{t j2 2:30:23}} — `Executors.newFixedThreadPool(5)`
- {{t j2 2:31:02}} — `execute(Runnable)`
- {{t j2 2:31:46}} — программа не завершается: `shutdown()`
- {{t j2 2:32:38}} — `newSingleThreadExecutor()` и `newCachedThreadPool()`
- {{t j2 2:33:39}} — домашнее задание: три задачи в пуле
- {{t j2 2:34:31}} — разбор решения
- {{t j2 2:38:58}} — переполнение `int` → `long`

## Захват переменных в лямбде

```java
for (int i = 0; i < 10; i++) {
    final int index = i;                     // копия, которая не меняется
    new Thread(() -> System.out.println("Start " + index)).start();
    // System.out.println(i) внутри — ошибка: i меняется
}
```

Лямбды и анонимные классы видят только **effectively final** локальные переменные — те, что не меняются после инициализации. Значение копируется в объект лямбды.

## CountDownLatch

«Защёлка с обратным отсчётом»: потоки уменьшают счётчик, а ожидающий поток просыпается, когда счётчик дошёл до нуля.

```java
CountDownLatch latch = new CountDownLatch(10);
for (int i = 0; i < 10; i++) {
    final int index = i;
    new Thread(() -> {
        System.out.println("Start " + index);
        sleep(1000);
        System.out.println("Finish " + index);
        latch.countDown();                   // −1
    }).start();
}
latch.await();                               // ждём, пока станет 0
System.out.println("Все потоки завершены");
```

Отличие от `join()`: ждём не конкретные потоки, а **N событий**, которые могут произойти в любых потоках (в том числе в пуле, где у нас нет ссылок на потоки). Счётчик **одноразовый** — сбросить его нельзя (для повторного использования есть `CyclicBarrier`, см. [урок о семафорах](#/lessons/j2-semaphore-barrier)).

:::tip "countDown — в finally"
Если задача упадёт с исключением до `countDown()`, `await()` будет ждать вечно. Надёжнее: `try { work(); } finally { latch.countDown(); }`. И используйте `await(timeout, unit)`, чтобы не зависнуть навсегда.
:::

## ExecutorService: пул потоков

Пул заранее создаёт N потоков. Задачи попадают в **очередь**, свободный поток берёт следующую задачу. Потоки переиспользуются — не надо платить за создание каждого.

```java
ExecutorService executor = Executors.newFixedThreadPool(5);
CountDownLatch latch = new CountDownLatch(100);

for (int i = 0; i < 100; i++) {
    final int index = i;
    executor.execute(() -> {
        try {
            System.out.println("Task " + index + " in " + Thread.currentThread().getName());
        } finally {
            latch.countDown();
        }
    });
}
executor.shutdown();          // новые задачи не принимаются, старые доработают
latch.await();
```

| Фабрика | Поведение |
|---|---|
| `newFixedThreadPool(n)` | Ровно `n` потоков, неограниченная очередь |
| `newSingleThreadExecutor()` | Один поток: задачи строго по очереди |
| `newCachedThreadPool()` | Создаёт потоки по мере надобности, переиспользует свободные |
| `newScheduledThreadPool(n)` | Задачи с задержкой и по расписанию |
| `newVirtualThreadPerTaskExecutor()` | Java 21+: новый **виртуальный** поток на каждую задачу |
| `newWorkStealingPool()` | `ForkJoinPool` по числу ядер |

:::warning "Поправка к видео про cachedThreadPool"
Автор говорит, что cached-пул «после завершения задач не уменьшается». Это не так: **простаивающие потоки удаляются через 60 секунд**. Реальная опасность другая — пул **не ограничен**: 10 000 одновременных задач = 10 000 потоков ОС, что может исчерпать память. Для производственного кода создают `ThreadPoolExecutor` с явными лимитами и ограниченной очередью.
:::

## Завершение пула

- `shutdown()` — перестать принимать задачи, дать доработать текущим.
- `awaitTermination(timeout, unit)` — дождаться завершения.
- `shutdownNow()` — прервать (`interrupt`) работающие задачи и вернуть невыполненные.

:::outdated "ExecutorService в try-with-resources (Java 19+)"
С Java 19 `ExecutorService` реализует `AutoCloseable`: `close()` вызывает `shutdown()` и ждёт завершения всех задач. Забытый `shutdown()` из видео ({{t j2 2:31:46}}) больше не проблема:

```java
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    for (int i = 0; i < 10_000; i++) {
        int id = i;
        executor.submit(() -> handle(id));
    }
}   // здесь все задачи уже выполнены
```
:::

## Что не рассказано в видео

- **Обработка ошибок.** Исключение в задаче, переданной через `execute`, печатается и убивает поток пула (пул создаст новый). При `submit` исключение «прячется» в `Future` — о нём ниже.
- **Размер пула.** Для вычислений (CPU-bound) — около числа ядер. Для задач с ожиданием (I/O-bound) — больше, а с Java 21 — проще виртуальные потоки.
- **`ThreadPoolExecutor`** — настраиваемая реализация: core/max размер, очередь, политика при переполнении (`CallerRunsPolicy`, `AbortPolicy`).

## Домашнее задание

:::task video "Три задачи в пуле — из видео"
Через `ExecutorService` выполните три задачи: 1) сумма чётных чисел от 0 до 1 000 000; 2) сумма чисел, делящихся на 7, в том же диапазоне; 3) список из 1000 случайных чисел от 0 до 1000 и количество чётных в нём. Дождитесь их через `CountDownLatch`, замерьте время. Сравните пул из 3 потоков и из 1. {{t j2 2:33:39}}
??? Подсказка
Суммы не помещаются в `int` — используйте `long` ({{t j2 2:38:58}}). Разбор: {{t j2 2:34:31}}
:::

:::task easy "Пул и имена потоков"
Отправьте 20 задач в `newFixedThreadPool(4)`, каждая печатает имя потока и спит 200 мс. Убедитесь, что используются только 4 потока. Повторите с `newCachedThreadPool()` и `newSingleThreadExecutor()`.
:::

:::task medium "Защёлка-стартер"
С помощью **двух** `CountDownLatch` организуйте одновременный старт: 10 потоков-бегунов готовятся, ждут сигнала `startSignal.await()`, `main` даёт старт `countDown()`, затем ждёт финиша всех через вторую защёлку.
:::

:::task hard "Свой ThreadPoolExecutor"
Создайте `new ThreadPoolExecutor(2, 4, 30, SECONDS, new ArrayBlockingQueue<>(10), new ThreadPoolExecutor.CallerRunsPolicy())`. Отправьте 50 долгих задач и логируйте `getPoolSize()`, `getQueue().size()` и имя потока. Объясните, когда пул растёт с 2 до 4 потоков и почему некоторые задачи выполняются в `main`.
:::
