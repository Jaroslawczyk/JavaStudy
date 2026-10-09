W [lekcji o lambdach](#/lessons/j2-lambdas) nauczyliśmy się przekazywać zachowanie parametrem. Ten artykuł zbiera w całość idee **programowania funkcyjnego** w Javie: interfejsy funkcyjne, złożenia funkcji, funkcje wyższego rzędu, niezmienność i funkcje czyste.

## Funkcja to też wartość

```java
Function<Integer, Integer> square = x -> x * x;
BiFunction<Integer, Integer, Integer> add = Integer::sum;
Supplier<UUID> idGen = UUID::randomUUID;

square.apply(5);          // 25
add.apply(2, 3);          // 5
```

Funkcję można włożyć do zmiennej, kolekcji, przekazać do metody i zwrócić z metody.

## Interfejsy funkcyjne

Pakiet `java.util.function` (43 interfejsy) zbudowany jest z czterech podstawowych form:

| Forma | Interfejs | Sygnatura |
|---|---|---|
| Dostawca | `Supplier<T>` | `() → T` |
| Konsument | `Consumer<T>` | `T → void` |
| Funkcja | `Function<T, R>` | `T → R` |
| Predykat | `Predicate<T>` | `T → boolean` |

Plus wersje `Bi…` z dwoma argumentami, `…Operator` dla jednakowych typów (`UnaryOperator<T>`, `BinaryOperator<T>`) i wersje dla typów prostych (`IntFunction`, `ToLongFunction`, `IntPredicate`…), które unikają opakowywania.

## Złożenia funkcji

```java
Function<String, String> trim = String::trim;
Function<String, String> lower = String::toLowerCase;
Function<String, Integer> length = String::length;

Function<String, Integer> normalizedLength = trim.andThen(lower).andThen(length);
normalizedLength.apply("  Hello ");                 // 5

Predicate<String> isEmpty = String::isEmpty;
Predicate<String> valid = isEmpty.negate().and(s -> s.length() < 20);
Predicate<String> notBlank = Predicate.not(String::isBlank);       // Java 11

Comparator<User> byCityThenAge = Comparator.comparing(User::city)
        .thenComparingInt(User::age)
        .reversed();
```

`andThen(g)` — „najpierw ta, potem `g`”; `compose(g)` — „najpierw `g`, potem ta”.

## Funkcje wyższego rzędu

Funkcja wyższego rzędu **przyjmuje** funkcję lub **zwraca** funkcję:

```java
// przyjmuje funkcję
static <T> List<T> retry(int times, Supplier<List<T>> action) { … }

// zwraca funkcję
static Function<Double, Double> multiplier(double k) {
    return x -> x * k;
}
Function<Double, Double> withVat = multiplier(1.23);
withVat.apply(100.0);                                 // 123.0

// currying: funkcja dwóch argumentów → łańcuch funkcji jednego argumentu
Function<Integer, Function<Integer, Integer>> adder = a -> b -> a + b;
adder.apply(2).apply(3);                              // 5
```

`Stream.map`, `filter`, `Collectors.groupingBy`, `CompletableFuture.thenApply`, `Optional.map` — wszystko to funkcje wyższego rzędu.

## Funkcje czyste i niezmienność

- **Funkcja czysta** — wynik zależy tylko od argumentów i nie ma efektów ubocznych (nie zmienia pól, nie pisze do bazy, nie wypisuje). Łatwo ją testować, cache'ować i zrównoleglać.
- **Dane niezmienne** — `record`, `List.of`, pola `final`. Zamiast zmiany tworzy się nową wartość.

```java
// niefunkcyjnie: efekt uboczny wewnątrz strumienia
List<String> result = new ArrayList<>();
names.stream().filter(n -> n.length() > 3).forEach(result::add);

// funkcyjnie
List<String> result2 = names.stream().filter(n -> n.length() > 3).toList();
```

:::note "Java to nie Haskell"
Java pozostaje językiem obiektowym z możliwościami funkcyjnymi. W praktyce się je łączy: obiekty i klasy dla struktury programu, styl funkcyjny — do przetwarzania danych (strumienie, `Optional`, `CompletableFuture`). Biblioteka **Vavr** dodaje niezmienne kolekcje i `Try`/`Either`, jeśli zespół chce pójść dalej.
:::

## Zadanie domowe

:::task easy "Taśmociąg przekształceń"
Zbierz `List<Function<String, String>>` z kroków „obciąć spacje”, „małe litery”, „zamienić spacje na myślniki” i zastosuj je po kolei przez `reduce(Function.identity(), Function::andThen)`. Uzyskaj slug z tytułu artykułu.
:::

:::task medium "Memoizacja"
Napisz funkcję wyższego rzędu `static <T, R> Function<T, R> memoize(Function<T, R> f)`, zwracającą wersję `f`, która cache'uje wyniki w `ConcurrentHashMap`. Sprawdź na wolnej funkcji (z `Thread.sleep`) i na rekurencyjnym Fibonaccim.
:::

:::task hard "Mini-biblioteka walidacji"
Utwórz `@FunctionalInterface Rule<T> { Optional<String> check(T value); }` z metodami `default` `and`, `or` i statycznymi fabrykami. Zbuduj reguły rejestracji użytkownika (imię, wiek, e-mail, hasło) wyłącznie przez złożenia, bez `if` w kodzie aplikacji, i wypisz wszystkie naruszenia naraz.
:::
