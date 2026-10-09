Zadania częściej są potrzebne nie do wypisywania w konsoli, lecz dla **wyniku**: wczytać imię użytkownika, policzyć raport. Poznajemy `Callable`, `Future` i metodę `submit`, a także `ThreadFactory` — sposób skonfigurowania wątków puli (np. zrobienia z nich demonów).

## Znaczniki czasu wideo

- {{t j2 2:39:44}} — zadanie: timer-demon w `ExecutorService`
- {{t j2 2:42:10}} — problem: `Runnable` nie ma `setDaemon`
- {{t j2 2:42:32}} — `ThreadFactory`: sami tworzymy wątki dla puli
- {{t j2 2:44:13}} — zadanie: wczytywanie imienia i wieku użytkownika
- {{t j2 2:46:29}} — `run()` niczego nie zwraca
- {{t j2 2:46:48}} — `submit()` zwraca `Future<T>`
- {{t j2 2:47:41}} — `Callable<T>` i metoda `call()`
- {{t j2 2:48:39}} — `call()` może rzucać wyjątki sprawdzane
- {{t j2 2:49:01}} — `future.get()` czeka na wynik
- {{t j2 2:50:46}} — mini-zadanie: wczytaj wiek
- {{t j2 2:52:33}} — pułapka: timer zajął jedyny wątek puli
- {{t j2 2:53:15}} — podsumowanie: `execute` vs `submit`, `Runnable` vs `Callable`, `ThreadFactory`

## ThreadFactory: jak pula tworzy wątki

Pula sama tworzy wątki i nie da się bezpośrednio wywołać na nich `setDaemon`. Za to wszystkie fabryki `Executors` przyjmują `ThreadFactory`:

```java
ThreadFactory daemonFactory = runnable -> {
    Thread t = new Thread(runnable);
    t.setDaemon(true);
    t.setName("timer-" + t.threadId());
    return t;
};
ExecutorService executor = Executors.newFixedThreadPool(3, daemonFactory);
```

Każde zadanie wykonuje się teraz w wątku-demonie. Przez fabrykę ustawia się też nazwy wątków (bardzo pomagają w logach i zrzutach), priorytety, `UncaughtExceptionHandler`.

:::tip "Gotowe buildery"
Od Javy 21 fabrykę można dostać z buildera: `Thread.ofPlatform().daemon().name("timer-", 0).factory()` — nazwy `timer-0`, `timer-1`… bez ręcznego kodu.
:::

## Callable i Future

```java
Future<String> futureName = executor.submit(() -> {   // Callable<String>
    Thread.sleep(5000);                               // symulacja wczytywania
    return "John";
});
Future<Integer> futureAge = executor.submit(() -> {
    Thread.sleep(4000);
    return 25;
});

String name = futureName.get();    // czekamy na wynik (blokuje bieżący wątek)
int age = futureAge.get();
System.out.println("\nName: " + name + ", age: " + age);   // ~5 s, nie 9: zadania szły równolegle
```

| | `Runnable` | `Callable<V>` |
|---|---|---|
| Metoda | `void run()` | `V call() throws Exception` |
| Wynik | brak | jest |
| Wyjątki sprawdzane | nie można rzucać | można |

| | `execute(Runnable)` | `submit(Runnable / Callable)` |
|---|---|---|
| Zwraca | `void` | `Future<?>` / `Future<V>` |
| Wyjątek w zadaniu | wypisywany, wątek puli ginie | zapisany w `Future`, rzucany z `get()` jako `ExecutionException` |

Metody `Future`: `get()`, `get(timeout, unit)`, `isDone()`, `cancel(mayInterrupt)`, `isCancelled()`; od Javy 19 — `resultNow()`, `exceptionNow()`, `state()`.

:::warning "Pułapka z wideo: pula na jeden wątek"
W wideo timer z nieskończoną pętlą zajął jedyny wątek `newSingleThreadExecutor` i zadania wczytywania **nigdy się nie zaczęły** ({{t j2 2:52:33}}). Zasada: długo żyjące zadania nie powinny dzielić ograniczonej puli z krótkimi — inaczej pula „głoduje” (thread starvation). Osobna pula dla timera albo więcej wątków.
:::

## Czego nie ma w wideo

### invokeAll i invokeAny

```java
List<Callable<Integer>> tasks = List.of(() -> 1, () -> 2, () -> 3);
List<Future<Integer>> results = executor.invokeAll(tasks);   // czeka na wszystkie
Integer fastest = executor.invokeAny(tasks);                 // pierwszy udany
```

### CompletableFuture — asynchroniczne łańcuchy

`Future.get()` blokuje wątek. `CompletableFuture` (Java 8) pozwala opisać, **co zrobić, gdy wynik będzie gotowy**, bez blokowania:

```java
CompletableFuture<String> name = CompletableFuture.supplyAsync(() -> loadName());
CompletableFuture<Integer> age = CompletableFuture.supplyAsync(() -> loadAge());

name.thenCombine(age, (n, a) -> n + ", " + a)
    .thenAccept(System.out::println)
    .exceptionally(ex -> { log(ex); return null; })
    .join();
```

Metody: `thenApply` (przekształcić), `thenCompose` (kolejne zadanie asynchroniczne), `thenCombine` (połączyć dwa), `allOf`/`anyOf`, `orTimeout` (Java 9).

### Structured concurrency (preview)

`StructuredTaskScope` pozwala uruchamiać podzadania jako jedną całość: jeśli jedno się wywróci, pozostałe są anulowane, a czas życia zadań jest ograniczony blokiem. W 2026 roku API jest wciąż w **preview** i zmienia się między wersjami — sprawdź JEP przed użyciem.

## Zadanie domowe

:::task video "Imię i wiek — z wideo"
Przez `ExecutorService` z fabryką wątków-demonów uruchom timer z kropkami „wczytywania” oraz dwa zadania `Callable`: wczytanie imienia (5 s) i wieku (4 s). Wypisz „Name: …, age: …” i upewnij się, że timer zatrzymał się sam. {{t j2 2:50:46}}
??? Podpowiedź
Pula musi mieć co najmniej 3 wątki — jeden zajmie nieskończony timer. Omówienie: {{t j2 2:51:05}}
:::

:::task easy "Suma w Callable"
Podziel sumę liczb od 1 do 100 000 000 na 4 części, policz każdą w `Callable<Long>` przez `invokeAll`, dodaj wyniki. Sprawdź wzorem `n * (n + 1) / 2`.
:::

:::task medium "Limit czasu i anulowanie"
Wyślij zadanie, które śpi 10 sekund. Wywołaj `future.get(2, SECONDS)`, złap `TimeoutException`, anuluj zadanie `cancel(true)` i udowodnij (wypisaniem w `catch (InterruptedException)` wewnątrz zadania), że naprawdę zostało przerwane.
:::

:::task hard "Agregator cen na CompletableFuture"
Zasymuluj trzy „sklepy”, każdy zwraca cenę towaru z losowym opóźnieniem 0,5–3 s (i czasem wyjątek). Za pomocą `CompletableFuture` odpytaj wszystkie trzy równolegle, zignoruj te, które się wywróciły (`exceptionally`/`handle`), ogranicz każde zapytanie do 2 sekund (`completeOnTimeout`) i wypisz najniższą cenę. Łączny czas — nie więcej niż ~2 s.
:::
