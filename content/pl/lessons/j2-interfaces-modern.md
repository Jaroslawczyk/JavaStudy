Co można trzymać w interfejsach, a czego nie: metody `default`, metody statyczne, stałe, dziedziczenie interfejsów — i główne pytanie rekrutacyjne: **czym klasa abstrakcyjna różni się od interfejsu**. Plus to, co pojawiło się po Javie 8: metody `private` i interfejsy `sealed`.

## Znaczniki czasu wideo

- {{t j2 7:00:17}} — interfejs funkcyjny `Car` z metodą `go()`
- {{t j2 7:01:15}} — dodanie `stop()` psuje wszystkie implementacje i lambdy
- {{t j2 7:02:07}} — metody `default` (Java 8)
- {{t j2 7:02:38}} — „w interfejsach nie można deklarować pól”?
- {{t j2 7:03:10}} — pola interfejsu są `public static final`
- {{t j2 7:04:07}} — metody statyczne w interfejsie
- {{t j2 7:04:45}} — interfejs dziedziczy po interfejsach: `extends`
- {{t j2 7:05:09}} — pytanie: klasa abstrakcyjna vs interfejs

## Metody default

Interfejsu `Car` używają setki klas. Dodać do niego abstrakcyjną metodę `stop()` — to zepsuć **wszystkie** implementacje (i lambdy: interfejs przestał być funkcyjny). Rozwiązanie z Javy 8 — metoda z implementacją domyślną:

```java
@FunctionalInterface
public interface Car {
    void go();

    default void stop() {                       // implementacja domyślna
        System.out.println("Car stopped");
    }
}

Car car = () -> System.out.println("Car goes");  // nadal lambda
car.go();
car.stop();
```

Właśnie tak w Javie 8 do `Collection` dodano `stream()`, `removeIf`, `forEach`, nie psując milionów klas.

### Konflikt metod default

Jeśli klasa implementuje dwa interfejsy z taką samą metodą `default`, kompilator wymaga jej jawnego nadpisania i — w razie potrzeby — wywołania właściwej:

```java
class Amphibian implements Car, Boat {
    @Override public void stop() { Car.super.stop(); }
}
```

Zasady: metoda klasy (lub nadklasy) zawsze wygrywa z `default`; bardziej szczegółowy interfejs wygrywa z rodzicem.

## Pola i metody statyczne

```java
public interface Car {
    int MAX_SPEED = 200;                   // w rzeczywistości public static final

    static void printSpeed() {             // Java 8: wywołuje się Car.printSpeed()
        System.out.println(MAX_SPEED);
    }
}
```

- Każde pole interfejsu jest automatycznie **`public static final`** — to stała, stanu obiektu interfejs nie przechowuje. Nazwy — `UPPER_SNAKE_CASE`.
- Metody statyczne interfejsu **nie są dziedziczone** przez implementacje: tylko `Car.printSpeed()`.
- Interfejs może rozszerzać kilka interfejsów: `interface Car extends Serializable, Comparable<Car>`.

## Klasa abstrakcyjna vs interfejs

| | Klasa abstrakcyjna | Interfejs |
|---|---|---|
| Sens | Wspólna **istota** pokrewnych klas („jest”) | **Kontrakt**, zachowanie („potrafi”) |
| Stan (pola instancji) | ✅ dowolne | ❌ tylko stałe |
| Konstruktory | ✅ | ❌ |
| Metody z implementacją | ✅ dowolne | `default`, `static`, `private` (Java 9) |
| Modyfikatory metod | dowolne | `public` (i `private` od Javy 9) |
| Dziedziczenie | tylko **jedna** klasa (`extends`) | dowolnie wiele (`implements`) |
| Przykład z JDK | `InputStream`, `AbstractList` | `Serializable`, `Comparable`, `Runnable` |

:::interview "Pytanie rekrutacyjne"
**Kiedy wybrać klasę abstrakcyjną, a kiedy interfejs?** — Interfejs — domyślnie: opisuje możliwość, którą mogą mieć niepowiązane klasy, i nie ogranicza dziedziczenia. Klasa abstrakcyjna — gdy rodzina klas ma wspólny **stan** i wspólny kod, a klasy są naprawdę pokrewne (metoda szablonowa). Często się je łączy: interfejs `List` + szkieletowa implementacja `AbstractList`.
:::

## Co pojawiło się później

:::outdated "Interfejsy po Javie 8"
- **Metody `private`** (Java 9) — wspólny kod dla kilku metod `default`, niewidoczny z zewnątrz.
- **Interfejsy `sealed`** (Java 17) — lista dozwolonych implementacji:

```java
public sealed interface Shape permits Circle, Square {}
record Circle(double r) implements Shape {}
record Square(double side) implements Shape {}

double area = switch (shape) {            // pattern matching (Java 21): kompilator sprawdzi kompletność
    case Circle c -> Math.PI * c.r() * c.r();
    case Square s -> s.side() * s.side();
};
```

Wideo mówi, że metody `default` dodano „tylko dla zgodności wstecznej”. To główny powód, ale dziś używa się ich też do wygodnych metod-kombinatorów (`Comparator.reversed()`, `Predicate.and()`), nie nadużywając ich do przechowywania logiki.
:::

## Zadanie domowe

W wideo nie ma zadań — utrwalamy.

:::task easy "Default i static"
Interfejs `Greeter` z abstrakcyjną `String name()`, `default String greet()` („Cześć, name!”) i `static Greeter of(String name)`. Utwórz powitania lambdą i przez `Greeter.of`. Nadpisz `greet()` w jednej z implementacji.
:::

:::task medium "Romb"
Dwa interfejsy `Flyer` i `Swimmer` z taką samą `default void move()`. Klasa `Duck implements Flyer, Swimmer`: rozwiąż konflikt tak, by kaczka najpierw płynęła, a potem leciała (`Flyer.super.move()`). Co będzie, jeśli nie nadpiszesz?
:::

:::task hard "Hierarchia płatności sealed"
Opisz `sealed interface Payment permits Card, Transfer, Cash` z implementacjami-rekordami i metodę `fee(Payment p)` przez `switch` z pattern matching bez `default`. Dodaj nowy typ `Crypto` i upewnij się, że kompilator wskaże wszystkie miejsca, gdzie go nie obsłużono. Porównaj z klasą abstrakcyjną i `instanceof`.
:::
