**Tablica** to grupa zmiennych tego samego typu pod jedną nazwą. Jeśli zmienna to pudełko na jedną wartość, to tablica jest skrzynią z ponumerowanymi przegródkami ściśle jednego typu i ściśle określonego rozmiaru.

## Znaczniki czasu wideo

- {{t j1 1:19:31}} — czym jest tablica
- {{t j1 1:19:48}} — składnia tworzenia tablicy
- {{t j1 1:20:22}} — indeksy zaczynają się od zera
- {{t j1 1:20:52}} — praktyka: tablica dni w miesiącach
- {{t j1 1:22:03}} — odczyt elementu po indeksie
- {{t j1 1:22:26}} — wypisanie wszystkich elementów pętlą `for`
- {{t j1 1:23:22}} — błąd wyjścia poza zakres tablicy
- {{t j1 1:23:57}} — właściwość `length`
- {{t j1 1:24:43}} — wartości domyślne
- {{t j1 1:25:22}} — wypełnianie tablicy w pętli (0, 10, 20 … 990)
- {{t j1 1:26:44}} — pętla for-each
- {{t j1 1:28:18}} — typ zmiennej w for-each odpowiada typowi tablicy
- {{t j1 1:28:59}} — zadanie domowe
- {{t j1 1:29:32}} — podpowiedź: dwie zmienne w jednym `for`
- {{t j1 1:30:50}} — omówienie rozwiązania zadania domowego

## Tworzenie tablicy

```java
int[] daysInMonths = new int[12];   // 12 komórek typu int, wszystkie równe 0
daysInMonths[0] = 31;   // styczeń
daysInMonths[1] = 28;   // luty
daysInMonths[2] = 31;   // marzec

int march = daysInMonths[2];
System.out.println(march);   // 31
```

- `int[]` — typ „tablica liczb całkowitych”.
- `new int[12]` — utwórz tablicę na 12 elementów. **Rozmiaru nie można zmienić** po utworzeniu.
- Indeksy — od `0` do `length - 1`. W tablicy 12-elementowej ostatni indeks to 11.

Krótka forma — od razu z wartościami (omówiona w następnej lekcji):

```java
int[] days = {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
```

## Przechodzenie w pętli i length

```java
for (int i = 0; i < daysInMonths.length; i++) {
    System.out.println(daysInMonths[i]);
}
```

:::warning "ArrayIndexOutOfBoundsException"
Odwołanie do nieistniejącego indeksu wysypuje program: `Index 12 out of bounds for length 12`. Dlatego w warunku pętli pisz `i < array.length`, a nie liczbę `12` i nie `<=`.
:::

Naucz się czytać takie błędy (stack trace) w konsoli: jest tam typ wyjątku, komunikat i linia kodu, w której wszystko się zepsuło — można w nią kliknąć.

## Wartości domyślne

Przy tworzeniu przez `new` wszystkie elementy dostają wartości domyślne:

| Typ elementów | Wartość domyślna |
|---|---|
| `int`, `long`, `short`, `byte` | `0` |
| `double`, `float` | `0.0` |
| `char` | `'\u0000'` (niewidoczny znak „zerowy”) |
| `boolean` | `false` |
| Referencyjne (`String`, obiekty) | `null` |

## Pętla for-each

```java
int[] nums = new int[100];
for (int i = 0; i < nums.length; i++) {
    nums[i] = i * 10;            // modyfikujemy — potrzebny zwykły for z indeksem
}

for (int num : nums) {           // „dla każdego num w nums”
    System.out.println(num);     // tylko czytamy — wygodny for-each
}
```

- for-each nie może wyjść poza zakres i nie wymaga indeksów.
- **Nie da się zmienić elementów przez zmienną for-each**: przypisanie `num = 5` zmienia kopię, a nie tablicę.
- Typ zmiennej odpowiada typowi elementów: dla `char[]` — `for (char ch : chars)`.

## Zadanie domowe z wideo — omówienie

```java
int[] first = new int[900];
for (int i = 0; i < first.length; i++) {
    first[i] = i + 100;                  // 100, 101, …, 999
}

int[] second = new int[first.length];
for (int i = 0, j = first.length - 1; i < first.length; i++, j--) {
    second[j] = first[i];                // pierwszy → na koniec drugiego
}

for (int value : second) {
    System.out.println(value);           // 999, 998, …, 100
}
```

:::note "Nieścisłość w zadaniu"
W zadaniu mowa o „wartościach od 100 do 1000”, a w rozwiązaniu tablica 900-elementowa daje liczby **od 100 do 999**. Aby objąć 1000, potrzebny jest rozmiar 901. Dobra lekcja: przy zakresach zawsze sprawdzaj granice.
:::

## Czego nie ma w wideo

### Klasa Arrays — gotowe narzędzia

```java
import java.util.Arrays;

int[] a = {5, 3, 9, 1};
System.out.println(a);                    // [I@1b6d3586 — adres, a nie zawartość!
System.out.println(Arrays.toString(a));   // [5, 3, 9, 1]
Arrays.sort(a);                           // [1, 3, 5, 9]
int[] copy = Arrays.copyOf(a, a.length);  // niezależna kopia
Arrays.fill(a, 0);                        // [0, 0, 0, 0]
boolean same = Arrays.equals(a, copy);    // porównanie zawartości
```

### Tablica to typ referencyjny

```java
int[] a = {1, 2, 3};
int[] b = a;        // TO NIE kopia: obie zmienne wskazują na tę samą tablicę
b[0] = 100;
System.out.println(a[0]);   // 100!
```

Szczegóły o referencjach — w lekcji o klasach i obiektach.

### Tablice dwuwymiarowe

```java
int[][] matrix = new int[3][4];      // 3 wiersze po 4 kolumny
matrix[1][2] = 7;
int[][] table = {{1, 2}, {3, 4}, {5, 6}};
for (int[] row : table) {
    System.out.println(Arrays.toString(row));
}
```

### Tablica a kolekcje

Tablica o stałym rozmiarze to struktura niskopoziomowa. W prawdziwym kodzie dużo częściej używa się `ArrayList`, która rośnie sama. Kolekcje — w kolejnych lekcjach; tam też zobaczysz, jak `ArrayList` jest zbudowana wewnątrz **na tablicy**.

### String[] args

Teraz jest jasne, że `String[] args` w metodzie `main` to tablica napisów z argumentami wiersza poleceń.

## Zadanie domowe

:::task video "Tablica w odwrotnej kolejności — z wideo"
Utwórz tablicę i wypełnij ją w pętli wartościami od 100 do 1000. Utwórz drugą tablicę o tym samym rozmiarze (użyj `.length`) i wypełnij ją wartościami pierwszej w odwrotnej kolejności — bierz wartości właśnie z pierwszej tablicy. Wypisz drugą tablicę pętlą for-each. {{t j1 1:28:59}}
??? Podpowiedź
W `for` można zadeklarować dwie zmienne po przecinku: `for (int i = 0, j = first.length - 1; i < first.length; i++, j--)`. Rozwiązanie jest w wideo: {{t j1 1:30:50}}
:::

:::task easy "Suma, minimum, maksimum"
Dana jest tablica `{12, -5, 7, 0, 33, 8}`. W jednym przejściu policz sumę, średnią (ułamkową!), element minimalny i maksymalny.
??? Podpowiedź
Wartości początkowe: `min = array[0]`, `max = array[0]` — nie `0`, inaczej dla tablicy liczb ujemnych maksimum wyjdzie błędne.
:::

:::task easy "Szukanie elementu"
Napisz program, który szuka liczby w tablicy i wypisuje jej indeks albo `-1`, jeśli takiej liczby nie ma.
:::

:::task medium "Odwracanie w miejscu"
Odwróć tablicę **bez drugiej tablicy**: zamieniaj miejscami pierwszy i ostatni element, drugi i przedostatni itd. Sprawdź na tablicach o parzystej i nieparzystej długości.
??? Podpowiedź
Pętla do połowy: `for (int i = 0; i < a.length / 2; i++)`, zamieniamy `a[i]` i `a[a.length - 1 - i]` przez zmienną tymczasową.
:::

:::task hard "Sortowanie bąbelkowe"
Posortuj tablicę rosnąco algorytmem „bąbelkowym” ręcznie (bez `Arrays.sort`). Następnie dodaj optymalizację: jeśli w przejściu nie było żadnej zamiany — tablica jest już posortowana, wychodzimy. Porównaj wynik z `Arrays.sort`.
??? Podpowiedź
Pętla zewnętrzna to przejścia, wewnętrzna porównuje sąsiednie elementy `a[j] > a[j + 1]` i je zamienia. Po każdym przejściu największy element „wypływa” na koniec, więc wewnętrzną pętlę można skracać: `j < a.length - 1 - i`.
:::
