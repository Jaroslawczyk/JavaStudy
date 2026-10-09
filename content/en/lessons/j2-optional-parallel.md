Wrapping up the Stream API: the **`Optional`** class — a container for a result that may be absent; the search operations `findFirst`/`findAny`; ways to create a stream; and **parallel streams** — parallelism with a single `parallelStream()` call.

## Video timestamps

- {{t j2 4:58:51}} — methods that return `Optional`
- {{t j2 4:59:23}} — `max(Comparator)`: the oldest user
- {{t j2 5:00:19}} — why `Optional<User>` instead of `User`
- {{t j2 5:01:11}} — `get()` and the `isPresent()` check
- {{t j2 5:01:54}} — functional style: `ifPresent`
- {{t j2 5:03:09}} — `ifPresentOrElse`
- {{t j2 5:04:05}} — mini-task: find a user with an L in the name
- {{t j2 5:04:29}} — solution: `findFirst` and `findAny`
- {{t j2 5:06:31}} — ways to create a stream: a collection, `Arrays.stream`, `Stream.of`
- {{t j2 5:08:07}} — 30 million numbers: a long computation via `map`
- {{t j2 5:10:52}} — `parallelStream()`: 6.5 s → 4.5 s
- {{t j2 5:11:26}} — the difference between `findFirst` and `findAny`
- {{t j2 5:12:14}} — lesson summary

## Optional

```java
Optional<User> oldest = users.stream()
        .max(Comparator.comparingInt(User::age));
```

If the stream has no elements (e.g. all were filtered out), there's no maximum. Instead of `null` the method returns an `Optional` — a "box" that may or may not contain a value. The type itself says: "check whether there's a result".

```java
oldest.ifPresent(System.out::println);                 // if present
oldest.ifPresentOrElse(
        System.out::println,
        () -> System.out.println("User not found"));   // Java 9+

User u = oldest.orElse(DEFAULT_USER);                  // a default value
User u2 = oldest.orElseGet(() -> loadDefault());       // a lazy default value
User u3 = oldest.orElseThrow();                        // Java 10+: NoSuchElementException
String name = oldest.map(User::name).orElse("—");      // transform if present
```

| Method | Purpose |
|---|---|
| `Optional.of(v)` / `ofNullable(v)` / `empty()` | Create (`of(null)` throws NPE) |
| `isPresent()` / `isEmpty()` (11) | Check |
| `map`, `flatMap`, `filter` | Transform the contents |
| `orElse`, `orElseGet`, `orElseThrow` | Get the value |
| `or(() -> other)` (9) | An alternative `Optional` |
| `stream()` (9) | 0 or 1 elements |

:::outdated "get() + isPresent() is old style"
The video gets the value via `isPresent()` + `get()`. It works, but it's essentially a `null` check. Modern style is `orElse…`, `map`, `ifPresent…`. And instead of `get()` use **`orElseThrow()`** (Java 10): it does the same, but the name honestly says an exception may be thrown.
:::

:::warning "What not to do with Optional"
- Don't use `Optional` for class fields and method parameters — it's meant as a **return type**.
- Don't return `null` instead of an `Optional` — that defeats the purpose.
- `orElse(expensive())` **always** evaluates its argument; for expensive values use `orElseGet`.
- For collections return an empty collection, not an `Optional<List>`.
:::

## findFirst and findAny

```java
users.stream()
     .filter(u -> u.name().contains("L"))
     .findFirst()
     .ifPresentOrElse(System.out::println, () -> System.out.println("User not found"));
```

- `findFirst()` — the first element in stream order.
- `findAny()` — any one. In a sequential stream it's usually the first too; in a **parallel** one it's the first found by any thread, but faster.

## How to create a stream

```java
list.stream();  list.parallelStream();            // from a collection
Arrays.stream(new int[]{1, 2, 3});                 // from an array → IntStream
Stream.of("a", "b", "c");                          // from values
Stream.iterate(1, x -> x * 2).limit(10);           // infinite, so we limit it
Stream.iterate(1, x -> x < 1000, x -> x * 2);      // Java 9: with a condition
Stream.generate(Math::random).limit(5);
IntStream.rangeClosed(1, 100);
Files.lines(Path.of("data.txt"));                  // lines of a file (close it!)
"text".chars();  map.entrySet().stream();
```

## Parallel streams

```java
List<Float> result = numbers.parallelStream()      // or .stream().parallel()
        .map(n -> heavyFormula(n))
        .toList();
```

The stream is split into parts processed in the shared pool `ForkJoinPool.commonPool()` (≈ number of cores − 1 threads), then the results are merged. The order of `forEach` isn't guaranteed (for order — `forEachOrdered`), but `toList()`/`collect` preserve the source order.

:::warning "parallelStream isn't a magic button"
Parallelism only pays off with a **large** amount of data and **expensive** per-element computation, with a source that splits well (`ArrayList`, arrays, `IntStream.range`; `LinkedList` and `Stream.iterate` split badly). For small data the overhead makes code **slower**. Never use it with side effects (`add` to a shared `ArrayList`) or for blocking I/O — that occupies the pool shared by the whole application. Always measure.
:::

## Homework

:::task video "A user with an L — from the video"
Find the first user whose name contains the letter `L`. If found, print them, otherwise print "User not found". In one chain. {{t j2 5:04:05}}
??? Hint
`filter(...).findFirst().ifPresentOrElse(...)`. Solution: {{t j2 5:04:29}}
:::

:::task easy "Searching without null"
Write `Optional<User> findByName(List<User> users, String name)` and use it three ways: `orElseThrow`, `map(User::age).orElse(-1)`, `ifPresentOrElse`.
:::

:::task medium "An Optional chain"
Given `record Address(String city)`, `record User(String name, Address address)` (the address may be `null`). Write a method that returns the user's city in upper case or `"UNKNOWN"` — without a single `if` or `!= null`, via `Optional.ofNullable(...).map(...)`.
:::

:::task hard "When parallelism wins"
Compare `stream()` and `parallelStream()` (ideally in JMH) on: the sum of 1,000 numbers; the sum of square roots of 50 million numbers from `IntStream.range`; the same on a `LinkedList<Integer>`; primality checks for 100,000 numbers. Put it in a table and formulate a rule for choosing.
:::
