Utrwalamy dziedziczenie na figurach i poznajemy **klasy i metody abstrakcyjne** (`abstract`), dziedziczenie wielopoziomowe oraz zakazy przez **`final`** dla metod i klas.

## Znaczniki czasu wideo

- {{t j1 4:30:06}} — zadanie: figura, prostokąt i trójkąt
- {{t j1 4:31:19}} — klasa `Figure` z polami `a`, `b` i metodą `area()`
- {{t j1 4:32:35}} — `Rect extends Figure`
- {{t j1 4:32:46}} — błąd: rodzic nie ma konstruktora bezparametrowego
- {{t j1 4:33:49}} — nadpisanie `area()` przez gettery
- {{t j1 4:34:11}} — `Triangle` i trzeci bok `c`
- {{t j1 4:35:38}} — pole ze wzoru Herona
- {{t j1 4:38:02}} — problem: zapomnieliśmy nadpisać — pole równe 0
- {{t j1 4:38:18}} — metoda abstrakcyjna i klasa abstrakcyjna
- {{t j1 4:39:06}} — dlaczego nie można utworzyć „po prostu figury”
- {{t j1 4:40:14}} — kompilator wymaga implementacji: <kbd>Ctrl+I</kbd>
- {{t j1 4:41:23}} — dziedziczenie wielopoziomowe: `ColorRect extends Rect`
- {{t j1 4:42:41}} — `final` przy metodzie — zakaz nadpisywania
- {{t j1 4:43:35}} — `final` przy klasie — zakaz dziedziczenia
- {{t j1 4:43:51}} — trzy zastosowania `final`

## Klasa abstrakcyjna

```java
public abstract class Figure {
    private final double a;
    private final double b;

    public Figure(double a, double b) {
        this.a = a;
        this.b = b;
    }

    public abstract double area();      // brak ciała — tylko „obietnica”

    public final double getA() { return a; }
    public final double getB() { return b; }
}
```

```java
public class Rect extends Figure {
    public Rect(double a, double b) { super(a, b); }
    public Rect(double size) { super(size, size); }

    @Override
    public double area() {
        return getA() * getB();
    }
}

public class Triangle extends Figure {
    private final double c;

    public Triangle(double a, double b, double c) {
        super(a, b);
        this.c = c;
    }

    public Triangle(double size) {
        this(size, size, size);
    }

    @Override
    public double area() {                               // wzór Herona
        double p = (getA() + getB() + c) / 2;
        return Math.sqrt(p * (p - getA()) * (p - getB()) * (p - c));
    }
}
```

```java
Figure rect = new Rect(5, 10);
Figure triangle = new Triangle(10);
System.out.println(rect.area());       // 50.0
System.out.println(triangle.area());   // 43.30…
// new Figure(5, 5);                   // błąd: Figure is abstract; cannot be instantiated
```

### Co daje abstract

| | Metoda abstrakcyjna | Klasa abstrakcyjna |
|---|---|---|
| Zapis | `public abstract double area();` — bez ciała | `public abstract class Figure` |
| Sens | Każda podklasa **musi** ją zaimplementować | Nie można utworzyć obiektu, tylko dziedziczyć |
| Zasada | Choć jedna metoda abstrakcyjna → klasa musi być abstrakcyjna | Może mieć pola, konstruktory i zwykłe metody |

Klasa abstrakcyjna opisuje coś, co w rzeczywistości istnieje tylko w konkretnych formach: nie ma „po prostu figur” — są trójkąty, prostokąty, koła. Kompilator nie pozwoli zapomnieć o implementacji: podklasa bez `area()` się nie skompiluje (chyba że sama jest `abstract`). <kbd>Ctrl+I</kbd> (Implement Methods) utworzy szkielety.

## Dziedziczenie wielopoziomowe

```java
public class ColorRect extends Rect {
    private final String color;

    public ColorRect(double a, double b, String color) {
        super(a, b);
        this.color = color;
    }
}
```

`ColorRect` jest i `Rect`, i `Figure`. `area()` nie trzeba nadpisywać: używana jest implementacja z `Rect`.

## final przy metodach i klasach

| Gdzie | Czego zabrania | Przykład |
|---|---|---|
| Zmienna / pole | Ponownego przypisania | `final double PI = 3.14;` |
| Metoda | Nadpisania w podklasach | `public final double getA()` |
| Klasa | Dziedziczenia po niej | `public final class Rect`, `String`, `Integer` |

Po co zabraniać: by nikt nie „zepsuł” zachowania, na którym polega reszta kodu. Na przykład nadpisane `getA()`, zawsze zwracające 10, zmyliłoby wszystkich użytkowników klasy.

## Czego nie ma w wideo

### Klasa abstrakcyjna może mieć konstruktor

Częste pytanie rekrutacyjne: „Czy klasa abstrakcyjna ma konstruktor, skoro nie można utworzyć jej obiektu?” — **Tak**. Jest wywoływany przez `super(...)` z konstruktorów podklas i inicjalizuje wspólne pola.

### Polimorfizm na figurach

```java
List<Figure> figures = List.of(new Rect(5, 10), new Triangle(10), new Rect(3));
double total = 0;
for (Figure f : figures) {
    total += f.area();           // wywoła się implementacja konkretnej figury
}
```

Szczegóły o polimorfizmie — w następnej lekcji.

### Wzorzec „Metoda szablonowa”

Klasa abstrakcyjna często wyznacza **algorytm**, a podklasy — kroki:

```java
public abstract class Report {
    public final void print() {          // final: algorytm się nie zmienia
        printHeader();
        printBody();                      // krok definiowany przez podklasę
        printFooter();
    }
    protected abstract void printBody();
    private void printHeader() { System.out.println("=== Raport ==="); }
    private void printFooter() { System.out.println("=============="); }
}
```

### Ograniczenie hierarchii — sealed

Zamiast `final` (nikt nie dziedziczy) można pozwolić dziedziczyć tylko konkretnym klasom — `sealed ... permits` (Java 17+), patrz lekcja o dziedziczeniu.

## Zadanie domowe

Zadanie do tego tematu autor dał w poprzedniej lekcji, a ta lekcja jest jego omówieniem. Zadania utrwalające abstrakcję:

:::task easy "Koło"
Dodaj do hierarchii figur klasę `Circle` (promień). Co z polami `a` i `b` z `Figure`? Zaproponuj rozwiązanie: przekazać promień jako `a` i `b` albo przeprojektować `Figure` tak, by w ogóle nie miała boków.
??? Podpowiedź
Druga opcja jest czystsza: `Figure` deklaruje tylko `abstract double area()` i np. `abstract double perimeter()`, a boki przechowują same podklasy.
:::

:::task medium "Obwód i sortowanie"
Dodaj do `Figure` abstrakcyjną metodę `perimeter()` i zaimplementuj ją wszędzie. Utwórz listę 6 różnych figur i wypisz je posortowane po polu (ręcznie lub przez `figures.sort(...)`).
:::

:::task medium "Metoda szablonowa"
Zaimplementuj klasę abstrakcyjną `Beverage` z metodą `final` `prepare()`: zagotuj wodę → `brew()` → nalej do kubka → `addCondiments()`. Podklasy `Tea` i `Coffee` implementują abstrakcyjne kroki. Upewnij się, że kolejności kroków nie da się zmienić.
:::

:::task hard "Abstrakcyjny transport"
Zaprojektuj klasę abstrakcyjną `Vehicle` (model, prędkość maks., abstrakcyjne `double travelTime(double km)`, metoda `final` `describe()`), podklasy `Car`, `Bicycle`, `Train` z własną logiką (np. pociąg ma postoje, rowerzysta męczy się po 30 km). Zrób `Train` jako `final`. Policz, kto najszybciej pokona 100 km, i wypisz ranking.
:::
