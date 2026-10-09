**Konstruktor** to specjalna metoda wywoływana przy tworzeniu obiektu przez `new`. Pozwala od razu ustawić początkowe wartości pól i nie zapomnieć o żadnym z nich.

## Znaczniki czasu wideo

- {{t j1 2:18:13}} — po co są konstruktory
- {{t j1 2:18:34}} — składnia konstruktora
- {{t j1 2:18:49}} — konstruktor bezparametrowy: domyślne wymiary 10
- {{t j1 2:19:43}} — `new Box()` to wywołanie konstruktora
- {{t j1 2:19:52}} — konstruktor domyślny tworzony przez Javę
- {{t j1 2:21:12}} — konstruktor z parametrami
- {{t j1 2:21:58}} — `this` w konstruktorze
- {{t j1 2:22:29}} — dlaczego „zniknął” konstruktor bezparametrowy
- {{t j1 2:22:53}} — kolejność argumentów: <kbd>Ctrl+P</kbd>
- {{t j1 2:23:10}} — generowanie konstruktora: <kbd>Alt+Insert</kbd>
- {{t j1 2:23:49}} — zadanie domowe

## Składnia

```java
public class Box {
    double width;
    double height;
    double length;

    Box(double width, double height, double length) {   // nazwa = nazwa klasy, brak typu zwracanego
        this.width = width;
        this.height = height;
        this.length = length;
    }

    double volume() {
        return width * height * length;
    }
}
```

```java
Box box = new Box(10, 15, 20);   // konstruktor wywołuje się automatycznie
System.out.println(box.volume()); // 3000.0
```

Czym konstruktor różni się od metody:

- nazwa **dokładnie pokrywa się** z nazwą klasy;
- **brak typu zwracanego** — nawet `void` (jeśli napiszesz `void Box()`, będzie to zwykła metoda, a nie konstruktor!);
- wywołuje się go tylko przez `new` (albo z innego konstruktora przez `this(...)`/`super(...)`).

## Konstruktor domyślny

Jeśli **nie napiszesz żadnego** konstruktora, kompilator doda pusty konstruktor bezparametrowy — dlatego `new Box()` działało wcześniej. Pola dostają wtedy wartości domyślne (`0`, `false`, `null`).

:::warning "Konstruktor domyślny znika"
Gdy tylko zadeklarujesz **jakikolwiek** własny konstruktor (np. z parametrami), Java konstruktora domyślnego **nie tworzy**. `new Box()` przestanie się kompilować — trzeba przekazać argumenty albo samemu zadeklarować konstruktor bezparametrowy.
:::

## Generowanie w IntelliJ IDEA

<kbd>Alt+Insert</kbd> (macOS: <kbd>⌘N</kbd>) → **Constructor** → zaznacz pola (z <kbd>Ctrl</kbd> lub <kbd>Shift</kbd>) → OK. Tak samo generuje się gettery/settery, `equals()`, `hashCode()`, `toString()`.

## Czego nie ma w wideo

### Wywołanie jednego konstruktora z innego: this(...)

Aby nie powielać kodu w kilku konstruktorach (ich przeciążanie omówimy w następnej lekcji), jeden konstruktor wywołuje drugi:

```java
Box(double size) {
    this(size, size, size);   // musi być pierwszą instrukcją*
}
```

\* Przed Javą 25 wywołanie `this(...)`/`super(...)` musiało być **pierwszą** linią. Od Javy 25 (JEP 513, „elastyczne ciała konstruktorów”) przed nim można sprawdzać argumenty, a nawet przypisywać pola, ale nadal nie można odczytywać pól ani wywoływać metod tworzonego obiektu.

### Sprawdzanie argumentów

Konstruktor to najlepsze miejsce, by nie dopuścić do utworzenia „błędnego” obiektu:

```java
Box(double width, double height, double length) {
    if (width <= 0 || height <= 0 || length <= 0) {
        throw new IllegalArgumentException("Wymiary muszą być dodatnie");
    }
    this.width = width;
    this.height = height;
    this.length = length;
}
```

Wyjątki są szczegółowo omówione w lekcji o wyjątkach.

### Obiekty niezmienne

Jeśli pola są oznaczone `final`, trzeba je przypisać dokładnie raz — w konstruktorze. Takiego obiektu nie da się zmienić po utworzeniu (immutable), co czyni kod bezpieczniejszym, zwłaszcza przy wielowątkowości:

```java
public class Point {
    private final double x;
    private final double y;

    public Point(double x, double y) {
        this.x = x;
        this.y = y;
    }
}
```

### Kolejność inicjalizacji obiektu

1. Pamięć na obiekt, pola = wartości domyślne.
2. Inicjalizatory pól (`double width = 10;`) i bloki inicjalizacyjne `{ … }` — w kolejności zapisu.
3. Ciało konstruktora.

Więcej w artykule [Bloki inicjalizacyjne](#/extra/initializer-blocks).

### Konstruktory w prawdziwych projektach

- **Lombok**: adnotacje `@NoArgsConstructor`, `@AllArgsConstructor`, `@RequiredArgsConstructor` generują konstruktory podczas kompilacji.
- **record** (Java 16+) dostaje konstruktor ze wszystkimi polami automatycznie.
- W Springu zależności wstrzykuje się **przez konstruktor** (constructor injection) — to zalecany sposób.

## Zadanie domowe

:::task video "Pracownik — z wideo"
Utwórz klasę `Employee` z polami imię, stanowisko i pensja oraz konstruktorem inicjalizującym wszystkie pola. Dodaj metodę z parametrem `int months`, która zwraca napis: „Pracownik Iwan, stanowisko programista, w ostatnich 12 miesiącach otrzymał 600000 zł” (kwota = pensja × months). W `main` utwórz pracownika (Iwan, programista, 50 000), wywołaj metodę z argumentem 12 i wypisz wynik. {{t j1 2:23:49}}
:::

:::task easy "Student"
Klasa `Student` z polami `name`, `group`, `averageGrade` i konstruktorem ze wszystkimi polami. Utwórz trzech studentów i wypisz ich dane. Wygeneruj konstruktor przez <kbd>Alt+Insert</kbd>.
:::

:::task medium "Ochrona przed błędnymi danymi"
Dodaj do konstruktora `Employee` sprawdzenie: imię nie jest puste (`isBlank()`), pensja nie jest niższa od minimalnej (zdefiniuj stałą). Przy naruszeniu rzucaj `IllegalArgumentException` z czytelnym komunikatem. Spróbuj utworzyć „złego” pracownika i przeczytaj komunikat błędu.
:::

:::task hard "Niezmienny ułamek"
Utwórz niezmienną klasę `Fraction` (licznik i mianownik są `final`). W konstruktorze skracaj ułamek (przez NWD) i przenoś znak do licznika; mianownik 0 jest zabroniony. Dodaj metody `plus(Fraction other)` i `times(Fraction other)`, które zwracają **nowy** ułamek, oraz `toString()` w postaci `"3/4"`.
??? Podpowiedź
NWD algorytmem Euklidesa: `while (b != 0) { int t = a % b; a = b; b = t; } return Math.abs(a);`. Suma: `a/b + c/d = (a*d + c*b) / (b*d)` — potem konstruktor sam skróci wynik.
:::
