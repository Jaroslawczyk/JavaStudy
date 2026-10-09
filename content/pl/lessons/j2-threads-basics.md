Zaczyna się najtrudniejszy dział kursu — **wielowątkowość**. W części 1 było tylko zapoznanie; teraz omawiamy procesy i wątki, dwa sposoby tworzenia wątku i odwieczne pytanie rekrutacyjne: czym `start()` różni się od `run()`.

## Znaczniki czasu wideo

- {{t j2 1:03:43}} — wstęp: jeden z najtrudniejszych tematów
- {{t j2 1:04:06}} — po co wielowątkowość
- {{t j2 1:04:52}} — wielozadaniowość oparta na procesach
- {{t j2 1:05:27}} — wielozadaniowość oparta na wątkach
- {{t j2 1:06:08}} — nowy projekt `concurrency`, wypisywanie liczb bez wątków
- {{t j2 1:07:44}} — wątek główny (main thread)
- {{t j2 1:08:07}} — sposób 1: dziedziczymy po `Thread`
- {{t j2 1:08:54}} — `start()`: wątek zaczyna pracę
- {{t j2 1:09:48}} — wątek główny i nowy działają równolegle
- {{t j2 1:10:15}} — sposób 2: implementujemy `Runnable`
- {{t j2 1:11:24}} — `Runnable` jako klasa anonimowa
- {{t j2 1:11:47}} — pytanie: jakie znasz sposoby tworzenia wątków
- {{t j2 1:12:18}} — pytanie: dlaczego wywołujemy `start()`, a nie `run()`

## Procesy i wątki

- **Proces** — uruchomiony program z własną pamięcią (przeglądarka, IDE, odtwarzacz). System wykonuje procesy równolegle — to **wielozadaniowość oparta na procesach**.
- **Wątek (thread)** — „linia wykonania” wewnątrz procesu. Wątki jednego procesu **dzielą wspólną pamięć** (stertę), ale każdy ma własny stos. To **wielozadaniowość oparta na wątkach**: w jednym programie jednocześnie trwa pobieranie, rysuje się pasek postępu i liczy się pozostały czas.

Gdy JVM uruchamia program, tworzony jest **wątek główny**, który wykonuje `main`. Dopóki nie utworzysz innych wątków, wszystko wykonuje się po kolei.

## Sposób 1: dziedziczenie po Thread

```java
public class MyThread extends Thread {
    @Override
    public void run() {                  // co robić w nowym wątku
        for (int i = 0; i < 1000; i++) {
            System.out.print(i + " ");
        }
    }
}

public static void main(String[] args) {
    System.out.println("Start");
    new MyThread().start();              // uruchamiamy NOWY wątek
    for (int i = 0; i < 1000; i++) System.out.print("M");
    System.out.println("\nFinish");
}
```

Wynik jest za każdym razem inny: `Start`, litery `M`, liczby i `Finish` się mieszają. Utworzenie wątku zajmuje czas, więc wątek główny często zdąży wypisać `Finish`, zanim nowy wypisze pierwszą liczbę.

## Sposób 2: implementacja Runnable

```java
public class MyRunnable implements Runnable {
    @Override
    public void run() {
        for (int i = 0; i < 1000; i++) System.out.print(i + " ");
    }
}

new Thread(new MyRunnable()).start();

// albo klasą anonimową / lambdą:
new Thread(() -> System.out.println("Pracuję w " + Thread.currentThread().getName())).start();
```

**`Runnable` jest lepszy:** w Javie nie ma wielokrotnego dziedziczenia klas — dziedzicząc po `Thread`, tracisz możliwość dziedziczenia po czymkolwiek innym. Poza tym `Runnable` oddziela **zadanie** („co robić”) od **mechanizmu wykonania** („kto i jak”): to samo zadanie można oddać puli wątków albo wątkowi wirtualnemu.

## start() i run()

```java
Thread t = new Thread(task);
t.run();     // ❌ zwykłe wywołanie metody w BIEŻĄCYM wątku — żadnej wielowątkowości
t.start();   // ✅ JVM tworzy nowy wątek i w nim wywołuje run()
```

`run()` to tylko metoda, którą sam nadpisałeś: nie ma w niej żadnego kodu tworzenia wątków. Wątek tworzy `start()` — natywna metoda klasy `Thread`. `run()` nigdy nie wywołuje się ręcznie.

:::interview "Pytania rekrutacyjne"
**Jakie znasz sposoby tworzenia wątku?** — Dziedziczyć po `Thread` i nadpisać `run()` albo zaimplementować `Runnable` i przekazać go do konstruktora `Thread`. Lepszy jest `Runnable`. Współczesną odpowiedź warto uzupełnić: `Callable` + `ExecutorService` oraz wątki wirtualne (Java 21).

**Czym różnią się `start()` i `run()`?** — `start()` tworzy nowy wątek i wywołuje w nim `run()` (asynchronicznie). Bezpośrednie wywołanie `run()` wykona kod w bieżącym wątku. Ponowny `start()` tego samego obiektu rzuci `IllegalThreadStateException`.
:::

## Czego nie ma w wideo

### Nazwy i informacje o wątku

```java
Thread t = new Thread(task, "downloader");      // nazwa przyda się w logach
Thread current = Thread.currentThread();
System.out.println(current.getName() + " id=" + current.threadId());
```

:::outdated "getId() → threadId()"
`Thread.getId()` jest przestarzały od Javy 19 — używaj `threadId()`. Od Javy 19 jest też `Thread.sleep(Duration)`.
:::

### Współbieżność a równoległość

- **Równoległość** — zadania dosłownie wykonują się jednocześnie na różnych rdzeniach.
- **Współbieżność** — zadania się przeplatają, tworząc iluzję jednoczesności (nawet na jednym rdzeniu).

Program wielowątkowy na 8 rdzeniach może być jednym i drugim. Liczba rdzeni: `Runtime.getRuntime().availableProcessors()`.

### Wątki wirtualne (Java 21+)

Zwykły (platformowy) wątek Javy = wątek systemu operacyjnego: jest ciężki (stos ~1 MB), tysiące takich wątków to już problem. **Wątki wirtualne** to lekkie wątki zarządzane przez JVM; można ich tworzyć miliony dla zadań, które dużo czekają (sieć, baza danych, pliki):

```java
Thread.ofVirtual().start(() -> System.out.println("Jestem wirtualny"));
Thread.ofPlatform().name("worker").start(task);    // builder także dla zwykłych
```

Szczegóły — w artykule [Virtual Threads](#/extra/virtual-threads).

## Zadanie domowe

W wideo w tej lekcji nie ma zadania (autor mówi, że na razie jest za mało materiału) — utrwalmy własnymi.

:::task easy "Dwa sposoby"
Utwórz wątek wypisujący liczby od 1 do 10 na trzy sposoby: podklasą `Thread`, klasą `implements Runnable`, lambdą. W każdym wypisuj `Thread.currentThread().getName()`.
:::

:::task easy "run kontra start"
Wywołaj w jednym wątku `run()`, a w drugim `start()`; w obu wypisuj nazwę bieżącego wątku. Wyjaśnij różnicę w wyniku. Następnie wywołaj `start()` dwa razy na jednym obiekcie i przeczytaj wyjątek.
:::

:::task medium "Wyścig wypisywania"
Uruchom 5 wątków, każdy wypisuje swoją literę 20 razy bez pauz. Uruchom program 5 razy i porównaj wynik. Odpowiedz: czy można zagwarantować, że wątek uruchomiony jako pierwszy pierwszy też coś wypisze?
:::

:::task hard "10 000 wątków"
Utwórz 10 000 wątków platformowych, każdy śpi 1 sekundę (`Thread.sleep(Duration.ofSeconds(1))`), poczekaj na wszystkie (`join`) i zmierz czas oraz szczytowe zużycie pamięci. Powtórz z `Thread.ofVirtual()`. Porównaj wyniki i wyjaśnij różnicę.
:::
