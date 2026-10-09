**Typ wyliczeniowy** (`enum`) to typ ze stałym zbiorem wartości: dni tygodnia, statusy zamówienia, role użytkowników. W wideo enum nie jest omawiany, a w prawdziwym kodzie pojawia się stale — i to coś znacznie więcej niż „lista stałych”.

## Podstawowa składnia

```java
public enum OrderStatus {
    NEW, PAID, SHIPPED, DELIVERED, CANCELLED
}

OrderStatus s = OrderStatus.PAID;
if (s == OrderStatus.PAID) { … }            // enumy porównuje się przez ==
```

Każda stała to jedyny egzemplarz klasy `OrderStatus` (`public static final`). Nowego egzemplarza nie da się utworzyć przez `new`, więc `==` jest bezpieczne i szybsze od `equals`.

| Metoda | Co robi |
|---|---|
| `values()` | Tablica wszystkich stałych w kolejności deklaracji |
| `valueOf("PAID")` | Stała po nazwie (`IllegalArgumentException`, jeśli nie ma) |
| `name()` | Nazwa stałej jak w kodzie |
| `ordinal()` | Numer porządkowy od zera |
| `compareTo` | Porównanie według `ordinal` |

:::warning "Nie zapisuj ordinal() w bazie"
Jeśli ktoś wstawi nową stałą w środek listy, wszystkie numery się przesuną, a dane w bazie „zmienią znaczenie”. Zapisuj `name()` (w JPA — `@Enumerated(EnumType.STRING)`) albo jawne pole-kod.
:::

## Pola, konstruktory, metody

Enum to pełnoprawna klasa:

```java
public enum Planet {
    MERCURY(3.303e23, 2.4397e6),
    EARTH(5.976e24, 6.37814e6);

    private final double mass, radius;

    Planet(double mass, double radius) {         // konstruktor jest zawsze private
        this.mass = mass;
        this.radius = radius;
    }

    public double surfaceGravity() {
        return 6.67300E-11 * mass / (radius * radius);
    }
}
```

Może implementować interfejs, a nawet dać każdej stałej własne zachowanie:

```java
public enum Operation implements IntBinaryOperator {
    PLUS("+")  { public int applyAsInt(int a, int b) { return a + b; } },
    MINUS("-") { public int applyAsInt(int a, int b) { return a - b; } };

    private final String symbol;
    Operation(String symbol) { this.symbol = symbol; }
}
```

## Enum i switch

```java
String text = switch (status) {                 // wyrażenie switch, Java 14+
    case NEW, PAID -> "W realizacji";
    case SHIPPED -> "W drodze";
    case DELIVERED -> "Dostarczone";
    case CANCELLED -> "Anulowane";
};                                              // bez default: kompilator sprawdzi kompletność
```

Po dodaniu nowej stałej wyrażenie switch bez `default` przestanie się kompilować — kompilator sam wskaże miejsca do aktualizacji.

## EnumSet i EnumMap

Specjalne kolekcje dla kluczy-enumów — bardzo szybkie (w środku maska bitowa / tablica):

```java
EnumSet<DayOfWeek> weekend = EnumSet.of(DayOfWeek.SATURDAY, DayOfWeek.SUNDAY);
EnumSet<DayOfWeek> workdays = EnumSet.complementOf(weekend);

EnumMap<OrderStatus, Long> stats = new EnumMap<>(OrderStatus.class);
stats.merge(OrderStatus.PAID, 1L, Long::sum);
```

## Singleton przez enum

```java
public enum AppConfig {
    INSTANCE;
    private final Properties props = load();
    public String get(String key) { return props.getProperty(key); }
}
```

Joshua Bloch nazywa to najlepszym sposobem implementacji singletona: bezpieczna wątkowo inicjalizacja i ochrona przed refleksją i serializacją „z pudełka”.

:::interview "Pytania rekrutacyjne"
**Czy można dziedziczyć po enumie?** — Nie: enum jest niejawnie `final` i już dziedziczy po `java.lang.Enum`. Ale enum może implementować interfejsy.

**Dlaczego enumy porównuje się przez `==`?** — Każda stała istnieje w jednym egzemplarzu; `==` jest bezpieczne, szybsze i nie wywraca się na `null`.
:::

## Zadanie domowe

:::task easy "Sygnalizator"
Utwórz `enum TrafficLight { RED, YELLOW, GREEN }` z metodą `next()` zwracającą następny kolor w kółko i polem `durationSeconds`. Wypisz cykl 6 przełączeń.
:::

:::task medium "Kalkulator na enumie"
Zaimplementuj `enum Operation` ze stałymi `PLUS, MINUS, MULTIPLY, DIVIDE`, polem `symbol` i abstrakcyjną metodą `apply(double, double)`. Dodaj statyczne `fromSymbol(String)` przez wyszukiwanie w `Map` zbudowanej raz z `values()`. Obsłuż dzielenie przez zero.
:::

:::task hard "Automat stanów zamówienia"
Opisz `OrderStatus` z dozwolonymi przejściami (`NEW → PAID → SHIPPED → DELIVERED`, anulowanie tylko z `NEW` i `PAID`) przez `EnumSet<OrderStatus> allowedNext()`. Klasa `Order` ma rzucać wyjątek przy niedozwolonym przejściu. Pokryj wszystkie przejścia testem parametryzowanym JUnit (`@EnumSource`).
:::
