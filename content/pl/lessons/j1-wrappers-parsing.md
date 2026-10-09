Przygotowanie do kolekcji: powtarzamy `import`, poznajemy **klasy opakowujące** (`Integer`, `Double`, `Boolean`…) i autoboxing, uczymy się zamieniać napisy na liczby (`parseInt`) i wycinać fragmenty napisu (`substring`).

## Znaczniki czasu wideo

- {{t j1 3:43:13}} — czego brakuje do nauki kolekcji
- {{t j1 3:43:23}} — `import` i klasy z innych pakietów
- {{t j1 3:44:05}} — `import java.util.ArrayList`
- {{t j1 3:44:48}} — automatyczny import: <kbd>Alt+Enter</kbd> i podpowiadanie
- {{t j1 3:45:12}} — dlaczego `Math` i `String` nie trzeba importować: `java.lang`
- {{t j1 3:46:06}} — klasy opakowujące (wrapper classes)
- {{t j1 3:46:50}} — autoboxing
- {{t j1 3:47:16}} — gdzie się da — używaj typów prostych
- {{t j1 3:47:28}} — wszystkie osiem klas opakowujących
- {{t j1 3:49:04}} — napis → liczba: `Integer.parseInt`
- {{t j1 3:50:50}} — `Boolean.parseBoolean`
- {{t j1 3:51:48}} — `substring`: wycinamy fragment napisu
- {{t j1 3:53:57}} — zadanie domowe

## Klasy opakowujące

Każdy typ prosty ma **referencyjny odpowiednik** — klasę opakowującą:

| Typ prosty | Klasa opakowująca |
|---|---|
| `byte` | `Byte` |
| `short` | `Short` |
| `int` | `Integer` |
| `long` | `Long` |
| `float` | `Float` |
| `double` | `Double` |
| `char` | `Character` |
| `boolean` | `Boolean` |

Po co są potrzebne:

- **Kolekcje przechowują tylko obiekty**: `ArrayList<int>` się nie skompiluje, potrzebna jest `ArrayList<Integer>` (następna lekcja).
- Klasa opakowująca może być `null` — „brak wartości” (np. opcjonalne pole w bazie danych).
- Przydatne metody statyczne i stałe: `Integer.parseInt`, `Integer.MAX_VALUE`, `Character.isDigit`, `Double.compare`.

### Autoboxing i unboxing

```java
Integer a = 5;        // autoboxing: int → Integer
int b = a + 10;       // unboxing: Integer → int
```

Kompilator sam wstawia `Integer.valueOf(5)` i `a.intValue()`. Wygodne, ale **nie za darmo**: tworzą się obiekty, zużywana jest pamięć. Dlatego zasada z wideo jest słuszna — **gdzie się da, używaj typów prostych**.

## Napis → liczba

```java
String s1 = "1000";
String s2 = "2000";
System.out.println(s1 + s2);                 // 10002000 — sklejenie napisów!

int n1 = Integer.parseInt(s1);
int n2 = Integer.parseInt(s2);
System.out.println(n1 + n2);                 // 3000

double d = Double.parseDouble("166.3");
long l = Long.parseLong("9000000000");
boolean b = Boolean.parseBoolean("false");   // false
```

:::warning "NumberFormatException"
`Integer.parseInt("12a")`, `Integer.parseInt("")` i `Double.parseDouble("166,3")` rzucają `NumberFormatException` — program się wysypie. Uwaga: w Javie część ułamkową oddziela **kropka**, napis „166,3” trzeba najpierw poprawić: `s.replace(',', '.')`.
:::

`Boolean.parseBoolean` zwraca `true` tylko dla napisu `"true"` (bez względu na wielkość liter: `"TRUE"` i `"True"` też dadzą `true`), wszystko inne — `false`. Dla `char` metody `parse` nie ma: znak bierze się przez `s.charAt(0)`.

Odwrotnie — liczba na napis: `String.valueOf(42)`, `Integer.toString(42)` lub `"" + 42`.

## substring — fragment napisu

```java
String s = "To jest Igor, on jest programistą";
String name = s.substring(8, 12);  // "Igor" — od indeksu 8 włącznie do 12 WYŁĄCZNIE
String tail = s.substring(8);      // "Igor, on jest programistą" — od 8 do końca
```

Zasada „początek włącznie, koniec wyłącznie” obowiązuje w Javie prawie wszędzie (`substring`, `subList`, `Arrays.copyOfRange`, `IntStream.range`). Wygodne: długość wyniku = `end - start`.

## Czego nie ma w wideo

:::outdated "new Integer(5) już się nie używa"
W starym kodzie spotkasz `new Integer(5)`, `new Double(3.14)`. Te konstruktory są przestarzałe od Javy 9, a od Javy 16 oznaczone do usunięcia (`forRemoval`). Używaj `Integer.valueOf(5)` albo po prostu autoboxingu: `Integer x = 5;`.
:::

### Pułapka: porównywanie klas opakowujących przez ==

```java
Integer a = 127, b = 127;
System.out.println(a == b);        // true  — wartości od -128 do 127 są cache'owane
Integer c = 128, d = 128;
System.out.println(c == d);        // false — różne obiekty!
System.out.println(c.equals(d));   // true
```

Klasy opakowujące, tak jak napisy, porównuje się przez `equals`. Popularne pytanie rekrutacyjne („Integer cache”).

### Pułapka: unboxing null

```java
Integer count = null;
int x = count;        // NullPointerException przy unboxingu
```

### Szukanie zamiast „magicznych” indeksów

Sztywne indeksy (`substring(8, 12)`) psują się, gdy tylko zmieni się tekst. Pewniej jest szukać pozycji:

```java
int start = s.indexOf("jest ") + 5;
int end = s.indexOf(",", start);
String name = s.substring(start, end);
```

Albo podzielić napis: `s.split(" ")`, `s.split("\\. ")`. Do złożonego parsowania służą wyrażenia regularne — artykuł [Regular Expressions](#/extra/regex).

## Zadanie domowe

:::task video "Parsowanie zdania o człowieku — z wideo"
Utwórz klasę `Man` z prywatnymi polami `String name`, `String position`, `int age`, `double height` i konstruktorem dla wszystkich pól. W `main` dany jest napis: `"To jest Iwan. Ma 34 lata. Jego wzrost to 166,3 cm. Stanowisko programista"`. Wydobądź z niego dane do osobnych zmiennych, utwórz obiekt `Man` i wypisz wszystkie pola przez gettery. {{t j1 3:53:57}}
??? Podpowiedź
Podziel napis po `". "` — wyjdą 4 części. Z każdej weź potrzebny fragment przez `substring`/`split(" ")`. Liczba: `Integer.parseInt("34")`. Wzrost: `Double.parseDouble("166,3".replace(',', '.'))`.
:::

:::task easy "Kalkulator napisów"
Użytkownik wpisuje dwie liczby jako napisy (przez `Scanner.nextLine()`). Wypisz ich sumę, różnicę, iloczyn i iloraz. Jeśli dane nie są liczbą — wykryj to wcześniej (`s.matches("-?\\d+")`) i wypisz czytelny komunikat.
:::

:::task medium "Lista liczb z napisu"
Dany jest napis `"12, 7, 33, -5, 18"`. Zamień go na tablicę `int[]`, znajdź sumę, minimum i maksimum.
??? Podpowiedź
`String[] parts = s.split(",\\s*");` — separator to „przecinek i dowolne spacje”. Potem `Integer.parseInt(parts[i])`.
:::

:::task hard "Integer cache na własne oczy"
Napisz program, który dla liczb od −200 do 200 sprawdza `Integer.valueOf(i) == Integer.valueOf(i)` i wypisuje zakres, w którym wynik to `true`. Następnie uruchom go z flagą JVM `-XX:AutoBoxCacheMax=1000` i wyjaśnij zmiany. Dlaczego porównywanie klas opakowujących przez `==` to błąd, nawet jeśli „na testach działa”?
:::
