Kończymy Stream API: klasa **`Optional`** — pojemnik na wynik, którego może nie być; operacje wyszukiwania `findFirst`/`findAny`; sposoby tworzenia strumienia; oraz **strumienie równoległe** — zrównoleglenie jednym wywołaniem `parallelStream()`.

## Znaczniki czasu wideo

- {{t j2 4:58:51}} — metody zwracające `Optional`
- {{t j2 4:59:23}} — `max(Comparator)`: najstarszy użytkownik
- {{t j2 5:00:19}} — dlaczego nie `User`, lecz `Optional<User>`
- {{t j2 5:01:11}} — `get()` i sprawdzenie `isPresent()`
- {{t j2 5:01:54}} — styl funkcyjny: `ifPresent`
- {{t j2 5:03:09}} — `ifPresentOrElse`
- {{t j2 5:04:05}} — mini-zadanie: znaleźć użytkownika z literą L w imieniu
- {{t j2 5:04:29}} — omówienie: `findFirst` i `findAny`
- {{t j2 5:06:31}} — sposoby tworzenia strumienia: kolekcja, `Arrays.stream`, `Stream.of`
- {{t j2 5:08:07}} — 30 mln liczb: długie obliczenie przez `map`
- {{t j2 5:10:52}} — `parallelStream()`: 6,5 s → 4,5 s
- {{t j2 5:11:26}} — różnica `findFirst` i `findAny`
- {{t j2 5:12:14}} — podsumowanie lekcji

## Optional

```java
Optional<User> oldest = users.stream()
        .max(Comparator.comparingInt(User::age));
```

Jeśli w strumieniu nie ma elementów (np. wszystkie odfiltrowano), maksimum nie istnieje. Zamiast `null` metoda zwraca `Optional` — „pudełko”, w którym wartość może być albo nie. Typ od razu mówi: „sprawdź, czy jest wynik”.

```java
oldest.ifPresent(System.out::println);                 // jeśli jest
oldest.ifPresentOrElse(
        System.out::println,
        () -> System.out.println("User not found"));   // Java 9+

User u = oldest.orElse(DEFAULT_USER);                  // wartość domyślna
User u2 = oldest.orElseGet(() -> loadDefault());       // leniwa wartość domyślna
User u3 = oldest.orElseThrow();                        // Java 10+: NoSuchElementException
String name = oldest.map(User::name).orElse("—");      // przekształcić, jeśli jest
```

| Metoda | Przeznaczenie |
|---|---|
| `Optional.of(v)` / `ofNullable(v)` / `empty()` | Utworzyć (`of(null)` rzuci NPE) |
| `isPresent()` / `isEmpty()` (11) | Sprawdzić |
| `map`, `flatMap`, `filter` | Przekształcić zawartość |
| `orElse`, `orElseGet`, `orElseThrow` | Wyjąć wartość |
| `or(() -> other)` (9) | Alternatywny `Optional` |
| `stream()` (9) | 0 lub 1 element |

:::outdated "get() + isPresent() — przestarzały styl"
W wideo wartość wyjmuje się przez `isPresent()` + `get()`. To działa, ale w istocie to samo co sprawdzenie na `null`. Współczesny styl — `orElse…`, `map`, `ifPresent…`. A zamiast `get()` używaj **`orElseThrow()`** (Java 10): robi to samo, ale nazwa uczciwie mówi, że będzie wyjątek.
:::

:::warning "Czego nie robić z Optional"
- Nie używaj `Optional` w polach klas i parametrach metod — pomyślano go jako **typ zwracany**.
- Nie zwracaj `null` zamiast `Optional` — sens znika.
- `orElse(expensive())` oblicza argument **zawsze**; dla kosztownych wartości — `orElseGet`.
- Dla kolekcji zwracaj pustą kolekcję, a nie `Optional<List>`.
:::

## findFirst i findAny

```java
users.stream()
     .filter(u -> u.name().contains("L"))
     .findFirst()
     .ifPresentOrElse(System.out::println, () -> System.out.println("User not found"));
```

- `findFirst()` — pierwszy element w kolejności strumienia.
- `findAny()` — dowolny. W strumieniu sekwencyjnym zwykle też pierwszy, w **równoległym** — pierwszy znaleziony przez którykolwiek wątek, za to szybciej.

## Jak utworzyć strumień

```java
list.stream();  list.parallelStream();            // z kolekcji
Arrays.stream(new int[]{1, 2, 3});                 // z tablicy → IntStream
Stream.of("a", "b", "c");                          // z wartości
Stream.iterate(1, x -> x * 2).limit(10);           // nieskończony, ograniczamy
Stream.iterate(1, x -> x < 1000, x -> x * 2);      // Java 9: z warunkiem
Stream.generate(Math::random).limit(5);
IntStream.rangeClosed(1, 100);
Files.lines(Path.of("data.txt"));                  // wiersze pliku (zamykać!)
"text".chars();  map.entrySet().stream();
```

## Strumienie równoległe

```java
List<Float> result = numbers.parallelStream()      // albo .stream().parallel()
        .map(n -> heavyFormula(n))
        .toList();
```

Strumień dzieli się na części, przetwarzane we wspólnej puli `ForkJoinPool.commonPool()` (wątków ≈ liczba rdzeni − 1), potem wyniki są sklejane. Kolejność `forEach` nie jest gwarantowana (dla kolejności — `forEachOrdered`), ale `toList()`/`collect` zachowują kolejność źródła.

:::warning "parallelStream to nie magiczny przycisk"
Równoległość wygrywa tylko przy **dużej** ilości danych i **kosztownych** obliczeniach na element, ze źródłem, które dobrze się dzieli (`ArrayList`, tablice, `IntStream.range`; `LinkedList` i `Stream.iterate` — źle). Dla małych danych narzut sprawi, że kod będzie **wolniejszy**. Nie wolno go używać z efektami ubocznymi (`add` do wspólnej `ArrayList`) ani do blokujących operacji I/O — zajmą wspólną pulę całej aplikacji. Zawsze mierz.
:::

## Zadanie domowe

:::task video "Użytkownik z literą L — z wideo"
Znajdź pierwszego użytkownika, w którego imieniu jest litera `L`. Jeśli znaleziony — wypisz go, w przeciwnym razie „User not found”. Jednym łańcuchem. {{t j2 5:04:05}}
??? Podpowiedź
`filter(...).findFirst().ifPresentOrElse(...)`. Omówienie: {{t j2 5:04:29}}
:::

:::task easy "Wyszukiwanie bez null"
Napisz `Optional<User> findByName(List<User> users, String name)` i użyj jej na trzy sposoby: `orElseThrow`, `map(User::age).orElse(-1)`, `ifPresentOrElse`.
:::

:::task medium "Łańcuch Optional"
Są `record Address(String city)`, `record User(String name, Address address)` (adres może być `null`). Napisz metodę zwracającą miasto użytkownika wielkimi literami albo `"UNKNOWN"` — bez żadnego `if` i `!= null`, przez `Optional.ofNullable(...).map(...)`.
:::

:::task hard "Kiedy równoległość wygrywa"
Porównaj `stream()` i `parallelStream()` (najlepiej w JMH) na zadaniach: suma 1000 liczb; suma pierwiastków kwadratowych 50 mln liczb z `IntStream.range`; to samo na `LinkedList<Integer>`; sprawdzanie pierwszości 100 000 liczb. Zbierz w tabelę i sformułuj regułę wyboru.
:::
