Ostatnia lekcja o wielowątkowości — jeszcze dwa synchronizatory: **`Semaphore`** ogranicza liczbę wątków jednocześnie pracujących z zasobem, a **`CyclicBarrier`** zbiera wątki w jednym punkcie. Na koniec — duże zadanie „wyścig samochodów z tunelem”, w którym przyda się wszystko, czego się nauczyliśmy.

## Znaczniki czasu wideo

- {{t j2 3:31:28}} — po co ograniczać liczbę wątków (pobieranie 100 plików)
- {{t j2 3:32:41}} — metoda „praca z systemem plików”
- {{t j2 3:35:37}} — 10 wątków jednocześnie wchodzi do systemu plików
- {{t j2 3:35:59}} — próba przez pulę 3 wątków — tracimy równoległość
- {{t j2 3:36:57}} — `Semaphore(3)`: `acquire()` i `release()`
- {{t j2 3:38:19}} — `release()` — w `finally`
- {{t j2 3:40:48}} — `CyclicBarrier`: przygotowanie danych w 10 wątkach
- {{t j2 3:42:15}} — to samo przez `CountDownLatch`
- {{t j2 3:43:04}} — czekamy parami: `CountDownLatch` się nie nadaje
- {{t j2 3:44:13}} — `CyclicBarrier` się resetuje i działa ponownie
- {{t j2 3:46:09}} — zadanie domowe: wyścig
- {{t j2 3:48:36}} — omówienie rozwiązania

## Semaphore

Semafor przechowuje liczbę „pozwoleń”. `acquire()` bierze pozwolenie (albo czeka, jeśli ich brak), `release()` je oddaje.

```java
private static final Semaphore semaphore = new Semaphore(3);   // najwyżej 3 wątki

static void workWithFileSystem() {
    String name = Thread.currentThread().getName();
    try {
        semaphore.acquire();                   // −1 albo czekać
        try {
            System.out.println(name + " pracuje z systemem plików");
            Thread.sleep(1000);
        } finally {
            semaphore.release();               // +1, nawet przy błędzie
        }
    } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
    }
}
```

Wszystkie 10 wątków równolegle wykonuje „swoją” pracę, ale do sekcji krytycznej trafiają jednocześnie najwyżej trzy. Pula 3 wątków tak nie potrafi: ograniczyłaby **całą** pracę ({{t j2 3:36:36}}).

:::warning "release — ściśle w finally i ściśle po udanym acquire"
Jeśli `acquire()` przerwano, pozwolenie nie zostało uzyskane — i `release()` wywoływać nie wolno, inaczej pozwoleń będzie więcej niż było. Dlatego `release` jest w **wewnętrznym** `try` po `acquire`, a nie w zewnętrznym.
:::

Gdzie się stosuje: ograniczenie jednoczesnych zapytań do zewnętrznego API, pula połączeń, rate limiting. `new Semaphore(n, true)` — tryb „sprawiedliwy” (FIFO).

## CyclicBarrier

Bariera na N uczestników: każdy, dochodząc do punktu, wywołuje `await()` i czeka; gdy zbiorą się wszyscy N — bariera się otwiera i wszyscy kontynuują jednocześnie. Potem bariera **automatycznie uzbraja się ponownie**.

```java
CyclicBarrier barrier = new CyclicBarrier(2, () -> System.out.println("Para gotowa!"));

executor.execute(() -> {
    prepareData();
    try {
        barrier.await();                  // czekamy na jeszcze jednego
    } catch (InterruptedException | BrokenBarrierException e) {
        throw new RuntimeException(e);
    }
    System.out.println(Thread.currentThread().getName() + " kontynuuje");
});
```

Drugi argument konstruktora — akcja wykonywana przy każdym otwarciu bariery. Jeśli któryś z czekających zostanie przerwany, bariera „się psuje”, a pozostali dostają `BrokenBarrierException`.

| | `CountDownLatch` | `CyclicBarrier` | `Semaphore` |
|---|---|---|---|
| Idea | czekać na N zdarzeń | N wątków czeka na siebie | najwyżej N wątków w środku |
| Kto czeka | dowolne wątki przez `await()` | sami uczestnicy | chcący wejść |
| Ponowne użycie | ❌ jednorazowy | ✅ resetuje się | ✅ |

:::note "Phaser i Exchanger"
W wideo wspomina się „kilka innych klas”. **`Phaser`** (Java 7) — elastyczna bariera ze zmienną liczbą uczestników i wieloma fazami. **`Exchanger`** — punkt wymiany danych między dwoma wątkami.
:::

## Omówienie wyścigu (w skrócie)

- 10 samochodów = 10 zadań w `ExecutorService`.
- Start jednocześnie po przygotowaniu → `CyclicBarrier(10)` (lub `CountDownLatch`).
- W tunelu najwyżej 3 samochody → `Semaphore(3)` wokół etapu „tunel”.
- Wyniki → `ConcurrentHashMap<Integer, Long>`.
- Czekamy na metę wszystkich → `CountDownLatch(10)`.
- Zwycięzca to pierwszy na mecie: blok `synchronized` (lub `AtomicInteger.compareAndSet(-1, index)`) wokół „jeśli zwycięzcy jeszcze nie ma — to ja”.

## Zadanie domowe

:::task video "Wyścig z tunelem — z wideo"
10 samochodów-wątków. Każdy przygotowuje się losowy czas, startują wszystkie jednocześnie. Trasa: droga → tunel → droga, każdy etap ma losowy czas; w tunelu jednocześnie najwyżej 3 samochody. Na końcu wypisz zwycięzcę z czasem i tabelę wszystkich wyników. {{t j2 3:46:09}}
??? Podpowiedź
`CyclicBarrier` do startu, `Semaphore` do tunelu, `ConcurrentHashMap` na wyniki, `CountDownLatch` na metę. Omówienie: {{t j2 3:48:36}}
:::

:::task easy "Parking"
Parking na 3 miejsca (`Semaphore(3)`), 10 samochodów-wątków: przyjeżdżają, czekają na miejsce, stoją losowy czas, odjeżdżają. Loguj „wjechał / wyjechał / wolnych miejsc: N” (`availablePermits()`).
:::

:::task medium "Ogranicznik zapytań"
Napisz `RateLimiter`, który przepuszcza najwyżej 5 jednoczesnych wywołań „zewnętrznego API” i odmawia przy czekaniu dłuższym niż 1 sekunda (`tryAcquire(1, SECONDS)`). Obciąż go 50 wątkami i policz sukcesy i odmowy.
:::

:::task hard "Równoległa macierz w fazach"
Macierz 1000×1000, 4 wątki, każdy obsługuje swoją ćwiartkę wierszy. Algorytm z 10 iteracji: w każdej iteracji wartość komórki = średnia sąsiadów z **poprzedniej** iteracji. Użyj `CyclicBarrier(4, swapBuffers)`, żeby wszystkie wątki skończyły iterację, zanim zacznie się następna. Porównaj wynik z jednowątkowym.
:::
