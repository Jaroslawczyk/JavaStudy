**Polimorfizm** — to samo wywołanie zachowuje się różnie w zależności od rzeczywistego obiektu. **Interfejsy** opisują, co obiekt *potrafi* i pozwalają obejść zakaz wielokrotnego dziedziczenia. Omawiamy upcast, downcast i `implements`.

## Znaczniki czasu wideo

- {{t j1 4:44:50}} — temat lekcji: interfejsy
- {{t j1 4:45:21}} — klasa abstrakcyjna `Animal` z metodą `eat()`
- {{t j1 4:45:51}} — pies, kot, ryba, ptak
- {{t j1 4:47:54}} — zadanie: nakarmić wszystkie zwierzęta w pętli
- {{t j1 4:48:36}} — `List<Animal>` — wspólny typ dla wszystkich
- {{t j1 4:49:38}} — polimorfizm: jeden interfejs — wiele implementacji
- {{t j1 4:49:53}} — upcast: rzutowanie na typ rodzica
- {{t j1 4:50:59}} — po upcaście dostępne są tylko metody rodzica
- {{t j1 4:51:59}} — downcast: jawne rzutowanie na typ potomny
- {{t j1 4:53:11}} — `ClassCastException` przy błędnym downcaście
- {{t j1 4:54:09}} — zadanie: niech biegają tylko ci, którzy potrafią
- {{t j1 4:55:03}} — w Javie nie ma wielokrotnego dziedziczenia klas
- {{t j1 4:55:18}} — interfejs `CanRun`
- {{t j1 4:56:15}} — `implements` i implementacja przez <kbd>Ctrl+I</kbd>
- {{t j1 4:57:04}} — `List<CanRun>`: ryba tam nie trafi
- {{t j1 4:59:20}} — upcast do interfejsu
- {{t j1 5:00:19}} — drugi interfejs `Flyable`: implementujemy kilka
- {{t j1 5:01:42}} — zadanie domowe

## Polimorfizm

```java
public abstract class Animal {
    public abstract void eat();
}

public class Dog extends Animal {
    @Override public void eat() { System.out.println("Kość"); }
    public void run() { System.out.println("Pies biegnie"); }
}
public class Cat extends Animal {
    @Override public void eat() { System.out.println("Karma dla kotów"); }
}
```

```java
List<Animal> animals = new ArrayList<>();
animals.add(new Dog());
animals.add(new Cat());
animals.add(new Fish());
animals.add(new Bird());

for (Animal animal : animals) {
    animal.eat();     // Kość, Karma dla kotów, Pokarm dla ryb, Ziarno dla ptaków
}
```

To samo wywołanie `animal.eat()` — różne zachowanie. JVM w czasie działania patrzy na **rzeczywistą klasę obiektu** i wywołuje jej implementację (wiązanie dynamiczne).

## Upcast i downcast

```java
Animal animal = new Dog();     // upcast — automatycznie, zawsze bezpiecznie
animal.eat();                  // OK — metoda jest w Animal
// animal.run();               // błąd kompilacji: w Animal nie ma run()

Dog dog = (Dog) animal;        // downcast — tylko jawnie
dog.run();                     // teraz dostępne
```

- **Upcast** (do rodzica): obiekt „wygląda” jak rodzic, widoczne są tylko metody rodzica. Sam obiekt się nie zmienia — to nadal pies.
- **Downcast** (do potomka): potrzebne jest jawne rzutowanie `(Dog)` i **ty odpowiadasz** za jego poprawność.

:::warning "ClassCastException"
```java
Animal animal = new Cat();
Dog dog = (Dog) animal;        // kompiluje się, ale przy uruchomieniu — ClassCastException
```
Kompilator nie sprawdzi downcastu — błąd wyjdzie dopiero w czasie działania.
:::

## Interfejsy

Zadanie: niech biegają psy, koty i ptaki, ale nie ryby. Dodanie `run()` do `Animal` sprawi, że ryby „pobiegną”. Klasa `RunningAnimal` — a jeśli ptak potrafi i biegać, i latać? Dziedziczyć po dwóch klasach w Javie **nie wolno**. Rozwiązanie — **interfejs**:

```java
public interface CanRun {
    void run();          // domyślnie public abstract
}

public interface Flyable {
    void fly();
}

public class Dog extends Animal implements CanRun { … }
public class Bird extends Animal implements CanRun, Flyable {   // dowolnie wiele interfejsów
    @Override public void eat() { System.out.println("Ziarno dla ptaków"); }
    @Override public void run() { System.out.println("Ptak biegnie"); }
    @Override public void fly() { System.out.println("Ptak leci"); }
}
```

```java
List<CanRun> runners = new ArrayList<>();
runners.add(new Dog());
runners.add(new Cat());
runners.add(new Bird());
// runners.add(new Fish());   // błąd: Fish nie implementuje CanRun

for (CanRun runner : runners) {
    runner.run();
}
```

Interfejs to **kontrakt**: „kto mnie implementuje, musi potrafić to i to”. Klasa może dziedziczyć po jednej klasie, ale implementować **dowolnie wiele** interfejsów. Nazwy często kończą się na `-able`: `Comparable`, `Runnable`, `Serializable`, `Flyable`.

## Czego nie ma w wideo

### instanceof i pattern matching

Przed downcastem bezpiecznie jest sprawdzić typ:

```java
if (animal instanceof Dog) {          // klasyczny wariant
    Dog dog = (Dog) animal;
    dog.run();
}

if (animal instanceof Dog dog) {      // Java 16+: sprawdzenie i rzutowanie w jednym kroku
    dog.run();
}
```

A jeszcze lepiej — projektować tak, by downcast nie był potrzebny (polimorfizm zamiast sprawdzania typów).

### Interfejsy we współczesnej Javie

Od Javy 8 interfejs może zawierać nie tylko metody abstrakcyjne:

```java
public interface CanRun {
    void run();

    default void runTwice() {        // metoda default: implementacja domyślna (Java 8)
        run();
        run();
    }

    static CanRun nobody() {         // metoda statyczna (Java 8)
        return () -> System.out.println("…");
    }

    int MAX_SPEED = 120;             // stała: public static final
}
```

Od Javy 9 interfejsy mogą mieć też metody `private` (na wspólny kod metod default).

### Klasa abstrakcyjna czy interfejs? (pytanie rekrutacyjne)

| | Klasa abstrakcyjna | Interfejs |
|---|---|---|
| Dziedziczenie | Tylko jedna | Dowolnie wiele |
| Pola | Dowolne (stan obiektu) | Tylko stałe `public static final` |
| Konstruktor | Jest | Brak |
| Metody | Dowolne, z dowolnym dostępem | Abstrakcyjne, `default`, `static`, `private` |
| Sens | „Jest” (wspólna baza, wspólny kod) | „Potrafi” (zdolność, kontrakt) |

Zasada: opisujesz **zdolność** lub **kontrakt** — interfejs; wspólny **kod i stan** dla pokrewnych klas — klasa abstrakcyjna. Często łączy się oba: interfejs + abstrakcyjna implementacja bazowa.

### Interfejsy, które spotkasz bez przerwy

`Comparable<T>` (porównywanie), `Comparator<T>`, `Runnable` (zadanie dla wątku), `Iterable<T>` (for-each), `List`/`Map`/`Set` (kolekcje to też interfejsy!), `AutoCloseable` (try-with-resources). Interfejs z jedną metodą abstrakcyjną jest **funkcyjny** i można go zaimplementować lambdą — to kolejny krok po klasach anonimowych (część 2).

## Zadanie domowe

:::task video "Pracownicy — z wideo"
Klasa `Worker` z polem `name`, konstruktorem, getterem i metodą `voice()`, która wypisuje imię. Podklasy `Programmer`, `Driver`, `Cook` (konstruktor przyjmuje tylko imię). Interfejsy `Codeable` (`writeCode()`), `Cookable` (`cook()`), `Driveable` (`drive()`); każdy pracownik implementuje swój. W `main` utwórz po trzech pracowników każdego zawodu, zrób apel (`voice()` u wszystkich), a potem każ wszystkim pracować — potrzebne będą jeszcze trzy pętle. {{t j1 5:01:42}}
??? Podpowiedź
Do apelu pasuje `List<Worker>`, do pracy — `List<Codeable>`, `List<Cookable>`, `List<Driveable>`. Ten sam obiekt może leżeć w dwóch listach różnych typów.
:::

:::task easy "instanceof"
W liście `List<Animal>` każ biegać tym, którzy potrafią, używając `instanceof CanRun runner` (pattern matching), a pozostałym wypisz „nie potrafi biegać”.
:::

:::task medium "Metody płatności"
Interfejs `PaymentMethod` z metodami `boolean pay(double amount)` i `default String receipt(double amount)`. Implementacje: `Card` (limit), `Cash` (reszta), `Blik` (kod z 6 cyfr). Proces płatności za koszyk działa tylko z interfejsem i nic nie wie o konkretnych klasach.
:::

:::task hard "Własne Comparable"
Spraw, by klasa `Box` implementowała `Comparable<Box>` (porównanie po objętości). Posortuj `List<Box>` wywołaniem `Collections.sort(boxes)`. Następnie posortuj tę samą listę **po długości** za pomocą osobnej klasy implementującej `Comparator<Box>`. Wyjaśnij, kiedy czego używać.
??? Podpowiedź
`public int compareTo(Box other) { return Double.compare(volume(), other.volume()); }` — pamiętasz metodę `compare` z lekcji o obiektach jako parametrach? Ta sama idea, tylko według standardu JDK.
:::
