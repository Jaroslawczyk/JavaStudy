Now the registry stores "owner → car" pairs. For such data there's the **`Map`** interface and its most popular implementation, **`HashMap`**. We write our own `CarHashMap`, look at collisions, trees inside buckets and complexity, and learn that `HashSet` is actually built on `HashMap`. This is probably the most frequent Java Junior interview question.

## Video timestamps

- {{t j1 8:54:14}} — new requirements: "owner — car" pairs
- {{t j1 8:55:20}} — the `Map` interface
- {{t j1 8:55:27}} — the `CarOwner` class
- {{t j1 8:56:03}} — the `CarMap` interface: `put`, `get`, `keySet`, `values`, `remove`, `size`, `clear`
- {{t j1 8:57:56}} — tests for `CarMap`
- {{t j1 9:00:55}} — how `HashMap` works: an array of 16 buckets
- {{t j1 9:01:32}} — an `Entry` with a key, a value and `next`
- {{t j1 9:02:13}} — the same key — the value is overwritten
- {{t j1 9:03:17}} — growth at 75 % fill
- {{t j1 9:03:50}} — the `CarHashMap` implementation
- {{t j1 9:05:20}} — the `put` method
- {{t j1 9:09:29}} — the `get` method
- {{t j1 9:10:45}} — the `remove` method
- {{t j1 9:14:40}} — `keySet` and `values`
- {{t j1 9:16:14}} — growing the array and the load factor
- {{t j1 9:20:14}} — tests failed: the key lacks `equals`/`hashCode`
- {{t j1 9:21:51}} — analysis and interview questions
- {{t j1 9:25:26}} — complexity: best and worst cases
- {{t j1 9:26:33}} — `TREEIFY_THRESHOLD = 8`: a tree instead of a list
- {{t j1 9:28:43}} — `put` with an existing key
- {{t j1 9:29:11}} — `HashSet` uses `HashMap` internally
- {{t j1 9:30:06}} — rewriting `CarHashSet` on top of `HashMap`

## The Map interface

```java
Map<CarOwner, Car> map = new HashMap<>();
CarOwner owner = new CarOwner(1, "Ivan", "Ivanov");

map.put(owner, new Car("BMW", 1));         // add a pair
Car car = map.get(owner);                   // get the value by key
map.put(owner, new Car("Audi", 2));        // the same key — the value is OVERWRITTEN
map.remove(owner);                          // remove a pair by key
Set<CarOwner> owners = map.keySet();        // all keys (unique → a Set)
Collection<Car> cars = map.values();        // all values (may repeat)
```

- **Keys are unique**, values aren't.
- `Map` **doesn't extend** `Collection` and isn't `Iterable`: `put(key, value)` and `remove(key)` don't fit the `Collection` contract.

## How HashMap works

```text
table[16]:
 0 [null]
 …
 6 [Entry key=owner1, value=BMW] → [Entry key=owner2, value=Audi]   ← a collision
 …
15 [null]
```

1. Inside is an array of buckets holding `Entry { key, value, next }` objects, 16 cells initially.
2. A pair's position is determined by the **key's hash code**.
3. Bucket empty — put the `Entry`. Taken — compare keys with `equals`: equal — **overwrite the value**; not equal — a **collision**, append to the chain.
4. `get` and `remove` work the same way: hash → bucket → search the chain with `equals`.
5. At 75 % fill (**load factor 0.75**) the array doubles and all pairs are redistributed.

If you understood `HashSet` from the previous lessons, `HashMap` is almost the same — the `Entry` just stores the key as well.

## Implementing put (abridged)

```java
private boolean put(CarOwner key, Car value, Entry[] dst) {
    int position = getElementPosition(key, dst.length);
    Entry existed = dst[position];
    if (existed == null) {
        dst[position] = new Entry(key, value, null);
        return true;                                    // a new pair
    }
    while (true) {
        if (existed.key.equals(key)) {
            existed.value = value;                      // the key exists — overwrite
            return false;
        }
        if (existed.next == null) {
            existed.next = new Entry(key, value, null); // a collision — append to the chain
            return true;
        }
        existed = existed.next;
    }
}
```

:::warning "Keys must have equals and hashCode"
In the video the tests fail at first: `CarOwner` doesn't override `equals` and `hashCode`, so identical owners were treated as different keys. The rule from the `equals`/`hashCode` lesson in action.
:::

## HashMap complexity

| Operation | Best / average case | Worst case |
|---|---|---|
| `put`, `get`, `remove`, `containsKey` | **O(1)** | **O(log n)** (Java 8+), O(n) before |

Where O(log n) comes from: if **8** or more elements pile up in one bucket (`TREEIFY_THRESHOLD`), the chain turns into a **red-black tree**, as in `TreeSet`. Not every interviewer knows this — a nice plus in an interview.

:::note "A refinement to the video"
A bucket is turned into a tree only if the table capacity is at least **64** (`MIN_TREEIFY_CAPACITY`); otherwise `HashMap` simply grows the table. When a bucket drops back to ≤ 6 elements, the tree turns back into a list. Trees work best when keys implement `Comparable`.
:::

## HashSet is built on HashMap

```java
public class CarHashSet implements CarSet {
    private static final Object PRESENT = new Object();
    private final Map<Car, Object> map = new HashMap<>();

    public boolean add(Car car)      { return map.put(car, PRESENT) == null; }
    public boolean remove(Car car)   { return map.remove(car) != null; }
    public boolean contains(Car car) { return map.containsKey(car); }
    public int size()                { return map.size(); }
    public void clear()              { map.clear(); }
    public Iterator<Car> iterator()  { return map.keySet().iterator(); }
}
```

The set's elements are the `HashMap`'s **keys**, and every value is the same placeholder. That's exactly how `java.util.HashSet` is written.

## Interview questions

:::interview "From the video — with refinements"
1. **What is a Map?** — A collection of "key — value" pairs with unique keys.
2. **Main methods?** — `put`, `get`, `remove`, `containsKey`, `keySet`, `values`, `entrySet`, `size`, `clear`.
3. **Is Map part of the Collection hierarchy?** — No: it extends neither `Collection` nor `Iterable`. You iterate its views: `keySet()`, `values()`, `entrySet()`.
4. **Why was Map kept separate?** — Its methods (`put(k, v)`, `remove(key)`) don't match the `Collection` contract.
5. **How does HashMap work?** — An array of `Entry` buckets (key, value, next); position by the key's hash code; on a bucket match keys are compared with `equals`: equal — overwrite, not equal — a collision.
6. **How are collisions resolved?** — With a chain (a linked list) in the bucket; with 8+ elements (and capacity ≥ 64) — a red-black tree.
7. **Complexity?** — O(1) on average, O(log n) in the worst case.
8. **Is element order guaranteed?** — No.
9. **`put` with an existing key?** — The value is overwritten; the method returns the old value.
10. **How does HashSet work?** — It wraps a `HashMap`: elements are keys, the value is a shared placeholder.
:::

## What the video doesn't cover

### Useful Map methods (Java 8+)

```java
Map<String, Integer> counts = new HashMap<>();
counts.merge("java", 1, Integer::sum);              // a counter in one line
counts.getOrDefault("kotlin", 0);                    // 0 if the key is absent
counts.putIfAbsent("go", 0);
counts.computeIfAbsent("python", k -> 42);
for (Map.Entry<String, Integer> e : counts.entrySet()) {   // the right way to iterate a Map
    System.out.println(e.getKey() + " = " + e.getValue());
}
counts.forEach((k, v) -> System.out.println(k + " = " + v));
```

### Other details

- `HashMap` allows **one `null` key** and any number of `null` values.
- `Hashtable` is the legacy synchronised counterpart; for concurrency use `ConcurrentHashMap` (part 2 of the course).
- `Map.of("a", 1, "b", 2)` — an immutable `Map` (Java 9+).

## Homework

The video has no separate task — the author suggests writing `CarHashMap` on your own, by analogy with `CarHashSet`.

:::task easy "Your own CarHashMap"
Implement `CarHashMap` following the lesson's scheme and check it with the video's tests: 100 different keys → size 100; 100 insertions with 10 distinct keys → size 10; removal; `keySet`/`values`; `get`.
:::

:::task medium "A word counter"
Using a `HashMap<String, Integer>` and `merge`, count word frequencies in a text. Print the 10 most frequent words by sorting `entrySet()` by value in descending order (`Map.Entry.comparingByValue(Comparator.reverseOrder())`).
:::

:::task medium "HashSet via HashMap"
Rewrite your `CarHashSet` on top of `HashMap` as in the video ({{t j1 9:30:06}}) and make sure all the previous tests still pass.
:::

:::task hard "Bad hash codes and trees"
Create a key class `BadKey(int id)` whose `hashCode()` always returns 42. Add 100,000 keys to a `HashMap` and time `get` — first when `BadKey` does **not** implement `Comparable`, then when it does. Explain the difference based on how tree buckets work.
:::
