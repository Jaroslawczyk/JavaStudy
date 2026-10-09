Lekcja z kilku małych tematów przed OOP: szybka inicjalizacja tablic, napisy `String`, znaki specjalne, instrukcja `switch` i poprawne porównywanie napisów przez `equals`.

## Znaczniki czasu wideo

- {{t j1 1:34:17}} — o czym jest lekcja: kilka małych tematów
- {{t j1 1:35:06}} — inicjalizacja tablicy od razu wartościami `{…}`
- {{t j1 1:36:23}} — typ napisowy `String` (referencyjny, nie prosty)
- {{t j1 1:37:20}} — łączenie napisów: „Cześć, Iwan, masz 33 lata”
- {{t j1 1:38:35}} — znak specjalny nowej linii `\n`
- {{t j1 1:39:12}} — escapowanie cudzysłowu `\"`
- {{t j1 1:39:53}} — zadanie: miesiące po przecinku, na końcu kropka
- {{t j1 1:40:26}} — rozwiązanie
- {{t j1 1:43:17}} — zadanie: numer miesiąca → nazwa przez `if-else`
- {{t j1 1:44:56}} — instrukcja `switch-case`
- {{t j1 1:46:45}} — co się stanie, gdy zapomnisz `break`
- {{t j1 1:47:37}} — zadanie domowe
- {{t j1 1:48:00}} — porównywanie napisów: `==` kontra `equals`

## Inicjalizacja tablicy wartościami

```java
int[] daysOfMonths = {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
String[] namesOfMonths = {
        "Styczeń", "Luty", "Marzec", "Kwiecień",
        "Maj", "Czerwiec", "Lipiec", "Sierpień",
        "Wrzesień", "Październik", "Listopad", "Grudzień"
};
```

Rozmiar wylicza się automatycznie, `new` nie jest potrzebne.

## Napisy String

`String` to typ **referencyjny** (klasa), a nie prosty, ale używa się go bardzo łatwo:

```java
String name = "Iwan";
int age = 33;
String result = "Cześć, \"" + name + "\"!\nMasz " + age + " lata.";
System.out.println(result);
```

Wynik:

```text
Cześć, "Iwan"!
Masz 33 lata.
```

| Znak specjalny | Znaczenie |
|---|---|
| `\n` | nowa linia |
| `\t` | tabulator |
| `\"` | cudzysłów wewnątrz napisu |
| `\'` | apostrof (w `char`) |
| `\\` | ukośnik wsteczny |

## Zadanie: miesiące po przecinku

```java
String result = "";
for (int i = 0; i < namesOfMonths.length; i++) {
    result += namesOfMonths[i];
    if (i == namesOfMonths.length - 1) {
        result += ".";
    } else {
        result += ", ";
    }
}
System.out.println(result);   // Styczeń, Luty, …, Grudzień.
```

:::tip "Krócej"
```java
String result = String.join(", ", namesOfMonths) + ".";
```
`String.join` skleja elementy separatorem. Przy sklejaniu wielu napisów w pętli używaj `StringBuilder` — `+=` za każdym razem tworzy nowy napis (patrz niżej).
:::

## Instrukcja switch

Gdy jedną zmienną porównuje się z wieloma wartościami, łańcuch `if-else` staje się nieporęczny. Klasyczny `switch`:

```java
int numberOfMonth = 5;
switch (numberOfMonth) {
    case 1:
        System.out.println("Styczeń");
        break;
    case 2:
        System.out.println("Luty");
        break;
    // …
    case 5:
        System.out.println("Maj");
        break;
    default:
        System.out.println("Taki miesiąc nie istnieje");
        break;
}
```

:::warning "Przechodzenie (fall-through)"
Jeśli zapomnisz o `break`, wykonanie „przechodzi” do kolejnych `case` bez sprawdzania warunków: przy `numberOfMonth = 1` bez `break` wypiszą się styczeń, luty, marzec… aż do pierwszego `break`. Czasem robi się to celowo — by zgrupować kilka wartości (jak w zadaniu domowym).
:::

```java
switch (month) {
    case "Grudzień":
    case "Styczeń":
    case "Luty":
        System.out.println("Zima");
        break;
    // …
}
```

`switch` działa z `int`, `char`, `byte`, `short`, ich klasami opakowującymi, `String` (od Javy 7) i `enum`.

:::outdated "Nowy switch (Java 14+)"
Nowoczesny kod Javy używa **switcha ze strzałkami** — bez `break` i bez przechodzenia, z kilkoma wartościami po przecinku. A **wyrażenie switch** od razu zwraca wartość:

```java
String season = switch (month) {
    case "Grudzień", "Styczeń", "Luty"        -> "Zima";
    case "Marzec", "Kwiecień", "Maj"          -> "Wiosna";
    case "Czerwiec", "Lipiec", "Sierpień"     -> "Lato";
    case "Wrzesień", "Październik", "Listopad" -> "Jesień";
    default -> "Nieistniejąca pora roku";
};
```

Jeśli gałąź potrzebuje kilku linii kodu — blok `{ … yield wartość; }`. Od Javy 21 w `switch` można dopasowywać także **typy** (pattern matching): `case Integer i when i > 0 -> …`. Stara składnia nadal działa i występuje w kodzie legacy — trzeba znać obie.
:::

## Porównywanie napisów: == i equals

```java
String first = "Java";
String second = new String("Java");

System.out.println(first == second);         // false — różne obiekty!
System.out.println(first.equals(second));    // true — ta sama zawartość
```

- `==` dla typów referencyjnych porównuje **referencje** (czy to ten sam obiekt w pamięci).
- `equals` porównuje **zawartość**.
- **Napisy zawsze porównuj przez `equals`** (albo `equalsIgnoreCase`, by ignorować wielkość liter).

Dlaczego `==` „czasem działa”: identyczne literały napisowe Java trzyma w **puli napisów** (string pool) i używa ponownie jednego obiektu. Ale napisy z wejścia, pliku czy sklejania to nowe obiekty i `==` da `false`. Więcej w części 2 kursu, w pytaniach rekrutacyjnych.

:::tip "Ochrona przed null"
`"Zima".equals(season)` nie wysypie się nawet przy `season == null`, a `season.equals("Zima")` rzuci `NullPointerException`. Inna opcja to `Objects.equals(a, b)`.
:::

## Czego nie ma w wideo

### Napisy są niezmienne (immutable)

Każda „zmieniająca” metoda zwraca **nowy** napis, oryginał się nie zmienia:

```java
String s = "java";
s.toUpperCase();          // wynik przepadł!
s = s.toUpperCase();      // "JAVA" — trzeba przypisać
```

Dlatego sklejanie w pętli przez `+=` tworzy tysiące zbędnych obiektów. Do tego służy `StringBuilder`:

```java
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i).append(", ");
}
String result = sb.toString();
```

### Najprzydatniejsze metody String

| Metoda | Przykład | Wynik |
|---|---|---|
| `length()` | `"Java".length()` | `4` |
| `charAt(i)` | `"Java".charAt(0)` | `'J'` |
| `toUpperCase()` / `toLowerCase()` | `"Java".toUpperCase()` | `"JAVA"` |
| `contains(s)` | `"Java".contains("av")` | `true` |
| `indexOf(s)` | `"Java".indexOf("a")` | `1` |
| `substring(from, to)` | `"Java".substring(1, 3)` | `"av"` |
| `replace(a, b)` | `"Java".replace("a", "o")` | `"Jovo"` |
| `strip()` / `trim()` | `"  hi ".strip()` | `"hi"` |
| `isEmpty()` / `isBlank()` | `"  ".isBlank()` | `true` |
| `split(regex)` | `"a,b,c".split(",")` | `["a", "b", "c"]` |
| `startsWith` / `endsWith` | `"Java".endsWith("va")` | `true` |
| `repeat(n)` (Java 11) | `"ab".repeat(3)` | `"ababab"` |
| `formatted(...)` (Java 15) | `"%s=%d".formatted("x", 5)` | `"x=5"` |

### Bloki tekstowe (Java 15+)

```java
String json = """
        {
          "name": "Iwan",
          "age": 33
        }
        """;
```

Tekst wieloliniowy bez `\n` i bez escapowania cudzysłowów.

## Zadanie domowe

:::task video "Pory roku — z wideo"
Użytkownik wpisuje nazwę miesiąca. Dla „Grudzień”, „Styczeń”, „Luty” wypisz „Zima”, dla „Marzec”, „Kwiecień”, „Maj” — „Wiosna” itd. Przy błędnych danych — „Nieistniejąca pora roku”. Zrób to najpierw przez `if-else`, potem przez `switch-case`. Napisy porównuj przez `equals`. {{t j1 1:47:37}}
??? Podpowiedź
W `if` łącz warianty przez `||`: `if (month.equals("Grudzień") || month.equals("Styczeń") || month.equals("Luty"))`. W `switch` użyj przechodzenia (kilka `case` pod rząd bez `break`) — albo nowej składni `case "Grudzień", "Styczeń", "Luty" ->`.
:::

:::task easy "Liczenie samogłosek"
Policz samogłoski w napisie podanym przez użytkownika.
??? Podpowiedź
Przechodź po znakach przez `charAt(i)` i sprawdzaj `"aąeęioóuy".indexOf(Character.toLowerCase(c)) >= 0`.
:::

:::task easy "Odwróć napis"
Wypisz napis od tyłu na dwa sposoby: pętlą od ostatniego znaku do pierwszego oraz przez `new StringBuilder(s).reverse()`.
:::

:::task medium "Palindrom"
Sprawdź, czy fraza jest palindromem, ignorując wielkość liter, spacje i interpunkcję: „Kobyła ma mały bok” → tak.
??? Podpowiedź
Najpierw znormalizuj napis: `s.toLowerCase().replaceAll("[^\\p{L}]", "")` zostawi tylko litery. Potem porównaj z odwróconym albo przejdź dwoma indeksami od końców do środka.
:::

:::task medium "Dzień tygodnia przez wyrażenie switch"
Dla numeru dnia (1–7) zwróć jego nazwę **wyrażeniem switch** (`String day = switch (n) { … };`), a dla sobót i niedziel dodaj dopisek „(weekend)”.
:::

:::task hard "Szyfr Cezara"
Zaszyfruj napis, przesuwając każdą literę łacińską o `k` pozycji w alfabecie (z zawinięciem `z` → `a`), zachowując wielkość liter; pozostałe znaki zostaw bez zmian. Napisz też odszyfrowanie. Sprawdź: `"Hello, World!"` przy `k = 3` → `"Khoor, Zruog!"`.
??? Podpowiedź
Dla małej litery: `(char) ('a' + (c - 'a' + k) % 26)`. Do odszyfrowania przesunięcie `26 - k`. Wynik składaj w `StringBuilder`.
:::
