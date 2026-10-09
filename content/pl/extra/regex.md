**Wyrażenia regularne** to język wzorców do wyszukiwania, sprawdzania i zamiany tekstu: walidacja e-maili, parsowanie logów, wyciąganie liczb z napisu. W Javie mieszkają w pakiecie `java.util.regex` i są używane także przez `String.matches`, `split`, `replaceAll`.

## Podstawy składni

| Wzorzec | Znaczenie |
|---|---|
| `.` | dowolny znak (poza nową linią) |
| `\d`, `\w`, `\s` | cyfra, „litera/cyfra/_”, biały znak |
| `\D`, `\W`, `\S` | wszystko oprócz powyższych |
| `[abc]`, `[a-z]`, `[^0-9]` | zbiór znaków, zakres, negacja |
| `^`, `$` | początek i koniec napisu |
| `*`, `+`, `?` | 0+, 1+, 0 lub 1 raz |
| `{3}`, `{2,5}` | dokładnie 3, od 2 do 5 razy |
| `(…)`, `(?<name>…)` | grupa, grupa nazwana |
| `a\|b` | lub |
| `\b` | granica słowa |

:::warning "Podwójny ukośnik wsteczny"
W literale napisowym Javy ukośnik wsteczny trzeba poprzedzić drugim: wzorzec `\d+` pisze się jako `"\\d+"`, kropkę — `"\\."`. W blokach tekstowych (`"""`) reguła jest ta sama.
:::

## Pattern i Matcher

```java
private static final Pattern PHONE = Pattern.compile("\\+48\\s?(\\d{3})[\\s-]?(\\d{3})[\\s-]?(\\d{3})");

Matcher m = PHONE.matcher("Dzwoń: +48 501-234 567 albo +48501234568");
while (m.find()) {
    System.out.println(m.group() + " → " + m.group(1) + m.group(2) + m.group(3));
}

boolean ok = PHONE.matcher(input).matches();       // czy cały napis pasuje?
```

- `Pattern.compile` jest kosztowne — kompiluj wzorzec **raz** do `static final`, a nie w pętli. `String.matches(regex)` kompiluje za każdym razem od nowa.
- `matches()` — cały napis, `find()` — następne wystąpienie, `lookingAt()` — początek napisu.

## Grupy nazwane i zamiana

```java
Pattern DATE = Pattern.compile("(?<day>\\d{2})\\.(?<month>\\d{2})\\.(?<year>\\d{4})");
Matcher m = DATE.matcher("09.10.2026");
if (m.matches()) {
    int year = Integer.parseInt(m.group("year"));
}

"09.10.2026".replaceAll("(\\d{2})\\.(\\d{2})\\.(\\d{4})", "$3-$2-$1");   // 2026-10-09
"a1b22c333".replaceAll("\\d+", "#");                                      // a#b#c#
DATE.matcher(text).replaceAll(r -> r.group("year"));                      // Java 9: funkcja zamiany
DATE.matcher(text).results().map(MatchResult::group).toList();            // Java 9: strumień dopasowań
```

## Flagi

```java
Pattern.compile("hello", Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE);
Pattern.compile("(?i)cześć");                   // flaga wewnątrz wzorca
Pattern.compile("^\\s*#.*$", Pattern.MULTILINE); // ^ i $ dla każdej linii
```

:::warning "ReDoS: katastrofalne nawroty"
Wzorce z zagnieżdżonymi kwantyfikatorami, jak `(a+)+$` czy `(\\w+\\s?)*$`, na specjalnie dobranym napisie działają wykładniczo długo — serwer „zawiesza się” na jednym żądaniu. Nie stosuj złożonych wyrażeń do danych użytkownika bez limitu długości; używaj kwantyfikatorów zaborczych (`a++`) i grup atomowych (`(?>…)`), a do e-maili/URL — gotowych walidatorów.
:::

:::tip "Kiedy regex nie jest potrzebny"
Do prostych zadań wystarczy `String`: `startsWith`, `contains`, `strip`, `isBlank`, `chars()`. Do parsowania JSON, HTML, CSV używaj parserów (Jackson, jsoup, Commons CSV), a nie wyrażeń regularnych.
:::

## Zadanie domowe

:::task easy "Wyciągnij liczby"
Z napisu `"Zamówienie 15: 3 szt. po 12.50 zł, rabat 10%"` wyciągnij wszystkie liczby (także ułamkowe) do `List<Double>` za pomocą `Matcher.results()`.
:::

:::task medium "Parsowanie logu"
Linie logu mają postać `2026-10-09 14:05:33 ERROR [OrderService] Payment failed: id=42`. Grupami nazwanymi wyciągnij datę, czas, poziom, komponent i komunikat. Policz liczbę wpisów według poziomów (`groupingBy`) dla pliku z 1000 linii.
:::

:::task hard "Walidator hasła i ReDoS"
Napisz sprawdzanie hasła (8–64 znaki, co najmniej jedna wielka litera, jedna mała, cyfra i znak specjalny) jednym wyrażeniem regularnym z lookahead (`(?=…)`) oraz alternatywną implementację bez regex. Następnie znajdź w internecie przykład wzorca podatnego na ReDoS, zmierz czas na napisach długości 20, 25, 30 i napraw go.
:::
