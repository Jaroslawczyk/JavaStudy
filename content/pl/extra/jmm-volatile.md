**Model pamięci Javy** (Java Memory Model, JMM) określa, kiedy zmiany zrobione przez jeden wątek stają się widoczne dla innych. Wideo tłumaczy `volatile` przez „cache wątku” — to przydatna intuicja, ale na rozmowach Middle+ oczekuje się pojęć **widoczność**, **przestawianie operacji** i **happens-before**.

## Skąd w ogóle biorą się problemy

1. **Cache procesora.** Każdy rdzeń ma własne cache; zapis jednego rdzenia nie jest natychmiast widoczny dla innego.
2. **Przestawianie.** Kompilator, JIT i procesor przestawiają niezależne instrukcje dla szybkości. W jednym wątku wynik się nie zmienia, ale inny wątek może zobaczyć operacje „w innej kolejności”.
3. **Optymalizacje JIT.** Odczyt pola w pętli może zostać wyciągnięty poza pętlę, jeśli JIT jest „pewny”, że pole się nie zmienia.

```java
// bez synchronizacji wątek może się NIGDY nie zakończyć
static boolean ready;
static int value;

// wątek 1                // wątek 2
value = 42;               while (!ready) { }
ready = true;             System.out.println(value);   // może wypisać 0!
```

## Happens-before

JMM gwarantuje: jeśli akcja **A happens-before B**, to wszystkie zapisy sprzed A są widoczne w B. Główne reguły:

| Reguła | A happens-before B |
|---|---|
| Kolejność programu | każda akcja wątku → następna akcja tego samego wątku |
| Monitor | wyjście z `synchronized(m)` → późniejsze wejście w `synchronized(m)` |
| volatile | zapis do pola volatile → późniejszy odczyt tego pola |
| Start wątku | `t.start()` → dowolna akcja w `t` |
| Zakończenie wątku | dowolna akcja w `t` → powrót z `t.join()` |
| Przechodniość | A → B i B → C ⇒ A → C |

`java.util.concurrent` daje też własne gwarancje: `put` do `ConcurrentHashMap` → `get`, `countDown` → powrót z `await`, wysłanie zadania → jego wykonanie, zakończenie zadania → `future.get()`.

## volatile

```java
static volatile boolean ready;
static int value;

value = 42;          // 1
ready = true;        // 2 — zapis volatile: wszystko powyżej zostaje „opublikowane”

while (!ready) { }   // odczyt volatile
System.out.println(value);   // gwarantowane 42
```

`volatile` daje **widoczność** i **zakaz przestawiania** wokół dostępu do pola, ale **nie atomowość** operacji złożonych (`count++`). Szczegóły — w [lekcji o atomikach i volatile](#/lessons/j2-atomic-volatile).

## Pola final i bezpieczna publikacja

Pola `final` mają specjalną gwarancję: jeśli referencja do obiektu nie „uciekła” z konstruktora, każdy wątek, który ją otrzymał, zobaczy poprawnie zainicjalizowane pola `final` — nawet bez synchronizacji. Dlatego **obiekty niezmienne są bezpieczne wątkowo „za darmo”**.

Sposoby bezpiecznej publikacji obiektu: inicjalizacja w polu `static` (przez inicjalizację klasy), zapis do pola `volatile` lub `AtomicReference`, przekazanie przez kolekcję bezpieczną wątkowo, publikacja wewnątrz `synchronized`.

:::warning "Nie wypuszczaj this z konstruktora"
Rejestracja `this` jako słuchacza albo uruchomienie wątku używającego `this` bezpośrednio w konstruktorze może oddać innym wątkom nie do końca utworzony obiekt — gwarancja dla pól `final` wtedy przepada.
:::

## Atomowość long i double

Zapis do zwykłego (nie volatile) pola `long`/`double` według specyfikacji może nie być atomowy (dwie 32-bitowe połówki). Na 64-bitowych JVM praktycznie się to nie zdarza, ale `volatile long` formalnie gwarantuje atomowość odczytu/zapisu.

:::interview "Pytania rekrutacyjne"
**Czym jest happens-before?** — Relacją porządku w modelu pamięci: jeśli A happens-before B, wyniki A są widoczne dla B. Powstaje przez `synchronized`, `volatile`, `start/join`, klasy `java.util.concurrent` i przechodniość.

**Dlaczego obiekty niezmienne są bezpieczne wątkowo?** — Ich stan nie zmienia się po konstruktorze, a semantyka pól `final` gwarantuje, że inne wątki zobaczą je poprawnie zainicjalizowane.
:::

## Zadanie domowe

:::task easy "Złap niewidoczność"
Uruchom przykład z flagą `ready` bez `volatile` z pustym ciałem pętli (`while (!ready) {}`). Czy program się kończy? Dodaj `volatile` i porównaj. Spróbuj też wariantu z `Thread.onSpinWait()` w pętli.
:::

:::task medium "Publikacja przez final"
Napisz niezmienną klasę `Config` (tylko pola `final`, kopie obronne kolekcji) i wariant zmienny. Dla każdego opisz sposób bezpiecznego przekazania obiektu z wątku ładującego do wątków roboczych i uzasadnij go regułami happens-before.
:::

:::task hard "jcstress"
Dodaj OpenJDK **jcstress** i napisz test pokazujący przestawianie (klasyczny przykład `x = 1; r1 = y;` / `y = 1; r2 = x;` z wynikiem `r1 == 0 && r2 == 0`). Powtórz z `volatile` i wyjaśnij różnicę w dopuszczalnych wynikach.
:::
