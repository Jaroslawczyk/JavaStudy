Trzy małe, ale bardzo praktyczne tematy przed wielowątkowością: klasa **`Object`** i metoda **`toString()`**, formatowanie napisów przez **`String.format`** oraz liczby losowe przez **`Math.random()`**.

## Znaczniki czasu wideo

- {{t j1 5:21:15}} — kilka małych tematów przed ostatnim tematem poziomu 1
- {{t j1 5:21:41}} — skąd bierze się tekst w rodzaju `Box@1b6d3586`
- {{t j1 5:21:53}} — wszystkie klasy dziedziczą po `Object`
- {{t j1 5:22:47}} — metoda `toString()` i jej niejawne wywołanie w `println`
- {{t j1 5:23:27}} — nadpisujemy `toString()` w `Box`
- {{t j1 5:25:29}} — sklejanie napisów przez `+` jest nieporęczne
- {{t j1 5:25:58}} — `String.format` i `%s`
- {{t j1 5:27:34}} — zadanie: kostka do gry
- {{t j1 5:27:50}} — `Math.random()` — liczba od 0 do 1
- {{t j1 5:28:58}} — rzutowanie `double` na `int` odrzuca część ułamkową
- {{t j1 5:30:22}} — wszystko w jednej linii i po co nawiasy
- {{t j1 5:32:18}} — zadanie domowe

## Object i toString()

Każda klasa w Javie (jeśli nie wskazano innego rodzica) niejawnie dziedziczy po `java.lang.Object`. Dlatego nawet pusta klasa ma metody `toString()`, `equals()`, `hashCode()`, `getClass()`…

`System.out.println(box)` niejawnie wywołuje `box.toString()`. Implementacja z `Object` zwraca `NazwaKlasy@hash` — np. `Box@1b6d3586`, co człowiekowi nic nie mówi. Nadpiszmy ją:

```java
@Override
public String toString() {
    return String.format("Szerokość: %s%nDługość: %s%nWysokość: %s", width, length, height);
}
```

```java
System.out.println(box);
// Szerokość: 10.0
// Długość: 10.0
// Wysokość: 10.0
```

<kbd>Alt+Insert</kbd> → **toString()** — IDEA sama wygeneruje metodę w formacie `Box{width=10.0, length=10.0, height=10.0}`.

## String.format

```java
String s = String.format("Cześć, %s! Masz %d lata, wzrost %.1f cm", "Iwan", 34, 166.3);
// "Cześć, Iwan! Masz 34 lata, wzrost 166,3 cm" — separator zależy od języka systemu
```

| Specyfikator | Do czego | Przykład |
|---|---|---|
| `%s` | dowolna wartość (wywoła `toString`) | `"%s"` → `Box{…}` |
| `%d` | liczba całkowita | `"%5d"` → `   42` |
| `%f`, `%.2f` | liczba ułamkowa, z 2 miejscami | `"%.2f"` → `3.14` |
| `%n` | nowa linia (właściwa dla systemu) | |
| `%,d` | separator tysięcy | `1,000,000` |
| `%-10s` | szerokość 10, do lewej | tabele |

Od Javy 15 jest krócej: `"Cześć, %s!".formatted(name)`.

:::tip "Ustawienia regionalne (Locale)"
`%.1f` wypisuje separator dziesiętny według języka systemu: w RU/PL — przecinek, w EN — kropkę. Jeśli zawsze potrzebna jest kropka (np. w JSON lub CSV): `String.format(Locale.ROOT, "%.1f", x)`.
:::

## Math.random() — kostka do gry

```java
int dice = (int) (Math.random() * 6 + 1);   // 1…6
```

Po kolei:

1. `Math.random()` — `double` z przedziału **[0; 1)** (jedynka nie wchodzi).
2. `* 6` → [0; 6).
3. `+ 1` → [1; 7).
4. `(int)` odrzuca część ułamkową → 1, 2, 3, 4, 5 lub 6.

:::warning "Nawiasy są obowiązkowe"
`(int) Math.random() * 6 + 1` zawsze daje **1**: rzutowanie dotyczy tylko `Math.random()`, a `(int) 0.73` = 0. Rzutowanie ma wysoki priorytet — weź w nawias całe wyrażenie.
:::

Ogólny wzór dla przedziału [min; max]: `(int) (Math.random() * (max - min + 1)) + min`.

## Czego nie ma w wideo

### Wygodniej niż Math.random()

```java
import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;

int a = new Random().nextInt(1, 7);                    // 1…6 (metoda z dwoma argumentami — Java 17+)
int b = ThreadLocalRandom.current().nextInt(10, 101);  // 10…100 — najlepszy wybór przy wielowątkowości
Random seeded = new Random(42);                         // ta sama sekwencja przy każdym uruchomieniu — wygodne w testach
```

Do kryptografii (hasła, tokeny) używa się wyłącznie `java.security.SecureRandom`.

### equals i hashCode

Oprócz `toString()` z `Object` najczęściej nadpisuje się `equals()` (porównanie zawartości) i `hashCode()` — zawsze **razem**, inaczej `HashSet`/`HashMap` będą działać niepoprawnie. Szczegóły w drugiej części kursu (własna implementacja `HashMap` i pytania rekrutacyjne).

### rekordy same generują toString

```java
record Point(int x, int y) { }
System.out.println(new Point(3, 4));   // Point[x=3, y=4]
```

## Zadanie domowe

:::task video "Liczba losowa — z wideo"
Napisz program, który wypisuje losową liczbę od 10 do 100 w postaci napisu „Liczba losowa: N. Spróbuj jeszcze raz”, gdzie napis jest tworzony przez `String.format`. {{t j1 5:32:18}}
??? Podpowiedź
`int n = (int) (Math.random() * 91) + 10;` — 91 wartości (od 10 do 100 włącznie). Potem `String.format("Liczba losowa: %d. Spróbuj jeszcze raz", n)`.
:::

:::task easy "toString dla własnych klas"
Nadpisz `toString()` w klasach `Man`, `Dog` i `Employee` z poprzednich lekcji. Włóż obiekty do `List` i wypisz listę jednym `System.out.println(list)` — zauważ, że `ArrayList` sama wywołuje `toString()` na elementach.
:::

:::task medium "Statystyka kostki"
Rzuć kostką 60 000 razy i policz, ile razy wypadła każda ścianka (tablica `int[7]`). Wypisz tabelę przez `printf` z procentami (`%5.2f%%`). Powinno wyjść ok. 16,67 % na każdą ściankę. Potem „zepsuj” kostkę, usuwając nawiasy, i zobacz wynik.
:::

:::task hard "Generator haseł"
Napisz metodę `String generatePassword(int length)`, która zwraca hasło z wielkich i małych liter łacińskich, cyfr i symboli `!@#$%`, przy czym w haśle **musi** być przynajmniej jeden znak z każdej grupy. Użyj `SecureRandom`. Wyjaśnij, dlaczego `Math.random()` nie nadaje się do haseł.
??? Podpowiedź
Najpierw weź po jednym losowym znaku z każdej grupy, resztę — ze wspólnego zbioru, potem przetasuj wynik (np. algorytmem Fishera–Yatesa). `Math.random()` jest przewidywalne: znając kilka wartości, można odtworzyć kolejne.
:::
