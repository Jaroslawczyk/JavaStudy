A new requirement: cars must be stored **sorted** by brand, with no duplicates. Sorting on every insertion is very expensive. The solution is **`TreeSet`**, built on a balanced tree. We look at the tree idea, O(log n) complexity, and the **`Comparable`** and **`Comparator`** interfaces.

## Video timestamps

- {{t j1 8:39:48}} — a theory lesson: trees
- {{t j1 8:40:22}} — the task: sorting by brand without duplicates
- {{t j1 8:40:57}} — how a tree grows: smaller — left, bigger — right
- {{t j1 8:41:51}} — complexity: the number of steps = the tree height
- {{t j1 8:42:33}} — O(log n) for insertion, removal and lookup
- {{t j1 8:43:20}} — a `TreeSet<Integer>` with random numbers
- {{t j1 8:45:02}} — the elements are sorted and unique
- {{t j1 8:45:28}} — `TreeSet<Car>` → `ClassCastException`
- {{t j1 8:46:48}} — implementing `Comparable<Car>` and `compareTo`
- {{t j1 8:48:44}} — comparing strings with `compareTo`
- {{t j1 8:49:28}} — a `Comparator` in the `TreeSet` constructor
- {{t j1 8:50:51}} — practice: sorting numbers in descending order
- {{t j1 8:52:45}} — summary: `TreeSet` vs `HashSet`

## How a tree works

```text
Adding 10, 30, 25, 5, 40:

        10
       /  \
      5    30
          /  \
        25    40
```

Each new element is compared with nodes starting from the root: smaller — go left, bigger — go right, until a free spot is found. To find, add or remove an element you walk not all elements but only the path from the root — the **tree height**.

`TreeSet` uses a **red-black tree**, which keeps itself balanced (height at most ~2·log₂ n). Therefore:

| `TreeSet` operation | Complexity |
|---|---|
| `add`, `remove`, `contains` | **O(log n)** |

**O(log n)** is worse than O(1) but far better than O(n): for a million elements it's ~20 steps, for a billion ~30.

## TreeSet in code

```java
Set<Integer> numbers = new TreeSet<>();
for (int i = 0; i < 100; i++) {
    numbers.add((int) (Math.random() * 10));
}
System.out.println(numbers);   // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] — sorted and unique
```

## Comparable — the natural order

For `TreeSet` to know how to sort your objects, the class implements `Comparable<T>`:

```java
public class Car implements Comparable<Car> {
    private final String brand;
    private final int number;
    // constructor, getters…

    @Override
    public int compareTo(Car other) {
        return brand.compareTo(other.brand);      // < 0, 0 or > 0
    }
}
```

Without `Comparable`, putting a `Car` into a `TreeSet` throws `ClassCastException: Car cannot be cast to Comparable`.

## Comparator — an external order

If you can't change the class or need a custom order, pass a **comparator** to the constructor:

```java
Set<Car> cars = new TreeSet<>(new Comparator<Car>() {
    @Override
    public int compare(Car o1, Car o2) {
        return o1.getBrand().compareTo(o2.getBrand());
    }
});

// the same, the modern way:
Set<Car> cars2 = new TreeSet<>(Comparator.comparing(Car::getBrand));

// numbers in descending order:
Set<Integer> desc = new TreeSet<>(Comparator.reverseOrder());
```

:::warning "TreeSet compares only via compareTo"
`TreeSet` **doesn't use `equals`**: two objects are considered the same if `compareTo` returns 0. If cars are compared only by brand, `BMW #1` and `BMW #2` become "duplicates" — the second simply isn't added! In the video every car has a different brand (`Brand0`, `Brand1`…), so the problem stays hidden, but with real data it shows up immediately. Make the comparison complete:

```java
Comparator.comparing(Car::getBrand).thenComparingInt(Car::getNumber)
```

The rule: the `compareTo` order should be **consistent with `equals`**.
:::

:::tip "Don't subtract numbers in compare"
`return a - b;` is a popular mistake: with large values the difference overflows (see the integer types lesson) and sorting breaks. Use `Integer.compare(a, b)`. For reverse order use `Comparator.reverseOrder()` or `b.compareTo(a)` rather than negating the result.
:::

## What the video doesn't cover

### NavigableSet features

`TreeSet` can do things `HashSet` can't:

```java
TreeSet<Integer> set = new TreeSet<>(List.of(10, 20, 30, 40, 50));
set.first();          // 10
set.last();           // 50
set.floor(35);        // 30 — the greatest ≤ 35
set.ceiling(35);      // 40 — the smallest ≥ 35
set.headSet(30);      // [10, 20]
set.tailSet(30);      // [30, 40, 50]
set.descendingSet();  // [50, 40, 30, 20, 10]
```

### Other details

- `TreeSet` is built on **`TreeMap`** internally (as `HashSet` is on `HashMap`).
- You can't put `null` into a `TreeSet` — a `NullPointerException` during comparison.
- A plain list can be sorted without `TreeSet`: `list.sort(Comparator.comparing(Car::getBrand))` — O(n log n) once.

## Interview questions

:::interview "From the video"
1. **Similarities and differences between TreeSet and HashSet?** — Both implement `Set` and store no duplicates. `TreeSet` keeps elements sorted, `HashSet` keeps no order.
2. **What objects can a TreeSet hold?** — Those implementing `Comparable`, or any objects if a `Comparator` is passed to the constructor.
3. **Operation complexity?** — `HashSet` O(1) on average, `TreeSet` O(log n).
4. **Which to choose?** — Need sorting — `TreeSet`; don't — `HashSet` (faster).
5. **I created a `User` class with a `name` field and add objects to a TreeSet. How will they be sorted?** — A trick question: if `User` doesn't implement `Comparable` and no comparator is passed, the program fails with `ClassCastException`.
:::

## Homework

:::task video "Numbers in descending order — from the video"
Bring back the `TreeSet<Integer>` example and make the numbers sort in descending order: first with a manual `compare` using `if`, then via `compareTo`, then via `Comparator.reverseOrder()`. {{t j1 8:50:51}}
:::

:::task easy "An alphabetical dictionary"
Read a text, split it into words and print the unique words in case-insensitive alphabetical order (`String.CASE_INSENSITIVE_ORDER`).
:::

:::task medium "Find the duplicates bug"
Put the cars `BMW 1`, `BMW 2`, `Audi 7` into a `TreeSet` with a brand-only comparator and print the size. Fix it with `thenComparingInt`. Then write a test checking that `compareTo` is consistent with `equals` for 1000 random cars.
:::

:::task hard "A player ranking"
A `Player(name, score)` class. Keep players in a `TreeSet` sorted by score descending, then by name for ties. Implement: the top 3 players, everyone above a given score threshold (`headSet`/`tailSet`), and updating a player's score. Why can't you just change `score` on an object that's already in the `TreeSet`?
??? Hint
When a field used in comparison changes, the object ends up "in the wrong place" in the tree, and neither `contains` nor `remove` will find it. The right way: remove → change → add again (or make `Player` immutable and create a new object).
:::
