Kontynuujemy Stream API: jeszcze kilka operacji końcowych (`count`, `allMatch`, `anyMatch`, `noneMatch`, `forEach`) i pośrednich (`sorted`, `limit`). Uczymy się sortować obiekty komparatorem i wypisywać wynik referencją do metody.

## Znaczniki czasu wideo

- {{t j2 4:44:40}} — klasa `User` z imieniem i wiekiem
- {{t j2 4:45:37}} — ilu użytkowników ma ponad 30 lat: `count()`
- {{t j2 4:46:48}} — wszystko, co nie zwraca `Stream`, to operacja końcowa
- {{t j2 4:47:36}} — `allMatch`, `anyMatch`, `noneMatch`
- {{t j2 4:47:52}} — przykład z kinem: idą wszyscy albo nikt
- {{t j2 4:49:12}} — `anyMatch`: przynajmniej jeden dorosły
- {{t j2 4:49:59}} — `noneMatch`
- {{t j2 4:50:16}} — mini-zadanie: przepisz przez `noneMatch`
- {{t j2 4:51:02}} — `sorted` i `limit`
- {{t j2 4:51:20}} — mini-zadanie: trzech najstarszych użytkowników
- {{t j2 4:51:38}} — omówienie: komparator, `Integer.compare`, lambda
- {{t j2 4:53:49}} — nadpisujemy `toString()`
- {{t j2 4:54:24}} — `forEach` zamiast `collect` + pętla
- {{t j2 4:55:37}} — `System.out::println`
- {{t j2 4:56:01}} — zadanie domowe: imiona trzech użytkowników
- {{t j2 4:56:45}} — omówienie rozwiązania
- {{t j2 4:58:25}} — `Comparator.comparing`

## count()

```java
record User(String name, int age) {}

long count = users.stream()
        .filter(u -> u.age() > 30)
        .count();                 // long, kolekcji zbierać nie trzeba
```

## allMatch, anyMatch, noneMatch

Sprawdzają elementy predykatem i zwracają `boolean`:

| Metoda | `true`, jeśli… | Na pustym strumieniu |
|---|---|---|
| `allMatch(p)` | **wszystkie** elementy pasują | `true` |
| `anyMatch(p)` | **przynajmniej jeden** pasuje | `false` |
| `noneMatch(p)` | **żaden** nie pasuje | `true` |

```java
boolean allAdults = users.stream().allMatch(u -> u.age() >= 18);
boolean hasAdult  = users.stream().anyMatch(u -> u.age() >= 18);
boolean noKids    = users.stream().noneMatch(u -> u.age() < 18);   // = allAdults
```

Wszystkie trzy są **krótko spinające** (short-circuit): `anyMatch` zatrzymuje się na pierwszym pasującym elemencie, `allMatch` — na pierwszym niepasującym.

:::tip "Pułapka pustego strumienia"
`allMatch` na pustej kolekcji zwraca `true` („wszyscy z zera użytkowników są dorośli”). Jeśli pusta lista oznacza „nie wolno”, sprawdzaj `!users.isEmpty()` osobno.
:::

## sorted i limit

```java
users.stream()
     .sorted((o1, o2) -> Integer.compare(o2.age(), o1.age()))   // malejąco według wieku
     .limit(3)
     .forEach(System.out::println);
```

To samo nowocześniej — przez fabryki `Comparator`:

```java
.sorted(Comparator.comparingInt(User::age).reversed())
.sorted(Comparator.comparing(User::name).thenComparingInt(User::age))
```

- `sorted()` bez argumentów — porządek naturalny (`Comparable`), w przeciwnym razie `ClassCastException`.
- `limit(n)` — pierwsze `n` elementów, `skip(n)` — pominąć `n` (razem dają paginację).

:::note "sorted nie jest leniwa"
Większość operacji pośrednich przetwarza elementy pojedynczo, ale `sorted` musi zobaczyć **wszystkie** elementy, zanim odda pierwszy. Na nieskończonym strumieniu `sorted` zawiśnie.
:::

## forEach

```java
users.stream().filter(u -> u.age() < 40).forEach(System.out::println);
```

`forEach` to operacja końcowa z `Consumer`. Jeśli trzeba tylko przejść całą kolekcję bez przekształceń, prościej `users.forEach(...)` — bez strumienia.

## Czego nie ma w wideo

- **`distinct()`** usuwa duplikaty (według `equals`), **`takeWhile`/`dropWhile`** (Java 9) — brać/pomijać, dopóki warunek jest spełniony (przydatne dla posortowanych danych).
- **`reduce`** — złożenie: `numbers.stream().reduce(0, Integer::sum)`.
- **`peek`** — do debugowania (podejrzeć elementy między krokami), nie do logiki biznesowej.
- **`mapMulti`** (Java 16) i **Stream Gatherers** (Java 24, `Stream.gather`) — własne operacje pośrednie, np. okna przesuwne: `.gather(Gatherers.windowSliding(3))`.
- **`flatMap`** — „spłaszczyć” zagnieżdżone kolekcje: `orders.stream().flatMap(o -> o.items().stream())`.

## Zadanie domowe

:::task video "Imiona trzech użytkowników — z wideo"
Posortuj użytkowników według imienia, zostaw młodszych niż 40 lat, weź pierwszych trzech, zamień w strumień imion i wypisz przez `forEach`. {{t j2 4:56:01}}
??? Podpowiedź
`sorted(Comparator.comparing(User::name)).filter(u -> u.age() < 40).limit(3).map(User::name).forEach(System.out::println)`. Omówienie: {{t j2 4:56:45}}
:::

:::task easy "Sprawdzenia"
Dla listy liczb sprawdź jednym `anyMatch`/`allMatch`/`noneMatch`: czy są ujemne, czy wszystkie są parzyste, czy nie ma zer. Sprawdź zachowanie na pustej liście.
:::

:::task medium "Strony"
Napisz `static <T> List<T> page(List<T> items, int page, int size)` przez `skip` i `limit`. Posortuj użytkowników według wieku, potem imienia, i wypisz drugą stronę po 5 osób.
:::

:::task hard "Top słów"
Wczytaj tekst, podziel na słowa (`split("\\W+")`), zamień na małe litery, policz częstości (`groupingBy` + `counting`) i wypisz 10 najczęstszych słów malejąco według częstości, a przy remisie — alfabetycznie. Tylko Stream API, bez pętli.
:::
