**Metody** to działania, które potrafi wykonać obiekt. Uczymy się deklarować metody, zwracać wartości przez `return`, przekazywać parametry i poznajemy słowo kluczowe `this`.

## Znaczniki czasu wideo

- {{t j1 2:00:49}} — klasy = dane + kod, który nimi zarządza
- {{t j1 2:01:09}} — ogólna postać deklaracji metody
- {{t j1 2:01:30}} — `void` — metoda nic nie zwraca
- {{t j1 2:01:50}} — `return` — zwracanie wartości
- {{t j1 2:02:06}} — metoda `showVolume` w klasie `Box`
- {{t j1 2:04:29}} — wywołanie metody przez kropkę
- {{t j1 2:05:24}} — wewnątrz klasy do pól odwołujemy się bezpośrednio
- {{t j1 2:05:56}} — metoda zwracająca objętość
- {{t j1 2:08:36}} — podsumowanie
- {{t j1 2:09:25}} — zadanie domowe 1: klasa `Dog`
- {{t j1 2:10:35}} — metody z parametrami
- {{t j1 2:13:02}} — `Math.sqrt` to też metoda z parametrem
- {{t j1 2:13:31}} — metoda `setDimens` z trzema parametrami
- {{t j1 2:14:34}} — konflikt nazw pól i parametrów
- {{t j1 2:15:13}} — słowo kluczowe `this`
- {{t j1 2:16:42}} — podpowiedź parametrów <kbd>Ctrl+P</kbd>
- {{t j1 2:17:33}} — zadanie domowe 2: klasa `Rect`

## Deklaracja metody

```text
typZwracany nazwaMetody(typ1 parametr1, typ2 parametr2) {
    ciało metody
}
```

- **Typ zwracany** — dowolny: typ prosty, `String`, twoja klasa. Jeśli metoda nic nie zwraca — `void`.
- Jeśli typ to nie `void`, metoda **musi** kończyć się `return wartość;` odpowiedniego typu.
- Bez parametrów — puste nawiasy `()`.

```java
public class Box {
    double width;
    double height;
    double length;

    void showVolume() {                       // nic nie zwraca — wypisuje
        System.out.println("Objętość: " + volume());
    }

    double volume() {                         // zwraca wartość
        return width * height * length;
    }

    void setDimens(double width, double height, double length) {
        this.width = width;                   // this.width — pole, width — parametr
        this.height = height;
        this.length = length;
    }
}
```

```java
Box box = new Box();
box.setDimens(15, 15, 15);
System.out.println(box.volume());   // 3375.0
box.showVolume();                   // Objętość: 3375.0
```

## Skąd metoda „wie”, czyja to objętość

Wewnątrz klasy do pól odwołujemy się bez kropki: `width * height * length`. Chodzi o pola **obiektu, na którym wywołano metodę**: `box1.volume()` liczy objętość `box1`, `box2.volume()` — objętość `box2`.

## Słowo kluczowe this

`this` to referencja do bieżącego obiektu. Potrzebna, gdy nazwa parametru jest taka sama jak nazwa pola:

```java
void setDimens(double width, double height, double length) {
    width = width;          // BŁĄD LOGICZNY: parametr przypisany sam sobie
    this.width = width;     // dobrze: polu obiektu — wartość parametru
}
```

Nadawanie parametrom takich samych nazw jak polom to normalna praktyka: nazwy są czytelne, a <kbd>Ctrl+P</kbd> w IDEA podpowie kolejność argumentów.

## Parametry i argumenty

- **Parametr** — zmienna w deklaracji metody: `int i` w `square(int i)`.
- **Argument** — konkretna wartość przy wywołaniu: `80` w `square(80)`.

```java
int square(int i) {
    return i * i;
}
// test.square(80) → 6400, test.square(15) → 225
```

Metody z parametrami czynią kod uniwersalnym: zamiast `square10()`, `square11()`… — jedno `square(int i)`.

## Czego nie ma w wideo

### Java przekazuje argumenty przez wartość

Do metody zawsze trafia **kopia** wartości. Dla typów prostych — kopia liczby, dla obiektów — kopia **referencji**:

```java
void reset(int x) { x = 0; }                 // na zewnątrz nic się nie zmieni
void resetBox(Box b) { b.width = 0; }        // zmieni się obiekt — referencja na niego wskazuje
void replaceBox(Box b) { b = new Box(); }    // na zewnątrz nic się nie zmieni — podmieniliśmy kopię referencji
```

To częste pytanie rekrutacyjne: „Czy Java przekazuje przez referencję, czy przez wartość?” Odpowiedź: **zawsze przez wartość** (szczegóły w artykule [Pass by Value](#/extra/pass-by-value)).

### Jak nazywać metody

- Czasownik lub fraza czasownikowa: `calculateTotal()`, `printReport()`, `isEmpty()`, `hasNext()`.
- Metody zwracające `boolean` zaczynają się od `is`/`has`/`can`.
- Jedna metoda — jedno zadanie. Jeśli w nazwie chcesz napisać „And” — podziel metodę.

### Metoda bez wypisywania jest lepsza niż z wypisywaniem

Autor przerobił `showVolume()` na `volume()`, która zwraca liczbę. To ważna zasada: metodę, która **oblicza i zwraca**, można użyć wszędzie (w innym obliczeniu, w teście, w odpowiedzi HTTP), a metodę, która **wypisuje** — tylko w konsoli.

### Wczesny return

```java
String grade(int score) {
    if (score < 0 || score > 100) {
        return "błąd";          // od razu wychodzimy — mniej zagnieżdżeń
    }
    if (score >= 90) {
        return "bardzo dobry";
    }
    return "dobry";
}
```

`return` w metodzie `void` też jest dozwolony (bez wartości) — do wcześniejszego wyjścia.

### Zmienna liczba argumentów (varargs)

```java
int sum(int... numbers) {          // wewnątrz numbers to int[]
    int total = 0;
    for (int n : numbers) total += n;
    return total;
}
// sum(1, 2), sum(1, 2, 3, 4), sum()
```

Tak działają `String.format(...)` i `printf(...)`.

## Zadanie domowe

:::task video "Pies — z wideo"
Utwórz klasę `Dog` z polami imię (`String`), rasa (`String`) i prędkość (`int`). Metody: `run()` — nic nie zwraca i wypisuje w jednej linii słowo „Biegnę” tyle razy, ile wynosi pole prędkość; `info()` — zwraca napis z imieniem, rasą i prędkością (niczego nie wypisuje). W `main` utwórz psa, zapisz wynik `info()` w zmiennej, wypisz ją i wywołaj `run()`. {{t j1 2:09:25}}
??? Podpowiedź
W `run()` użyj `System.out.print("Biegnę ")` w pętli `for`, a po pętli — `System.out.println()`. W `info()` — `return "Imię: " + name + ", rasa: " + breed + ", prędkość: " + speed;`.
:::

:::task video "Prostokąt — z wideo"
Utwórz klasę `Rect` z polami długość i szerokość oraz trzema metodami: metodą z parametrami ustawiającą długość i szerokość; metodą bez parametrów zwracającą obwód; metodą bez parametrów zwracającą pole. Pokaż działanie wszystkich metod w `main`. {{t j1 2:17:33}}
:::

:::task easy "Kalkulator rabatu"
Utwórz klasę `Product` z polami `name` i `price` oraz metodę `double priceWithDiscount(int percent)`, która zwraca cenę po rabacie. Sprawdź dla rabatów 0, 15 i 100 %.
:::

:::task medium "Konto bankowe"
Klasa `Account` z polem `balance` i metodami `deposit(double amount)`, `boolean withdraw(double amount)` (zwraca `false` i nie zmienia salda, gdy brakuje pieniędzy) oraz `double getBalance()`. Zablokuj kwoty ujemne.
??? Podpowiedź
W `withdraw` najpierw sprawdź `amount <= 0 || amount > balance` i zrób wczesny `return false`.
:::

:::task hard "Przekazywanie przez wartość w praktyce"
Napisz trzy metody z sekcji „Java przekazuje argumenty przez wartość” (`reset`, `resetBox`, `replaceBox`), wywołaj je i wypisz wartości przed i po. Następnie napisz metodę `swap(Box a, Box b)`, która próbuje zamienić dwa pudełka, i wyjaśnij, dlaczego na zewnątrz nic się nie zmienia. Jak jednak zamienić ich **wymiary**?
??? Podpowiedź
Metoda nie może zamienić zmiennych-referencji w kodzie wywołującym, ale może zamienić **zawartość** obiektów: tymczasowo zapamiętaj pola `a`, wpisz do `a` pola `b`, a do `b` — zapamiętane.
:::
