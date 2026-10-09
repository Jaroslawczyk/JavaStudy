Zamykamy luki przed kolekcjami: szczegółowo o **`static`** (składowe klasy, a nie obiektu), **`final`** (niezmienność), stałych, zmianie nazwy przez <kbd>Shift+F6</kbd> i argumentach o zmiennej długości (varargs). I wreszcie rozbieramy na słowa `public static void main(String[] args)`.

## Znaczniki czasu wideo

- {{t j1 3:11:24}} — powtarzamy `static`
- {{t j1 3:11:47}} — klasa `MyMath` i statyczna metoda `square`
- {{t j1 3:13:24}} — obwód koła i pole `pi`
- {{t j1 3:14:33}} — metoda statyczna nie widzi pól niestatycznych
- {{t j1 3:14:52}} — pole statyczne
- {{t j1 3:15:38}} — „słaby programista” zmienia `pi`
- {{t j1 3:17:49}} — wspólny stan statyczny psuje cudzą metodę
- {{t j1 3:18:22}} — `final`: przypisać można tylko raz
- {{t j1 3:18:57}} — stałe `static final` pisze się WIELKIMI literami
- {{t j1 3:19:34}} — zmiana nazwy wszędzie: <kbd>Shift+F6</kbd>
- {{t j1 3:20:16}} — metoda `sum` z dowolną liczbą argumentów
- {{t j1 3:21:13}} — argumenty o zmiennej długości `int... numbers`
- {{t j1 3:23:12}} — co znaczy każde słowo w `public static void main`

## static — należy do klasy

| | Niestatyczny (instancji) | Statyczny (`static`) |
|---|---|---|
| Należy do | Konkretnego obiektu | Całej klasy — jeden dla wszystkich |
| Wywołanie | `box.volume()` | `MyMath.square(20)` |
| Potrzebny obiekt? | Tak | Nie |
| Dostęp do pól instancji | Tak | **Nie** — obiekt może nie istnieć |

```java
public class MyMath {
    private static final double PI = 3.14;

    public static int square(int number) {
        return number * number;
    }

    public static double length(double radius) {
        return 2 * PI * radius;
    }

    public static double area(double radius) {
        return PI * radius * radius;
    }
}
```

```java
System.out.println(MyMath.square(20));    // 400
System.out.println(MyMath.length(10));    // 62.8
```

:::warning "Metoda statyczna nie widzi pól instancji"
Jeśli `pi` zadeklarujesz jako zwykłe pole (`private double pi = 3.14;`), to `return 2 * pi * radius;` w metodzie statycznej się nie skompiluje: `non-static variable pi cannot be referenced from a static context`. Metoda statyczna jest wywoływana **bez obiektu**, więc nie ma pól konkretnego obiektu.
:::

## Niebezpieczeństwo wspólnego zmiennego stanu

Pole statyczne jest **jedno na cały program**. W wideo „słaby programista” w swojej metodzie `area` pisze `pi = 10;` — i od tej pory **twoja** metoda `length` zwraca błędne wartości. Jedna metoda niepostrzeżenie zepsuła drugą przez wspólne pole.

## final — przypisanie tylko raz

```java
private static final double PI = 3.14;
PI = 10;   // błąd kompilacji: cannot assign a value to final variable PI
```

- **Stała** = `static final`. Nazwa w `UPPER_SNAKE_CASE`: `PI`, `MAX_SIZE`, `DEFAULT_TIMEOUT`.
- Stałą można bez obaw zrobić `public` — i tak nie da się jej zmienić (tak działa `Math.PI`). Ale jeśli dostęp z zewnątrz nie jest potrzebny — `private`.

## Argumenty o zmiennej długości (varargs)

```java
public static int sum(int... numbers) {   // wewnątrz numbers to zwykła int[]
    int sum = 0;
    for (int number : numbers) {
        sum += number;
    }
    return sum;
}
```

```java
MyMath.sum();                // 0
MyMath.sum(1);               // 1
MyMath.sum(1, 2, 3, 4);      // 10
MyMath.sum(new int[]{5, 5}); // 10 — można przekazać też tablicę
```

Zasady: parametr varargs może być tylko **jeden** i tylko **ostatni**: `format(String pattern, Object... args)`.

## public static void main(String[] args) — słowo po słowie

| Słowo | Znaczenie |
|---|---|
| `public` | Metoda dostępna zewsząd — JVM musi ją wywołać |
| `static` | Przy starcie programu nie ma jeszcze obiektów, więc punkt wejścia nie może wymagać obiektu |
| `void` | Metoda nic nie zwraca |
| `main` | Nazwa, której JVM szuka jako punktu wejścia |
| `String[] args` | Tablica argumentów wiersza poleceń |

:::note "O argumentach wiersza poleceń"
Autor mówi, że przez całą karierę ani razu nie użył `args`. W programowaniu webowym to faktycznie rzadkość, ale w narzędziach wiersza poleceń, skryptach, kontenerach Docker i Spring Boot (`--server.port=9090`) argumentów używa się stale.
:::

## Czego nie ma w wideo

### Pole statyczne jako licznik obiektów

Klasyczny przykład przydatnego pola statycznego:

```java
public class User {
    private static int count = 0;   // wspólny dla wszystkich obiektów
    private final int id;

    public User() {
        count++;
        id = count;
    }

    public static int getCount() {
        return count;
    }
}
```

### Wszystkie znaczenia final

| Gdzie | Co oznacza |
|---|---|
| zmienna/pole `final` | Wartość przypisuje się raz |
| parametr `final` | Nie można go przypisać ponownie w metodzie |
| metoda `final` | Nie można jej **nadpisać** w podklasie |
| klasa `final` | Nie można po niej **dziedziczyć** (np. `String`, `Integer`) |

Ważne: `final` przy referencji zabrania zmiany **referencji**, ale nie zawartości obiektu: `final int[] arr = {1, 2}; arr[0] = 100;` — kompiluje się.

### Klasy narzędziowe

Klasy złożone wyłącznie z metod statycznych (`Math`, `Arrays`, `Collections`) robi się `final` z konstruktorem `private`, by nikt nie tworzył ich obiektów:

```java
public final class MyMath {
    private MyMath() { }   // obiekty nie są potrzebne
    // tylko metody static
}
```

### Import statyczny

```java
import static java.lang.Math.PI;
import static java.lang.Math.sqrt;

double r = sqrt(PI);   // bez "Math."
```

Wygodne w testach (`assertEquals`), ale nie warto nadużywać — nie wiadomo, skąd pochodzi metoda.

### Dlaczego unika się stanu statycznego

Zmienne pola statyczne to w praktyce zmienne globalne: utrudniają testowanie i są niebezpieczne przy wielowątkowości. Stałe (`static final`) i czyste funkcje statyczne są w porządku; zmienny `static` — tylko z ważnego powodu.

## Zadanie domowe

W wideo nie ma zadania (autor radzi odpocząć przed kolekcjami), więc zadania są nasze.

:::task easy "Konwerter jednostek"
Utwórz klasę narzędziową `Converter` ze stałymi (`KM_IN_MILE = 1.609344`, `CM_IN_INCH = 2.54`) i metodami statycznymi `milesToKm`, `kmToMiles`, `inchesToCm`. Zrób klasę `final` z konstruktorem `private`.
:::

:::task easy "Średnia z dowolnej liczby wartości"
Napisz `static double average(double... values)`. Co zwrócić dla pustego wywołania `average()`? Wybierz zachowanie (0, `NaN` lub wyjątek) i uzasadnij.
:::

:::task medium "Licznik i ID"
Zaimplementuj klasę `User` ze statycznym licznikiem: każdy nowy użytkownik dostaje unikalne `id` (1, 2, 3…), a `User.getCount()` zwraca, ilu użytkowników utworzono. Utwórz 5 użytkowników i wypisz ich `id`.
:::

:::task hard "Zepsuj i napraw"
Powtórz eksperyment z wideo: klasa ze statycznym **niefinalnym** polem `pi` i dwiema metodami statycznymi, z których jedna zmienia `pi`. Pokaż, jak wywołanie jednej metody psuje wynik drugiej. Potem napraw: stała `final`, a jeszcze lepiej — `Math.PI`. Wyjaśnij, dlaczego zmienny stan statyczny jest szczególnie niebezpieczny, gdy metody są wywoływane jednocześnie z kilku wątków.
:::
