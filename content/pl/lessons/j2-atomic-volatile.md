Jeszcze dwa narzędzia przeciw problemom wielowątkowości: **typy atomowe** (`AtomicInteger` i spółka) — operacje „odczytaj–zmień–zapisz” w jednym niepodzielnym kroku, oraz słowo kluczowe **`volatile`** — gwarancja widoczności zmian między wątkami. I omówienie popularnego błędnego przekonania: `volatile` **nie** rozwiązuje wyścigu.

## Znaczniki czasu wideo

- {{t j2 2:11:01}} — wracamy do licznika bez synchronizacji
- {{t j2 2:13:12}} — inkrementacja to trzy operacje
- {{t j2 2:13:33}} — typy atomowe: `AtomicInteger`, `AtomicBoolean`, `AtomicLong`…
- {{t j2 2:14:29}} — `getAndIncrement()`, `getAndDecrement()`
- {{t j2 2:15:19}} — popularne pytanie: słowo kluczowe `volatile`
- {{t j2 2:15:48}} — buforowanie zmiennej w wątku
- {{t j2 2:16:45}} — mit: „volatile czyni operacje atomowymi”
- {{t j2 2:17:12}} — sprawdzenie: `volatile` nie usuwa wyścigu

## Typy atomowe

```java
public class Counter {
    private final AtomicInteger value = new AtomicInteger();

    public void increment() { value.incrementAndGet(); }
    public void decrement() { value.decrementAndGet(); }
    public int getValue()   { return value.get(); }
}
```

Żadnego `synchronized`, a wynik to zawsze 0. Pakiet `java.util.concurrent.atomic`: `AtomicInteger`, `AtomicLong`, `AtomicBoolean`, `AtomicReference<V>`, tablice `AtomicIntegerArray`…

| Metoda | Co robi |
|---|---|
| `get()` / `set(v)` | Odczytać / zapisać |
| `incrementAndGet()` / `getAndIncrement()` | `++i` / `i++` atomowo |
| `addAndGet(delta)` | Dodać |
| `compareAndSet(expected, new)` | Zapisać `new`, tylko jeśli teraz jest `expected` |
| `updateAndGet(x -> x * 2)` | Dowolna funkcja (Java 8+) |
| `accumulateAndGet(x, Math::max)` | Złożyć z argumentem |

### Jak to działa: CAS

Atomiki zbudowano nie na blokadach, lecz na instrukcji procesora **CAS** (compare-and-swap): „zapisz nową wartość, jeśli w pamięci wciąż jest stara; w przeciwnym razie zgłoś niepowodzenie”. Przy niepowodzeniu operacja jest po prostu powtarzana:

```java
int prev, next;
do {
    prev = value.get();
    next = prev + 1;
} while (!value.compareAndSet(prev, next));
```

To algorytm **nieblokujący** (lock-free): wątki nie zasypiają, tylko „kręcą się”. Przy umiarkowanej rywalizacji jest szybszy od `synchronized`.

:::tip "LongAdder dla gorących liczników"
Jeśli dziesiątki wątków stale zwiększają jeden licznik (metryki, statystyki), `AtomicLong` utyka na ciągłych powtórzeniach CAS. **`LongAdder`** (Java 8) trzyma kilka komórek i sumuje je przy odczycie — pod dużym obciążeniem jest wielokrotnie szybszy.
:::

## volatile

Wyjaśnienie z wideo: wątek może zbuforować zmienną u siebie i nie widzieć zmian zrobionych przez inne wątki; `volatile` zabrania takiego buforowania. To dobra intuicja. Dokładniej (według modelu pamięci Javy, JMM):

- **Widoczność.** Zapis do pola `volatile` jest od razu widoczny dla wszystkich wątków, które je czytają.
- **Uporządkowanie.** Wszystko, co wątek zapisał **przed** zapisem do pola `volatile`, stanie się widoczne dla wątku, który **potem** odczyta to pole (relacja *happens-before*). Kompilator i procesor nie przestawią operacji przez tę granicę.
- **Atomowość** — tylko dla pojedynczego odczytu/zapisu (także `long`/`double`). **Operacje złożone (`count++`) nie stają się atomowe.**

```java
private volatile boolean running = true;     // klasyczny przypadek: flaga zatrzymania

public void run() {
    while (running) { doWork(); }            // bez volatile pętla mogłaby nie zobaczyć false
}
public void stop() { running = false; }
```

:::warning "Poprawka do wideo"
Autor radzi robić `volatile` **każdą** zmienną, do której sięgają różne wątki. Nie jest to potrzebne, jeśli wszystkie dostępy i tak odbywają się wewnątrz `synchronized` na jednym monitorze (lub przez `Lock`) — synchronizacja sama zapewnia widoczność. `volatile` jest potrzebny tam, gdzie synchronizacji nie ma: flagi, jednorazowo publikowane referencje, double-checked locking.
:::

:::interview "Pytanie rekrutacyjne"
**Co robi volatile i czy rozwiązuje race condition?** — Gwarantuje widoczność zapisu wszystkim wątkom i zabrania przestawiania operacji wokół dostępu do pola. Atomowości operacji złożonych nie daje: `volatile int count; count++` nadal gubi aktualizacje. Dla liczników — `AtomicInteger`/`LongAdder` lub synchronizacja.
:::

## Czego nie ma w wideo

- **Double-checked locking** — leniwa inicjalizacja z `volatile`:

```java
private static volatile Service instance;
static Service get() {
    Service s = instance;
    if (s == null) {
        synchronized (Service.class) {
            s = instance;
            if (s == null) instance = s = new Service();
        }
    }
    return s;
}
```

Bez `volatile` inny wątek może dostać referencję do **nie do końca skonstruowanego** obiektu.

- **`VarHandle`** (Java 9) — niskopoziomowy dostęp do pól z różnymi trybami pamięci; na nim zbudowano współczesne atomiki.
- Głębiej o modelu pamięci — artykuł [JMM i volatile](#/extra/jmm-volatile).

## Zadanie domowe

W wideo nie ma zadań — oto własne.

:::task easy "Licznik atomowy"
Przepisz `Counter` na `AtomicInteger`. Uruchom 8 wątków po 1 000 000 inkrementacji i sprawdź wynik. Porównaj czas z wersją `synchronized`.
:::

:::task medium "Flaga bez volatile"
Napisz wątek z pętlą `while (!stop) { counter++; }` (bez `sleep` i wypisywania w środku!) i zatrzymaj go z `main` po sekundzie, ustawiając `stop = true`. Uruchom z `volatile` i bez. Bez niego program może zawisnąć na zawsze — wyjaśnij dlaczego (podpowiedź: JIT wyciągnął odczyt poza pętlę).
:::

:::task medium "CAS ręcznie"
Zaimplementuj metodę `static int incrementIfLessThan(AtomicInteger a, int limit)` na pętli `compareAndSet`: zwiększa wartość, tylko jeśli jest mniejsza od `limit`, i zwraca nową wartość. Sprawdź 10 wątkami, że wartość nigdy nie przekracza limitu.
:::

:::task hard "AtomicLong kontra LongAdder"
Zrób benchmark (najlepiej w JMH): 1, 4, 16 wątków zwiększa wspólny licznik 10 mln razy. Porównaj `synchronized`, `AtomicLong`, `LongAdder`. Zbuduj tabelę i wyjaśnij, dlaczego wraz ze wzrostem liczby wątków różnica rośnie.
:::
