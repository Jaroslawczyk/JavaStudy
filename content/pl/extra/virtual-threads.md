**Wątki wirtualne** (Java 21, JEP 444) to największa zmiana wielowątkowości w Javie od lat. To lekkie wątki zarządzane przez JVM, a nie przez system operacyjny. Można ich utworzyć milion, a pozwalają pisać prosty blokujący kod „wątek na żądanie”, który skaluje się jak kod asynchroniczny.

## Problem wątków platformowych

Zwykły `Thread` = wątek systemu: ~1 MB stosu, kosztowne tworzenie i przełączanie. Serwer z pulą 200 wątków obsłuży najwyżej 200 jednoczesnych żądań — nawet jeśli każde 95 % czasu po prostu **czeka** na odpowiedź bazy lub zewnętrznego API. Wcześniej rozwiązywano to programowaniem reaktywnym (WebFlux, `CompletableFuture`), ale taki kod trudno pisać, czytać i debugować.

## Jak działają wątki wirtualne

- Wątek wirtualny wykonuje się na **wątku nośnym** (carrier thread) z niewielkiej `ForkJoinPool` (według liczby rdzeni).
- Gdy wątek wirtualny blokuje się na I/O (`socket.read`, JDBC, `Thread.sleep`, `BlockingQueue.take`), JVM **zdejmuje** go z nośnika (unmount), zapisując stos na stercie, i uruchamia na nośniku inny wątek wirtualny.
- Gdy dane przyjdą, wątek znów jest montowany na jakimś nośniku i kontynuuje pracę.

```java
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    IntStream.range(0, 100_000).forEach(i ->
        executor.submit(() -> {
            Thread.sleep(Duration.ofSeconds(1));     // wywołanie blokujące — i to jest w porządku
            return i;
        }));
}   // 100 000 zadań zakończy się w około sekundę

Thread.ofVirtual().name("worker-", 0).start(task);
Thread.startVirtualThread(task);
```

## Zasady użycia

| ✅ Rób | ❌ Nie rób |
|---|---|
| Nowy wątek wirtualny na każde zadanie | Pule wątków wirtualnych — są tanie, nie ma po co |
| Kod blokujący: JDBC, `HttpClient`, `sleep` | Oczekuj przyspieszenia zadań CPU — rdzeni jest tyle samo |
| Ograniczaj dostęp do zasobu `Semaphore` (np. 50 połączeń z bazą) | Ograniczaj równoległość rozmiarem puli |
| `ReentrantLock` lub `synchronized` (Java 24+) | Ogromne obiekty w `ThreadLocal` — będą ich miliony kopii |

:::outdated "Pinning a synchronized"
W Javie 21–23 blokowanie wewnątrz `synchronized` „przypinało” (pinning) wątek wirtualny do nośnika, a pod obciążeniem nośniki się kończyły. Rada „zamieniaj `synchronized` na `ReentrantLock`” była aktualna do **Javy 24** — JEP 491 usunął ten problem. Przypinanie zostaje tylko przy wywołaniu kodu natywnego (JNI) i w rzadkich przypadkach; diagnostyka — zdarzenie JFR `jdk.VirtualThreadPinned`.
:::

## We frameworkach

- **Spring Boot 3.2+**: `spring.threads.virtual.enabled=true` — Tomcat/Jetty, `@Async`, schedulery przechodzą na wątki wirtualne.
- **Quarkus**: adnotacja `@RunOnVirtualThread`.
- **Helidon 4** jest zbudowany w całości na wątkach wirtualnych.

Dla typowego serwisu REST „żądanie → baza → zewnętrzne API → odpowiedź” często oznacza to wzrost przepustowości bez przepisywania kodu.

## Obok: Structured Concurrency i Scoped Values

- **Scoped Values** (sfinalizowane w Javie 25, JEP 506) — niezmienny zamiennik `ThreadLocal` do przekazywania kontekstu (użytkownik, trace-id) w głąb wywołań, wygodny przy milionach wątków.
- **Structured Concurrency** (`StructuredTaskScope`) — uruchamianie podzadań jako całości ze wspólnym anulowaniem przy błędzie. W 2026 roku API jest wciąż w preview.

:::interview "Pytania rekrutacyjne"
**Czym wątek wirtualny różni się od platformowego?** — Platformowy to opakowanie wątku systemu, ciężkie i ograniczone liczebnie. Wirtualny jest zarządzany przez JVM, montowany na wątku nośnym tylko podczas wykonywania kodu, przy blokadzie na I/O zwalnia nośnik; można ich tworzyć miliony.

**Czy wątki wirtualne przyspieszą sortowanie dużej tablicy?** — Nie: pomagają zadaniom, które czekają (I/O-bound), a nie obliczeniowym (CPU-bound).
:::

## Zadanie domowe

:::task easy "10 000 żądań"
Zasymuluj 10 000 „żądań”, każde śpi 200 ms. Wykonaj je przez `newFixedThreadPool(100)` i przez `newVirtualThreadPerTaskExecutor()`. Porównaj łączny czas.
:::

:::task medium "Równoległy pobieracz"
Za pomocą `HttpClient` i wątków wirtualnych pobierz 50 stron (np. różnych artykułów Wikipedii) równolegle, ale nie więcej niż 10 jednocześnie (`Semaphore`). Wypisz rozmiar każdej strony i łączny czas. Porównaj z pobieraniem sekwencyjnym.
:::

:::task hard "Znajdź pinning"
Napisz serwis, w którym wątki wirtualne blokują się wewnątrz `synchronized`, i uruchom go na Javie 21 i Javie 25 z `-Djdk.tracePinnedThreads=full` (Java 21) lub nagraniem JFR (`jdk.VirtualThreadPinned`). Porównaj przepustowość przy 10 000 jednoczesnych zadań i wyjaśnij różnicę z punktu widzenia JEP 491.
:::
