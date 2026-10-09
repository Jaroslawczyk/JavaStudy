Ordinary collections (`ArrayList`, `HashMap`) are **not thread-safe**: if two threads add elements at the same time, some data is lost. We look at three solutions: manual synchronisation, `Collections.synchronized…` wrappers and the special collections from `java.util.concurrent`.

## Video timestamps

- {{t j2 3:23:33}} — collections and concurrency
- {{t j2 3:24:02}} — two threads each add 100 elements to an `ArrayList`
- {{t j2 3:26:16}} — the list has 131 elements instead of 200
- {{t j2 3:26:24}} — solution 1: a `synchronized` block around `add`
- {{t j2 3:27:16}} — solution 2: `Collections.synchronizedList(…)`
- {{t j2 3:28:41}} — the downside: one monitor for the whole collection
- {{t j2 3:29:28}} — solution 3: `CopyOnWriteArrayList`, `CopyOnWriteArraySet`
- {{t j2 3:30:08}} — `ConcurrentHashMap`
- {{t j2 3:30:46}} — lesson summary

## The problem

```java
List<Integer> numbers = new ArrayList<>();
Runnable add100 = () -> { for (int i = 0; i < 100; i++) { sleep(1); numbers.add(i); } };
// two threads → size() = 131, sometimes ArrayIndexOutOfBoundsException
```

`add` inside `ArrayList` is "write to `elementData[size]`, increment `size`": two threads write to the same slot, the increment is lost, and an exception is possible during array growth.

## Solution 1: manual synchronisation

```java
synchronized (monitor) { numbers.add(i); }
```

Works, but you have to remember the monitor on **every** access — including reads and iteration.

## Solution 2: synchronised wrappers

```java
List<Integer> numbers = Collections.synchronizedList(new ArrayList<>());
Map<String, Integer> map = Collections.synchronizedMap(new HashMap<>());
Set<String> set = Collections.synchronizedSet(new HashSet<>());
```

Every wrapper method is `synchronized` on a single monitor. Simple but slow: even two readers wait for each other.

:::warning "Iterating over a synchronised collection"
Iteration is many calls, and the wrapper doesn't protect them. You must synchronise the iteration manually on the collection itself, otherwise a `ConcurrentModificationException` is possible:

```java
synchronized (numbers) {
    for (Integer n : numbers) System.out.println(n);
}
```
:::

## Solution 3: java.util.concurrent collections

| Interface | Thread-safe implementation | When |
|---|---|---|
| `List` | `CopyOnWriteArrayList` | Many reads, few writes (listener lists, configs) |
| `Set` | `CopyOnWriteArraySet`, `ConcurrentHashMap.newKeySet()` | Same / general case |
| `Map` | `ConcurrentHashMap` | The main choice for shared maps |
| `SortedMap` | `ConcurrentSkipListMap` | Sorted keys needed |
| `Queue` | `ConcurrentLinkedQueue`, `BlockingQueue` | Task queues |

### Copy-on-write

Every write creates a **copy** of the internal array, new data goes into the copy, then the reference is swapped. Readers are never blocked and iterate over a "snapshot" — there's never a `ConcurrentModificationException`. The price is O(n) writes: on frequently modified collections it's very slow.

### ConcurrentHashMap

Different threads can work with different buckets of the table at the same time — locks aren't global. Reads aren't blocked at all.

:::outdated "How ConcurrentHashMap works today"
People often talk about "segments" (16 parts of the table, each with its own lock) — that was **before Java 8**. Since Java 8 `ConcurrentHashMap` uses CAS for empty buckets and `synchronized` on the bucket's first node on collision; long chains, as in `HashMap`, turn into trees. In an interview it helps to know both versions.
:::

:::tip "ConcurrentHashMap's atomic operations"
Instead of "check, then put" (a race!) use atomic methods:

```java
map.putIfAbsent("a", 1);
map.computeIfAbsent(key, k -> new ArrayList<>()).add(value);
map.merge(word, 1, Integer::sum);          // a word counter
```
One more difference from `HashMap`: keys and values can't be `null`.
:::

:::interview "Interview questions"
**What do you know about synchronised collections?** — Ordinary collections aren't thread-safe. `Collections.synchronizedList/Set/Map` wrap them, synchronising every method on one monitor (slow, iteration must be synchronised manually). The `java.util.concurrent` package offers optimised ones: `ConcurrentHashMap`, `CopyOnWriteArrayList/Set`, `ConcurrentLinkedQueue`, `BlockingQueue`.

**`Hashtable` vs `ConcurrentHashMap`?** — `Hashtable` is a legacy class with all methods `synchronized` on one monitor. `ConcurrentHashMap` locks only individual buckets, reads are lock-free.
:::

## What the video doesn't cover

- **Immutable collections** (`List.of`, `Map.copyOf`, `Collections.unmodifiableList`) are safe to read from any threads without any synchronisation — as long as the original owner doesn't modify them.
- **`Vector` and `Hashtable`** — Java 1.0 legacy, all methods synchronised. Not used in new code.
- **Weakly consistent iterators** of concurrent collections don't throw `ConcurrentModificationException`, but may not see changes made during iteration.

## Homework

The video has no task — here are our own.

:::task easy "Lost elements"
Repeat the experiment from the video with `ArrayList`, `Collections.synchronizedList` and `CopyOnWriteArrayList`: 4 threads, 10,000 additions each. Compare the size and the time.
:::

:::task medium "A word-frequency map"
Read a big text, split it into 4 parts and count word frequencies in 4 threads into one shared `ConcurrentHashMap<String, Integer>` via `merge`. Compare the result with the single-threaded version — it must match. Then try `get` + `put` instead of `merge` and find the discrepancies.
:::

:::task medium "CopyOnWrite and the iterator"
Iterate over a `CopyOnWriteArrayList` in one thread while adding elements from another. Show there's no exception and the iterator sees a "snapshot". Repeat with `ArrayList` — you'll get a `ConcurrentModificationException`.
:::

:::task hard "A compute-once cache"
Write a `Memoizer<K, V>` with a method `V get(K key)` that computes the value with an expensive function **exactly once** per key, even if 100 threads request the same key at the same time. Use `ConcurrentHashMap.computeIfAbsent`. Think about why the function must not access the same map.
:::
