Java ma osiem **typów prostych** (prymitywnych). W tej lekcji — cztery całkowite (`byte`, `short`, `int`, `long`), przepełnienie oraz rzutowanie typów: automatyczne i ręczne.

## Znaczniki czasu wideo

- {{t j1 32:10}} — osiem typów prostych i ich cztery kategorie
- {{t j1 33:08}} — liczby całkowite: `byte`, `short`, `int`, `long`
- {{t j1 34:55}} — zadanie: ile kilometrów przebędzie światło w N dni
- {{t j1 37:32}} — błąd `incompatible types`
- {{t j1 38:08}} — typ wyrażenia = największy typ w nim
- {{t j1 38:47}} — skąd liczba ujemna: przepełnienie
- {{t j1 39:04}} — przepełnienie na przykładzie `byte`: 127 + 1 = −128
- {{t j1 40:29}} — dlaczego `long distance` nadal jest ujemne
- {{t j1 41:23}} — automatyczna (rozszerzająca) konwersja typów
- {{t j1 42:19}} — ręczne (zawężające) rzutowanie: `(byte) a`

## Typy proste Javy

| Kategoria | Typy |
|---|---|
| Liczby całkowite | `byte`, `short`, `int`, `long` |
| Liczby zmiennoprzecinkowe | `float`, `double` |
| Znaki | `char` |
| Logiczny | `boolean` |

Wszystkie pozostałe typy (`String`, tablice, twoje klasy) są **referencyjne** — o nich później.

## Typy całkowite

| Typ | Rozmiar | Zakres | Kiedy się używa |
|---|---|---|---|
| `byte` | 1 bajt | −128 … 127 | Pliki, sieć, dane binarne |
| `short` | 2 bajty | −32 768 … 32 767 | Prawie nigdy (oszczędność pamięci w ogromnych tablicach) |
| `int` | 4 bajty | −2 147 483 648 … 2 147 483 647 (≈ ±2,1 mld) | **Domyślnie** dla liczb całkowitych |
| `long` | 8 bajtów | ≈ ±9,2 × 10¹⁸ | Duże liczby: czas w milisekundach, ID, pieniądze w groszach |

Dokładne granice są w stałych: `Integer.MAX_VALUE`, `Integer.MIN_VALUE`, `Long.MAX_VALUE`, `Byte.MIN_VALUE` itd.

```java
byte b = 120;
short s = 3_500;
int i = 950_000;
long l = 9_000_000_000L;   // L na końcu — literał typu long
```

:::warning "Przyrostek L"
Liczba zapisana w kodzie ma domyślnie typ `int`. Literał większy niż 2,1 mld bez przyrostka `L` to błąd kompilacji `integer number too large`. Pisz wielkie `L`: małe `l` łatwo pomylić z jedynką.
:::

## Przepełnienie (overflow)

Jeśli wynik nie mieści się w typie, Java **nie zgłasza błędu** — wartość „zawija się” na drugi koniec zakresu:

```java
byte b = 127;
b++;
System.out.println(b);          // -128

int big = Integer.MAX_VALUE;    // 2147483647
System.out.println(big + 1);    // -2147483648
```

To jak licznik przebiegu w starym samochodzie: po 999 999 przychodzi 000 000. Tak działa zapis liczb w **kodzie uzupełnień do dwóch** (two's complement).

## Zadanie z wideo: światło w N dni

```java
int days = 1000;
int speed = 300_000;                  // km/s
int seconds = days * 24 * 60 * 60;    // 86 400 000 — mieści się w int
long distance = speed * seconds;      // BŁĄD LOGICZNY: wynik jest ujemny!
```

Dlaczego `distance` jest ujemne, choć to `long`? Wyrażenie `speed * seconds` liczy się **w typie `int`** (oba argumenty to `int`), przepełnia się, a dopiero potem zepsuta wartość jest rozszerzana do `long`.

**Poprawka** — zrób przynajmniej jeden argument typu `long` *przed* mnożeniem:

```java
long distance = (long) speed * seconds;   // rzutowanie przed mnożeniem
// lub
long distance = 300_000L * seconds;       // literał long
```

:::tip "Zasada"
Typ wyniku wyrażenia arytmetycznego to najszerszy typ spośród argumentów (ale nie węższy niż `int`). Kolejność ma znaczenie: `(long) a * b` — dobrze, `(long) (a * b)` — za późno, przepełnienie nastąpiło już w nawiasie.
:::

## Rzutowanie typów (type casting)

### Automatyczne (rozszerzające)

Mniejszy typ bezpiecznie zamienia się w większy — bez utraty danych:

```text
byte → short → int → long → float → double
           char ↗
```

```java
byte a = 10;
int b = a;       // OK, automatycznie
long c = b;      // OK
```

### Ręczne (zawężające)

Z większego do mniejszego — tylko jawnie, odpowiedzialność spoczywa na programiście:

```java
int a = 15;
byte b = (byte) a;        // 15 — zmieściło się
int big = 300;
byte broken = (byte) big; // 44 — nadmiarowe bity odrzucone!
```

## Czego nie ma w wideo

### Arytmetyka byte i short zawsze daje int

```java
byte x = 10, y = 20;
byte sum = x + y;           // BŁĄD: x + y ma typ int
byte sum2 = (byte) (x + y); // OK
x += 5;                     // OK! operatory złożone same rzutują
```

### Ochrona przed przepełnieniem

Metody `Math.addExact`, `Math.multiplyExact`, `Math.toIntExact` rzucają wyjątek zamiast „po cichu” zwracać zły wynik:

```java
long distance = Math.multiplyExact((long) speed, seconds);
int safe = Math.addExact(Integer.MAX_VALUE, 1);   // ArithmeticException: integer overflow
```

### Gdy nie wystarcza nawet long

Do dowolnie dużych liczb całkowitych służy klasa `java.math.BigInteger` (a do dokładnych ułamków — `BigDecimal`):

```java
BigInteger factorial = BigInteger.ONE;
for (int n = 2; n <= 50; n++) {
    factorial = factorial.multiply(BigInteger.valueOf(n));
}
System.out.println(factorial);   // 30414093201713378043612608166064768844377641568960512000000000000
```

### Inne systemy liczbowe w literałach

```java
int hex = 0xFF;          // 255 — szesnastkowy
int bin = 0b1010_1010;   // 170 — dwójkowy
int oct = 017;           // 15 — ósemkowy (wiodące 0 to pułapka!)
```

### Klasy opakowujące

Każdy typ prosty ma klasę opakowującą: `Integer`, `Long`, `Byte`, `Short`. Są potrzebne w kolekcjach i mają przydatne metody, np. `Integer.parseInt("42")`. Szczegóły w lekcji o klasach opakowujących.

## Zadanie domowe

W wideo nie ma osobnego zadania — autor radzi poćwiczyć rzutowanie typów. Oto zadania do tego.

:::task easy "Tabela zakresów"
Wypisz wartość minimalną i maksymalną dla `byte`, `short`, `int` i `long`, używając stałych `MIN_VALUE` / `MAX_VALUE` klas opakowujących.
:::

:::task easy "Napraw program o świetle"
Przepisz program z wideo tak, aby odległość, którą światło przebywa w 1000 dni, była policzona poprawnie. Odpowiedź: 25 920 000 000 000 km.
:::

:::task medium "Złap przepełnienie"
Policz `Integer.MAX_VALUE * 2` na trzy sposoby: „jak jest” w `int`, z rzutowaniem na `long` i przez `Math.multiplyExact`. Wyjaśnij każdy wynik.
??? Podpowiedź
W `int` wyjdzie `-2`: 2 147 483 647 × 2 = 4 294 967 294, czyli o 2³² więcej niż się mieści, więc wynik się „zawinął”.
:::

:::task hard "Silnie"
Wypisz silnie liczb od 1 do 25 w typie `long`. Znajdź pierwsze `n`, przy którym wynik staje się błędny (wskazówka: sprawdzaj, czy `fact / n == poprzednia`), a następnie przepisz obliczenia na `BigInteger`.
??? Podpowiedź
20! = 2 432 902 008 176 640 000 jeszcze mieści się w `long`, a 21! już nie. Pętle omówimy za dwie lekcje — jeśli teraz jest trudno, wróć do tego zadania po lekcji o pętlach.
:::
