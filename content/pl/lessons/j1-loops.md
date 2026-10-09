**Pętla** to powtarzanie czynności, dopóki spełniony jest warunek. Zamiast tysiąca linijek `println` — trzy linijki pętli. Omawiamy `while`, `do-while`, `for`, operatory `++`/`--` oraz `break`.

## Znaczniki czasu wideo

- {{t j1 1:02:40}} — czym jest pętla
- {{t j1 1:03:34}} — inkrementacja `++` i dekrementacja `--`
- {{t j1 1:04:54}} — zadanie: wypisz liczby od 1 do 1000
- {{t j1 1:05:23}} — pętla `while`
- {{t j1 1:07:35}} — pętla nieskończona: co się stanie bez `i++`
- {{t j1 1:08:15}} — przerwanie pętli: `break`
- {{t j1 1:09:09}} — zadanie: liczby parzyste od 1000 do 0
- {{t j1 1:10:52}} — zadanie: średnia arytmetyczna liczb od 0 do 100
- {{t j1 1:14:14}} — pętla `do-while`
- {{t j1 1:16:36}} — pętla `for`
- {{t j1 1:18:11}} — zadanie: liczby od 1000 do 0 podzielne przez 3
- {{t j1 1:19:14}} — zadanie domowe

## Inkrementacja i dekrementacja

```java
int a = 10;
a = a + 1;   // 11
a += 1;      // 12
a++;         // 13 — inkrementacja: +1
a--;         // 12 — dekrementacja: −1
```

## Pętla while

```java
int i = 1;
while (i <= 1000) {
    System.out.println(i);
    i++;
}
```

Kolejność: **sprawdź warunek → jeśli true, wykonaj ciało → sprawdź ponownie**. Gdy tylko warunek stanie się `false`, pętla się kończy i program idzie dalej.

:::warning "Pętla nieskończona"
Jeśli zapomnisz o `i++`, warunek `i <= 1000` będzie prawdziwy w nieskończoność i program nigdy się nie zatrzyma. W IDEA zatrzymasz go czerwonym przyciskiem ■ Stop (<kbd>Ctrl+F2</kbd>).
:::

### break — wcześniejsze wyjście

```java
int i = 1;
while (i <= 1000) {
    if (i == 5) {
        break;          // natychmiast wyjdź z pętli
    }
    System.out.println(i);   // 1 2 3 4
    i++;
}
```

## Pętla do-while

Najpierw wykonuje ciało, potem sprawdza warunek — więc ciało wykona się **co najmniej raz**:

```java
int a = 0;
do {
    System.out.println("Cześć");   // wypisze się raz
} while (a > 0);                   // ; po while jest obowiązkowy
```

Używa się jej rzadko — np. „pytaj o dane, dopóki użytkownik nie poda poprawnej wartości”.

## Pętla for

Najlepiej pasuje, gdy **znana jest liczba powtórzeń**:

```java
for (int i = 0; i < 100; i++) {
    System.out.println(i);   // 0 … 99
}
```

W nawiasie są trzy części rozdzielone `;`:

1. **Inicjalizacja** — wykonuje się raz: `int i = 0`
2. **Warunek** — sprawdzany przed każdym krokiem: `i < 100`
3. **Aktualizacja** — wykonuje się po każdym kroku: `i++`

```java
// Liczby od 1000 do 0 podzielne przez 3
for (int i = 1000; i >= 0; i--) {
    if (i % 3 == 0) {
        System.out.println(i);
    }
}
```

Czwarty rodzaj pętli — **for-each** — omówimy w lekcji o tablicach.

## Zadanie: średnia od 0 do 100

```java
int sum = 0;
int count = 1;
while (count <= 100) {
    sum += count;
    count++;
}
float result = sum / (float) count;   // rzutowanie — inaczej dzielenie całkowite
System.out.println(result);           // 50.0
```

:::note "Subtelność w rozwiązaniu z wideo"
Liczby od 0 do 100 to **101** liczb, ich suma to 5050, a średnia 5050 / 101 = 50. Kod z wideo daje poprawny wynik, bo po pętli `count` wynosi 101. Ale wyjaśnienie „dzielimy przez 100” jest nieścisłe: gdyby zadanie dotyczyło liczb od 1 do 100, poprawna odpowiedź to 5050 / 100 = **50.5**. Zawsze sprawdzaj, ile wynosi licznik *po* pętli!
:::

## Czego nie ma w wideo

### continue — pomiń krok

```java
for (int i = 1; i <= 10; i++) {
    if (i % 2 == 0) {
        continue;            // przejdź od razu do następnej iteracji
    }
    System.out.println(i);   // 1 3 5 7 9
}
```

### Krok pętli nie musi wynosić 1

Zamiast sprawdzać resztę, często prościej od razu iść odpowiednim krokiem:

```java
for (int i = 1000; i >= 0; i -= 2) {   // tylko parzyste — bez if
    System.out.println(i);
}
```

### i++ a ++i

```java
int a = 5;
int b = a++;   // b = 5, a = 6 — postfiks: najpierw zwróć wartość, potem zwiększ
int c = ++a;   // c = 7, a = 7 — prefiks: najpierw zwiększ, potem zwróć
```

W pętli `for` nie ma różnicy. Wewnątrz wyrażeń jest — lepiej nie mieszać `++` ze złożonymi wyrażeniami.

### Zasięg licznika

Zmienna `i` zadeklarowana w `for (int i = …)` istnieje tylko wewnątrz pętli. Po pętli jej nie ma — to chroni przed przypadkowym użyciem.

### Pętle zagnieżdżone i etykiety

```java
for (int row = 1; row <= 9; row++) {
    for (int col = 1; col <= 9; col++) {
        System.out.print(row * col + "\t");
    }
    System.out.println();
}
```

Aby wyjść od razu z dwóch pętli, używa się etykiety: `outer: for (…) { for (…) { break outer; } }`. Częściej lepiej przenieść pętle do metody i zrobić `return`.

### Którą pętlę wybrać

| Sytuacja | Pętla |
|---|---|
| Znana liczba powtórzeń / przechodzenie po indeksach | `for` |
| Powtarzaj, dopóki warunek (nie wiadomo ile razy) | `while` |
| Ciało musi wykonać się co najmniej raz | `do-while` |
| Przejdź po wszystkich elementach tablicy/kolekcji | `for-each` (następna lekcja) |
| Przetwarzanie kolekcji w stylu funkcyjnym | Stream API (część 2 kursu) |

## Zadanie domowe

:::task video "Nieparzyste podzielne przez 5 — z wideo"
Wypisz wszystkie nieparzyste liczby od 100 do 1000 włącznie, które dzielą się bez reszty przez 5. {{t j1 1:19:14}}
??? Podpowiedź
Rozwiązanie „na wprost”: `for` od 100 do 1000 i warunek `i % 2 != 0 && i % 5 == 0`. Sprytniejsze: nieparzyste wielokrotności 5 kończą się na 5, więc `for (int i = 105; i <= 1000; i += 10)`.
:::

:::task easy "Tabliczka mnożenia"
Wypisz tabliczkę mnożenia przez 7: `7 x 1 = 7` … `7 x 10 = 70`.
:::

:::task easy "Suma cyfr liczby"
Dana jest dowolna dodatnia liczba całkowita (np. 98 765). Pętlą `while` policz sumę jej cyfr (35).
??? Podpowiedź
Dopóki liczba jest większa od zera: dodawaj `n % 10` do sumy i wykonuj `n /= 10`.
:::

:::task medium "Zgadnij liczbę"
Program „losuje” liczbę od 1 do 100 (`int secret = (int) (Math.random() * 100) + 1;`). Użytkownik wpisuje propozycje przez `Scanner`, a program odpowiada „więcej”, „mniej” lub „zgadłeś w N próbach”. Użyj `do-while`.
:::

:::task medium "FizzBuzz"
Wypisz liczby od 1 do 100, ale zamiast wielokrotności 3 — `Fizz`, zamiast wielokrotności 5 — `Buzz`, a zamiast wielokrotności i 3, i 5 — `FizzBuzz`. Klasyczne zadanie z rozmów rekrutacyjnych.
??? Podpowiedź
Kolejność sprawdzeń ma znaczenie: najpierw sprawdź `i % 15 == 0`.
:::

:::task hard "Liczby pierwsze"
Wypisz wszystkie liczby pierwsze od 2 do 1000 i ich liczbę (powinno być 168). Potem zoptymalizuj: sprawdzaj dzielniki tylko do `√n`, a liczb parzystych większych od 2 w ogóle nie sprawdzaj.
??? Podpowiedź
Dla każdego `n` wewnętrzna pętla szuka dzielnika `d` od 2, dopóki `d * d <= n`. Jeśli się znajdzie — liczba jest złożona, `break`. Użyj `boolean isPrime = true;` przed wewnętrzną pętlą.
:::
