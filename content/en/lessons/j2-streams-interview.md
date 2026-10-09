A short "interview" on lambdas and the Stream API. The author notes that this topic is rarely asked in depth — what matters is being able to use streams. But you need to know the basic questions firmly, and streams come up constantly in live coding.

## Video timestamps

- {{t j2 5:13:27}} — start of the interview
- {{t j2 5:13:32}} — functional interfaces, `stream()`, why streams
- {{t j2 5:14:28}} — ways to create streams
- {{t j2 5:14:42}} — terminal and intermediate operations
- {{t j2 5:15:43}} — `map`, `Optional`, `filter`
- {{t j2 5:16:56}} — how `sorted()` sorts objects
- {{t j2 5:17:37}} — end of the section

## Questions

:::task video "1. What is a functional interface?"
{{t j2 5:13:32}}
??? Answer
An interface with exactly one abstract method (`default`/`static` don't count). Only it can be implemented with a lambda or a method reference. Marked with `@FunctionalInterface`. Examples: `Runnable`, `Comparator`, `Predicate`, `Function`.
:::

:::task video "2. What does stream() do?"
{{t j2 5:13:42}}
??? Answer
Creates a sequential stream from a collection — a flow of elements for pipeline processing. The collection itself isn't changed.
:::

:::task video "3. Why turn collections into streams?"
{{t j2 5:13:54}}
??? Answer
To describe filtering, transformation, sorting and grouping compactly and declaratively without intermediate collections; lazy execution with early stopping (`limit`, `findFirst`); easy parallelism via `parallelStream()`.
:::

:::task video "4. What ways of creating streams do you know?"
{{t j2 5:14:28}}
??? Answer
`collection.stream()/parallelStream()`, `Arrays.stream(array)`, `Stream.of(...)`, `Stream.iterate`, `Stream.generate`, `IntStream.range`, `Files.lines(path)`, `String.chars()`, `Stream.empty()`, `Stream.ofNullable` (9).
:::

:::task video "5. How does a terminal operation differ from an intermediate one?"
{{t j2 5:14:42}}
??? Answer
An intermediate operation returns a `Stream` and is lazy; there can be any number of them. A terminal one returns a result (or `void`), runs the whole pipeline and closes the stream; there's one, at the end.
:::

:::task video "6. Examples of terminal and intermediate operations"
{{t j2 5:15:19}}
??? Answer
Terminal: `collect`, `toList`, `count`, `min`/`max`, `forEach`, `reduce`, `anyMatch`, `findFirst`. Intermediate: `filter`, `map`, `flatMap`, `sorted`, `distinct`, `limit`, `skip`, `peek`.
:::

:::task video "7. What does map do?"
{{t j2 5:15:43}}
??? Answer
Applies a function to each element; the result type can differ from the original (`Stream<User>` → `Stream<String>`).
:::

:::task video "8. Optional — what is it and how is it related to streams?"
{{t j2 5:15:55}}
??? Answer
A container for a value that may be absent. `findFirst`, `findAny`, `min`, `max` and `reduce` without an identity return an `Optional` because the stream may be empty. The value is obtained via `orElse…`, `ifPresent…`, `map`.
:::

:::task video "9. How does filter work?"
{{t j2 5:16:33}}
??? Answer
It takes a `Predicate` and passes on only the elements for which it returned `true`.
:::

:::task video "10. How does sorted() sort objects of our own class?"
{{t j2 5:16:56}}
??? Answer
Without arguments — by natural order: the class must implement `Comparable`, otherwise `ClassCastException`. Or pass a `Comparator`: `sorted(Comparator.comparing(User::name))`.
:::

## Extra questions (not from the video)

:::task easy "map vs flatMap"
How do they differ?
??? Answer
`map` — one element to one. `flatMap` — one element to a stream of elements that are "flattened" into the common stream: `List<List<T>>` → `Stream<T>`.
:::

:::task medium "Why can't a stream be reused?"
And what happens if you try?
??? Answer
A stream is a single-use description of a computation over a source; after a terminal operation it's closed, and another call throws `IllegalStateException`. You need a new stream from the source.
:::

:::task medium "Collectors.toList() vs Stream.toList()"
What's the difference?
??? Answer
`Stream.toList()` (Java 16) returns an unmodifiable list and allows `null` elements. `Collectors.toList()` returns a mutable list (in practice an `ArrayList`, but without a spec guarantee).
:::

:::task hard "Live coding: grouping"
Given `List<Order(String customer, double amount)>`. In one expression, get a `Map<String, Double>` — the total of orders per customer, sorted by total descending.
??? Answer
`orders.stream().collect(groupingBy(Order::customer, summingDouble(Order::amount))).entrySet().stream().sorted(Map.Entry.<String, Double>comparingByValue().reversed()).collect(toMap(Map.Entry::getKey, Map.Entry::getValue, (a, b) -> a, LinkedHashMap::new))` — the `LinkedHashMap` preserves the sort order.
:::
