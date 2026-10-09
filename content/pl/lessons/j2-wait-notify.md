Jak sprawić, by wątek **spał, gdy nie ma pracy**, i budził się, gdy się pojawi? Piszemy własną kolejkę blokującą zadań na `wait()` i `notify()`, a potem znajdujemy jej gotowy odpowiednik — `BlockingQueue`. W zadaniu domowym trzy wątki wypisują `ABCABC…` ściśle po kolei.

## Znaczniki czasu wideo

- {{t j2 2:53:47}} — zadanie: kolejka blokująca zadań `BlockingQueue`
- {{t j2 2:54:39}} — `add` i `take` na bazie `Queue<Runnable>`
- {{t j2 2:55:25}} — nieskończona pętla-obsługa w osobnym wątku
- {{t j2 2:57:34}} — problem: pętla stale „kręci się” i zjada procesor
- {{t j2 2:58:55}} — setki tysięcy pustych iteracji w kilka sekund
- {{t j2 2:59:05}} — wspólny monitor dla `add` i `take`
- {{t j2 2:59:48}} — `while (queue.isEmpty()) monitor.wait()`
- {{t j2 3:00:21}} — `monitor.notify()` przy dodaniu zadania
- {{t j2 3:00:48}} — teraz pętla wykonała się 11 razy, wątek śpi
- {{t j2 3:02:57}} — `wait()` zwalnia monitor
- {{t j2 3:03:15}} — skąd obiekt ma `wait`, `notify`, `notifyAll`
- {{t j2 3:03:30}} — pytanie: `notify` vs `notifyAll`
- {{t j2 3:04:27}} — gotowy interfejs `BlockingQueue` i `LinkedBlockingQueue`
- {{t j2 3:05:24}} — zadanie domowe: `ABC` pięć razy
- {{t j2 3:06:17}} — omówienie rozwiązania
- {{t j2 3:10:37}} — dlaczego `notify()` tu zawiesza program

## Aktywne czekanie — źle

```java
while (true) {
    Runnable task = queue.take();      // zwraca null, jeśli pusto
    if (task != null) new Thread(task).start();
}
```

Pętla kręci się bez przerwy, nawet gdy nie ma zadań: 100 % jednego rdzenia, rozładowana bateria telefonu. Nazywa się to **busy waiting** (aktywne czekanie).

## wait() i notify()

```java
public class MyBlockingQueue {
    private final Object monitor = new Object();
    private final Queue<Runnable> queue = new LinkedList<>();

    public void put(Runnable task) {
        synchronized (monitor) {
            queue.add(task);
            monitor.notify();                 // obudzić czekającego
        }
    }

    public Runnable take() throws InterruptedException {
        synchronized (monitor) {
            while (queue.isEmpty()) {         // właśnie while, nie if!
                monitor.wait();               // zasnąć i ZWOLNIĆ monitor
            }
            return queue.poll();
        }
    }
}
```

- `wait()` — wątek zasypia (stan `WAITING`) i **zwalnia monitor**, więc inny wątek może wejść do `put`.
- `notify()` budzi **jeden** dowolny wątek czekający na tym monitorze; `notifyAll()` — **wszystkie**. Obudzony wątek najpierw ponownie zajmuje monitor, potem kontynuuje od miejsca, w którym zasnął.
- Metody są zadeklarowane w `Object` — bo monitorem może być dowolny obiekt.
- Wywoływać je można **tylko wewnątrz `synchronized` na tym samym obiekcie**, inaczej `IllegalMonitorStateException`.

:::warning "Dlaczego while, a nie if"
1) Zdarzają się **fałszywe przebudzenia** (spurious wakeups) — wątek może się obudzić bez `notify`. 2) Gdy obudzony wątek czekał na monitor, zadanie mógł zabrać inny. Warunek zawsze sprawdza się ponownie w pętli.
:::

## notify czy notifyAll

W zadaniu `ABC` trzy wątki czekają na jednym monitorze, ale każdy potrzebuje swojego warunku („teraz moja litera”). `notify()` może obudzić „niewłaściwy” — ten sprawdzi warunek i znów zaśnie, a właściwy wątek się nie obudzi: program zawiśnie ({{t j2 3:10:37}}). `notifyAll()` budzi wszystkich — każdy sprawdzi warunek i dokładnie jeden pójdzie dalej.

Zasada: `notify()` jest bezpieczny tylko wtedy, gdy wszyscy czekający czekają na **ten sam** warunek i każdy z nich może kontynuować. W przeciwnym razie — `notifyAll()` (albo `Condition` z osobnymi kolejkami oczekiwania).

## Gotowe rozwiązanie: BlockingQueue

```java
BlockingQueue<Runnable> queue = new LinkedBlockingQueue<>();
queue.put(task);                 // czeka, jeśli kolejka pełna (dla ograniczonej)
Runnable next = queue.take();    // czeka, jeśli pusta — nigdy nie zwróci null
```

| Metoda | Pełna/pusta kolejka |
|---|---|
| `put` / `take` | Czeka |
| `offer` / `poll` | Od razu zwraca `false`/`null` |
| `offer(e, t, unit)` / `poll(t, unit)` | Czeka nie dłużej niż limit |

Implementacje: `ArrayBlockingQueue` (ograniczona), `LinkedBlockingQueue`, `PriorityBlockingQueue`, `DelayQueue`, `SynchronousQueue` (bez bufora — przekazanie „z rąk do rąk”). Właśnie na `BlockingQueue` zbudowano pule wątków z poprzedniej lekcji.

:::interview "Pytania rekrutacyjne"
**Co robi `wait()`?** — Przenosi wątek w stan oczekiwania i zwalnia monitor, dopóki nie obudzą go `notify`/`notifyAll` lub `interrupt`.

**Czym różnią się `notify()` i `notifyAll()`?** — `notify` budzi jeden czekający wątek, `notifyAll` — wszystkie; obudzone po kolei zajmują monitor.

**Dlaczego te metody są w `Object`, a nie w `Thread`?** — Czeka się nie na wątek, lecz na monitor, a monitorem może być dowolny obiekt.
:::

## Czego nie ma w wideo

- **`Lock` + `Condition`** — współczesny zamiennik `wait/notify`: kilka warunków na jednej blokadzie (`notFull`, `notEmpty`) i `signal()` do właściwej grupy wątków.
- **Producer–consumer** — klasyczny wzorzec „producent–konsument”; w prawdziwym kodzie prawie zawsze pisze się go na `BlockingQueue`, a nie na gołych `wait/notify`.

## Zadanie domowe

:::task video "ABCABC… — z wideo"
Trzy wątki, każdy wypisuje swoją literę (`A`, `B`, `C`) pięć razy. Ustaw je tak, żeby w konsoli było `ABCABCABCABCABC`. Nie wolno używać `sleep` i `join` — tylko `wait` i `notifyAll`. {{t j2 3:05:24}}
??? Podpowiedź
Wspólny monitor i wspólna zmienna `nextLetter`. Wątek: `while (!nextLetter.equals("A")) monitor.wait();` → wypisanie → `nextLetter = "B"` → `monitor.notifyAll()`. Omówienie: {{t j2 3:06:17}}
:::

:::task easy "Kolejka z limitem"
Rozbuduj `MyBlockingQueue` z lekcji: maksymalny rozmiar `capacity`; `put` czeka, jeśli kolejka jest pełna. Sprawdź: szybki producent i wolny konsument, w kolejce nigdy nie ma więcej niż `capacity` elementów.
:::

:::task medium "Producer–consumer na BlockingQueue"
Dwóch producentów generuje losowe liczby, trzech konsumentów je zabiera i wypisuje kwadrat. Użyj `ArrayBlockingQueue(10)`. Wymyśl poprawne zatrzymanie: np. „zatrutą pigułkę” — specjalny element, po zobaczeniu którego konsument się kończy.
:::

:::task hard "ABC na Condition"
Rozwiąż zadanie z wideo przez `ReentrantLock` i **trzy** `Condition` (po jednym na literę): każdy wątek budzi tylko następnego (`signal()`), a nie wszystkich. Uogólnij na `N` wątków i dowolny napis.
:::
