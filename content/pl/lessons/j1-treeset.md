Nowe wymaganie: samochody mają być przechowywane **posortowane** według marki, bez duplikatów. Sortowanie przy każdym dodaniu jest bardzo kosztowne. Rozwiązanie — **`TreeSet`** oparty na zrównoważonym drzewie. Omawiamy ideę drzewa, złożoność O(log n) oraz interfejsy **`Comparable`** i **`Comparator`**.

## Znaczniki czasu wideo

- {{t j1 8:39:48}} — lekcja teoretyczna: drzewa
- {{t j1 8:40:22}} — zadanie: sortowanie po marce bez duplikatów
- {{t j1 8:40:57}} — jak rośnie drzewo: mniejsze — w lewo, większe — w prawo
- {{t j1 8:41:51}} — złożoność: liczba kroków = wysokość drzewa
- {{t j1 8:42:33}} — O(log n) dla wstawiania, usuwania i wyszukiwania
- {{t j1 8:43:20}} — `TreeSet<Integer>` z liczbami losowymi
- {{t j1 8:45:02}} — elementy są posortowane i unikalne
- {{t j1 8:45:28}} — `TreeSet<Car>` → `ClassCastException`
- {{t j1 8:46:48}} — implementujemy `Comparable<Car>` i `compareTo`
- {{t j1 8:48:44}} — porównywanie napisów przez `compareTo`
- {{t j1 8:49:28}} — `Comparator` w konstruktorze `TreeSet`
- {{t j1 8:50:51}} — praktyka: sortowanie liczb malejąco
- {{t j1 8:52:45}} — podsumowanie: `TreeSet` kontra `HashSet`

## Jak zbudowane jest drzewo

```text
Dodajemy 10, 30, 25, 5, 40:

        10
       /  \
      5    30
          /  \
        25    40
```

Każdy nowy element porównujemy z węzłami, zaczynając od korzenia: mniejszy — idziemy w lewo, większy — w prawo, aż znajdziemy wolne miejsce. Aby znaleźć, dodać lub usunąć element, przechodzimy nie przez wszystkie elementy, a tylko ścieżkę od korzenia — **wysokość drzewa**.

`TreeSet` używa **drzewa czerwono-czarnego** — samo utrzymuje równowagę (wysokość nie większa niż ~2·log₂ n). Dlatego:

| Operacja `TreeSet` | Złożoność |
|---|---|
| `add`, `remove`, `contains` | **O(log n)** |

**O(log n)** jest gorsze od O(1), ale dużo lepsze od O(n): dla miliona elementów to ~20 kroków, dla miliarda — ~30.

## TreeSet w kodzie

```java
Set<Integer> numbers = new TreeSet<>();
for (int i = 0; i < 100; i++) {
    numbers.add((int) (Math.random() * 10));
}
System.out.println(numbers);   // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] — posortowane i bez powtórzeń
```

## Comparable — porządek naturalny

Aby `TreeSet` wiedział, jak sortować twoje obiekty, klasa implementuje `Comparable<T>`:

```java
public class Car implements Comparable<Car> {
    private final String brand;
    private final int number;
    // konstruktor, gettery…

    @Override
    public int compareTo(Car other) {
        return brand.compareTo(other.brand);      // < 0, 0 lub > 0
    }
}
```

Bez `Comparable` próba włożenia `Car` do `TreeSet` kończy się `ClassCastException: Car cannot be cast to Comparable`.

## Comparator — porządek zewnętrzny

Jeśli klasy nie da się zmienić albo potrzebny jest niestandardowy porządek — przekaż **komparator** do konstruktora:

```java
Set<Car> cars = new TreeSet<>(new Comparator<Car>() {
    @Override
    public int compare(Car o1, Car o2) {
        return o1.getBrand().compareTo(o2.getBrand());
    }
});

// to samo nowocześnie:
Set<Car> cars2 = new TreeSet<>(Comparator.comparing(Car::getBrand));

// liczby malejąco:
Set<Integer> desc = new TreeSet<>(Comparator.reverseOrder());
```

:::warning "TreeSet porównuje tylko przez compareTo"
`TreeSet` **nie używa `equals`**: dwa obiekty uznaje się za jednakowe, jeśli `compareTo` zwróciło 0. Jeśli porównujesz samochody tylko po marce, to `BMW nr 1` i `BMW nr 2` okażą się „duplikatami” — drugi po prostu się nie doda! W wideo każdy samochód ma inną markę (`Brand0`, `Brand1`…), więc problem jest niewidoczny, ale na prawdziwych danych ujawni się od razu. Rób porównanie pełne:

```java
Comparator.comparing(Car::getBrand).thenComparingInt(Car::getNumber)
```

Zasada: porządek `compareTo` powinien być **zgodny z `equals`**.
:::

:::tip "Nie odejmuj liczb w compare"
`return a - b;` to popularny błąd: przy dużych wartościach różnica się przepełnia (lekcja o typach całkowitych) i sortowanie się psuje. Używaj `Integer.compare(a, b)`. Do odwrotnej kolejności — `Comparator.reverseOrder()` lub `b.compareTo(a)`, a nie minus przed wynikiem.
:::

## Czego nie ma w wideo

### Możliwości NavigableSet

`TreeSet` potrafi to, czego nie ma `HashSet`:

```java
TreeSet<Integer> set = new TreeSet<>(List.of(10, 20, 30, 40, 50));
set.first();          // 10
set.last();           // 50
set.floor(35);        // 30 — największy ≤ 35
set.ceiling(35);      // 40 — najmniejszy ≥ 35
set.headSet(30);      // [10, 20]
set.tailSet(30);      // [30, 40, 50]
set.descendingSet();  // [50, 40, 30, 20, 10]
```

### Inne szczegóły

- `TreeSet` wewnątrz zbudowany jest na **`TreeMap`** (tak jak `HashSet` na `HashMap`).
- Do `TreeSet` nie można włożyć `null` — `NullPointerException` przy porównaniu.
- Zwykłą listę można posortować bez `TreeSet`: `list.sort(Comparator.comparing(Car::getBrand))` — O(n log n) jednorazowo.

## Pytania rekrutacyjne

:::interview "Z wideo"
1. **Podobieństwa i różnice TreeSet i HashSet?** — Oba implementują `Set` i nie przechowują duplikatów. `TreeSet` trzyma elementy posortowane, `HashSet` — bez kolejności.
2. **Jakie obiekty można przechowywać w TreeSet?** — Implementujące `Comparable` albo dowolne, jeśli do konstruktora przekazano `Comparator`.
3. **Złożoność operacji?** — `HashSet` średnio O(1), `TreeSet` O(log n).
4. **Co wybrać?** — Potrzebne sortowanie — `TreeSet`; niepotrzebne — `HashSet` (szybszy).
5. **Utworzyłem klasę `User` z polem `name` i dodaję obiekty do TreeSet. Jak się posortują?** — Pytanie z haczykiem: jeśli `User` nie implementuje `Comparable` i nie przekazano komparatora, program padnie z `ClassCastException`.
:::

## Zadanie domowe

:::task video "Liczby malejąco — z wideo"
Wróć do przykładu z `TreeSet<Integer>` i spraw, by liczby sortowały się malejąco: najpierw z ręczną implementacją `compare` przez `if`, potem przez `compareTo`, potem przez `Comparator.reverseOrder()`. {{t j1 8:50:51}}
:::

:::task easy "Słownik alfabetyczny"
Wczytaj tekst, podziel na słowa i wypisz unikalne słowa w kolejności alfabetycznej bez rozróżniania wielkości liter (`String.CASE_INSENSITIVE_ORDER`).
:::

:::task medium "Znajdź błąd z duplikatami"
Włóż do `TreeSet` samochody `BMW 1`, `BMW 2`, `Audi 7` z komparatorem tylko po marce i wypisz rozmiar. Napraw przez `thenComparingInt`. Następnie napisz test sprawdzający, że `compareTo` jest zgodne z `equals` dla 1000 losowych samochodów.
:::

:::task hard "Ranking graczy"
Klasa `Player(name, score)`. Przechowuj graczy w `TreeSet` posortowanym malejąco po punktach, a przy remisie — po imieniu. Zaimplementuj: top-3 graczy, wszystkich z punktami powyżej progu (`headSet`/`tailSet`) i aktualizację punktów gracza. Dlaczego nie można po prostu zmienić `score` w obiekcie, który już leży w `TreeSet`?
??? Podpowiedź
Po zmianie pola uczestniczącego w porównaniu obiekt jest „nie na swoim miejscu” w drzewie i nie znajdą go ani `contains`, ani `remove`. Poprawnie: usuń → zmień → dodaj ponownie (albo zrób `Player` niezmiennym i twórz nowy obiekt).
:::
