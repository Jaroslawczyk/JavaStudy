The **Stream API** (Java 8) processes collections as a "pipeline": filter, transform, collect the result — without intermediate lists or manual loops. We cover the three basic operations `filter`, `map`, `collect`, the difference between intermediate and terminal operations, and method references.

## Video timestamps

- {{t j2 4:26:50}} — the starting task: filtering and transforming by hand
- {{t j2 4:27:21}} — a `map` method: numbers → strings `number: N`
- {{t j2 4:29:26}} — the downsides: three collections, tied to types
- {{t j2 4:29:42}} — a stream is a "pipe" that data flows through
- {{t j2 4:30:47}} — `stream()` and `filter(Predicate)`
- {{t j2 4:33:04}} — `map(Function)`: changing the element type
- {{t j2 4:34:48}} — mini-task: strings ending with 0, plus "!"
- {{t j2 4:36:00}} — without a terminal operation nothing runs
- {{t j2 4:36:45}} — the terminal operation `collect(Collectors.toList())`
- {{t j2 4:38:37}} — intermediate and terminal operations
- {{t j2 4:39:46}} — homework: square roots
- {{t j2 4:40:37}} — the solution
- {{t j2 4:42:36}} — method references: `Math::sqrt`

## Before and after

```java
// Before: three collections and two methods
List<Integer> positive = filter(numbers);
List<String> mapped = map(positive);

// After: one pipeline
List<String> result = numbers.stream()
        .filter(n -> n % 2 == 0)
        .map(n -> "number: " + n)
        .filter(s -> s.endsWith("0"))
        .map(s -> s + "!")
        .collect(Collectors.toList());
```

A stream is **not a collection** and stores no data. It's a description of a computation over a source (a collection, an array, a file, a generator). The source collection isn't modified.

## Intermediate and terminal operations

- **Intermediate** ones (`filter`, `map`, `sorted`, `limit`, `distinct`, `peek`…) return a new `Stream` and are **lazy**: they only remember the step.
- **Terminal** ones (`collect`, `forEach`, `count`, `reduce`, `min`/`max`, `anyMatch`, `findFirst`, `toList`…) return something other than a stream and **run** the whole pipeline.

```java
numbers.stream()
       .filter(n -> { System.out.println("filter " + n); return n > 0; });
// nothing is printed: there's no terminal operation
```

The rule from the video: a method returning a `Stream` is intermediate, otherwise it's terminal.

Elements go through the pipeline **one at a time**, not stage by stage: the first element passes `filter → map → …` completely, then the second. That's why `limit(3)` after `filter` stops processing as soon as three matching elements are found.

:::warning "A stream is single-use"
After a terminal operation the stream can't be used again: a second call throws `IllegalStateException: stream has already been operated upon or closed`. Need it again — call `list.stream()` once more.
:::

## map changes the type

```java
Stream<Integer> ints = Stream.of(4, 9, 16);
Stream<Double> roots = ints.map(Math::sqrt);          // Integer → Double
Stream<String> text = roots.map(d -> "sqrt: " + d);   // Double → String
```

## Method references

If a lambda only forwards its parameter to another method, use `::`:

```java
.map(n -> Math.sqrt(n))        →   .map(Math::sqrt)
.map(d -> Main.toText(d))      →   .map(Main::toText)
.forEach(s -> System.out.println(s))  →  .forEach(System.out::println)
```

Which one to use is a matter of team taste; neither is a mistake.

:::outdated "Collectors.toList() → Stream.toList() (Java 16+)"
The video uses `.collect(Collectors.toList())`. Since Java 16 it's shorter: **`.toList()`**. An important difference: `Stream.toList()` returns an **unmodifiable** list (`add` throws `UnsupportedOperationException`), while `Collectors.toList()` returns a mutable `ArrayList` (without a spec guarantee). If the list must be modified — `Collectors.toCollection(ArrayList::new)`.
:::

## What the video doesn't cover

### Primitive streams

`Stream<Integer>` boxes every number. For numbers there are `IntStream`, `LongStream`, `DoubleStream` with handy methods:

```java
int sum = numbers.stream().mapToInt(Integer::intValue).sum();
IntStream.rangeClosed(1, 100).filter(n -> n % 7 == 0).average();   // OptionalDouble
IntStream.range(0, 5).boxed().toList();                            // back to objects
```

### Useful collectors

```java
Collectors.joining(", ", "[", "]")            // strings into one
Collectors.toSet(), Collectors.toMap(k, v)
Collectors.groupingBy(User::city)             // Map<City, List<User>>
Collectors.groupingBy(User::city, Collectors.counting())
Collectors.partitioningBy(u -> u.age() >= 18) // Map<Boolean, List<User>>
```

### Side effects

Lambdas in streams should be **pure**: don't modify external collections and variables. `list.stream().forEach(x -> other.add(x))` is bad style (and a bug in a parallel stream); use `collect`/`toList`.

## Homework

:::task video "Square roots — from the video"
Create a list of 1000 random `int`s from 100 to 200. Keep only the ones that are even and divisible by 5, turn each into its square root (`double`), then into a string `"sqrt: …"`, collect into a list and print it. {{t j2 4:39:46}}
??? Hint
`filter(n -> n % 2 == 0 && n % 5 == 0).map(Math::sqrt).map(d -> "sqrt: " + d).toList()`. Solution: {{t j2 4:40:37}}
:::

:::task easy "Long words"
From a list of words, get the words longer than 4 letters in upper case without duplicates (`distinct`), sorted alphabetically. In one pipeline.
:::

:::task medium "Grouping"
Given `record Employee(String name, String department, int salary)`. Get: a `Map<String, List<String>>` of names by department, the average salary per department and the highest-paid employee in each department (`groupingBy` + `maxBy`).
:::

:::task hard "Laziness with your own eyes"
Make a stream of 1–10 with `peek(x -> log("source " + x))`, a `filter` (with a log), a `map` (with a log) and `limit(2)`. Predict the output before running, then check. Explain why not all elements were processed and why the log order is "vertical" rather than stage by stage. What changes if you add `sorted()` before `limit`?
:::
