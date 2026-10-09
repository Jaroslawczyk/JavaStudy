Piszemy pierwszy program: tworzymy projekt, sprawdzamy, z czego się składa, czym jest klasa i metoda `main`, i wypisujemy tekst w konsoli.

## Znaczniki czasu wideo

- {{t j1 6:05}} — tworzenie pierwszego projektu Hello World
- {{t j1 6:57}} — struktura projektu, folder `src`
- {{t j1 7:24}} — klasy i pliki `.java`, tworzenie klasy
- {{t j1 7:47}} — konwencje nazewnictwa (CamelCase)
- {{t j1 8:36}} — deklaracja klasy: `public class`
- {{t j1 9:09}} — metoda `main` — punkt wejścia
- {{t j1 10:14}} — skrót `psvm` + Tab
- {{t j1 10:51}} — wypisywanie w konsoli `System.out.println`
- {{t j1 11:36}} — uruchomienie programu
- {{t j1 11:56}} — podsumowanie lekcji
- {{t j1 12:28}} — zadanie domowe

## Struktura projektu

Po utworzeniu projektu w IntelliJ IDEA po lewej widać panel **Project**. Najważniejszy jest w nim folder **`src`** (source, źródła): tam leży cały kod Javy. W projektach Maven/Gradle ścieżka jest dłuższa: `src/main/java` na kod i `src/test/java` na testy.

Cały kod w Javie pisze się **wewnątrz klas**, a każda publiczna klasa jest w osobnym pliku z rozszerzeniem **`.java`**. Nazwa pliku musi być taka sama jak nazwa publicznej klasy: klasa `HelloWorld` → plik `HelloWorld.java`.

## Pierwszy program

```java
public class HelloWorld {

    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}
```

Po kolei:

| Fragment | Znaczenie |
|---|---|
| `public` | Modyfikator dostępu: klasa jest widoczna z każdej innej klasy (szczegóły w lekcji o modyfikatorach dostępu) |
| `class HelloWorld` | Deklaracja klasy o nazwie `HelloWorld` |
| `{ ... }` | Ciało klasy — wszystko, co do niej należy, pisze się między nawiasami klamrowymi |
| `public static void main(String[] args)` | Metoda `main` — **punkt wejścia**: od niej JVM zaczyna wykonywanie programu |
| `System.out.println("...")` | Wywołanie metody, która wypisuje wiersz w konsoli i przechodzi do nowej linii |
| `;` | Każda instrukcja kończy się średnikiem |

Na razie traktuj `public static void main(String[] args)` jak „zaklęcie” — każde słowo omówimy później: `static` w lekcji o składowych statycznych, `void` w lekcji o metodach, `String[] args` to tablica argumentów wiersza poleceń (lekcja o tablicach).

:::tip "Szybkie wpisywanie"
W IntelliJ IDEA wpisz `psvm` (lub `main`) i naciśnij <kbd>Tab</kbd> — pojawi się metoda `main`. Wpisz `sout` + <kbd>Tab</kbd> — pojawi się `System.out.println();`. Ikona ▶ obok klasy pojawia się tylko wtedy, gdy klasa ma metodę `main`.
:::

## Konwencje nazewnictwa

Kompilatorowi jest obojętne, jak nazwiesz klasę, ale wszyscy programiści Javy stosują te same zasady — cudzy kod czyta się wtedy łatwiej:

| Co | Styl | Przykład |
|---|---|---|
| Klasy, interfejsy, rekordy, enumy | **UpperCamelCase** (PascalCase) | `HelloWorld`, `BankAccount` |
| Metody i zmienne | **lowerCamelCase** | `main`, `printReport`, `userName` |
| Stałe | **UPPER_SNAKE_CASE** | `MAX_SIZE`, `DEFAULT_TIMEOUT` |
| Pakiety | małe litery, oddzielone kropką | `com.example.shop` |

Java **rozróżnia wielkość liter**: `System` i `system` to różne słowa, a drugie się nie skompiluje.

## Czego nie ma w wideo

### print, println i printf

```java
System.out.print("Bez nowej linii. ");
System.out.println("Z nową linią.");
System.out.printf("Imię: %s, wiek: %d%n", "Anna", 25);   // wypisywanie sformatowane
System.out.println("Linia 1\nLinia 2\tz tabulatorem i \"cudzysłowem\"");
```

- `print` wypisuje bez przejścia do nowej linii, `println` — z przejściem.
- `printf` formatuje: `%s` — napis, `%d` — liczba całkowita, `%.2f` — liczba z 2 miejscami po przecinku, `%n` — nowa linia.
- Sekwencje ucieczki: `\n` — nowa linia, `\t` — tabulator, `\"` — cudzysłów, `\\` — ukośnik wsteczny.

### Komentarze

```java
// komentarz jednoliniowy

/* komentarz
   wieloliniowy */

/**
 * Komentarz Javadoc: generuje się z niego dokumentację.
 */
```

### Typowe błędy początkujących

- Brak `;` → `';' expected`.
- Nazwa pliku inna niż nazwa publicznej klasy → `class X is public, should be declared in a file named X.java`.
- `system.out.println` małą literą → `package system does not exist`.
- Napis w apostrofach `'Hello'` — tak zapisuje się tylko znaki (`char`), napisy — w cudzysłowie.

:::outdated "Kreator nowego projektu"
W nowych wersjach IDEA kreator *New Project* od razu pyta o **Build system** (IntelliJ / Maven / Gradle) i JDK, a pole **Add sample code** samo tworzy klasę `Main` z metodą `main`. Do nauki wystarczy *IntelliJ*; w prawdziwych projektach wybiera się Maven lub Gradle. Okno „Tip of the Day” domyślnie już się nie wyświetla.
:::

:::outdated "Od Javy 25 klasa i public static nie są obowiązkowe"
Od **Javy 25** (JEP 512 „Compact Source Files and Instance Main Methods”) prosty program można napisać bez deklarowania klasy i bez `public static`:

```java
void main() {
    IO.println("Hello World");
}
```

Klasa `java.lang.IO` (Java 25) zawiera proste metody `IO.println(...)`, `IO.print(...)` i `IO.readln(...)` do wejścia-wyjścia. To ułatwienie do nauki i skryptów. W prawdziwych projektach nadal pisze się klasy i `public static void main(String[] args)` — dlatego koniecznie znaj klasyczną formę.
:::

## Zadanie domowe

:::task video "Członkowie rodziny — z wideo"
Utwórz nową klasę Javy, która wypisuje imiona członków twojej rodziny, każde w nowej linii. {{t j1 12:28}}
??? Podpowiedź
Wywołaj `System.out.println("...")` kilka razy — raz na każde imię.
:::

:::task easy "Wizytówka"
Wypisz „wizytówkę” w ramce ze znaków `*`: imię, miasto, ulubiony język programowania. Ramka musi być równa.
??? Podpowiedź
```text
***********************
*  Anna               *
*  Warszawa           *
*  Java               *
***********************
```
:::

:::task easy "Jedną instrukcją"
Wypisz te same imiona **jednym** wywołaniem `System.out.println`, używając `\n`. A potem — używając `print` zamiast `println`.
:::

:::task medium "Tabela przez printf"
Za pomocą `printf` wypisz tabelę trzech produktów z równymi kolumnami: nazwa (szerokość 10), ilość (szerokość 5), cena z dwoma miejscami po przecinku.
??? Podpowiedź
Szerokość podaje się liczbą w specyfikatorze: `%-10s` — napis o szerokości 10 wyrównany do lewej; `%5d` — liczba całkowita o szerokości 5; `%8.2f` — liczba o szerokości 8 z dwoma miejscami.
```java
System.out.printf("%-10s %5d %8.2f%n", "Kawa", 2, 15.5);
```
:::

:::task hard "Argumenty wiersza poleceń"
Napisz program, który wypisuje `Cześć, <imię>!`, gdzie imię przekazuje się przy uruchomieniu: `java Greeter.java Anna`. Jeśli argumentu nie podano, wypisz `Cześć, świecie!`. Skonfiguruj przekazanie argumentu także w IDEA (*Run → Edit Configurations → Program arguments*).
??? Podpowiedź
Argumenty trafiają do tablicy `args`: pierwszy to `args[0]`, liczba — `args.length`. Instrukcję `if` omówimy za kilka lekcji, ale tu potrzebna jest w najprostszej postaci:
```java
if (args.length > 0) {
    System.out.println("Cześć, " + args[0] + "!");
} else {
    System.out.println("Cześć, świecie!");
}
```
:::
