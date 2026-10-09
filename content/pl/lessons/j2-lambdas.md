Przed Stream API trzeba opanować **wyrażenia lambda** — krótki zapis „funkcji”, którą przekazuje się jako parametr. Omawiamy, jak z klasy anonimowej powstaje lambda, czym jest **interfejs funkcyjny** i dlaczego bez niego lambda jest niemożliwa. W zadaniu domowym piszemy własny `Predicate` i uniwersalny filtr.

## Znaczniki czasu wideo

- {{t j2 4:08:21}} — nowy dział: strumienie; najpierw lambdy
- {{t j2 4:09:06}} — wątek z anonimowym `Runnable`
- {{t j2 4:09:32}} — IDEA proponuje „Replace with lambda”
- {{t j2 4:09:58}} — krok po kroku zamieniamy klasę anonimową w lambdę
- {{t j2 4:11:21}} — sedno: przekazujemy nie obiekt, lecz funkcję
- {{t j2 4:12:17}} — interfejs funkcyjny: jedna metoda abstrakcyjna
- {{t j2 4:12:46}} — mini-zadanie: `Worker` i `Director`
- {{t j2 4:13:31}} — omówienie: klasa anonimowa i lambda
- {{t j2 4:15:28}} — adnotacja `@FunctionalInterface`
- {{t j2 4:16:02}} — lambda z parametrem i wartością zwracaną
- {{t j2 4:18:39}} — lambda w zmiennej
- {{t j2 4:19:29}} — typu parametru można nie podawać
- {{t j2 4:19:49}} — filtr liczb parzystych z kolekcji
- {{t j2 4:22:42}} — zadanie domowe: własny `Predicate`
- {{t j2 4:23:55}} — omówienie rozwiązania

## Od klasy anonimowej do lambdy

```java
new Thread(new Runnable() {
    @Override
    public void run() {
        System.out.println(1);
    }
}).start();
```

Co w tym kodzie naprawdę niesie informację? Tylko ciało metody. Kompilator i tak wie, że konstruktor `Thread` przyjmuje `Runnable`, a `Runnable` ma jedyną metodę `run()` bez parametrów. Usuwamy wszystko zbędne:

```java
new Thread(() -> System.out.println(1)).start();
```

Składnia: `(parametry) -> { ciało }`.

| Wariant | Przykład |
|---|---|
| Bez parametrów | `() -> System.out.println("hi")` |
| Jeden parametr (nawiasy można pominąć) | `n -> n * 2` |
| Kilka | `(a, b) -> a + b` |
| Z typami | `(int a, int b) -> a + b` |
| Blok | `n -> { int r = n * 2; return r; }` |

Jeśli ciało to jedno wyrażenie, nawiasów klamrowych, `return` i `;` się nie pisze.

## Interfejs funkcyjny

Lambdę można podstawić tylko tam, gdzie oczekiwany jest **interfejs funkcyjny** — interfejs z **dokładnie jedną metodą abstrakcyjną** (SAM, single abstract method). Metody `default`, `static` i metody `Object` się nie liczą.

```java
@FunctionalInterface
public interface Worker {
    String work(int count);
}

public class Director {
    public String force(Worker worker, int count) {
        return worker.work(count);
    }
}

String result = new Director().force(n -> {
    for (int i = 0; i < n; i++) System.out.println("Pracuję");
    return "success";
}, 5);
```

`@FunctionalInterface` jest opcjonalna, ale przydatna: kompilator zgłosi błąd, jeśli ktoś doda drugą metodę abstrakcyjną.

## Własny Predicate i uniwersalny filtr

```java
@FunctionalInterface
interface Predicate {
    boolean test(int value);
}

static List<Integer> filter(List<Integer> list, Predicate predicate) {
    List<Integer> result = new ArrayList<>();
    for (int n : list) {
        if (predicate.test(n)) result.add(n);
    }
    return result;
}

filter(numbers, n -> n % 2 == 0);     // parzyste
filter(numbers, n -> n > 0);          // dodatnie
filter(numbers, n -> n % 5 == 0);     // wielokrotności 5
```

Jedna metoda `filter` zamiast dziesięciu: **zachowanie przekazuje się parametrem**. To właśnie idea programowania funkcyjnego.

## Czego nie ma w wideo

### Standardowe interfejsy funkcyjne

Własnych interfejsów prawie nie trzeba pisać — w `java.util.function` są gotowe (autor ostrzega, by nie pomylić własnego `Predicate` z tym):

| Interfejs | Metoda | Sens |
|---|---|---|
| `Predicate<T>` | `boolean test(T)` | warunek |
| `Function<T, R>` | `R apply(T)` | przekształcenie |
| `Consumer<T>` | `void accept(T)` | akcja |
| `Supplier<T>` | `T get()` | dostawca wartości |
| `UnaryOperator<T>` | `T apply(T)` | `T → T` |
| `BinaryOperator<T>` | `T apply(T, T)` | złożenie dwóch wartości |
| `BiFunction<T, U, R>` | `R apply(T, U)` | dwa argumenty |

Plus wersje dla typów prostych bez opakowywania: `IntPredicate`, `IntFunction`, `ToIntFunction`, `IntBinaryOperator`…

### Referencje do metod

Jeśli lambda tylko wywołuje istniejącą metodę, można ją zastąpić **referencją do metody** (`::`):

| Lambda | Referencja |
|---|---|
| `s -> System.out.println(s)` | `System.out::println` |
| `s -> s.length()` | `String::length` |
| `(a, b) -> Integer.compare(a, b)` | `Integer::compare` |
| `() -> new ArrayList<>()` | `ArrayList::new` |

### Złożenia

```java
Predicate<String> notEmpty = s -> !s.isEmpty();
Predicate<String> shortWord = s -> s.length() < 5;
Predicate<String> both = notEmpty.and(shortWord).negate();

Function<Integer, Integer> plus1 = x -> x + 1, twice = x -> x * 2;
plus1.andThen(twice).apply(3);   // 8
plus1.compose(twice).apply(3);   // 7
```

### Przechwytywanie zmiennych

Lambda widzi zmienne lokalne tylko **effectively final** (te, które się nie zmieniają). Pola klasy — bez ograniczeń. `this` wewnątrz lambdy to obiekt zewnętrzny, a nie sama lambda (w odróżnieniu od klasy anonimowej).

Więcej — w artykule [Programowanie funkcyjne](#/extra/functional).

## Zadanie domowe

:::task video "Własny Predicate — z wideo"
Utwórz interfejs funkcyjny `Predicate` z metodą `boolean test(int)`. Przepisz metodę `filter(List<Integer>, Predicate)` tak, by warunek był przekazywany parametrem. Wywołaj ją z klasą anonimową, potem z lambdami: parzyste, dodatnie, wielokrotności 5. {{t j2 4:22:42}}
??? Podpowiedź
Nie pomyl importu ze standardowym `java.util.function.Predicate`. Omówienie: {{t j2 4:23:55}}
:::

:::task easy "Kalkulator lambd"
Utwórz `Map<String, IntBinaryOperator>` z operacjami `+ - * / %` i oblicz wyrażenie `a op b` wpisane przez użytkownika. Żadnego `switch` — tylko wyszukanie operacji w mapie.
:::

:::task medium "Generyczny filtr i mapper"
Napisz `static <T> List<T> filter(List<T>, Predicate<T>)` i `static <T, R> List<R> map(List<T>, Function<T, R>)` na standardowych interfejsach. Przefiltruj napisy dłuższe niż 3 znaki i zamień je na wielkie litery, używając referencji do metod, gdzie się da.
:::

:::task hard "Konstruktor walidatorów"
Zrób `Validator<T>` — interfejs funkcyjny `ValidationResult validate(T)` z metodami `default` `and(Validator<T>)`, `or(…)` i statycznymi fabrykami `notNull()`, `minLength(int)`, `matches(String regex)`. Złóż walidator e-maila z kawałków i wypisz wszystkie komunikaty o błędach.
:::
