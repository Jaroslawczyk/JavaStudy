Zaczynamy **programowanie obiektowe (OOP)** — główną ideę Javy. Wyjaśniamy, czym klasa różni się od obiektu, tworzymy własną klasę `Box` z polami i rozumiemy, czym są zmienne referencyjne.

## Znaczniki czasu wideo

- {{t j1 1:49:19}} — czym jest OOP
- {{t j1 1:49:42}} — klasa i obiekt: przykład z psem
- {{t j1 1:50:49}} — pola i metody — składowe klasy
- {{t j1 1:51:05}} — składnia deklaracji klasy
- {{t j1 1:51:51}} — metoda `main` w klasie nie jest obowiązkowa
- {{t j1 1:52:00}} — praktyka: projekt OOP, klasa `Main`
- {{t j1 1:52:27}} — klasa `Box` z polami szerokość, wysokość, długość
- {{t j1 1:53:25}} — zmienna na obiekt
- {{t j1 1:54:03}} — tworzenie obiektu: `new Box()`
- {{t j1 1:54:40}} — dostęp do pól przez kropkę
- {{t j1 1:55:59}} — każdy obiekt ma własne kopie pól
- {{t j1 1:57:42}} — formatowanie kodu <kbd>Ctrl+Alt+L</kbd>
- {{t j1 1:59:11}} — dlaczego te zmienne nazywa się referencyjnymi
- {{t j1 1:59:22}} — dwie zmienne — jeden obiekt
- {{t j1 2:00:23}} — zadanie domowe

## Klasa i obiekt

**Klasa** to szablon, plan: opis tego, jakie właściwości i zachowanie mają obiekty. **Obiekt** (instancja klasy) to konkretna rzecz zbudowana według tego planu.

> „Pies to zwierzę z czterema łapami, ogonem i sierścią, które szczeka” — to **klasa**.
> Burek z twojego podwórka — czarny, niewielki, o imieniu Burek — to **obiekt**.

Klasa składa się ze **składowych**:

- **pól** (zmiennych instancji) — dane: długość, imię, wiek;
- **metod** — działania: policz objętość, zaszczekaj (następna lekcja).

```java
public class Box {
    double width;
    double height;
    double length;
}
```

## Tworzenie obiektów

```java
public class Main {
    public static void main(String[] args) {
        Box myBox = new Box();      // utwórz obiekt i zapisz referencję do niego
        myBox.height = 10.2;        // dostęp do pól — przez kropkę
        myBox.length = 15;
        myBox.width = 11.3;

        double volume = myBox.height * myBox.width * myBox.length;
        System.out.println("Objętość pudełka: " + volume);   // 1728.9…
    }
}
```

- `Box myBox` — deklaracja zmiennej typu `Box` (na razie pustej).
- `new Box()` — utworzenie nowego obiektu w pamięci. `new` zawsze oznacza „utwórz nowy”.
- Każdy obiekt przechowuje **własne kopie pól**: zmiana wymiarów `box2` nie wpływa na `box3`.

:::note "Jedna klasa publiczna — jeden plik"
Klasa `Box` jest w pliku `Box.java`, a `Main` — w `Main.java`. Klasy bez `main` nie da się „uruchomić” — jej obiekty tworzy się i używa w innych klasach.
:::

## Zmienne referencyjne

Zmienne `myBox`, `box2`, `box3` przechowują nie same obiekty, lecz **referencje** (adresy) do nich:

```java
Box box3 = new Box();
box3.height = 10; box3.width = 10; box3.length = 10;

Box box4 = box3;        // TO NIE nowe pudełko: druga referencja do tego samego obiektu
box4.height = 100;

System.out.println(box3.height);   // 100 — box3 też się zmienił!
```

```text
box3 ──┐
       ├──►  [ Box: height=100, width=10, length=10 ]
box4 ──┘
```

Ważne konsekwencje:

- `box3 == box4` porównuje **referencje** — `true`, to jeden obiekt. Dwa różne pudełka o tych samych wymiarach przez `==` nie będą równe (przypomnij sobie napisy i `equals`).
- Typy proste (`int`, `double`…) przechowują **wartość**, a `int b = a;` to kopia.

## Czego nie ma w wideo

### Gdzie żyją obiekty: stos i sterta

- **Stos (stack)** — zmienne lokalne metod: typy proste i *referencje*. Czyszczony automatycznie po wyjściu z metody.
- **Sterta (heap)** — wszystkie obiekty utworzone przez `new`.
- **Garbage Collector** sam usuwa obiekty ze sterty, gdy nie zostanie do nich żadna referencja. W Javie nie zwalnia się pamięci ręcznie jak w C/C++.

### null i NullPointerException

```java
Box box = null;          // zmienna na nic nie wskazuje
box.height = 5;          // NullPointerException!
```

`null` to „pusta referencja”. Odwołanie do pola lub metody przez `null` to najczęstszy błąd w Javie. Od Javy 14 komunikat jest szczegółowy: `Cannot assign field "height" because "box" is null`.

### Domyślne wartości pól

Pola obiektu, w odróżnieniu od zmiennych lokalnych, dostają wartości domyślne: liczby — `0`, `boolean` — `false`, referencje — `null`. Dlatego `new Box()` tworzy pudełko o wymiarach `0.0`.

### Cztery zasady OOP

Pytają o nie prawie na każdej rozmowie — oto krótka ściąga; każda zasada jest szczegółowo omówiona w kolejnych lekcjach:

| Zasada | Istota |
|---|---|
| **Enkapsulacja (hermetyzacja)** | Dane i metody razem w klasie, szczegóły implementacji ukryte (`private`) |
| **Dziedziczenie** | Nowa klasa rozszerza istniejącą (`extends`) i używa ponownie jej kodu |
| **Polimorfizm** | Jeden interfejs — różne implementacje; obiekt podklasy używany tam, gdzie oczekiwany jest rodzic |
| **Abstrakcja** | Wydobywamy to, co istotne, ukrywamy resztę (klasy abstrakcyjne, interfejsy) |

:::outdated "Klasy danych dziś — record"
Do klas, które tylko przechowują dane (jak `Box` czy `Person` z zadania), od Javy 16 jest **record** — zwarta forma, w której konstruktor, metody dostępowe, `equals`, `hashCode` i `toString` generują się automatycznie:

```java
public record Person(String name, int age, double weight) { }
```

Ale najpierw koniecznie zrozum zwykłe klasy — rekordy omawiamy w artykule [Records](#/extra/records).
:::

## Zadanie domowe

:::task video "Średni wiek — z wideo"
Utwórz klasę `Person` z polami imię, wiek i waga. W `main` utwórz pięć zmiennych typu `Person`, wypełnij ich pola i wypisz średni wiek. {{t j1 2:00:23}}
??? Podpowiedź
Średni wiek to suma wieku podzielona przez 5. Aby dostać wynik ułamkowy, dziel przez `5.0`. Jeszcze wygodniej włożyć osoby do tablicy `Person[] people = {p1, p2, p3, p4, p5};` i policzyć sumę pętlą for-each.
:::

:::task easy "Książka"
Utwórz klasę `Book` z polami `title`, `author`, `year`, `pages`. Utwórz dwie książki i wypisz informacje w formacie „Autor — „Tytuł” (rok), N str.”.
:::

:::task medium "Referencje i kopie"
Utwórz `Box a = new Box();` o wymiarach 1×2×3, potem `Box b = a;` i `Box c = new Box();` o tych samych wymiarach. Wypisz `a == b`, `a == c`. Zmień `b.width` i wypisz `a.width`. Wyjaśnij każdy wynik i narysuj schemat referencji.
:::

:::task medium "Najstarszy"
Utwórz tablicę pięciu obiektów `Person` i znajdź najstarszą oraz najlżejszą osobę. Wypisz ich imiona.
??? Podpowiedź
Przechowuj nie wiek, lecz **referencję** do znalezionej osoby: `Person oldest = people[0];` i w pętli `if (p.age > oldest.age) oldest = p;`.
:::

:::task hard "Punkty na płaszczyźnie"
Utwórz klasę `Point` z polami `x` i `y` (`double`). Utwórz tablicę 5 punktów, znajdź parę punktów o największej odległości (odległość to `Math.hypot(x2 - x1, y2 - y1)`) i wypisz ich współrzędne oraz odległość.
??? Podpowiedź
Przejdź po wszystkich parach dwiema zagnieżdżonymi pętlami: `for (int i = 0; i < n; i++) for (int j = i + 1; j < n; j++)`.
:::
