A new requirement: the registry must never contain two identical cars. Checking for duplicates by scanning is O(n) per addition. The solution is a **set** built on a **hash table**: we write `CarHashSet`, look at collisions and the load factor, then move the shared methods into a `CarCollection` interface.

## Video timestamps

- {{t j1 7:36:08}} — the requirement: no identical cars
- {{t j1 7:36:40}} — why checking in a `List` is too expensive
- {{t j1 7:37:12}} — the `CarSet` interface: `add`, `remove`, `size`, `clear`
- {{t j1 7:37:58}} — write the tests yourself
- {{t j1 7:38:26}} — tests: three identical objects → size +1
- {{t j1 7:42:04}} — theory: an `Entry` array of 16 cells, position = hash code % 16
- {{t j1 7:43:08}} — a collision: a chain via `next`
- {{t j1 7:44:20}} — the load factor 0.75
- {{t j1 7:45:07}} — positions are recalculated after growth
- {{t j1 7:45:38}} — the `CarHashSet` implementation
- {{t j1 7:47:14}} — an element's position and `Math.abs`
- {{t j1 7:48:24}} — the `add` method
- {{t j1 7:52:53}} — the `remove` method
- {{t j1 7:57:22}} — growing the table and recalculating positions
- {{t j1 8:02:06}} — the load factor in code
- {{t j1 8:03:36}} — questions about `HashSet`
- {{t j1 8:06:24}} — a shared `CarCollection` interface
- {{t j1 8:09:56}} — the hierarchy: `Collection` → `List`, `Set`
- {{t j1 8:10:28}} — homework: `contains`
- {{t j1 8:14:11}} — refactoring: a shared `findElement`

## A hash table

```text
index:   0      1      2      3      4                    …   15
       [null] [null] [null] [null] [Entry 20]→[Entry 36]  …  [null]
                                      (20 % 16 = 4, 36 % 16 = 4 — a collision)
```

1. Inside is an array of "buckets" holding `Entry { value, next }` objects, **16** cells initially.
2. An element's position = `hashCode() % array length`.
3. If the bucket is empty, put it there. If it's taken, compare with **`equals`**: equal — a duplicate, don't add; not equal — a **collision**: walk the `next` chain and append to the end.
4. When there are more elements than `length × 0.75` (the **load factor**), the array **doubles** and all elements are **redistributed** — since `hashCode % 32` is no longer the same as `% 16`.

The element order is defined by hash codes, not insertion order — hence the "chaotic" output and no index access.

## The CarHashSet implementation (abridged)

```java
public class CarHashSet implements CarSet {
    private static final int INITIAL_CAPACITY = 16;
    private static final double LOAD_FACTOR = 0.75;
    private Entry[] array = new Entry[INITIAL_CAPACITY];
    private int size = 0;

    private static class Entry {
        private final Car value;
        private Entry next;
        Entry(Car value, Entry next) { this.value = value; this.next = next; }
    }

    @Override
    public boolean add(Car car) {
        if (size >= array.length * LOAD_FACTOR) {
            increaseArray();
        }
        boolean added = add(car, array);
        if (added) size++;
        return added;
    }

    private boolean add(Car car, Entry[] dst) {
        int position = getElementPosition(car, dst.length);
        if (dst[position] == null) {
            dst[position] = new Entry(car, null);
            return true;
        }
        Entry existed = dst[position];
        while (true) {
            if (existed.value.equals(car)) return false;        // a duplicate
            if (existed.next == null) {
                existed.next = new Entry(car, null);             // append to the chain
                return true;
            }
            existed = existed.next;
        }
    }

    private int getElementPosition(Car car, int arrayLength) {
        return Math.abs(car.hashCode() % arrayLength);
    }

    private void increaseArray() {
        Entry[] newArray = new Entry[array.length * 2];
        for (Entry entry : array) {
            for (Entry e = entry; e != null; e = e.next) {
                add(e.value, newArray);                          // recalculating positions
            }
        }
        array = newArray;
    }

    // remove, contains, size, clear — see the video
}
```

:::warning "Element classes must implement equals and hashCode correctly"
A hash collection finds the bucket via `hashCode()` and compares elements via `equals()`. If `Car` overrides only `equals`, two identical cars land in different buckets — and the set ends up with duplicates (question 3 below).
:::

## HashSet complexity

| Operation | Average case | Worst case |
|---|---|---|
| `add`, `remove`, `contains` | **O(1)** | O(n) when every element is in one bucket (O(log n) in the real JDK, see the `HashMap` lesson) |

## Interview questions

:::interview "From the video"
1. **Why does a Set have no `get(index)`, `remove(index)`, `add(e, index)`?** — An element's position is determined by its hash code, not by order; there's no notion of an "index".
2. **Is the order of elements in a HashSet guaranteed?** — No: elements are placed by hash code and redistributed when the table grows.
3. **What happens if you override `equals` but not `hashCode`?** — Identical objects get different hash codes and different buckets: duplicates get added, `contains`/`remove` behave unpredictably.
4. **What if `hashCode` always returns 1?** — Every element goes into one bucket, which degenerates into a list: operations become O(n).
5. **Why does Set have its own interface instead of implementing List?** — A Set can't implement `List`'s index methods; the shared methods were moved up into the parent `Collection`.
:::

## What the video doesn't cover

### The Math.abs trap

The video takes the absolute value **after** the remainder — `Math.abs(hash % n)` — and that's safe. But the common "reverse" variant, `Math.abs(hash) % n`, breaks: `Math.abs(Integer.MIN_VALUE)` returns the **negative** `-2147483648` (see the overloading lesson), and when the array length isn't a power of two the index becomes negative. The clearest option is `Math.floorMod(hash, n)`: the result is always within `[0, n)`.

### How the JDK does it

- The table capacity is always a **power of two**, and the index is computed bitwise: `(n - 1) & (h ^ (h >>> 16))` — faster than division and better at "mixing" poor hash codes.
- The real `HashSet` has no hash table of its own at all: inside it is a **`HashMap`** whose keys are the elements (see the `HashMap` lesson).
- `HashSet` allows one `null`.
- If order matters — `LinkedHashSet` (insertion order) or `TreeSet` (sorted).

## Homework

:::task video "The contains method — from the video"
Add `boolean contains(Car car)` to the shared `CarCollection` interface, write tests for it and implement it in all three collections: `CarArrayList`, `CarLinkedList`, `CarHashSet`. {{t j1 8:10:28}}
??? Hint
In the lists it's convenient to extract the search into `private int findElement(Car car)` (returns an index or −1) and express both `remove` and `contains` with it: `return findElement(car) != -1;`. In `CarHashSet` — like `remove`, but without relinking. Walkthrough: {{t j1 8:10:58}}
:::

:::task easy "Unique words"
Using a `HashSet<String>`, print how many unique words a long text contains (e.g. the first chapter of a classic novel), and compare the time with a naive duplicate search in an `ArrayList`.
:::

:::task medium "floorMod and powers of two"
First confirm the trap: with an array length of 10, compute `Math.abs(Integer.MIN_VALUE) % 10` — you get a negative index. Then change `CarHashSet`: the capacity is a power of two, the position is `(n - 1) & (h ^ (h >>> 16))`. Write a test with an object whose `hashCode()` returns `Integer.MIN_VALUE` and make sure adding and searching work.
:::

:::task hard "Collision statistics"
Add a method to `CarHashSet` returning the longest chain length and the share of empty buckets. Compare three `hashCode` implementations for `Car`: `Objects.hash(brand, number)`, `brand.hashCode() + number` (from the video) and `number` — on 100,000 cars. Which gives fewer collisions and why?
:::
