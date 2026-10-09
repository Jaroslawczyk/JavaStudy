Parametry i wartości zwracane metod mogą być nie tylko typami prostymi, ale także **obiektami**. Uczymy się porównywać obiekty metodą zwracającą `-1 / 0 / 1`, piszemy konstruktor kopiujący i metody tworzące nowe obiekty.

## Znaczniki czasu wideo

- {{t j1 2:41:00}} — obiekty jako parametry i wartości zwracane
- {{t j1 2:41:18}} — metoda `compare(Box box)` wypisująca wynik
- {{t j1 2:44:43}} — `compare` zwraca `int`: 1, −1, 0
- {{t j1 2:46:48}} — wariant z jedną zmienną `result` i jednym `return`
- {{t j1 2:47:31}} — obsługa wyniku przez `switch`
- {{t j1 2:49:02}} — konstruktor przyjmujący inne pudełko (kopiujący)
- {{t j1 2:50:38}} — te same wymiary ≠ ten sam obiekt
- {{t j1 2:51:22}} — metoda zwracająca nowe pudełko: `increase()`
- {{t j1 2:53:36}} — uniwersalne `increase(int i)`
- {{t j1 2:54:34}} — zadanie domowe

## Obiekt jako parametr

```java
public class Box {
    private double width, height, length;

    public Box(double width, double height, double length) {
        this.width = width;
        this.height = height;
        this.length = length;
    }

    public double volume() {
        return width * height * length;
    }

    /** 1 — to pudełko jest większe, -1 — mniejsze, 0 — równe objętością */
    public int compare(Box box) {
        double thisVolume = volume();
        double boxVolume = box.volume();
        if (thisVolume > boxVolume) {
            return 1;
        } else if (thisVolume < boxVolume) {
            return -1;
        }
        return 0;
    }
}
```

**Obiekt wywołujący** to ten, na którym wywołano metodę (`box1` w `box1.compare(box2)`); jest dostępny jako `this`. Przekazany obiekt to parametr `box`.

```java
int result = box1.compare(box2);
switch (result) {
    case -1 -> System.out.println("Nasze pudełko jest mniejsze");
    case 0  -> System.out.println("Pudełka są równe");
    case 1  -> System.out.println("Nasze pudełko jest większe");
}
```

Konwencja „ujemne / 0 / dodatnie” to standard Javy: tak działa `compareTo` w napisach, liczbach i wszystkich obiektach implementujących interfejs `Comparable`. Później zaimplementujesz go, by sortować własne obiekty.

:::tip "Nie wymyślaj porównywania liczb"
Do porównania liczb są gotowe metody: `return Double.compare(volume(), box.volume());` — jedna linijka zamiast trzech `if`, do tego poprawnie obsługuje wartości specjalne jak `NaN`.
:::

## Konstruktor kopiujący

```java
public Box(Box other) {
    this.width = other.width;     // wewnątrz klasy dostępne są pola private innego obiektu tej samej klasy
    this.height = other.height;
    this.length = other.length;
}
```

```java
Box box1 = new Box(10, 10, 10);
Box box2 = new Box(box1);          // NOWE pudełko o tych samych wymiarach
System.out.println(box1 == box2);  // false — różne obiekty
```

Zmiana `box1` już nie wpływa na `box2` — w odróżnieniu od `Box box2 = box1;`.

## Metoda zwracająca obiekt

```java
public Box increase(int i) {
    return new Box(width * i, height * i, length * i);
}
```

```java
Box box1 = new Box(10, 10, 10);
Box box2 = box1.increase(2);
System.out.println(box1.volume());   // 1000.0
System.out.println(box2.volume());   // 8000.0 — każdy wymiar ×2, objętość ×8
```

Metoda nie zmienia obiektu wywołującego, tylko zwraca **nowy** — tak działają `String.toUpperCase()`, `BigDecimal.add()`, `LocalDate.plusDays()`. To podstawa obiektów niezmiennych (immutable).

## Czego nie ma w wideo

### Jeden return czy kilka?

Autor pokazuje dwa style: kilka `return` (wczesne wyjście) i jedną zmienną `result` z jednym `return` na końcu. Nowoczesne standardy (Google Java Style, większość zespołów) **dopuszczają kilka return** — kod jest krótszy i nie ma „zbędnych” stanów. Najważniejszy jest jednolity styl w projekcie.

### Kopiowanie: płytkie i głębokie

Jeśli pole samo jest obiektem (np. pudełko ma pole `Color color`), konstruktor kopiujący z `this.color = other.color` tworzy kopię **płytką**: oba pudełka wskazują na ten sam obiekt koloru. Dla kopii **głębokiej** trzeba skopiować też obiekt zagnieżdżony: `this.color = new Color(other.color)`.

Metody `clone()` z klasy `Object` nie zaleca się do tego używać (uważa się ją za nieudane API) — konstruktor kopiujący lub statyczna metoda `copyOf` są pewniejsze.

### null jako parametr

Wywołanie `box1.compare(null)` wysypie się z `NullPointerException` na `box.volume()`. W metodach publicznych parametry często sprawdza się od razu: `Objects.requireNonNull(box, "box must not be null");`.

## Zadanie domowe

:::task video "Suma pudełek — z wideo"
W klasie `Box` utwórz metodę, która przyjmuje inne pudełko i zwraca **nowe**: jego długość = długość wywołującego + długość przekazanego, tak samo dla szerokości i wysokości. Dodaj konstruktor przyjmujący **dwa** pudełka, robiący to samo. Sprawdź, że objętość wyniku jest większa od sumy objętości obu pudełek, i pokaż wszystko w `main`. {{t j1 2:54:34}}
??? Podpowiedź
Konstruktor z dwóch pudełek może użyć konstruktora z wymiarami: `public Box(Box a, Box b) { this(a.width + b.width, a.height + b.height, a.length + b.length); }`, a metoda to po prostu `return new Box(this, other);`.
:::

:::task easy "Porównanie osób"
Klasa `Person` (imię, wiek) z metodą `int compareByAge(Person other)` zwracającą −1/0/1. Utwórz trzy osoby i wypisz, kto jest starszy w każdej parze.
:::

:::task medium "Odcinek"
Klasa `Point(x, y)` i klasa `Segment` z dwoma polami-punktami. Metody: `double length()`, `Point middle()` (zwraca nowy punkt — środek), `boolean isLongerThan(Segment other)`. Dodaj konstruktor kopiujący `Segment(Segment other)` tworzący **głęboką** kopię punktów i udowodnij to kodem.
:::

:::task hard "Największe pudełko"
Napisz statyczną metodę `Box largest(Box... boxes)` zwracającą pudełko o największej objętości (użyj `compare`) oraz metodę `Box[] sortedByVolume(Box[] boxes)` zwracającą **nową** posortowaną tablicę bez zmieniania oryginału (sortowanie zaimplementuj sam, np. przez wybieranie lub bąbelkowe).
??? Podpowiedź
Najpierw skopiuj tablicę `Arrays.copyOf(boxes, boxes.length)` i sortuj kopię. Dla pustej tablicy `largest` może zwrócić `null` — albo lepiej rzucić `IllegalArgumentException`.
:::
