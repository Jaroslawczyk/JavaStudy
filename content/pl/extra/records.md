**Rekordy** (`record`, Java 16) to zwięzły sposób deklarowania niezmiennej klasy-nośnika danych. Jedna linia zastępuje konstruktor, gettery, `equals`, `hashCode` i `toString`. W wideo ich nie ma (kurs nagrano przed Javą 16), ale dziś rekordy to standard dla DTO, odpowiedzi API, kluczy map i wartości w strumieniach.

## Było i jest

```java
// Przed Javą 16: ~40 linii
public final class Point {
    private final int x, y;
    public Point(int x, int y) { this.x = x; this.y = y; }
    public int getX() { return x; }
    public int getY() { return y; }
    @Override public boolean equals(Object o) { … }
    @Override public int hashCode() { … }
    @Override public String toString() { … }
}

// Java 16+
public record Point(int x, int y) {}

Point p = new Point(1, 2);
p.x();                         // akcesor bez przedrostka get
System.out.println(p);         // Point[x=1, y=2]
new Point(1, 2).equals(p);     // true — porównanie po komponentach
```

## Co generuje kompilator

- pole `private final` dla każdego komponentu;
- **konstruktor kanoniczny** ze wszystkimi komponentami;
- akcesory `x()`, `y()`;
- `equals`, `hashCode`, `toString` po wszystkich komponentach.

Klasa rekordu jest niejawnie `final` i dziedziczy po `java.lang.Record` — po innych klasach dziedziczyć nie może, ale **interfejsy implementować może**.

## Konstruktor kompaktowy: walidacja

```java
public record Money(BigDecimal amount, String currency) {
    public Money {                                   // kompaktowy: bez parametrów i przypisań
        Objects.requireNonNull(currency);
        if (amount.signum() < 0) throw new IllegalArgumentException("amount < 0");
        amount = amount.setScale(2, RoundingMode.HALF_UP);  // można normalizować
    }

    public Money plus(Money other) {                 // własne metody — proszę bardzo
        return new Money(amount.add(other.amount), currency);
    }

    public static Money zero(String currency) {      // statyczne fabryki też
        return new Money(BigDecimal.ZERO, currency);
    }
}
```

:::warning "Niezmienność jest płytka"
`record Team(List<String> members)` — pole jest finalne, ale samą listę można zmienić z zewnątrz. Rób kopię obronną w konstruktorze kompaktowym: `members = List.copyOf(members);`.
:::

## Rekordy i pattern matching (Java 21)

```java
sealed interface Shape permits Circle, Rect {}
record Circle(double r) implements Shape {}
record Rect(double w, double h) implements Shape {}

double area(Shape s) {
    return switch (s) {
        case Circle(double r) -> Math.PI * r * r;           // wzorzec rekordu — dekonstrukcja
        case Rect(double w, double h) -> w * h;
    };
}

if (obj instanceof Point(int x, int y) && x == y) { … }
```

## Gdzie używać, a gdzie nie

| ✅ Dobrze | ❌ Nie pasuje |
|---|---|
| DTO i odpowiedzi REST API (Jackson je obsługuje) | Encje JPA (`@Entity` wymaga zmienności i konstruktora bezparametrowego) |
| Klucze `Map`, elementy `Set` | Klasy ze zmiennym stanem |
| Zwracanie kilku wartości z metody | Hierarchie dziedziczenia |
| Dane pośrednie w strumieniach | Klasy z leniwymi/wyliczanymi polami-cache |
| Konfiguracja (`@ConfigurationProperties` w Spring Boot) | |

:::note "Rekordy a Lombok"
Wcześniej to samo robiono adnotacjami Lomboka `@Value`/`@Data`. Dla danych niezmiennych rekordy je wypierają: to część języka, nie trzeba wtyczki. Lombok nadal jest używany do `@Builder` i klas zmiennych.
:::

:::interview "Pytania rekrutacyjne"
**Czym rekord różni się od zwykłej klasy?** — Niezmienne komponenty, wygenerowane konstruktor/akcesory/`equals`/`hashCode`/`toString`, klasa `final`, nie można po niej dziedziczyć ani deklarować pól instancji poza komponentami.

**Czy rekord może być encją JPA?** — Nie (potrzebna zmienność i konstruktor bezparametrowy), ale można go używać jako DTO, projekcji Spring Data lub `@Embeddable` w Hibernate 6.2+.
:::

## Zadanie domowe

:::task easy "Przepisz na rekord"
Weź klasę `Car` z części 1 kursu (pola, konstruktor, gettery, `equals`/`hashCode`) i przepisz ją jako rekord. Upewnij się, że `HashSet<Car>` działa tak samo.
:::

:::task medium "Rekord z walidacją"
Utwórz `record Email(String value)` z konstruktorem kompaktowym: obcina spacje, zamienia na małe litery i sprawdza format wyrażeniem regularnym. Napisz testy na poprawne i niepoprawne adresy.
:::

:::task hard "Kalkulator wyrażeń na rekordach"
Opisz drzewo wyrażeń `sealed interface Expr permits Num, Add, Mul, Neg` z implementacjami-rekordami i metodą `static int eval(Expr e)` przez `switch` z wzorcami rekordów (zagnieżdżonymi, np. `case Mul(Num(var a), Num(var b))`). Dodaj `toString` w notacji infiksowej i uproszczenie `x * 1 → x`.
:::
