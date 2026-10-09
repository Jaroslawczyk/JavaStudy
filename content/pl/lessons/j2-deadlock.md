**Deadlock** (zakleszczenie) to sytuacja, w której wątki w nieskończoność czekają na siebie nawzajem. Program się nie wywraca i nie zgłasza błędów — po prostu „zamiera”. Odtwarzamy deadlock na przelewach między dwoma kontami i uczymy się mu zapobiegać. W zadaniu domowym — urządzenie wielofunkcyjne, które potrafi jednocześnie drukować i skanować.

## Znaczniki czasu wideo

- {{t j2 3:12:12}} — czym jest deadlock
- {{t j2 3:12:28}} — klasa `Account` z dwoma kontami i dwoma monitorami
- {{t j2 3:13:34}} — przelew 1→2: monitor 1, potem monitor 2
- {{t j2 3:16:15}} — przelew 2→1: monitor 2, potem monitor 1
- {{t j2 3:17:32}} — dwa wątki przelewają w przeciwnych kierunkach
- {{t j2 3:18:15}} — program zawisł
- {{t j2 3:18:24}} — omówienie: każdy wątek trzyma swój monitor i czeka na cudzy
- {{t j2 3:19:50}} — podsumowanie: deadlock
- {{t j2 3:20:06}} — zadanie z poprzednich tematów: urządzenie wielofunkcyjne
- {{t j2 3:21:18}} — omówienie: dwa monitory

## Jak powstaje deadlock

```java
public class Account {
    private final Object monitor1 = new Object(), monitor2 = new Object();
    private int amount1, amount2;

    public void transfer1to2(int amount) {
        synchronized (monitor1) {
            sleep(2000);
            synchronized (monitor2) {             // czekamy na monitor 2
                amount1 -= amount; amount2 += amount;
            }
        }
    }

    public void transfer2to1(int amount) {
        synchronized (monitor2) {
            sleep(2000);
            synchronized (monitor1) {             // czekamy na monitor 1
                amount2 -= amount; amount1 += amount;
            }
        }
    }
}
```

| Czas | Wątek 1 (`transfer1to2`) | Wątek 2 (`transfer2to1`) |
|---|---|---|
| t1 | zajął monitor 1 | zajął monitor 2 |
| t2 | czeka na monitor 2 ⏳ | czeka na monitor 1 ⏳ |
| ∞ | czeka… | czeka… |

### Cztery warunki Coffmana

Deadlock jest możliwy tylko wtedy, gdy spełnione są wszystkie cztery:
1. **Wzajemne wykluczanie** — zasób może trzymać tylko jeden wątek.
2. **Trzymanie i czekanie** — wątek trzyma jeden zasób i czeka na drugi.
3. **Brak wywłaszczania** — zasobu nie można odebrać.
4. **Cykliczne czekanie** — A czeka na B, B czeka na A.

Złam dowolny — i deadlock jest niemożliwy.

## Jak zapobiegać

**1. Jednolita kolejność zajmowania** (łamie cykliczne czekanie) — najczęstszy sposób:

```java
static void transfer(Account from, Account to, int amount) {
    Account first  = from.id < to.id ? from : to;   // zawsze najpierw mniejsze id
    Account second = from.id < to.id ? to : from;
    synchronized (first) {
        synchronized (second) {
            from.balance -= amount;
            to.balance += amount;
        }
    }
}
```

**2. Próba z limitem czasu** (łamie „trzymanie i czekanie”) — `ReentrantLock.tryLock(timeout)`: nie udało się wziąć drugiej blokady — zwalniamy pierwszą i próbujemy później.

**3. Mniej zagnieżdżonych blokad** — jeden monitor na operację, dane niezmienne, kolejki komunikatów zamiast wspólnych obiektów.

:::tip "Jak znaleźć deadlock w działającym programie"
Zrób zrzut wątków: `jstack <pid>` (albo `jcmd <pid> Thread.print`, albo przycisk „aparatu” w debuggerze IntelliJ). JVM sama pisze na końcu: **„Found one Java-level deadlock”** — i pokazuje, który wątek trzyma który monitor i na co czeka. Widać to też w VisualVM i JDK Mission Control.
:::

## Livelock i starvation

- **Livelock** — wątki nie są zablokowane, ale w nieskończoność ustępują sobie nawzajem (dwie osoby na korytarzu jednocześnie robią krok w tę samą stronę). Leczy się losowym opóźnieniem przed ponowieniem.
- **Starvation (głodzenie)** — wątek nie dostaje zasobu, bo stale zajmują go inne. Leczy się „sprawiedliwymi” blokadami (`new ReentrantLock(true)`) i ograniczonymi kolejkami.

:::interview "Pytanie rekrutacyjne"
**Czym jest deadlock i jak go uniknąć?** — Wzajemnym zakleszczeniem: każdy z wątków trzyma zasób i czeka na zasób zajęty przez inny — czekanie trwa wiecznie. Uniknąć: zajmować blokady zawsze w tej samej kolejności, używać `tryLock` z limitem czasu, zmniejszać zagnieżdżenie blokad. Wykryć — zrzutem wątków (`jstack`).
:::

## Zadanie domowe

:::task video "Urządzenie wielofunkcyjne — z wideo"
Klasa urządzenia z metodami `print(int pages)` i `scan(int pages)`: wypisują „Wydrukowano 1, 2, 3…” / „Zeskanowano…” z niewielkim opóźnieniem. Z różnych wątków można jednocześnie drukować i skanować, ale nie można jednocześnie dwóch wydruków albo dwóch skanów. {{t j2 3:20:06}}
??? Podpowiedź
Dwa różne monitory: `printMonitor` i `scanMonitor`. Omówienie: {{t j2 3:21:18}}
:::

:::task easy "Odtwórz deadlock"
Powtórz przykład z wideo, potem zrób zrzut wątków (`jstack` lub przyciskiem w IDEA) i znajdź w nim wiersz o deadlocku. Jakie monitory są wskazane?
:::

:::task medium "Napraw konto"
Napraw klasę `Account` na dwa sposoby: jednolitą kolejnością zajmowania monitorów oraz `ReentrantLock.tryLock(100, MILLISECONDS)` z ponawianiem. Uruchom 10 000 przeciwnych przelewów w 8 wątkach — program nie może zawisnąć, a łączna suma musi się zachować.
:::

:::task hard "Ucztujący filozofowie"
Klasyczne zadanie: 5 filozofów przy okrągłym stole, między sąsiadami po jednym widelcu; żeby jeść, potrzebne są oba. Zaimplementuj „naiwne” rozwiązanie (każdy bierze lewy, potem prawy) i doprowadź do deadlocku. Następnie napraw: uporządkowanie widelców według numeru oraz wariant z `Semaphore(4)` („kelner” wpuszcza do stołu nie więcej niż 4). Porównaj, ile razy kto zjadł w ciągu 10 sekund.
:::
