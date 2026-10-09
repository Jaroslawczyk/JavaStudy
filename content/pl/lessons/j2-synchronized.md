Leczymy wyścig **synchronizacją**: słowo kluczowe `synchronized`, pojęcia **monitor** i **sekcja krytyczna** oraz dlaczego czasem opłaca się mieć kilka monitorów. W zadaniu domowym — bankomat, który bez synchronizacji schodzi na minus.

## Znaczniki czasu wideo

- {{t j2 1:50:42}} — jak naprawić wyścig: synchronizacja metod
- {{t j2 1:51:07}} — `synchronized` w sygnaturze: zawsze 0
- {{t j2 1:51:42}} — czym jest monitor: przykład z kabiną toalety
- {{t j2 1:52:21}} — sekcja krytyczna
- {{t j2 1:52:45}} — własny monitor: `private final Object monitor`
- {{t j2 1:53:14}} — blok `synchronized (monitor) { … }`
- {{t j2 1:55:05}} — monitorem metody `synchronized` jest `this`
- {{t j2 1:55:46}} — po co własne monitory: dwa niezależne liczniki
- {{t j2 1:57:41}} — pomiar: jeden monitor kontra dwa
- {{t j2 2:00:54}} — pytania rekrutacyjne
- {{t j2 2:01:49}} — które z czterech metod mogą działać jednocześnie
- {{t j2 2:02:22}} — zadanie domowe: bankomat
- {{t j2 2:04:17}} — omówienie: wyścig, `join`, `synchronized`, własny monitor

## Metoda synchronized

```java
public class Counter {
    private int value;
    public synchronized void increment() { value++; }
    public synchronized void decrement() { value--; }
    public synchronized int getValue() { return value; }
}
```

Teraz wynik to zawsze 0: dopóki jeden wątek wykonuje `increment`, drugi nie może wejść do **żadnej** metody `synchronized` tego samego obiektu.

## Monitor i sekcja krytyczna

Analogia z wideo: kabina w pociągu z tabliczką „wolne/zajęte”.

- **Sekcja krytyczna** — fragment kodu, w którym jednocześnie może być tylko jeden wątek (kabina).
- **Monitor** (obiekt synchronizacji, lock) — „tabliczka”: przechowuje, czy sekcja jest wolna, czy zajęta i przez który wątek. Monitorem może być **dowolny obiekt** — każdy obiekt w Javie ma wbudowany monitor.

```java
public class Counter {
    private final Object monitor = new Object();
    private int value;

    public void increment() {
        // kod przed blokiem może wykonywać się równolegle
        synchronized (monitor) {          // zająć monitor albo czekać
            value++;                      // sekcja krytyczna
        }                                 // monitor zwolniony (nawet przy wyjątku)
    }
}
```

| Zapis | Monitor |
|---|---|
| `synchronized void m()` | `this` — sam obiekt |
| `static synchronized void m()` | `Counter.class` — obiekt klasy |
| `synchronized (lock) { … }` | wskazany obiekt `lock` |

## Po co kilka monitorów

Jeśli klasa ma dwa **niezależne** liczniki, a wszystkie metody są synchronizowane na `this`, wątek zmieniający pierwszy licznik niepotrzebnie czeka na wątek zmieniający drugi. Rozwiązanie — osobny monitor dla każdej niezależnej grupy danych:

```java
private final Object lock1 = new Object(), lock2 = new Object();
private int value1, value2;

public void increment1() { synchronized (lock1) { value1++; } }
public void increment2() { synchronized (lock2) { value2++; } }
```

W wideo taki wariant okazał się szybszy: 10 sekund zamiast 16 ({{t j2 2:00:46}}).

:::tip "Zasady dla monitorów"
- Monitor rób `private final`: jeśli referencję do monitora się podmieni, wątki zaczną synchronizować się na różnych obiektach (IDEA podświetla to ostrzeżeniem — {{t j2 2:10:28}}).
- Nie synchronizuj na literałach napisowych, `Integer` i innych „wspólnych” obiektach — może ich używać cudzy kod.
- Synchronizacja na `this` jest otwarta dla świata: dowolny zewnętrzny kod może zrobić `synchronized (twójObiekt)` i ci przeszkodzić. Prywatny monitor jest pewniejszy.
:::

## Pytania rekrutacyjne

:::interview "Czym metoda synchronized różni się od zwykłej?"
Jednocześnie może ją wykonywać tylko jeden wątek (na ten sam monitor). {{t j2 2:01:00}}
:::

:::interview "Czym jest monitor i co może nim być?"
Obiektem, na którym synchronizują się wątki: jeśli monitor jest zajęty, wątek czeka na zwolnienie. Monitorem może być dowolny obiekt. Dla metody `synchronized` monitorem jest `this`, dla statycznej — obiekt `Class`. {{t j2 2:01:11}}
:::

:::interview "Które metody mogą działać jednocześnie?"
Metoda 1 bez synchronizacji, metody 2 i 3 na jednym monitorze, metoda 4 — na innym. Jednocześnie mogą działać 1, 2, 4 albo 1, 3, 4: metody 2 i 3 blokują się wzajemnie. {{t j2 2:01:49}}
:::

## Czego nie ma w wideo

- **Wielowejściowość (reentrancy).** Wątek, który już posiada monitor, może ponownie wejść w `synchronized` na tym samym monitorze (np. jedna metoda `synchronized` wywołuje drugą) — sam siebie nie zablokuje.
- **Widoczność.** `synchronized` gwarantuje nie tylko wzajemne wykluczanie, ale też to, że zmiany zrobione wewnątrz bloku zobaczy następny wątek, który zajmie ten sam monitor (happens-before). Dlatego **odczyt** wspólnego pola (`getValue()`) też trzeba synchronizować.
- **`ReentrantLock`** z `java.util.concurrent.locks` — jawna blokada z `tryLock(timeout)`, przerywalnym oczekiwaniem i sprawiedliwą kolejką. Zawsze zwalniana w `finally`:

```java
private final ReentrantLock lock = new ReentrantLock();
public void increment() {
    lock.lock();
    try { value++; } finally { lock.unlock(); }
}
```

- **`ReadWriteLock`** — wielu czytelników jednocześnie, pisarz — jeden.

:::note "Wątki wirtualne a synchronized"
W Javie 21–23 wątek wirtualny zablokowany wewnątrz `synchronized` „przypinał” (pinning) wątek nośny, dlatego zalecano `ReentrantLock`. **Od Javy 24 (JEP 491) ten problem rozwiązano** i `synchronized` z wątkami wirtualnymi znów można stosować bez obaw.
:::

## Zadanie domowe

:::task video "Bankomat — z wideo"
Klasa `Atm` z kwotą pieniędzy i metodą `withdraw(String name, int amount)`: wypisuje „name podszedł do bankomatu”, śpi 2 sekundy, potem wypłaca pieniądze i wypisuje saldo albo informuje, że pieniędzy nie wystarczy. Utwórz kilku klientów-wątków tak, żeby komuś zabrakło — zobaczysz ujemne saldo. Napraw: 1) przez `join`, 2) metodą `synchronized` (monitor `this`), 3) własnym monitorem. {{t j2 2:02:22}}
??? Podpowiedź
Wyścig zachodzi między sprawdzeniem `amount <= this.amount` a odjęciem — synchronizować trzeba cały fragment „sprawdź i wypłać”. Omówienie: {{t j2 2:04:17}}
:::

:::task easy "Synchroniczny licznik"
Napraw klasę `Counter` z poprzedniej lekcji na trzy sposoby (metoda `synchronized`, blok z własnym monitorem, `ReentrantLock`) i upewnij się, że 100 uruchomień z rzędu daje 0.
:::

:::task medium "Dwa liczniki — dwa monitory"
Powtórz pomiar z wideo: 4 wątki, dwa liczniki, 100 mln operacji. Porównaj czas dla jednego wspólnego monitora i dwóch osobnych. Dodaj trzeci wariant — `AtomicInteger` (następna lekcja).
:::

:::task hard "Przelew bankowy"
Klasa `Account` z saldem i metoda `static void transfer(Account from, Account to, int amount)`. Zrób ją bezpieczną wątkowo, synchronizując się na **obu** kontach. Uruchom 1000 losowych przelewów między 10 kontami w 20 wątkach i sprawdź, że suma się nie zmieniła. Jeśli program się zawiesi — spotkałeś deadlock, o nim [lekcja niżej](#/lessons/j2-deadlock).
:::
