Czasem „dowolny typ” to za dużo. Żeby policzyć średnią, potrzebny jest typ, który **potrafi być liczbą**. W tym celu parametry typów ogranicza się od góry (`T extends Number`), a w parametrach metod używa się maski **wildcard** `?`. Omówimy też główną pułapkę generyków: dlaczego `List<Integer>` to **nie** `List<Number>`.

## Znaczniki czasu wideo

- {{t j2 30:08}} — `Box<T>` z tablicą i metodą `avg()`
- {{t j2 33:13}} — potrzebne `doubleValue()`, a `T` go nie ma
- {{t j2 34:44}} — ograniczenie od góry: `T extends Number`
- {{t j2 35:37}} — kilka ograniczeń: `T extends Number & Comparable<T>`
- {{t j2 37:00}} — porównujemy dwa pudełka po średniej
- {{t j2 39:01}} — `Box<Integer>` nie przyjmie `Box<Double>`: wildcard `Box<?>`
- {{t j2 39:26}} — `Box<? extends Number>`
- {{t j2 40:08}} — `List<Number>` vs `List<? extends Number>`: inwariancja
- {{t j2 43:20}} — podsumowanie lekcji

## Ograniczenie od góry: `T extends Number`

```java
public class Box<T extends Number> {
    private final T[] array;

    @SafeVarargs
    public Box(T... array) { this.array = array; }

    public double avg() {
        double sum = 0;
        for (T item : array) {
            sum += item.doubleValue();     // dostępne: T na pewno jest Number
        }
        return sum / array.length;
    }
}

Box<Integer> ints = new Box<>(1, 2, 3);
Box<Double> doubles = new Box<>(1.5, 2.5);
Box<String> strings = new Box<>("a");      // ❌ String to nie Number
```

- `extends` oznacza tu „ta klasa **lub jej podklasa**”, a dla interfejsów — „**implementuje**” (słowa `implements` w generykach się nie używa).
- Po wymazaniu `T` zastępuje się nie `Object`, lecz **ograniczeniem** — `Number`. Dlatego metody `Number` są dostępne.

### Kilka ograniczeń

```java
class Box<T extends Number & Comparable<T>> { … }
```

Najpierw może stać **jedna klasa**, potem dowolna liczba interfejsów przez `&`. Wewnątrz dostępne są metody i `Number`, i `Comparable`.

## Wildcard `?` — „jakiś typ”

Chcemy porównać pudełko `Integer` z pudełkiem `Double`:

```java
public boolean compare(Box<T> another) { … }     // Box<Integer> przyjmie tylko Box<Integer>

public boolean compare(Box<?> another) {          // dowolne pudełko
    return Math.abs(avg() - another.avg()) < 0.0001;
}
```

`Box<?>` — „pudełko nieznanego typu”. Skoro wiemy, że `T extends Number`, `another.avg()` jest dostępne.

## Inwariancja: główna pułapka

`Integer` to podklasa `Number`. Ale **`List<Integer>` nie jest podtypem `List<Number>`**:

```java
static double sum(List<Number> list) { … }

List<Integer> ints = List.of(1, 2, 3);
sum(ints);                     // ❌ nie kompiluje się
```

Dlaczego to słuszne? Gdyby było wolno, metoda włożyłaby do „twojej” listy `Double`:

```java
static void broken(List<Number> list) { list.add(3.14); }   // do List<Integer>?!
```

Rozwiązanie — wildcard z ograniczeniem:

```java
static double sum(List<? extends Number> list) {
    double s = 0;
    for (Number n : list) s += n.doubleValue();   // czytać można jako Number
    // list.add(1);                               ❌ pisać nie wolno (poza null)
    return s;
}
sum(List.of(1, 2, 3));        // ✅
sum(List.of(1.5, 2.5));       // ✅
```

| Zapis | Co można przekazać | Odczyt | Zapis |
|---|---|---|---|
| `List<Number>` | tylko `List<Number>` | `Number` | `Number` i podtypy |
| `List<? extends Number>` | `List<Integer>`, `List<Double>`, … | `Number` | ❌ |
| `List<? super Integer>` | `List<Integer>`, `List<Number>`, `List<Object>` | tylko `Object` | `Integer` |
| `List<?>` | dowolną listę | `Object` | ❌ |

O `? super` — szczegółowo w [następnej lekcji](#/lessons/j2-generic-methods) (reguła PECS).

:::interview "Pytanie rekrutacyjne"
**Czy można przekazać `List<Integer>` do metody przyjmującej `List<Number>`?** — Nie. Generyki są **inwariantne**: `Integer` dziedziczy po `Number`, ale `List<Integer>` nie dziedziczy po `List<Number>`. Żeby przyjąć listę dowolnych liczb, parametr deklaruje się jako `List<? extends Number>`.
:::

:::note "Tablice zachowują się inaczej"
Tablice są **kowariantne**: `Number[] arr = new Integer[3];` się kompiluje. Ale `arr[0] = 1.5;` wywróci się w czasie działania z `ArrayStoreException`. Generyki wybrały inwariancję, żeby łapać takie błędy na etapie kompilacji.
:::

## Czego nie ma w wideo

- **`@SafeVarargs`.** Konstruktor/metoda z parametrem `T...` tworzy tablicę typu generycznego i kompilator ostrzega o „heap pollution”. Jeśli metoda tylko czyta argumenty, oznacz ją `@SafeVarargs` (dozwolone na metodach `final`, `static`, `private` i konstruktorach).
- **Ograniczenie rekurencyjne** `T extends Comparable<? super T>` — tak zadeklarowano `Collections.max`. Pozwala porównywać np. `java.sql.Date`, który implementuje `Comparable<java.util.Date>`.
- **Parametr typu nie ma ograniczenia od dołu.** `class Box<T super Integer>` jest niedozwolone; `super` istnieje tylko przy wildcard.

## Zadanie domowe

W wideo w tej lekcji nie ma zadania — utrwalmy własnymi.

:::task easy "Statystyki pudełka"
Dodaj do `Box<T extends Number>` metody `max()` i `min()` zwracające `double`. Sprawdź na `Box<Integer>` i `Box<Float>`.
:::

:::task medium "Suma dowolnych liczb"
Napisz `static double sum(Collection<? extends Number> c)` i wywołaj ją dla `List<Integer>`, `Set<Double>` i `List<BigDecimal>`. Wyjaśnij, dlaczego wewnątrz metody nie można zrobić `c.add(0)`.
:::

:::task medium "Maksimum po Comparable"
Napisz `static <T extends Comparable<? super T>> T max(List<? extends T> list)` bez użycia `Collections.max`. Sprawdź na napisach, liczbach i własnej klasie `Car implements Comparable<Car>`.
:::

:::task hard "Zepsuj tablice, a nie generyki"
1) Napisz kod, w którym `Object[] objs = new String[1]; objs[0] = 1;` wywraca się z `ArrayStoreException`. 2) Spróbuj powtórzyć to samo z `List<Object> l = new ArrayList<String>();` — wyjaśnij błąd kompilacji. 3) Przez raw type jednak „zanieczyść” `List<String>` liczbą i znajdź miejsce wywrotki.
:::
