Dwa ważne pojęcia: **wątki demony** — wątki działające w tle, które nie przeszkadzają programowi się zakończyć, i **wyścig** (race condition) — główna przyczyna „tajemniczych” błędów w programach wielowątkowych.

## Znaczniki czasu wideo

- {{t j2 1:40:16}} — wątki demony: timer do zadania domowego
- {{t j2 1:42:18}} — program się nie kończy, dopóki działa timer
- {{t j2 1:42:36}} — wątki główne („ważne”) i demony („nieważne”)
- {{t j2 1:43:30}} — `setDaemon(true)`
- {{t j2 1:44:25}} — częsty błąd: demony kończą się nie z `main`, lecz ze wszystkimi wątkami głównymi
- {{t j2 1:45:53}} — klasa `Counter`: `increment()` i `decrement()`
- {{t j2 1:47:51}} — licznik w dwóch wątkach daje losowe liczby
- {{t j2 1:49:08}} — wyścig: jak do niego dochodzi
- {{t j2 1:50:27}} — podsumowanie: demony i race condition

## Wątki demony

JVM kończy program, gdy zakończyły się **wszystkie wątki główne (nie-demony)**. Nieskończony timer w zwykłym wątku „trzyma” program w nieskończoność. Rozwiązanie — zrobić z niego demona:

```java
Thread timer = new Thread(() -> {
    try {
        int seconds = 0;
        while (true) {
            System.out.println(seconds++);
            Thread.sleep(1000);
        }
    } catch (InterruptedException ignored) { }
});
timer.setDaemon(true);      // PRZED start(), inaczej IllegalThreadStateException
timer.start();
```

- Demony **kończą się automatycznie**, gdy zakończą się wszystkie wątki główne — **nie tylko `main`** ({{t j2 1:44:25}}).
- Wątek dziedziczy „demoniczność” po wątku, który go utworzył.
- Typowe demony JVM — wątki garbage collectora i kompilatora JIT.

:::warning "Demon zostaje przerwany w pół zdania"
Przy zamykaniu JVM demony nie dostają ani `interrupt()`, ani szansy na wykonanie `finally`. Nigdy nie powierzaj demonowi zapisu do pliku lub bazy — dane zostaną niedopisane. Demon nadaje się do monitoringu, timerów, czyszczenia cache w tle.
:::

## Wyścig (race condition)

```java
public class Counter {
    private int value;
    public void increment() { value++; }
    public void decrement() { value--; }
    public int getValue() { return value; }
}

Counter counter = new Counter();
Thread t1 = new Thread(() -> { for (int i = 0; i < 1000; i++) counter.increment(); });
Thread t2 = new Thread(() -> { for (int i = 0; i < 1000; i++) counter.decrement(); });
t1.start(); t2.start();
t1.join(); t2.join();
System.out.println(counter.getValue());   // 9, 296, -251… ale nie zawsze 0
```

`value++` to **trzy** operacje: odczytać `value`, dodać 1, zapisać z powrotem. Scenariusz utraconej aktualizacji:

| Krok | Wątek 1 | Wątek 2 | `value` |
|---|---|---|---|
| 1 | czyta 0 | | 0 |
| 2 | | czyta 0 | 0 |
| 3 | zapisuje 0 + 1 | | 1 |
| 4 | | zapisuje 0 − 1 | **−1** |

Jedno zwiększenie „zginęło”. Wynik zależy od tego, jak planista przeplata wątki — dlatego przy każdym uruchomieniu jest inny, a w testach błąd może się nie ujawniać miesiącami.

:::interview "Pytanie rekrutacyjne"
**Czym jest race condition?** — Sytuacją, w której wynik zależy od kolejności wykonania wątków pracujących na wspólnych danych. Typowy przykład — nieatomowa operacja „odczytaj–zmień–zapisz” (`count++`). Leczy się synchronizacją (`synchronized`, `Lock`), atomikami (`AtomicInteger`) lub rezygnacją ze wspólnego zmiennego stanu.
:::

## Czego nie ma w wideo

- **Data race vs race condition.** Data race — jednoczesny dostęp do zmiennej bez synchronizacji, gdy choć jeden wątek pisze (naruszenie modelu pamięci). Race condition — pojęcie szersze: błąd logiki z powodu kolejności operacji (nawet przy metodach bezpiecznych wątkowo: `if (!map.containsKey(k)) map.put(k, v)` — „sprawdź-potem-działaj”).
- **Check-then-act** — drugi klasyczny rodzaj wyścigu. Dla kolekcji używaj metod atomowych: `map.putIfAbsent`, `map.computeIfAbsent`, `map.merge`.
- **Najlepsza synchronizacja to jej brak.** Obiekty niezmienne (`record`, pola `final`), zmienne lokalne i podział danych między wątki usuwają wyścigi już na poziomie projektu.
- **Wątki wirtualne są zawsze demonami** (Java 21+) — `setDaemon(false)` rzuci dla nich wyjątek.

## Zadanie domowe

W wideo nie ma zadania do tej lekcji — utrwalmy własnymi.

:::task easy "Demon czy nie"
Uruchom nieskończony timer dwa razy: zwykłym wątkiem i demonem. W `main` po starcie timera prześpij 3 sekundy i wypisz „main zakończony”. Wyjaśnij różnicę w zachowaniu programu.
:::

:::task medium "Demon przeżywa main"
Odtwórz przykład z wideo ({{t j2 1:44:25}}): `main` uruchamia timer-demona i dwa wątki główne z długą pracą (po 5 sekund), a potem od razu się kończy. Udowodnij, że timer działa, dopóki żyją wątki główne.
:::

:::task medium "Złap wyścig"
Uruchom przykład z licznikiem 100 razy z rzędu i policz, w ilu uruchomieniach wynik nie jest 0. Zwiększ liczbę iteracji do 100 000 — jak zmieniła się częstotliwość błędów?
:::

:::task hard "Check-then-act"
Napisz „leniwy singleton” `if (instance == null) instance = new Service();` i udowodnij w teście z 50 wątkami i `CountDownLatch` (jednoczesny start), że czasem powstaje więcej niż jeden obiekt (licz w konstruktorze `AtomicInteger`). Następnie napraw na trzy sposoby: metoda `synchronized`, klasa holder, `enum`.
:::
