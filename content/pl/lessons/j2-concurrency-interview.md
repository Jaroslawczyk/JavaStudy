Końcowa „rozmowa rekrutacyjna” z wielowątkowości — jednego z głównych tematów na rozmowie programisty Javy. Odpowiadaj na głos, zaznaczaj słabe punkty i wracaj do lekcji. Odpowiedzi doprecyzowano tam, gdzie wideo upraszcza lub jest nieaktualne.

## Znaczniki czasu wideo

- {{t j2 4:00:31}} — początek rozmowy
- {{t j2 4:00:47}} — tworzenie wątków
- {{t j2 4:01:24}} — `wait`, `notify`, `notifyAll`, monitory, deadlock
- {{t j2 4:02:37}} — kolekcje synchronizowane
- {{t j2 4:03:07}} — `ExecutorService`, `submit`/`execute`, `Callable`, pule, `ThreadFactory`
- {{t j2 4:05:10}} — demony, atomiki, `volatile`
- {{t j2 4:06:31}} — `Semaphore`, `CountDownLatch`, `CyclicBarrier`
- {{t j2 4:08:06}} — koniec działu

## Pytania

:::task video "1. Jakie znasz sposoby tworzenia wątków? Który jest lepszy?"
{{t j2 4:00:47}}
??? Odpowiedź
Dziedziczyć po `Thread` lub zaimplementować `Runnable` (lepszy — bez ograniczenia pojedynczego dziedziczenia, zadanie oddzielone od wykonawcy). Dodatkowo: `Callable` + `ExecutorService`, `CompletableFuture`, wątki wirtualne (`Thread.ofVirtual()`, Java 21).
:::

:::task video "2. Opowiedz o wait, notify, notifyAll. Na jakich obiektach można je wywołać?"
{{t j2 4:01:24}}
??? Odpowiedź
Metody klasy `Object` do koordynacji wątków przez monitor. Wywołuje się je na obiekcie używanym jako monitor, **tylko wewnątrz `synchronized` na nim** (inaczej `IllegalMonitorStateException`).
:::

:::task video "3. Co robi wait()?"
{{t j2 4:01:44}}
??? Odpowiedź
Przenosi wątek w stan oczekiwania i **zwalnia monitor**. Wątek obudzi się przez `notify/notifyAll`, `interrupt` lub po limicie czasu (`wait(ms)`), potem znów zajmie monitor. Wywołuje się go w pętli ze sprawdzaniem warunku.
:::

:::task video "4. Co robią notify() i notifyAll()?"
{{t j2 4:01:53}}
??? Odpowiedź
Budzą wątki czekające na tym monitorze: `notify` — jeden dowolny, `notifyAll` — wszystkie (monitor będą zajmować po kolei).
:::

:::task video "5. Co jest monitorem metody synchronized?"
{{t j2 4:02:13}}
??? Odpowiedź
`this`; dla metody statycznej — obiekt `Class`.
:::

:::task video "6. Czym jest deadlock?"
{{t j2 4:02:21}}
??? Odpowiedź
Wzajemnym zakleszczeniem: wątki trzymają zasoby i w nieskończoność czekają na zasoby innych. (W wideo — „wszystkie wątki w stanie oczekiwania”; dokładniej — cykliczne czekanie.) Zapobieganie: jednolita kolejność zajmowania blokad, `tryLock` z limitem czasu. Diagnostyka — `jstack`.
:::

:::task video "7. Co wiesz o kolekcjach synchronizowanych?"
{{t j2 4:02:37}}
??? Odpowiedź
`Collections.synchronizedList/Set/Map` — opakowania z jednym monitorem na wszystkie metody. Zoptymalizowane — z `java.util.concurrent`: `ConcurrentHashMap`, `CopyOnWriteArrayList/Set`, kolejki `BlockingQueue`, `ConcurrentLinkedQueue`.
:::

:::task video "8. Po co jest ExecutorService?"
{{t j2 4:03:07}}
??? Odpowiedź
Wykonuje zadania na puli wielokrotnie używanych wątków, zarządza kolejką zadań i cyklem życia puli, zwraca wyniki przez `Future`.
:::

:::task video "9. Czym różnią się submit() i execute()?"
{{t j2 4:03:30}}
??? Odpowiedź
`execute(Runnable)` niczego nie zwraca. `submit(Runnable/Callable)` zwraca `Future`; wynik lub wyjątek (opakowany w `ExecutionException`) pobiera się przez `get()`.
:::

:::task video "10. Czym różnią się Runnable i Callable?"
{{t j2 4:03:53}}
??? Odpowiedź
`Runnable.run()` zwraca `void` i nie rzuca wyjątków sprawdzanych. `Callable<V>.call()` zwraca `V` i może rzucać `Exception`.
:::

:::task video "11. Jakie znasz rodzaje pul wątków?"
{{t j2 4:04:07}}
??? Odpowiedź
`newSingleThreadExecutor` (1 wątek), `newFixedThreadPool(n)`, `newCachedThreadPool` (rośnie na żądanie, bezczynne wątki usuwane po 60 s), `newScheduledThreadPool`, `newWorkStealingPool`, `newVirtualThreadPerTaskExecutor` (Java 21).
:::

:::task video "12. Jak wpływać na wątki tworzone przez ExecutorService?"
{{t j2 4:04:44}}
??? Odpowiedź
Przekazać do fabryki `Executors` własną `ThreadFactory`: tworzy `Thread` z `Runnable` i go konfiguruje (`setDaemon`, nazwa, priorytet, obsługa wyjątków).
:::

:::task video "13. Czym jest wątek demon?"
{{t j2 4:05:10}}
??? Odpowiedź
Wątkiem w tle, który kończy się automatycznie po zakończeniu wszystkich wątków głównych. `finally` w nim nie jest gwarantowane.
:::

:::task video "14. Po co są typy atomowe?"
{{t j2 4:05:30}}
??? Odpowiedź
Wykonują operacje złożone („odczytaj–zmień–zapisz”) atomowo bez blokad — na CAS. Przykład: `AtomicInteger.incrementAndGet()` zamiast `count++`.
:::

:::task video "15. Słowo kluczowe volatile: po co i gdzie stosować?"
{{t j2 4:06:08}}
??? Odpowiedź
Gwarantuje widoczność zapisów między wątkami i zabrania przestawiania operacji wokół dostępu do pola. Nie czyni `++` atomowym. Stosuje się je do flag i bezpiecznej publikacji referencji, gdy nie ma innej synchronizacji.
:::

:::task video "16. Semaphore, CountDownLatch, CyclicBarrier — jaka różnica?"
{{t j2 4:06:31}}
??? Odpowiedź
`Semaphore` wpuszcza do fragmentu kodu najwyżej N wątków. `CountDownLatch` — wątki czekają, aż N operacji wywoła `countDown()`; jednorazowy. `CyclicBarrier` — N wątków czeka na siebie w punkcie, potem bariera się resetuje i można jej użyć ponownie.
:::

## Dodatkowe pytania (nie z wideo)

:::task easy "Czym jest ThreadLocal?"
Gdzie się go stosuje i w czym niebezpieczeństwo?
??? Odpowiedź
Zmienna, która ma własną wartość w każdym wątku (np. `SimpleDateFormat`, kontekst żądania/transakcji). Niebezpieczeństwo — w pulach wątki żyją długo: zapomniane `remove()` to wyciek pamięci i „cudze” dane w następnym żądaniu. W Javie 25 dla wielu przypadków pojawiły się **Scoped Values** (JEP 506).
:::

:::task medium "synchronized vs ReentrantLock"
Kiedy co wybierać?
??? Odpowiedź
`synchronized` — prostszy, zwalnia się automatycznie, od Javy 24 nie „przypina” wątków wirtualnych. `ReentrantLock` — gdy potrzebne są `tryLock` z limitem czasu, przerywalne czekanie, sprawiedliwa kolejka, kilka `Condition`. Zwalniać ściśle w `finally`.
:::

:::task medium "Czym jest CompletableFuture?"
Czym jest lepszy od zwykłego `Future`?
??? Odpowiedź
Pozwala budować nieblokujące łańcuchy (`thenApply`, `thenCompose`, `thenCombine`, `allOf`), obsługiwać błędy (`exceptionally`, `handle`) i limity czasu bez wywoływania blokującego `get()`.
:::

:::task hard "Wątki wirtualne: kiedy pomagają, a kiedy nie?"
Wyjaśnij na przykładach.
??? Odpowiedź
Pomagają w zadaniach, w których wątki dużo **czekają** (HTTP, baza danych, pliki): można trzymać setki tysięcy jednoczesnych zadań w modelu „wątek na żądanie”. Nie przyspieszają **obliczeń** (CPU-bound) — rdzeni jest tyle samo. Nie pakuje się ich w pule; dostęp do zasobów ogranicza się semaforami. Uważaj na duże `ThreadLocal` w każdym z miliona wątków.
:::
