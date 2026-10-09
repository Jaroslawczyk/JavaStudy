Co można zrobić z już działającym wątkiem? Zatrzymać (poprawnie i niepoprawnie), uśpić, poczekać na jego zakończenie. Omawiamy `stop()`, `interrupt()`, `sleep()`, `join()`, uczymy się mierzyć czas i przyspieszamy obliczenia dwukrotnie, dzieląc tablicę na dwie połowy.

## Znaczniki czasu wideo

- {{t j2 1:14:08}} — pytanie: czy można zatrzymać, wstrzymać, ponownie uruchomić wątek
- {{t j2 1:14:36}} — `stop()` — przestarzały i niebezpieczny
- {{t j2 1:15:23}} — `interrupt()` nie zatrzymuje wątku, tylko ustawia flagę
- {{t j2 1:16:27}} — `Thread.currentThread().isInterrupted()`
- {{t j2 1:17:34}} — zakończonego wątku nie można uruchomić ponownie
- {{t j2 1:17:56}} — timer: `Thread.sleep(1000)`
- {{t j2 1:18:28}} — `InterruptedException`
- {{t j2 1:19:35}} — dlaczego `try` musi obejmować całą pętlę
- {{t j2 1:21:13}} — trzy kolekcje wypełniane w trzech wątkach
- {{t j2 1:23:39}} — złe rozmiary: wątek główny nie czeka
- {{t j2 1:24:13}} — `join()`: czekamy na zakończenie wątku
- {{t j2 1:25:33}} — kolejność uruchomienia wątków nie jest gwarantowana
- {{t j2 1:27:19}} — błąd z liczenia na kolejność: `NullPointerException`
- {{t j2 1:28:31}} — naprawiamy przez `join()`
- {{t j2 1:29:14}} — pomiar czasu: `System.currentTimeMillis()`
- {{t j2 1:30:24}} — zadanie domowe: obliczanie tablicy w jednym i w dwóch wątkach
- {{t j2 1:31:58}} — omówienie rozwiązania
- {{t j2 1:39:18}} — wynik: z wątkami prawie 2 razy szybciej

## Zatrzymywanie wątku

### stop() — nie wolno

`stop()` natychmiast przerywa wątek w dowolnym miejscu: jeśli zapisywał plik lub rekord w bazie, dane zostaną uszkodzone, a monitory — zwolnione w połowie operacji.

:::outdated "Thread.stop() już nie działa"
W wideo `stop()` jest przekreślony, ale jeszcze działa. **Od Javy 20 `Thread.stop()` zawsze rzuca `UnsupportedOperationException`.** Metody `suspend()`/`resume()` (pauza/wznowienie) też wyszły z użycia. Jedyny poprawny sposób to kooperacyjne zatrzymanie przez `interrupt()`.
:::

### interrupt() — uprzejma prośba

`interrupt()` jedynie ustawia wątkowi **flagę przerwania**. Wątek sam musi ją sprawdzać i zdecydować, jak się zakończyć:

```java
Thread counter = new Thread(() -> {
    for (int i = 0; i < 1_000_000; i++) {
        if (Thread.currentThread().isInterrupted()) {
            System.out.println("Przerwano mnie na " + i);
            break;
        }
        System.out.println(i);
    }
});
counter.start();
Thread.sleep(10);
counter.interrupt();
```

Jeśli wątek w tym momencie **śpi** (`sleep`), **czeka** (`join`, `wait`) lub jest zablokowany na kolejce, metoda od razu rzuca `InterruptedException`, a flaga jest **czyszczona**.

## sleep() i obsługa InterruptedException

```java
Thread timer = new Thread(() -> {
    try {
        int seconds = 0;
        while (true) {                          // cała pętla wewnątrz try
            System.out.println(seconds++);
            Thread.sleep(1000);
        }
    } catch (InterruptedException e) {
        System.out.println("Timer zatrzymany");
    }
});
```

Jeśli w `try` objąć tylko `sleep`, wyjątek zostanie złapany, ale pętla będzie kontynuowana — wątek „nie usłyszy” prośby o zatrzymanie ({{t j2 1:19:35}}).

:::warning "Nie połykaj InterruptedException"
Jeśli łapiesz `InterruptedException`, ale nie możesz tu zakończyć pracy (np. w metodzie bibliotecznej), **przywróć flagę**: `Thread.currentThread().interrupt();` — inaczej kod wywołujący nie dowie się o przerwaniu. Pusty `catch` to klasyczny błąd wytykany na code review.
:::

## join() — poczekać na wątek

```java
List<Integer> list1 = new ArrayList<>(), list2 = new ArrayList<>();
Thread t1 = new Thread(() -> { for (int i = 0; i < 1_000_000; i++) list1.add(i); });
Thread t2 = new Thread(() -> { for (int i = 0; i < 1_000_000; i++) list2.add(i); });
t1.start(); t2.start();

t1.join();      // wątek główny czeka na t1
t2.join();      // …i na t2
System.out.println(list1.size() + " " + list2.size());   // 1000000 1000000
```

`join()` zatrzymuje **wątek, w którym go wywołano**, do zakończenia wątku, **na którym go wywołano**. Jest wariant z limitem czasu: `t.join(500)` lub `t.join(Duration.ofSeconds(1))` (Java 19+).

## Kolejność wątków nie jest gwarantowana

`start()` trzech wątków po kolei nie oznacza, że wykonają się w tej kolejności: `1 3 2`, `2 1 3` — dowolny wariant. Jeśli wątek B zależy od wyniku A, synchronizuj je jawnie (`join`, `CountDownLatch`, `Future`…), zamiast liczyć na kolejność startu.

## Cykl życia wątku

| Stan (`Thread.State`) | Kiedy |
|---|---|
| `NEW` | Utworzony, `start()` jeszcze nie wywołany |
| `RUNNABLE` | Wykonuje się lub jest gotowy do wykonania |
| `BLOCKED` | Czeka na monitor (`synchronized`) |
| `WAITING` | `join()`, `wait()` bez limitu czasu |
| `TIMED_WAITING` | `sleep()`, `join(ms)`, `wait(ms)` |
| `TERMINATED` | `run()` się zakończył — nie da się uruchomić ponownie |

## Omówienie zadania: tablica w dwóch wątkach

```java
static final int SIZE = 10_000_000, HALF = SIZE / 2;

static void withConcurrency() throws InterruptedException {
    float[] arr = new float[SIZE];
    Arrays.fill(arr, 1f);
    long before = System.currentTimeMillis();

    float[] a = new float[HALF], b = new float[HALF];
    System.arraycopy(arr, 0, a, 0, HALF);
    System.arraycopy(arr, HALF, b, 0, HALF);

    Thread t1 = new Thread(() -> calc(a, 0));
    Thread t2 = new Thread(() -> calc(b, HALF));    // przesunięcie indeksu!
    t1.start(); t2.start();
    t1.join(); t2.join();

    System.arraycopy(a, 0, arr, 0, HALF);
    System.arraycopy(b, 0, arr, HALF, HALF);
    System.out.println("Z wątkami: " + (System.currentTimeMillis() - before) + " ms");
}

static void calc(float[] part, int offset) {
    for (int i = 0; i < part.length; i++) {
        float f = i + offset;
        part[i] = (float) (part[i] * Math.sin(0.2f + f / 5) * Math.cos(0.2f + f / 5) * Math.cos(0.4f + f / 2));
    }
}
```

:::warning "Subtelność, której nie ma w wideo"
W drugiej połowie indeks `i` zaczyna się od zera, a w wersji jednowątkowej były tam wartości `5 000 000…`. Żeby wyniki obu metod się zgadzały, przekazuj **przesunięcie** (`offset`). Sprawdź: `Arrays.equals(result1, result2)`.
:::

:::tip "Jak poprawnie mierzyć czas"
`System.currentTimeMillis()` to „zegar ścienny”, który może zawieść przy zmianie czasu. Do pomiarów używaj `System.nanoTime()`. Do rzetelnych benchmarków — **JMH** (uwzględnia rozgrzewkę JIT): pierwsze uruchomienia w JVM są zawsze wolniejsze.
:::

## Zadanie domowe

:::task video "Tablica w jednym i w dwóch wątkach — z wideo"
Utwórz tablicę `float` z 10 mln elementów, wypełnij jedynkami i przelicz każdy element wzorem z wideo. Metoda 1 — w jednym wątku; metoda 2 — podziel tablicę na dwie połowy (`System.arraycopy`), policz w dwóch wątkach, sklej z powrotem. Porównaj czas. {{t j2 1:30:24}}
??? Podpowiedź
Poczekaj na oba wątki przez `join()` przed sklejeniem. Omówienie: {{t j2 1:31:58}}
:::

:::task easy "Timer z zatrzymaniem"
Uruchom timer wypisujący sekundy i zatrzymaj go z `main` po 5 sekundach wywołaniem `interrupt()`. Timer powinien wypisać „Zatrzymany” i poprawnie się zakończyć.
:::

:::task medium "N wątków zamiast dwóch"
Uogólnij zadanie z wideo na `N` wątków (`N = availableProcessors()`). Porównaj czas dla `N = 1, 2, 4, 8, 16`. Kiedy przyspieszenie przestaje rosnąć i dlaczego?
:::

:::task hard "Stany wątku"
Napisz program, który wypisuje `getState()` jednego wątku we wszystkich sześciu stanach: `NEW`, `RUNNABLE`, `TIMED_WAITING` (sleep), `WAITING` (join na innym wątku), `BLOCKED` (czeka na `synchronized` zajęty przez wątek główny), `TERMINATED`.
??? Podpowiedź
Dla `BLOCKED`: wątek główny wchodzi w `synchronized (lock)`, uruchamia wątek, który też próbuje wejść w `synchronized (lock)`, chwilę śpi i wypisuje jego stan.
:::
