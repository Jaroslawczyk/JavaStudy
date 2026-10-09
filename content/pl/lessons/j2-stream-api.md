**Stream API** (Java 8) to sposób przetwarzania kolekcji „taśmociągiem”: przefiltrować, przekształcić, zebrać wynik — bez list pośrednich i ręcznych pętli. Omawiamy trzy podstawowe operacje `filter`, `map`, `collect`, różnicę między operacjami pośrednimi i końcowymi oraz referencje do metod.

## Znaczniki czasu wideo

- {{t j2 4:26:50}} — zadanie wyjściowe: filtrowanie i przekształcanie ręcznie
- {{t j2 4:27:21}} — metoda `map`: liczby → napisy `number: N`
- {{t j2 4:29:26}} — minusy: trzy kolekcje, przywiązanie do typów
- {{t j2 4:29:42}} — strumień to „rura”, którą płyną dane
- {{t j2 4:30:47}} — `stream()` i `filter(Predicate)`
- {{t j2 4:33:04}} — `map(Function)`: zmieniamy typ elementów
- {{t j2 4:34:48}} — mini-zadanie: napisy kończące się na 0, + „!”
- {{t j2 4:36:00}} — bez operacji końcowej nic się nie wykonuje
- {{t j2 4:36:45}} — operacja końcowa `collect(Collectors.toList())`
- {{t j2 4:38:37}} — operacje pośrednie i końcowe
- {{t j2 4:39:46}} — zadanie domowe: pierwiastki liczb
- {{t j2 4:40:37}} — omówienie rozwiązania
- {{t j2 4:42:36}} — referencje do metod: `Math::sqrt`

## Było i jest

```java
// Było: trzy kolekcje i dwie metody
List<Integer> positive = filter(numbers);
List<String> mapped = map(positive);

// Jest: jeden taśmociąg
List<String> result = numbers.stream()
        .filter(n -> n % 2 == 0)
        .map(n -> "number: " + n)
        .filter(s -> s.endsWith("0"))
        .map(s -> s + "!")
        .collect(Collectors.toList());
```

Strumień to **nie kolekcja** i nie przechowuje danych. To opis obliczenia nad źródłem (kolekcją, tablicą, plikiem, generatorem). Kolekcja źródłowa się nie zmienia.

## Operacje pośrednie i końcowe

- **Pośrednie** (`filter`, `map`, `sorted`, `limit`, `distinct`, `peek`…) zwracają nowy `Stream` i są **leniwe**: tylko zapamiętują krok.
- **Końcowe** (`collect`, `forEach`, `count`, `reduce`, `min`/`max`, `anyMatch`, `findFirst`, `toList`…) zwracają coś innego niż strumień i **uruchamiają** cały taśmociąg.

```java
numbers.stream()
       .filter(n -> { System.out.println("filter " + n); return n > 0; });
// nic nie zostało wypisane: brak operacji końcowej
```

Reguła z wideo: metoda zwraca `Stream` — pośrednia, w przeciwnym razie — końcowa.

Elementy przechodzą przez taśmociąg **pojedynczo**, a nie etapami: pierwszy element przechodzi `filter → map → …` w całości, potem drugi. Dlatego `limit(3)` po `filter` zatrzymuje przetwarzanie, gdy tylko znajdą się trzy pasujące elementy.

:::warning "Strumień jest jednorazowy"
Po operacji końcowej strumienia nie można użyć ponownie: kolejne wywołanie rzuci `IllegalStateException: stream has already been operated upon or closed`. Potrzebujesz znowu — wywołaj `list.stream()` jeszcze raz.
:::

## map zmienia typ

```java
Stream<Integer> ints = Stream.of(4, 9, 16);
Stream<Double> roots = ints.map(Math::sqrt);          // Integer → Double
Stream<String> text = roots.map(d -> "sqrt: " + d);   // Double → String
```

## Referencje do metod

Jeśli lambda jedynie przekazuje parametr do innej metody, użyj `::`:

```java
.map(n -> Math.sqrt(n))        →   .map(Math::sqrt)
.map(d -> Main.toText(d))      →   .map(Main::toText)
.forEach(s -> System.out.println(s))  →  .forEach(System.out::println)
```

Który wariant wybrać — kwestia gustu zespołu; żaden nie jest błędem.

:::outdated "Collectors.toList() → Stream.toList() (Java 16+)"
W wideo — `.collect(Collectors.toList())`. Od Javy 16 krócej: **`.toList()`**. Ważna różnica: `Stream.toList()` zwraca listę **niezmienną** (próba `add` rzuci `UnsupportedOperationException`), a `Collectors.toList()` — zmienną `ArrayList` (bez gwarancji w specyfikacji). Jeśli listę trzeba zmieniać — `Collectors.toCollection(ArrayList::new)`.
:::

## Czego nie ma w wideo

### Strumienie typów prostych

`Stream<Integer>` opakowuje każdą liczbę. Dla liczb są `IntStream`, `LongStream`, `DoubleStream` z wygodnymi metodami:

```java
int sum = numbers.stream().mapToInt(Integer::intValue).sum();
IntStream.rangeClosed(1, 100).filter(n -> n % 7 == 0).average();   // OptionalDouble
IntStream.range(0, 5).boxed().toList();                            // z powrotem w obiekty
```

### Przydatne kolektory

```java
Collectors.joining(", ", "[", "]")            // napisy w jeden
Collectors.toSet(), Collectors.toMap(k, v)
Collectors.groupingBy(User::city)             // Map<City, List<User>>
Collectors.groupingBy(User::city, Collectors.counting())
Collectors.partitioningBy(u -> u.age() >= 18) // Map<Boolean, List<User>>
```

### Efekty uboczne

Lambdy w strumieniach powinny być **czyste**: nie zmieniać zewnętrznych kolekcji i zmiennych. `list.stream().forEach(x -> other.add(x))` to zły styl (i błąd w strumieniu równoległym); używaj `collect`/`toList`.

## Zadanie domowe

:::task video "Pierwiastki liczb — z wideo"
Utwórz listę 1000 losowych `int` od 100 do 200. Zostaw tylko parzyste i podzielne przez 5, zamień każdą na pierwiastek kwadratowy (`double`), potem w napis `"sqrt: …"`, zbierz w listę i wypisz. {{t j2 4:39:46}}
??? Podpowiedź
`filter(n -> n % 2 == 0 && n % 5 == 0).map(Math::sqrt).map(d -> "sqrt: " + d).toList()`. Omówienie: {{t j2 4:40:37}}
:::

:::task easy "Długie słowa"
Z listy słów otrzymaj listę słów dłuższych niż 4 litery, wielkimi literami, bez powtórzeń (`distinct`), posortowaną alfabetycznie. Jednym taśmociągiem.
:::

:::task medium "Grupowanie"
Jest `record Employee(String name, String department, int salary)`. Otrzymaj: `Map<String, List<String>>` imion według działów, średnią pensję według działów i najlepiej opłacanego pracownika w każdym dziale (`groupingBy` + `maxBy`).
:::

:::task hard "Leniwość na własne oczy"
Zrób strumień 1–10 z `peek(x -> log("source " + x))`, `filter` (z logiem), `map` (z logiem) i `limit(2)`. Przewidź wynik przed uruchomieniem, potem sprawdź. Wyjaśnij, dlaczego nie wszystkie elementy zostały przetworzone i dlaczego kolejność logów jest „pionowa”, a nie etapami. Co się zmieni, jeśli dodasz `sorted()` przed `limit`?
:::
