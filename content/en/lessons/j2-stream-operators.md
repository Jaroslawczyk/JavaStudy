More of the Stream API: a few more terminal operations (`count`, `allMatch`, `anyMatch`, `noneMatch`, `forEach`) and intermediate ones (`sorted`, `limit`). We learn to sort objects with a comparator and print results with a method reference.

## Video timestamps

- {{t j2 4:44:40}} — a `User` class with a name and an age
- {{t j2 4:45:37}} — how many users are over 30: `count()`
- {{t j2 4:46:48}} — anything that doesn't return a `Stream` is a terminal operation
- {{t j2 4:47:36}} — `allMatch`, `anyMatch`, `noneMatch`
- {{t j2 4:47:52}} — the cinema example: everyone goes or nobody does
- {{t j2 4:49:12}} — `anyMatch`: at least one adult
- {{t j2 4:49:59}} — `noneMatch`
- {{t j2 4:50:16}} — mini-task: rewrite with `noneMatch`
- {{t j2 4:51:02}} — `sorted` and `limit`
- {{t j2 4:51:20}} — mini-task: the three oldest users
- {{t j2 4:51:38}} — solution: a comparator, `Integer.compare`, a lambda
- {{t j2 4:53:49}} — overriding `toString()`
- {{t j2 4:54:24}} — `forEach` instead of `collect` + a loop
- {{t j2 4:55:37}} — `System.out::println`
- {{t j2 4:56:01}} — homework: the names of three users
- {{t j2 4:56:45}} — the solution
- {{t j2 4:58:25}} — `Comparator.comparing`

## count()

```java
record User(String name, int age) {}

long count = users.stream()
        .filter(u -> u.age() > 30)
        .count();                 // long; no need to collect a collection
```

## allMatch, anyMatch, noneMatch

They test elements with a predicate and return a `boolean`:

| Method | `true` if… | On an empty stream |
|---|---|---|
| `allMatch(p)` | **all** elements match | `true` |
| `anyMatch(p)` | **at least one** matches | `false` |
| `noneMatch(p)` | **none** match | `true` |

```java
boolean allAdults = users.stream().allMatch(u -> u.age() >= 18);
boolean hasAdult  = users.stream().anyMatch(u -> u.age() >= 18);
boolean noKids    = users.stream().noneMatch(u -> u.age() < 18);   // = allAdults
```

All three are **short-circuiting**: `anyMatch` stops at the first matching element, `allMatch` at the first non-matching one.

:::tip "The empty-stream trap"
`allMatch` on an empty collection returns `true` ("all zero users are adults"). If an empty list means "not allowed", check `!users.isEmpty()` separately.
:::

## sorted and limit

```java
users.stream()
     .sorted((o1, o2) -> Integer.compare(o2.age(), o1.age()))   // by age, descending
     .limit(3)
     .forEach(System.out::println);
```

The same, more modern — with `Comparator` factories:

```java
.sorted(Comparator.comparingInt(User::age).reversed())
.sorted(Comparator.comparing(User::name).thenComparingInt(User::age))
```

- `sorted()` without arguments uses natural order (`Comparable`), otherwise `ClassCastException`.
- `limit(n)` — the first `n` elements, `skip(n)` — skip `n` (together they give pagination).

:::note "sorted isn't lazy"
Most intermediate operations process elements one at a time, but `sorted` has to see **all** elements before emitting the first one. On an infinite stream `sorted` hangs.
:::

## forEach

```java
users.stream().filter(u -> u.age() < 40).forEach(System.out::println);
```

`forEach` is a terminal operation taking a `Consumer`. If you only need to go through the whole collection with no transformations, `users.forEach(...)` is simpler — no stream needed.

## What the video doesn't cover

- **`distinct()`** removes duplicates (by `equals`); **`takeWhile`/`dropWhile`** (Java 9) take/skip while a condition holds (useful on sorted data).
- **`reduce`** — folding: `numbers.stream().reduce(0, Integer::sum)`.
- **`peek`** — for debugging (look at elements between steps), not for business logic.
- **`mapMulti`** (Java 16) and **Stream Gatherers** (Java 24, `Stream.gather`) — your own intermediate operations, e.g. sliding windows: `.gather(Gatherers.windowSliding(3))`.
- **`flatMap`** — "flattens" nested collections: `orders.stream().flatMap(o -> o.items().stream())`.

## Homework

:::task video "The names of three users — from the video"
Sort users by name, keep those under 40, take the first three, turn them into a stream of names and print via `forEach`. {{t j2 4:56:01}}
??? Hint
`sorted(Comparator.comparing(User::name)).filter(u -> u.age() < 40).limit(3).map(User::name).forEach(System.out::println)`. Solution: {{t j2 4:56:45}}
:::

:::task easy "Checks"
For a list of numbers, check with one `anyMatch`/`allMatch`/`noneMatch` each: whether there are negatives, whether all are even, whether there are no zeros. Check the behaviour on an empty list.
:::

:::task medium "Pages"
Write `static <T> List<T> page(List<T> items, int page, int size)` using `skip` and `limit`. Sort users by age, then by name, and print the second page of 5 people.
:::

:::task hard "Top words"
Read a text, split it into words (`split("\\W+")`), lower-case them, count frequencies (`groupingBy` + `counting`) and print the 10 most frequent words by descending frequency, alphabetically on ties. Stream API only, no loops.
:::
