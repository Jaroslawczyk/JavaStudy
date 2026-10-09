**Przeciążanie (overloading)** to kilka metod lub konstruktorów o tej samej nazwie, ale z różnymi parametrami. Tu także pierwsze spotkanie ze `static` i wywołanie jednej metody z drugiej.

## Znaczniki czasu wideo

- {{t j1 2:25:13}} — czym jest przeciążanie metod
- {{t j1 2:25:37}} — metoda `multiple(int, int)`
- {{t j1 2:26:53}} — błąd przy przekazaniu `double`
- {{t j1 2:27:24}} — przeciążona `multiple(double, double)`
- {{t j1 2:28:15}} — <kbd>Ctrl+P</kbd> pokazuje wszystkie warianty
- {{t j1 2:28:30}} — `multiple(int)` — kwadrat liczby
- {{t j1 2:29:31}} — pierwsze spotkanie ze `static`
- {{t j1 2:30:59}} — wywołanie metody statycznej przez nazwę klasy
- {{t j1 2:31:17}} — `Math.sqrt`, `Math.abs` — statyczne i przeciążone
- {{t j1 2:32:55}} — przeciążaj tylko metody o podobnym znaczeniu
- {{t j1 2:33:36}} — zasady: różnić się muszą parametry, a nie typ zwracany
- {{t j1 2:34:29}} — przeciążanie konstruktorów: sześcian i pudełko
- {{t j1 2:37:10}} — konstruktor bezparametrowy
- {{t j1 2:38:13}} — wywołanie metody z metody zamiast powielania kodu
- {{t j1 2:39:22}} — zadanie domowe: klasa `Monster`

## Przeciążanie metod

```java
public class Calc {
    static int multiple(int a, int b) {
        return a * b;
    }

    static double multiple(double a, double b) {
        return a * b;
    }

    static int multiple(int a) {
        return a * a;
    }
}
```

```java
Calc.multiple(6, 5);       // 30   → multiple(int, int)
Calc.multiple(6.3, 5.8);   // 36.54 → multiple(double, double)
Calc.multiple(5);          // 25   → multiple(int)
```

Kompilator wybiera wersję według **liczby i typów argumentów**. Tak działa wiele metod JDK: `Math.abs` istnieje w czterech wariantach — dla `int`, `long`, `float`, `double`; `System.out.println` — dla wszystkich typów.

### Zasady

- Przeciążone metody muszą różnić się **liczbą** parametrów, ich **typami** lub **kolejnością typów**.
- **Sam typ zwracany nie wystarczy**: `int f(int a)` i `double f(int a)` to błąd kompilacji.
- Nazwy parametrów nie mają znaczenia.

:::tip "Zasada najmniejszego zaskoczenia"
Przeciążaj tylko metody, które robią **to samo** dla różnych danych wejściowych. `multiple(int, int)`, które mnoży, i `multiple(double, double)`, które odejmuje, formalnie się skompilują, ale zmylą każdego, kto użyje twojego kodu.
:::

## Pierwsze spotkanie ze static

Metody `multiple` nie używają pól obiektu — potrzebują tylko parametrów. Tworzenie dla nich obiektu nie ma sensu, dlatego deklaruje się je jako `static` i wywołuje przez nazwę klasy: `Calc.multiple(5)`. Dokładnie tak wywoływałeś już `Math.sqrt(36)`.

Szczegóły o `static` — w lekcji o składowych statycznych.

## Przeciążanie konstruktorów

```java
public class Box {
    double width, height, length;

    Box(double width, double height, double length) {
        this.width = width;
        this.height = height;
        this.length = length;
    }

    Box(double size) {           // sześcian
        this(size, size, size);  // lepiej wywołać inny konstruktor, niż kopiować kod
    }

    Box() {                      // puste pudełko
        this(0);
    }

    double volume() {
        return width * height * length;
    }

    void showVolume() {
        System.out.println("Objętość: " + volume());   // wywołanie metody z metody
    }
}
```

```java
new Box(10).showVolume();          // 1000.0
new Box(15, 20, 25).showVolume();  // 7500.0
new Box().showVolume();            // 0.0
```

:::note "O public"
Autor zauważa w wideo, że czasem „z przyzwyczajenia” pisze `public` przed konstruktorem, i obiecuje wyjaśnić to później — modyfikatory dostępu omówione są za dwie lekcje.
:::

## Czego nie ma w wideo

### Jak kompilator wybiera przeciążenie

Jeśli nie ma dokładnego dopasowania, kompilator próbuje **rozszerzyć** argumenty:

```java
Calc.multiple(5, 2.0);   // int 5 rozszerza się do double → multiple(double, double) = 10.0
```

Kolejność: dokładne dopasowanie → rozszerzenie typu prostego → autoboxing (`int` → `Integer`) → varargs. Jeśli dwa warianty pasują równie dobrze — błąd „ambiguous method call”.

### Przeciążanie ≠ nadpisywanie

| | Przeciążanie (overloading) | Nadpisywanie (overriding) |
|---|---|---|
| Gdzie | W jednej klasie (lub w podklasie) | W podklasie |
| Sygnatura | Różne parametry | Ta sama sygnatura |
| Kiedy wybierane | Przy kompilacji (wiązanie statyczne) | W czasie działania (wiązanie dynamiczne) |

Nadpisywanie — w lekcji o dziedziczeniu; o wiązaniu — w artykule [Static vs Dynamic Binding](#/extra/binding).

### Pułapka Math.abs

```java
Math.abs(Integer.MIN_VALUE);   // -2147483648 — wartość bezwzględna nie mieści się w int!
```

Klasyczny przykład przepełnienia, czasem pojawia się na rozmowach rekrutacyjnych.

## Zadanie domowe

:::task video "Potwór — z wideo"
Utwórz klasę `Monster` z polami: liczba oczu, nóg i rąk. Konstruktor bezparametrowy ustawia wszystkim polom wartość 2 („zwykły potwór wygląda jak człowiek”). Jeszcze trzy konstruktory: z liczbą oczu; z oczami i rękami; ze wszystkimi trzema parametrami (brakujące wartości = 2). Metoda `voice()` wypisuje „Głos”; przeciążenie `voice(int n)` wypisuje „Głos” n razy; przeciążenie `voice(int n, String word)` wypisuje podane słowo n razy. {{t j1 2:39:22}}
??? Podpowiedź
Niech każdy „krótki” konstruktor wywołuje najpełniejszy przez `this(...)`: `Monster(int eyes) { this(eyes, 2, 2); }`. Tak samo `voice()` może wywołać `voice(1)`, a `voice(int n)` — `voice(n, "Głos")`.
:::

:::task easy "Pola figur"
Utwórz klasę `Area` ze statycznymi przeciążonymi metodami: `area(double r)` — pole koła, `area(double a, double b)` — prostokąta, `area(double a, double b, double c)` — trójkąta ze wzoru Herona.
:::

:::task medium "Maksimum dla wszystkich"
Napisz przeciążone statyczne metody `max`: dla dwóch `int`, trzech `int`, tablicy `int[]` i dwóch `double`. Wersja dla trzech liczb ma używać wersji dla dwóch.
:::

:::task hard "Które przeciążenie zostanie wywołane?"
Zadeklaruj metody `print(int x)`, `print(long x)`, `print(Integer x)`, `print(Object x)`, `print(int... x)`, każda wypisuje swoją nazwę. Wywołaj `print(5)`, `print(5L)`, `print((short) 5)`, `print(Integer.valueOf(5))`, `print("5")`, `print()`. Najpierw **przewidź** wynik, potem sprawdź i wyjaśnij kolejność wyboru.
??? Podpowiedź
Kolejność: dokładne dopasowanie → rozszerzenie typu prostego (`short` → `int`) → opakowanie (boxing) → varargs. `print("5")` trafi do `Object`, `print()` — tylko do varargs.
:::
