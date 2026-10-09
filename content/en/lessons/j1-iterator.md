How do you go over a `Set` if it has no `get(index)`? With **for-each** — which works with any object implementing **`Iterable`**. We implement iterators for all three of our collections and go through the first mini-interview on collections.

## Video timestamps

- {{t j1 8:17:46}} — how to print every element of a `Set` without `get`
- {{t j1 8:18:12}} — for-each over the standard collections works
- {{t j1 8:19:16}} — over our `CarList` — a compile error
- {{t j1 8:19:38}} — for-each relies on the `Iterable` interface
- {{t j1 8:20:25}} — `Collection` extends `Iterable` — the top of the hierarchy
- {{t j1 8:20:43}} — `CarCollection extends Iterable<Car>`
- {{t j1 8:21:33}} — a for-each test
- {{t j1 8:22:41}} — the `iterator()` method and the `Iterator` object
- {{t j1 8:23:02}} — the `hasNext()` and `next()` methods
- {{t j1 8:23:18}} — what for-each turns into
- {{t j1 8:24:16}} — an iterator for `CarArrayList`
- {{t j1 8:25:11}} — `index++` vs `++index`
- {{t j1 8:26:29}} — an iterator for `CarLinkedList`
- {{t j1 8:28:07}} — an iterator for `CarHashSet` — trickier
- {{t j1 8:32:04}} — a `NullPointerException` and the fix — tests to the rescue
- {{t j1 8:34:24}} — a mini-interview on what we've covered

## for-each under the hood

```java
for (Car car : cars) {
    System.out.println(car);
}
```

the compiler turns into:

```java
Iterator<Car> iterator = cars.iterator();
while (iterator.hasNext()) {
    Car car = iterator.next();
    System.out.println(car);
}
```

That's why for-each works with arrays and with any class implementing `Iterable<T>` — an interface with a single method `Iterator<T> iterator()`.

```text
Iterable
 └─ Collection
     ├─ List  → ArrayList, LinkedList
     └─ Set   → HashSet, TreeSet, LinkedHashSet
```

## Iterators for our collections

```java
// CarArrayList
@Override
public Iterator<Car> iterator() {
    return new Iterator<>() {
        private int index = 0;

        @Override
        public boolean hasNext() {
            return index < size;
        }

        @Override
        public Car next() {
            return array[index++];     // return array[index] first, then increment
        }
    };
}
```

```java
// CarLinkedList
@Override
public Iterator<Car> iterator() {
    return new Iterator<>() {
        private Node node = first;

        @Override
        public boolean hasNext() {
            return node != null;
        }

        @Override
        public Car next() {
            Car car = node.value;
            node = node.next;
            return car;
        }
    };
}
```

```java
// CarHashSet: find a non-empty bucket, then walk its chain
@Override
public Iterator<Car> iterator() {
    return new Iterator<>() {
        private int index = 0;         // how many elements we've returned
        private int arrayIndex = 0;    // the current bucket
        private Entry entry;           // the current chain element

        @Override
        public boolean hasNext() {
            return index < size;
        }

        @Override
        public Car next() {
            while (array[arrayIndex] == null) {
                arrayIndex++;
            }
            if (entry == null) {
                entry = array[arrayIndex];
            }
            Car result = entry.value;
            entry = entry.next;
            if (entry == null) {
                arrayIndex++;
            }
            index++;
            return result;
        }
    };
}
```

:::tip "Tests catch bugs"
In the video the author mistakenly wrote the condition `!= null` instead of `== null` in the bucket-search loop — the test immediately failed with a `NullPointerException`. That's exactly why tests are written before the implementation.
:::

## What the video doesn't cover

### The Iterator contract

- `next()` must throw `NoSuchElementException` when there are no more elements — our learning versions don't; add `if (!hasNext()) throw new NoSuchElementException();`.
- There's an optional `remove()` method — removes the last returned element **during** iteration. It's the only safe way to remove while iterating:

```java
Iterator<Car> it = cars.iterator();
while (it.hasNext()) {
    if (it.next().getNumber() < 10) {
        it.remove();          // safe
    }
}
```

### Fail-fast and ConcurrentModificationException

JDK collection iterators are **fail-fast**: if the collection is modified other than through the iterator during iteration, the next `next()` throws `ConcurrentModificationException`. Internally the collection keeps a modification counter `modCount`, and the iterator compares it with its own copy.

### ListIterator

Lists offer `listIterator()` — it moves in both directions (`previous()`) and can `set` and `add` at the current position. With it, insertion into a `LinkedList` really is O(1) (see the `LinkedList` lesson).

## Mini-interview

:::interview "Questions from the video — with refined answers"
1. **The Collection Framework hierarchy?** — `Iterable` → `Collection` → `List` (`ArrayList`, `LinkedList`), `Set` (`HashSet`, `LinkedHashSet`, `TreeSet`), `Queue`. `Map` stands separately.
2. **How do Set and List differ?** — A Set stores no duplicates and has no index methods.
3. **ArrayList vs LinkedList?** — An array vs a doubly linked list of nodes; details and corrections in the `LinkedList` lesson.
4. **Complexity of insertion without an index?** — `ArrayList`, `LinkedList`, `HashSet` — O(1) (amortised for `ArrayList`).
5. **Insertion with an index?** — `ArrayList` O(n); `LinkedList` O(n) including finding the node (O(1) at the start/end); impossible for a `Set`.
6. **`contains`?** — `ArrayList` and `LinkedList` O(n); `HashSet` O(1) on average.
7. **When to use what?** — `ArrayList` by default; `HashSet` when you need unique elements and order doesn't matter; `LinkedList` rarely (see its lesson).
8. **How is memory organised? Will the GC remove objects referencing each other?** — Stack/heap; yes, if they're unreachable from the roots.
9. **The equals/hashCode rules? Why hashCode?** — See the `equals`/`hashCode` lesson; the hash code determines the bucket in a hash table.
10. **What happens to a HashSet if only equals is overridden?** — Duplicates; `contains`/`remove` fail to find existing elements.
:::

## Homework

:::task video "Iterators for your collections — from the video"
Implement `Iterable<Car>` in all three collections (`CarArrayList`, `CarLinkedList`, `CarHashSet`) and check with a test that for-each visits exactly 100 elements. The author suggests trying `CarLinkedList` and `CarHashSet` on your own first. {{t j1 8:26:29}}
:::

:::task easy "NoSuchElementException"
Add a `hasNext()` check to `next()` in all three iterators, throwing `NoSuchElementException`, plus a test for this behaviour.
:::

:::task medium "Iterator.remove()"
Implement `remove()` in `CarArrayList`'s iterator: it removes the last element returned by `next()` and adjusts the internal index correctly. A second `remove()` without `next()` must throw `IllegalStateException`.
:::

:::task hard "Fail-fast"
Add a `modCount` counter to `CarArrayList`, incremented on every structural change (`add`, `remove`, `clear`). The iterator remembers it on creation and in `next()` throws `ConcurrentModificationException` if the values diverge. Write a test: removing from the list inside for-each must fail, while removing via `iterator.remove()` must work.
:::
