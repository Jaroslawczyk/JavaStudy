Do tej pory cały kod wykonywał się **w jednym wątku** — linijka po linijce. **Wielowątkowość** pozwala wykonywać kilka zadań jednocześnie: zegar tyka, a program robi coś innego. Pierwsze spotkanie z `Thread`, `Runnable` i `Thread.sleep` — i podsumowanie pierwszego poziomu kursu.

## Znaczniki czasu wideo

- {{t j1 5:32:36}} — czym jest wielowątkowość
- {{t j1 5:33:09}} — klasa `Thread` i interfejs `Runnable`
- {{t j1 5:33:44}} — tworzymy wątek `timer`
- {{t j1 5:34:30}} — klasa `RunnableTimer implements Runnable`
- {{t j1 5:35:40}} — uruchomienie wątku: `start()`
- {{t j1 5:35:54}} — wątek główny i poboczny działają jednocześnie
- {{t j1 5:36:36}} — `Runnable` przez klasę anonimową
- {{t j1 5:37:02}} — zegar: przerwa między wypisaniami
- {{t j1 5:37:42}} — `Thread.sleep(1000)`
- {{t j1 5:37:51}} — obowiązkowa obsługa `InterruptedException`
- {{t j1 5:38:39}} — dlaczego w `try` owija się całą pętlę
- {{t j1 5:39:24}} — dwa zegary jednocześnie
- {{t j1 5:40:02}} — pętla nieskończona `while (true)`
- {{t j1 5:41:13}} — wspólna zmienna dla dwóch wątków
- {{t j1 5:42:28}} — pole statyczne zamiast zmiennej lokalnej
- {{t j1 5:42:56}} — zadanie domowe: wątek zgaduje liczbę
- {{t j1 5:43:40}} — omówienie rozwiązania
- {{t j1 5:44:56}} — owiń kod w try-catch: <kbd>Ctrl+Alt+T</kbd>
- {{t j1 5:47:45}} — koniec poziomu 1: dokąd dalej

## Wątek i zadanie

- **`Runnable`** — interfejs z jedną metodą `run()`: **co** trzeba zrobić.
- **`Thread`** — wątek wykonania: **kto** to zrobi.

```java
Thread timer = new Thread(new Runnable() {
    @Override
    public void run() {
        try {
            int i = 0;
            while (true) {
                System.out.println(i++);
                Thread.sleep(1000);          // uśpij na 1 sekundę
            }
        } catch (InterruptedException e) {
            System.out.println("Zegar zatrzymany");
        }
    }
});
timer.start();                               // uruchom w osobnym wątku

for (int i = 0; i < 5; i++) {
    System.out.println("Wątek główny pracuje");
}
```

- `start()` tworzy **nowy wątek** i wywołuje w nim `run()`. Bezpośrednie wywołanie `run()` po prostu wykona kod w bieżącym wątku — częsty błąd początkujących.
- Kod w `main` działa w **wątku głównym**, pozostałe są poboczne. Wyniki wątków przeplatają się w nieprzewidywalny sposób.
- `Thread.sleep(ms)` rzuca **kontrolowany** wyjątek `InterruptedException` — trzeba go obsłużyć.

:::tip "Dlaczego try obejmuje całą pętlę"
Jeśli w `try-catch` owiniesz tylko `Thread.sleep`, to po przerwaniu wątek złapie wyjątek i… będzie kręcić pętlę dalej. Przerwanie (`interrupt()`) to prośba o zatrzymanie, więc poprawnie jest wyjść z pętli: owinąć całą pętlę (jak w wideo) albo sprawdzać `Thread.currentThread().isInterrupted()`.
:::

## Wspólna zmienna dwóch wątków

```java
public class Main {
    private static volatile boolean isFive = false;   // w wideo bez volatile — patrz niżej

    public static void main(String[] args) {
        Thread timer = new Thread(() -> {
            for (int i = 0; ; i++) {
                System.out.println(i);
                if (i == 5) isFive = true;
                sleepSecond();
            }
        });
        Thread timer2 = new Thread(() -> {
            while (!isFive) {
                System.out.println("drugi zegar");
                sleepSecond();
            }
        });
        timer.start();
        timer2.start();
    }

    private static void sleepSecond() {
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
```

Zmiennej lokalnej metody nie można zmieniać z klasy anonimowej/lambdy (tylko effectively final), dlatego flaga jest polem klasy — i to `static`, bo używa się jej ze statycznego `main`.

:::warning "Wideo nie mówi o volatile"
Bez słowa kluczowego **`volatile`** nie ma gwarancji, że zmiana `isFive` w jednym wątku **będzie widoczna** w innym: wątek może zbuforować wartość i pętla `while (!isFive)` nigdy się nie skończy. Na małych przykładach to „przypadkiem działa”, a na produkcji prowadzi do zawieszeń. Zasada: flaga zapisywana przez jeden wątek i czytana przez inny musi być `volatile` (lub `AtomicBoolean`). Szczegóły w dziale o wielowątkowości w części 2 i w artykule [JMM i volatile](#/extra/jmm-volatile).
:::

## Czego nie ma w wideo

### Lambda zamiast klasy anonimowej

`Runnable` to interfejs funkcyjny, więc:

```java
Thread t = new Thread(() -> System.out.println("Pracuję w " + Thread.currentThread().getName()));
t.start();
t.join();     // poczekaj na zakończenie wątku
```

### Współczesna współbieżność

| Podejście | Kiedy |
|---|---|
| `new Thread(...)` | Przykłady szkoleniowe, rzadko w prawdziwym kodzie |
| `ExecutorService` / pule wątków | Standard dla zadań serwerowych (część 2 kursu) |
| **Wątki wirtualne** (Java 21+) | Tysiące i miliony lekkich wątków do zadań I/O: `Thread.ofVirtual().start(task)` lub `Executors.newVirtualThreadPerTaskExecutor()` |
| `CompletableFuture` | Asynchroniczne łańcuchy zadań |

Artykuł [Virtual Threads](#/extra/virtual-threads) — o największej zmianie Javy 21.

### Co czeka cię w drugiej części

Wyścigi danych, `synchronized`, `wait/notify`, deadlock, `ExecutorService`, kolekcje bezpieczne wątkowo — wszystko to szczegółowo w [części 2](#/lessons/j2-generics) kursu.

## Podsumowanie pierwszego poziomu

Na {{t j1 5:47:45}} autor gratuluje ukończenia podstaw i proponuje dwie drogi: Android (Kotlin/Java) albo pogłębiona Java do weba i serwerów. Na tej stronie dalej jest „Java poziom 2” — testy, budowa kolekcji i przygotowanie do rozmowy rekrutacyjnej, a potem druga część kursu. Dokąd iść po całym kursie — strona [Kariera](#/page/career) i [Roadmapa](#/roadmap).

## Zadanie domowe

:::task video "Zgadnij liczbę w wątku — z wideo"
W wątku głównym wylosuj liczbę od 0 do 1 000 000. Utwórz dwa wątki: pierwszy — zegar, co sekundę wypisuje, ile sekund minęło; drugi próbuje **zgadnąć** liczbę, generując liczby losowe. Gdy liczba zostanie zgadnięta, zegar się zatrzymuje, a wylosowana liczba pojawia się na ekranie. Użyj wspólnej zmiennej `boolean`. {{t j1 5:42:56}}
??? Podpowiedź
Flaga `private static volatile boolean win;`. Zegar: `while (!win) { … Thread.sleep(1000); }`. Gracz: w pętli `while (!win)` generuje liczbę i przy trafieniu ustawia `win = true`. Jeśli zgaduje „w 0 sekund”, zwiększ zakres, jak w omówieniu: {{t j1 5:43:40}}
:::

:::task easy "Trzy wątki-liczniki"
Uruchom trzy wątki, z których każdy 5 razy wypisuje swoją nazwę (`Thread.currentThread().getName()`) z losową przerwą 300–700 ms. Zobacz, jak przeplata się wynik przy różnych uruchomieniach. Poczekaj na wszystkie wątki przez `join()` i wypisz „Gotowe”.
:::

:::task medium "Przerwanie zegara"
Uruchom nieskończony zegar w osobnym wątku i zatrzymaj go z wątku głównego po 5 sekundach wywołaniem `timer.interrupt()`. Zegar musi poprawnie wyjść z pętli i wypisać „Zegar zatrzymany”.
:::

:::task hard "Wyścig o licznik"
Utwórz statyczne pole `int counter`. Uruchom 4 wątki, każdy 100 000 razy wykonuje `counter++`. Po `join()` wypisz wynik — dlaczego jest mniejszy niż 400 000? Napraw na trzy sposoby: metoda `synchronized`, `AtomicInteger`, podział pracy bez wspólnego stanu (każdy wątek liczy swoje, potem suma). Porównaj czasy.
??? Podpowiedź
`counter++` to trzy operacje (odczyt, dodanie, zapis). Dwa wątki mogą odczytać tę samą wartość i jedno zwiększenie „zginie”. To nazywa się **wyścigiem** (race condition).
:::
