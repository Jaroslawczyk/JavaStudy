Zmienne to podstawa każdego programu. Uczymy się deklarować zmienne, przechowywać w nich liczby całkowite typu `int`, wykonywać działania i wypisywać wynik.

## Znaczniki czasu wideo

- {{t j1 12:43}} — czym jest zmienna (analogia z etui na szczoteczkę do zębów)
- {{t j1 13:12}} — deklaracja i przypisanie
- {{t j1 14:07}} — typ `int`
- {{t j1 14:50}} — praktyka: nowy projekt, klasa `IntegerManipulations`
- {{t j1 16:26}} — przypisywanie wartości, `c = a + b`
- {{t j1 17:38}} — wypisanie zmiennej z opisem (łączenie napisów)
- {{t j1 18:22}} — zmiana wartości zmiennej
- {{t j1 19:15}} — dzielenie całkowite: `10 / 3 = 3`
- {{t j1 19:56}} — reszta z dzielenia `%`
- {{t j1 20:31}} — operatory złożone `+=`, `*=`
- {{t j1 21:25}} — zadanie: ile lat, miesięcy i dni jest w 5000 dniach
- {{t j1 25:11}} — zadanie domowe

## Czym jest zmienna

**Zmienna** to nazwana komórka pamięci przechowująca wartość. Autor porównuje ją do etui na szczoteczkę: etui (zmienna) może być puste albo zawierać szczoteczkę (wartość), ale gitary do niego nie włożysz — typ jest ściśle określony.

```java
int number;        // deklaracja: typ + nazwa
number = 5;        // przypisanie
int count = 10;    // deklaracja z inicjalizacją
```

- Najpierw pisze się **typ** (`int`), potem **nazwę**, potem `;`.
- Znak `=` to **przypisanie**, a nie matematyczne „równa się”: „włóż wartość z prawej do zmiennej po lewej”.
- Zmiennej można użyć dopiero po przypisaniu jej wartości — inaczej błąd kompilacji `variable might not have been initialized`.

## Typ int i arytmetyka

`int` przechowuje liczby całkowite od ok. −2,1 mld do 2,1 mld.

```java
int a = 5;
int b = 7;
int c = a + b;
System.out.println("a + b = " + c);   // a + b = 12

c = c + 5;      // 17
c = c * 10;     // 170
```

| Operator | Działanie | Przykład | Wynik |
|---|---|---|---|
| `+` | dodawanie | `7 + 3` | `10` |
| `-` | odejmowanie | `7 - 3` | `4` |
| `*` | mnożenie | `7 * 3` | `21` |
| `/` | dzielenie (dla `int` — **całkowite**) | `10 / 3` | `3` |
| `%` | reszta z dzielenia | `10 % 3` | `1` |

:::warning "Dzielenie całkowite"
Jeśli oba argumenty są całkowite, wynik też jest całkowity, a część ułamkowa jest **odrzucana** (nie zaokrąglana!): `10 / 3 == 3`, `-7 / 2 == -3`. Aby dostać wynik ułamkowy, przynajmniej jeden argument musi być ułamkowy: `10 / 3.0 == 3.333…` (o tym w lekcji o typach zmiennoprzecinkowych).
:::

### Złożone operatory przypisania

| Pełny zapis | Skrócony |
|---|---|
| `c = c + 5` | `c += 5` |
| `c = c - 5` | `c -= 5` |
| `c = c * 10` | `c *= 10` |
| `c = c / 2` | `c /= 2` |
| `c = c % 3` | `c %= 3` |

### Łączenie napisów

Operator `+` z napisem „skleja” wartości: `"c = " + c` → `"c = 170"`. Uważaj na kolejność:

```java
int a = 5, b = 7;
System.out.println("Suma: " + a + b);    // Suma: 57  — sklejone jak napisy!
System.out.println("Suma: " + (a + b));  // Suma: 12  — nawias najpierw liczy liczbę
System.out.println(a + b + " to suma");  // 12 to suma  — od lewej: najpierw liczby
```

## Zadanie z wideo: dni → lata, miesiące, dni

```java
public class Days {
    public static void main(String[] args) {
        int days = 5000;
        int years = days / 365;
        int months = (days % 365) / 31;
        int leftDays = days - years * 365 - months * 31;

        System.out.println("Wszystkich dni: " + days);
        System.out.println("Lat: " + years);
        System.out.println("Miesięcy: " + months);
        System.out.println("Dni: " + leftDays);
    }
}
```

Wynik: 13 lat, 8 miesięcy, 7 dni. Zwróć uwagę na technikę „dzielenie + reszta”: `/` daje liczbę pełnych części, `%` — to, co zostało. Przyda się w zadaniu domowym.

:::note
To zadanie szkoleniowe: rok ma zawsze 365 dni, a miesiąc 31 dni. Do prawdziwych dat Java ma pakiet `java.time` (`Period`, `Duration`, `LocalDate`), który uwzględnia lata przestępne i różną długość miesięcy. Omawiamy go w osobnym artykule [Date and Time](#/extra/date-time).
:::

## Czego nie ma w wideo

### Zasady nazywania zmiennych

- Dozwolone: litery, cyfry, `_` i `$`; **nie można** zaczynać od cyfry: `2count` to błąd.
- Nie wolno używać słów kluczowych: `int class = 5;` to błąd.
- Styl: `lowerCamelCase` — `totalPrice`, `daysInMonth`. Nazwa powinna wyjaśniać sens: `d` jest gorsze niż `days`.

### Stałe i `final`

```java
final int DAYS_IN_YEAR = 365;
DAYS_IN_YEAR = 366;   // błąd kompilacji: zmienna final
```

`final` zabrania ponownego przypisania. „Magiczne liczby” warto przenosić do stałych o czytelnych nazwach.

### Słowo kluczowe var (Java 10+)

```java
var days = 5000;      // kompilator sam wnioskuje typ int
```

`var` to nie „typ dynamiczny”: typ ustala się raz podczas kompilacji i się nie zmienia. Wygodne przy długich typach, ale początkującym lepiej pisać `int` jawnie.

### Podkreślenia w liczbach (Java 7+)

```java
int days = 5_000;
int million = 1_000_000;
```

W wideo „5.000” to tylko sposób wymowy. W kodzie Javy kropka oddziela część **ułamkową**, a grupy cyfr rozdziela się znakiem `_`.

### Dzielenie przez zero

```java
int x = 10 / 0;   // ArithmeticException: / by zero — program się wysypie
```

### Wczytywanie z klawiatury

W wideo wartości są wpisane w kod. Aby program pytał użytkownika, używa się klasy `Scanner`:

```java
import java.util.Scanner;

public class InputDemo {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Podaj liczbę sekund: ");
        int seconds = scanner.nextInt();
        System.out.println("Podałeś: " + seconds);
    }
}
```

Od Javy 25 jeszcze prościej: `int seconds = Integer.parseInt(IO.readln("Podaj sekundy: "));`

## Zadanie domowe

:::task video "Sekundy → dni, godziny, minuty, sekundy — z wideo"
Utwórz klasę, w której podana jest liczba sekund, a program wypisuje, ile to dni, godzin, minut i sekund. {{t j1 25:11}}
??? Podpowiedź
Doba ma 86 400 sekund, godzina — 3 600, minuta — 60. Użyj techniki „dzielenie + reszta”:
```java
int total = 100000;
int days = total / 86400;
int hours = total % 86400 / 3600;
int minutes = total % 3600 / 60;
int seconds = total % 60;
```
Dla 100 000 sekund: 1 dzień, 3 godziny, 46 minut, 40 sekund.
:::

:::task easy "Prostokąt"
Zapisz długość i szerokość prostokąta w zmiennych `int` i wypisz pole oraz obwód z opisami.
:::

:::task easy "Suma cyfr"
Dana jest liczba trzycyfrowa, np. `472`. Wypisz jej cyfry osobno oraz ich sumę (4 + 7 + 2 = 13), używając tylko `/` i `%`.
??? Podpowiedź
Ostatnia cyfra to `n % 10`, środkowa — `n / 10 % 10`, pierwsza — `n / 100`.
:::

:::task medium "Zamiana wartości"
Masz `int a = 3, b = 8;`. Zamień wartości tak, aby `a == 8`, `b == 3`. Najpierw z trzecią zmienną, potem **bez** niej, tylko arytmetyką.
??? Podpowiedź
Bez trzeciej zmiennej: `a = a + b; b = a - b; a = a - b;`. Zastanów się, co się stanie przy bardzo dużych liczbach (przepełnienie to temat następnej lekcji o typach całkowitych).
:::

:::task hard "Reszta w monetach"
Klient ma dostać `n` groszy reszty (np. 289). Są monety 50, 20, 10, 5, 2, 1. Wypisz, ile monet każdego nominału wydać, aby monet było jak najmniej. Następnie dodaj wczytywanie `n` z klawiatury przez `Scanner`.
??? Podpowiedź
To algorytm „zachłanny”: najpierw jak najwięcej największych monet, resztę następnymi.
```java
int coins50 = n / 50;  n %= 50;
int coins20 = n / 20;  n %= 20;
// ...
```
Dla 289: 5×50, 1×20, 1×10, 1×5, 2×2, 0×1.
:::
