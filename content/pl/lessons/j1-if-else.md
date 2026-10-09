Do tej pory programy wykonywały się linijka po linijce. Instrukcja warunkowa `if` pozwala wykonać kod **tylko przy określonym warunku** — na przykład włączyć klimatyzację, gdy w pokoju jest gorąco.

## Znaczniki czasu wideo

- {{t j1 25:26}} — po co jest instrukcja warunkowa (przykład z klimatyzacją)
- {{t j1 25:55}} — składnia `if`
- {{t j1 26:37}} — praktyka: projekt „Temperatura”
- {{t j1 28:22}} — co się dzieje, gdy warunek jest fałszywy
- {{t j1 28:48}} — blok `else`
- {{t j1 29:32}} — `else if`: sprawdzanie kilku warunków
- {{t j1 30:34}} — końcowe `else` — „żaden warunek nie był spełniony”
- {{t j1 31:34}} — zadanie domowe

## Składnia

```java
if (warunek) {
    // wykona się, jeśli warunek jest prawdziwy (true)
} else if (innyWarunek) {
    // wykona się, jeśli pierwszy jest fałszywy, a ten prawdziwy
} else {
    // wykona się, jeśli wszystkie warunki są fałszywe
}
```

**Warunek** to wyrażenie, którego wynikiem jest `true` (prawda) lub `false` (fałsz), np. `temp > 25`. Typ logiczny `boolean` omówimy szczegółowo za dwie lekcje.

## Przykład z wideo

```java
public class Temperature {
    public static void main(String[] args) {
        int temp = 23;

        if (temp > 25) {
            System.out.println("Klimatyzacja włączona");
        } else if (temp < 22) {
            System.out.println("Klimatyzacja wyłączona");
        } else {
            System.out.println("Klimatyzacja nic nie robi");
        }
    }
}
```

| `temp` | Co jest sprawdzane | Wynik |
|---|---|---|
| 30 | `30 > 25` → true | Klimatyzacja włączona |
| 23 | `23 > 25` → false, `23 < 22` → false | Klimatyzacja nic nie robi |
| 21 | `21 > 25` → false, `21 < 22` → true | Klimatyzacja wyłączona |

Ważne: w łańcuchu `if / else if / else` wykonuje się **dokładnie jedna gałąź** — pierwsza, której warunek jest prawdziwy. Pozostałe sprawdzenia są pomijane.

## Operatory porównania

| Operator | Znaczenie |
|---|---|
| `>` / `<` | większe / mniejsze |
| `>=` / `<=` | większe lub równe / mniejsze lub równe |
| `==` | równe (dwa znaki!) |
| `!=` | różne |

## Czego nie ma w wideo

### Zawsze stawiaj nawiasy klamrowe

Jeśli w gałęzi jest jedna instrukcja, nawiasy formalnie można pominąć — ale to częste źródło błędów:

```java
if (temp > 25)
    System.out.println("Włączamy");
    System.out.println("Chłodzimy");   // wykona się ZAWSZE — wcięcie kłamie!
```

Zasada większości zespołów (i Google Java Style): **nawiasy zawsze**.

### Warunki zagnieżdżone

```java
if (temp > 25) {
    if (isNight) {
        System.out.println("Tryb cichy");
    } else {
        System.out.println("Maksymalne chłodzenie");
    }
}
```

Głębokie zagnieżdżenie źle się czyta: lepiej łączyć warunki operatorami logicznymi `&&` i `||` (lekcja o `boolean`) albo przenosić sprawdzenia do metod.

### Operator trójargumentowy

Krótka forma `if-else`, która **zwraca wartość**:

```java
String status = temp > 25 ? "gorąco" : "normalnie";
```

Czyta się: „jeśli `temp > 25`, to `"gorąco"`, w przeciwnym razie `"normalnie"`”. Używaj w prostych przypadkach, bez zagnieżdżania.

### Instrukcja switch

Gdy jedną zmienną porównuje się z wieloma wartościami, wygodniejszy jest `switch` — omówiony w lekcji [Napisy i switch](#/lessons/j1-strings-switch).

### Granice przedziałów

W zadaniu domowym łatwo pomylić się na granicach: „od 300 do 500” — włącznie z 300? 500? Zawsze rozstrzygaj to jawnie i testuj program na **wartościach granicznych**: 99, 100, 299, 300, 500, 501.

## Zadanie domowe

:::task video "Co kupić na obiad — z wideo"
W kieszeni masz pewną kwotę. Więcej niż 500 — kupujemy pizzę; od 300 do 500 — szawarmę; od 100 do 300 — hamburgera; mniej niż 100 — zupkę chińską. Program wypisuje nazwę produktu. {{t j1 31:34}}
??? Podpowiedź
Sprawdzaj od największej do najmniejszej — wtedy w każdym kolejnym `else if` wystarczy jedna granica:
```java
int money = 350;
if (money > 500) {
    System.out.println("Pizza");
} else if (money >= 300) {
    System.out.println("Szawarma");
} else if (money >= 100) {
    System.out.println("Hamburger");
} else {
    System.out.println("Zupka chińska");
}
```
:::

:::task easy "Parzysta czy nieparzysta"
Dana jest liczba. Wypisz „parzysta” lub „nieparzysta”.
??? Podpowiedź
Liczba jest parzysta, jeśli reszta z dzielenia przez 2 wynosi zero: `n % 2 == 0`. Uwaga na liczby ujemne: `-3 % 2 == -1`, więc sprawdzaj `== 0`, a nie `== 1`.
:::

:::task easy "Maksimum z trzech"
Dane są trzy liczby `a`, `b`, `c`. Wypisz największą, używając tylko `if/else`. Potem przepisz z użyciem `Math.max`.
:::

:::task medium "Ocena za punkty"
Zamień punkty 0–100 na ocenę: 90–100 — „bardzo dobry”, 75–89 — „dobry”, 50–74 — „dostateczny”, 0–49 — „niedostateczny”. Dla wartości spoza 0–100 wypisz „błędne dane”. Sprawdź wszystkie wartości graniczne.
:::

:::task hard "Równanie kwadratowe"
Dane są całkowite współczynniki `a`, `b`, `c` równania `ax² + bx + c = 0`. Wypisz liczbę pierwiastków i same pierwiastki. Uwzględnij przypadek `a == 0` (równanie staje się liniowe) oraz przypadek, gdy zarówno `a`, jak i `b` są zerem.
??? Podpowiedź
Wyróżnik `d = b*b - 4*a*c`. Jeśli `d > 0` — dwa pierwiastki `(-b ± Math.sqrt(d)) / (2.0 * a)`, jeśli `d == 0` — jeden, jeśli `d < 0` — brak pierwiastków rzeczywistych. Zwróć uwagę na `2.0` — inaczej dzielenie byłoby całkowite.
:::
