Pozostałe typy proste: zmiennoprzecinkowe `float` i `double`, znakowy `char` i logiczny `boolean`. Do tego operacje porównania i operatory logiczne `&&`, `||`, `!`.

## Znaczniki czasu wideo

- {{t j1 43:55}} — liczby zmiennoprzecinkowe: `float` i `double`
- {{t j1 44:45}} — zadanie: pole koła z promienia
- {{t j1 46:50}} — przyrostek `f` dla `float`
- {{t j1 47:32}} — zadanie domowe: przeciwprostokątna z twierdzenia Pitagorasa
- {{t j1 47:48}} — pierwiastek kwadratowy `Math.sqrt`
- {{t j1 49:09}} — typ `char` i tablica znaków
- {{t j1 50:03}} — dwa sposoby ustawienia `char`: kod i znak w apostrofach
- {{t j1 51:34}} — arytmetyka na `char`
- {{t j1 51:58}} — typ `boolean`
- {{t j1 53:19}} — zmienna `boolean` w warunku `if`
- {{t j1 54:16}} — negacja `!`
- {{t j1 54:51}} — sześć operatorów porównania, błąd `=` zamiast `==`
- {{t j1 55:56}} — operatory logiczne `||` (LUB) i `&&` (I)
- {{t j1 58:36}} — wspólne zadanie: spać, spacerować czy czytać (bez `else`)
- {{t j1 59:38}} — omówienie rozwiązania

## float i double

| Typ | Rozmiar | Precyzja | Literał |
|---|---|---|---|
| `float` | 4 bajty | ~7 cyfr znaczących | `3.14f` (przyrostek `f` obowiązkowy) |
| `double` | 8 bajtów | ~15–16 cyfr znaczących | `3.14` (domyślnie wszystkie literały ułamkowe to `double`) |

Separatorem części całkowitej i ułamkowej w kodzie jest **kropka**, nie przecinek.

```java
double r = 10.8;
double pi = 3.14;
double s = pi * r * r;
System.out.println("Pole koła = " + s);   // 366.2496...
```

:::outdated "float czy double?"
W wideo pada rada: „jeśli potrzebna jest dokładność do 1–2 miejsc — używaj `float`”. Dziś przyjęta praktyka jest inna: **domyślnie zawsze `double`**. Oszczędność 4 bajtów prawie nigdy nie ma znaczenia, a precyzję `float` łatwo „zjeść” już w prostych obliczeniach. `float` używa się w grafice, grach i ogromnych tablicach liczb (uczenie maszynowe).
:::

:::tip "Używaj Math.PI"
Zamiast `3.14` pisz `Math.PI` (3.141592653589793): dokładniej i czytelniej.
:::

### Dlaczego 0.1 + 0.2 ≠ 0.3

```java
System.out.println(0.1 + 0.2);         // 0.30000000000000004
System.out.println(0.1 + 0.2 == 0.3);  // false
```

Liczby ułamkowe przechowuje się w postaci **dwójkowej** (standard IEEE 754), a 0.1 w systemie dwójkowym to ułamek nieskończony, jak 1/3 w dziesiętnym. Stąd zasady:

- **Nigdy nie przechowuj pieniędzy w `double`/`float`** — używaj `BigDecimal` albo liczb całkowitych w groszach (`long`).
- Liczb ułamkowych nie porównuje się przez `==`; porównuje się z tolerancją: `Math.abs(a - b) < 1e-9`.

### Dzielenie przez zero dla ułamków

```java
System.out.println(10.0 / 0);    // Infinity
System.out.println(0.0 / 0);     // NaN (Not a Number)
```

W odróżnieniu od `int` wyjątku nie ma.

## char — znak

`char` przechowuje **jeden znak** w apostrofach. W środku to liczba — kod znaku w tablicy **Unicode** (UTF-16), dlatego `char` formalnie jest typem całkowitym (0 … 65 535).

```java
char ch1 = 89;      // kod znaku 'Y'
char ch2 = 'Y';     // sam znak
System.out.println(ch1 + " " + ch2);   // Y Y
ch1 += 1;
System.out.println(ch1);               // Z
```

:::note "ASCII i Unicode"
W wideo mowa o tablicy ASCII. Dokładniej: Java używa **Unicode**, a pierwsze 128 kodów Unicode pokrywa się z ASCII (litery łacińskie, cyfry, znaki). Cyrylica i polskie litery też tam są: `'Ж'` = 1046, `'ł'` = 322. Emoji nie mieszczą się w jednym `char` — potrzebna jest para `char` (para zastępcza, surrogate pair).
:::

Przydatne metody klasy `Character`: `Character.isDigit(c)`, `Character.isLetter(c)`, `Character.toUpperCase(c)`.

## boolean — typ logiczny

`boolean` przechowuje tylko `true` lub `false`. Właśnie tę wartość zwracają operacje porównania:

```java
int temp = 26;
boolean isHot = temp > 25;   // true

if (isHot) {
    System.out.println("Klimatyzacja włączona");
}
if (!isHot) {                // ! — „NIE”
    System.out.println("Klimatyzacja wyłączona");
}
```

### Operatory porównania

`<`, `<=`, `>`, `>=`, `==` (równe), `!=` (różne).

:::warning "= i =="
`=` to przypisanie, `==` to porównanie. `if (temp = 25)` to błąd kompilacji (w Javie, inaczej niż w C, to się nie skompiluje: wynik jest typu `int`, a nie `boolean`). Ale `if (isHot = true)` się skompiluje i zawsze będzie prawdziwe — niebezpieczna literówka. Dlatego `boolean` sprawdza się po prostu `if (isHot)`, bez `== true`.
:::

### Operatory logiczne

| Operator | Nazwa | `true`, gdy… |
|---|---|---|
| `&&` | I (AND) | oba warunki są prawdziwe |
| `\|\|` | LUB (OR) | przynajmniej jeden jest prawdziwy |
| `!` | NIE (NOT) | warunek jest fałszywy |
| `^` | alternatywa wykluczająca (XOR) | dokładnie jeden jest prawdziwy |

```java
int time = 24;
boolean late = time >= 23;
if (!isHot || late) {
    System.out.println("Klimatyzacja wyłączona");
}
```

## Zadanie „spać, spacerować czy czytać”

Bez `else`, każdy warunek w osobnej zmiennej:

```java
int time = 19;
boolean isGoodWeather = true;
boolean late = time >= 23 || time <= 5;

if (late) {
    System.out.println("Spać");
}
if (!late && isGoodWeather) {
    System.out.println("Spacerować");
}
if (!late && !isGoodWeather) {
    System.out.println("Czytać książkę");
}
```

## Czego nie ma w wideo

### Skrócone obliczanie (short-circuit)

`&&` i `||` obliczają prawą stronę **tylko wtedy, gdy trzeba**: w `a && b` przy `a == false` wyrażenie `b` nie jest sprawdzane. Dzięki temu można pisać bezpiecznie: `if (count != 0 && sum / count > 10)` — dzielenia przez zero nie będzie. Operatory `&` i `|` dla `boolean` zawsze obliczają obie strony — używa się ich rzadko.

### Priorytet operatorów

`!` → arytmetyka → porównania → `==`/`!=` → `&&` → `||` → `?:` → przypisania. W razie wątpliwości stawiaj nawiasy: `(a && b) || c` czyta się jednoznacznie.

### Zamiana ułamków na liczby całkowite

```java
double d = 9.99;
int i = (int) d;                 // 9 — część ułamkowa odrzucona
long rounded = Math.round(d);    // 10 — zaokrąglenie matematyczne
double f = Math.floor(-2.5);     // -3.0 — w dół
double c = Math.ceil(2.1);       // 3.0 — w górę
```

### Przydatne metody Math

`Math.sqrt`, `Math.pow(2, 10)`, `Math.abs`, `Math.max/min`, `Math.round`, `Math.hypot(a, b)` — przeciwprostokątna jedną funkcją (ale zadanie domowe najpierw zrób przez `sqrt`!).

## Zadanie domowe

:::task video "Przeciwprostokątna — z wideo"
Dane są przyprostokątne `a` i `b` trójkąta prostokątnego. Wypisz przeciwprostokątną `c` z twierdzenia Pitagorasa: c = √(a² + b²). {{t j1 47:32}}
??? Podpowiedź
```java
double a = 3, b = 4;
double c = Math.sqrt(a * a + b * b);   // 5.0
```
:::

:::task easy "Celsjusz → Fahrenheit"
Przelicz temperaturę ze stopni Celsjusza na Fahrenheita: F = C × 9/5 + 32. Sprawdź dla 36.6 °C (powinno wyjść 97.88). Dlaczego `c * 9 / 5` i `9 / 5 * c` dają różne wyniki, gdy `c` jest typu `int`?
:::

:::task easy "Kody liter"
Wypisz kody znaków `'A'`, `'Z'`, `'a'`, `'0'`, `'Ж'`, `'ł'` oraz znak następujący po `'A'`, używając arytmetyki na `char`.
??? Podpowiedź
Aby zobaczyć kod, rzutuj na `int`: `(int) 'A'` → 65. Aby dostać następny znak: `(char) ('A' + 1)` → `B`.
:::

:::task medium "Rok przestępny"
Zapisz **jednym** wyrażeniem logicznym w zmiennej `boolean isLeap` warunek roku przestępnego: podzielny przez 4, ale nie przez 100, albo podzielny przez 400. Sprawdź dla 1900 (nie), 2000 (tak), 2024 (tak), 2026 (nie).
??? Podpowiedź
`boolean isLeap = (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;`
:::

:::task hard "Czy trójkąt istnieje"
Dane są trzy boki (`double`). Za pomocą osobnych zmiennych `boolean` ustal: czy trójkąt istnieje (każdy bok jest mniejszy od sumy dwóch pozostałych), czy jest równoboczny, równoramienny, prostokątny. Przy sprawdzaniu kąta prostego uwzględnij niedokładność `double`.
??? Podpowiedź
Prostokątny: `Math.abs(a*a + b*b - c*c) < 1e-9` dla najdłuższego boku `c`. Najpierw znajdź najdłuższy bok przez `Math.max`.
:::
