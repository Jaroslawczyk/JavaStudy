In the [lambdas lesson](#/lessons/j2-lambdas) we learned to pass behaviour as a parameter. This article brings together the ideas of **functional programming** in Java: functional interfaces, function composition, higher-order functions, immutability and pure functions.

## A function is a value too

```java
Function<Integer, Integer> square = x -> x * x;
BiFunction<Integer, Integer, Integer> add = Integer::sum;
Supplier<UUID> idGen = UUID::randomUUID;

square.apply(5);          // 25
add.apply(2, 3);          // 5
```

A function can be stored in a variable or a collection, passed to a method and returned from a method.

## Functional interfaces

The `java.util.function` package (43 interfaces) is built from four basic shapes:

| Shape | Interface | Signature |
|---|---|---|
| Supplier | `Supplier<T>` | `() → T` |
| Consumer | `Consumer<T>` | `T → void` |
| Function | `Function<T, R>` | `T → R` |
| Predicate | `Predicate<T>` | `T → boolean` |

Plus `Bi…` versions with two arguments, `…Operator` for matching types (`UnaryOperator<T>`, `BinaryOperator<T>`) and primitive versions (`IntFunction`, `ToLongFunction`, `IntPredicate`…) that avoid boxing.

## Function composition

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

`andThen(g)` — "this first, then `g`"; `compose(g)` — "`g` first, then this".

## Higher-order functions

A higher-order function **takes** a function or **returns** a function:

```java
// takes a function
static <T> List<T> retry(int times, Supplier<List<T>> action) { … }

// returns a function
static Function<Double, Double> multiplier(double k) {
    return x -> x * k;
}
Function<Double, Double> withVat = multiplier(1.23);
withVat.apply(100.0);                                 // 123.0

// currying: a two-argument function → a chain of one-argument functions
Function<Integer, Function<Integer, Integer>> adder = a -> b -> a + b;
adder.apply(2).apply(3);                              // 5
```

`Stream.map`, `filter`, `Collectors.groupingBy`, `CompletableFuture.thenApply`, `Optional.map` — all of them are higher-order functions.

## Pure functions and immutability

- A **pure function**'s result depends only on its arguments and it has no side effects (doesn't change fields, write to a DB or print). It's easy to test, cache and parallelise.
- **Immutable data** — `record`, `List.of`, `final` fields. Instead of changing something, a new value is created.

```java
// not functional: a side effect inside a stream
List<String> result = new ArrayList<>();
names.stream().filter(n -> n.length() > 3).forEach(result::add);

// functional
List<String> result2 = names.stream().filter(n -> n.length() > 3).toList();
```

:::note "Java isn't Haskell"
Java remains an object-oriented language with functional features. In practice they're mixed: objects and classes for the program's structure, functional style for data processing (streams, `Optional`, `CompletableFuture`). The **Vavr** library adds immutable collections and `Try`/`Either` if the team wants to go further.
:::

## Homework

:::task easy "A transformation pipeline"
Build a `List<Function<String, String>>` from the steps "trim", "lower-case", "replace spaces with hyphens" and apply them in turn via `reduce(Function.identity(), Function::andThen)`. Produce a slug from an article title.
:::

:::task medium "Memoisation"
Write a higher-order function `static <T, R> Function<T, R> memoize(Function<T, R> f)` returning a version of `f` that caches results in a `ConcurrentHashMap`. Test it on a slow function (with `Thread.sleep`) and on a recursive Fibonacci.
:::

:::task hard "A mini validation library"
Create `@FunctionalInterface Rule<T> { Optional<String> check(T value); }` with `default` methods `and`, `or` and static factories. Assemble rules for user registration (name, age, e-mail, password) purely through composition, with no `if` in the application code, and print all violations at once.
:::
