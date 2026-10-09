Tworzenie wątku pod każde zadanie jest drogie i niewygodne. W prawdziwych programach wątki bierze się z **puli**, a do czekania na grupę zadań używa się synchronizatorów. Poznajemy `CountDownLatch` i `ExecutorService` — fundament całej serwerowej wielowątkowości w Javie.

## Znaczniki czasu wideo

- {{t j2 2:23:19}} — 10 zadań w 10 wątkach
- {{t j2 2:24:12}} — lambda/klasa anonimowa widzi tylko zmienne `final` i effectively final
- {{t j2 2:25:18}} — jak poczekać na wszystkie wątki: lista i `join()` w pętli
- {{t j2 2:27:08}} — `CountDownLatch`: `countDown()` i `await()`
- {{t j2 2:29:13}} — 100 zadań: tworzenie wątków jest drogie
- {{t j2 2:29:21}} — idea puli wątków: `ExecutorService`
- {{t j2 2:30:23}} — `Executors.newFixedThreadPool(5)`
- {{t j2 2:31:02}} — `execute(Runnable)`
- {{t j2 2:31:46}} — program się nie kończy: `shutdown()`
- {{t j2 2:32:38}} — `newSingleThreadExecutor()` i `newCachedThreadPool()`
- {{t j2 2:33:39}} — zadanie domowe: trzy zadania w puli
- {{t j2 2:34:31}} — omówienie rozwiązania
- {{t j2 2:38:58}} — przepełnienie `int` → `long`

## Przechwytywanie zmiennych w lambdzie

```java
for (int i = 0; i < 10; i++) {
    final int index = i;                     // kopia, która się nie zmienia
    new Thread(() -> System.out.println("Start " + index)).start();
    // użycie i w środku to błąd: i się zmienia
}
```

Lambdy i klasy anonimowe widzą tylko zmienne lokalne **effectively final** — takie, które nie zmieniają się po inicjalizacji. Wartość jest kopiowana do obiektu lambdy.

## CountDownLatch

„Zatrzask z odliczaniem”: wątki zmniejszają licznik, a czekający wątek budzi się, gdy licznik dojdzie do zera.

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
latch.await();                               // czekamy, aż będzie 0
System.out.println("Wszystkie wątki zakończone");
```

Różnica względem `join()`: czekamy nie na konkretne wątki, lecz na **N zdarzeń**, które mogą zajść w dowolnych wątkach (także w puli, gdzie nie mamy referencji do wątków). Licznik jest **jednorazowy** — nie da się go zresetować (do ponownego użycia służy `CyclicBarrier`, zob. [lekcję o semaforach](#/lessons/j2-semaphore-barrier)).

:::tip "countDown — w finally"
Jeśli zadanie wywróci się wyjątkiem przed `countDown()`, `await()` będzie czekać w nieskończoność. Pewniej: `try { work(); } finally { latch.countDown(); }`. I używaj `await(timeout, unit)`, żeby nigdy nie zawisnąć na zawsze.
:::

## ExecutorService: pula wątków

Pula tworzy z góry N wątków. Zadania trafiają do **kolejki**, wolny wątek bierze następne zadanie. Wątki są używane wielokrotnie — nie płacisz za tworzenie każdego.

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
executor.shutdown();          // nowe zadania nie są przyjmowane, stare dokończą
latch.await();
```

| Fabryka | Zachowanie |
|---|---|
| `newFixedThreadPool(n)` | Dokładnie `n` wątków, nieograniczona kolejka |
| `newSingleThreadExecutor()` | Jeden wątek: zadania ściśle po kolei |
| `newCachedThreadPool()` | Tworzy wątki w miarę potrzeby, używa ponownie wolnych |
| `newScheduledThreadPool(n)` | Zadania z opóźnieniem i według harmonogramu |
| `newVirtualThreadPerTaskExecutor()` | Java 21+: nowy **wirtualny** wątek na każde zadanie |
| `newWorkStealingPool()` | `ForkJoinPool` według liczby rdzeni |

:::warning "Poprawka do wideo o cachedThreadPool"
Autor mówi, że pula cached „po zakończeniu zadań się nie zmniejsza”. To nieprawda: **bezczynne wątki są usuwane po 60 sekundach**. Prawdziwe niebezpieczeństwo jest inne — pula jest **nieograniczona**: 10 000 jednoczesnych zadań = 10 000 wątków systemowych, co może wyczerpać pamięć. W kodzie produkcyjnym tworzy się `ThreadPoolExecutor` z jawnymi limitami i ograniczoną kolejką.
:::

## Zamykanie puli

- `shutdown()` — przestać przyjmować zadania, pozwolić dokończyć bieżące.
- `awaitTermination(timeout, unit)` — poczekać na zakończenie.
- `shutdownNow()` — przerwać (`interrupt`) działające zadania i zwrócić niewykonane.

:::outdated "ExecutorService w try-with-resources (Java 19+)"
Od Javy 19 `ExecutorService` implementuje `AutoCloseable`: `close()` wywołuje `shutdown()` i czeka na zakończenie wszystkich zadań. Zapomniany `shutdown()` z wideo ({{t j2 2:31:46}}) przestaje być problemem:

```java
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    for (int i = 0; i < 10_000; i++) {
        int id = i;
        executor.submit(() -> handle(id));
    }
}   // tu wszystkie zadania są już wykonane
```
:::

## Czego nie ma w wideo

- **Obsługa błędów.** Wyjątek w zadaniu przekazanym przez `execute` jest wypisywany i zabija wątek puli (pula utworzy nowy). Przy `submit` wyjątek „chowa się” w `Future` — o tym niżej.
- **Rozmiar puli.** Dla obliczeń (CPU-bound) — około liczby rdzeni. Dla zadań z czekaniem (I/O-bound) — więcej, a od Javy 21 prościej użyć wątków wirtualnych.
- **`ThreadPoolExecutor`** — konfigurowalna implementacja: rozmiar core/max, kolejka, polityka przy przepełnieniu (`CallerRunsPolicy`, `AbortPolicy`).

## Zadanie domowe

:::task video "Trzy zadania w puli — z wideo"
Przez `ExecutorService` wykonaj trzy zadania: 1) suma liczb parzystych od 0 do 1 000 000; 2) suma liczb podzielnych przez 7 w tym samym zakresie; 3) lista 1000 losowych liczb od 0 do 1000 i liczba parzystych w niej. Poczekaj na nie przez `CountDownLatch`, zmierz czas. Porównaj pulę 3 wątków i pulę 1 wątku. {{t j2 2:33:39}}
??? Podpowiedź
Sumy nie mieszczą się w `int` — użyj `long` ({{t j2 2:38:58}}). Omówienie: {{t j2 2:34:31}}
:::

:::task easy "Pula i nazwy wątków"
Wyślij 20 zadań do `newFixedThreadPool(4)`, każde wypisuje nazwę wątku i śpi 200 ms. Upewnij się, że używane są tylko 4 wątki. Powtórz z `newCachedThreadPool()` i `newSingleThreadExecutor()`.
:::

:::task medium "Zatrzask startowy"
Za pomocą **dwóch** `CountDownLatch` zorganizuj jednoczesny start: 10 wątków-biegaczy się przygotowuje, czeka na sygnał `startSignal.await()`, `main` daje start `countDown()`, a potem czeka na metę wszystkich przez drugi zatrzask.
:::

:::task hard "Własny ThreadPoolExecutor"
Utwórz `new ThreadPoolExecutor(2, 4, 30, SECONDS, new ArrayBlockingQueue<>(10), new ThreadPoolExecutor.CallerRunsPolicy())`. Wyślij 50 długich zadań i loguj `getPoolSize()`, `getQueue().size()` i nazwę wątku. Wyjaśnij, kiedy pula rośnie z 2 do 4 wątków i dlaczego niektóre zadania wykonują się w `main`.
:::
