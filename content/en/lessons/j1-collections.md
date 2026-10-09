Java's built-in collections: **`ArrayList`** — a dynamic list, **`HashSet`** — a set without duplicates, **`TreeSet`** — a sorted set. Plus generic types in angle brackets `<>`, and something the video skips but you need from day one — **`HashMap`**.

## Video timestamps

- {{t j1 3:54:51}} — our collection's weakness: strings only
- {{t j1 3:55:12}} — the built-in `ArrayList`
- {{t j1 3:55:41}} — an untyped list stores anything — that's bad
- {{t j1 3:55:52}} — the element type in angle brackets `<String>`
- {{t j1 3:56:32}} — `add`, `size()`, `get(index)`
- {{t j1 3:57:45}} — `remove` by index and by value
- {{t j1 3:58:20}} — iterating with for-each
- {{t j1 3:58:59}} — `List<Integer>`: no primitives, wrappers needed
- {{t j1 4:00:14}} — summing the numbers in a list
- {{t j1 4:00:50}} — array or list?
- {{t j1 4:02:26}} — `HashSet`: no duplicates, no order
- {{t j1 4:04:40}} — `TreeSet`: a sorted set
- {{t j1 4:06:17}} — homework

## ArrayList

```java
import java.util.ArrayList;
import java.util.List;

List<String> employees = new ArrayList<>();
employees.add("Sergey");
employees.add("Natalia");
employees.add("Oleg");

System.out.println(employees.size());   // 3
System.out.println(employees.get(0));   // Sergey

employees.remove(0);            // by index
employees.remove("Natalia");    // by value (using equals)

for (String name : employees) {
    System.out.println(name);
}
```

- `List<String>` is a **generic** type: the compiler won't let you put anything but strings into the list.
- `new ArrayList<>()` is the "diamond": the type on the right is inferred from the declaration on the left.
- Without `<…>` (a raw type) the list accepts any `Object` — that's how code was written before Java 5; today it's a warning and a source of bugs.

### Reference types only

```java
List<int> nums;            // compile error
List<Integer> numbers = new ArrayList<>();
for (int i = 0; i <= 1000; i++) {
    numbers.add(i);        // autoboxing int → Integer
}
int sum = 0;
for (int n : numbers) {    // unboxing
    sum += n;
}
System.out.println(sum);   // 500500
```

### The most useful List methods

| Method | What it does |
|---|---|
| `add(e)` / `add(i, e)` | Add at the end / at an index |
| `get(i)` / `set(i, e)` | Get / replace |
| `remove(i)` / `remove(obj)` | Remove by index / by value |
| `size()` / `isEmpty()` | Size / is it empty |
| `contains(obj)` / `indexOf(obj)` | Is it there / where is it |
| `clear()` | Clear |
| `sort(null)` or `Collections.sort(list)` | Sorting |
| `getFirst()` / `getLast()` / `reversed()` | First / last / reversed view (Java 21+) |

:::warning "remove(1) on a List<Integer>"
`numbers.remove(1)` removes the element **at index 1**, not the number 1. To remove the value: `numbers.remove(Integer.valueOf(1))`. A classic trap with the `remove(int)` / `remove(Object)` overloads.
:::

## Array or list?

The author quotes the advice "always use a list instead of arrays" and uses arrays himself only for small, unchanging sets (animation frames in a game). In practice:

- **`List`** — the default for business logic: handy methods, grows by itself.
- **Array** — for fixed data, large amounts of primitives (`int[]` is far more compact than `List<Integer>`), low-level performance.

## HashSet and TreeSet

A **Set** stores no duplicates.

```java
Set<String> names = new HashSet<>();
names.add("Olga");
names.add("Ivan");
names.add("Olga");                  // not added
System.out.println(names.size());   // 2
```

| | `HashSet` | `LinkedHashSet` | `TreeSet` |
|---|---|---|---|
| Duplicates | no | no | no |
| Order | **none** (may change) | insertion order | **sorted** |
| `add`/`contains` speed | O(1) | O(1) | O(log n) |
| `get(index)` | no | no | no — iteration only |

:::note "Strings sort as strings"
In the video a `TreeSet` of the strings `"15"`, `"3"`, `"4"` printed `15, 3, 4` — strings are compared **character by character** (lexicographically). With `TreeSet<Integer>` numbers sort by value.
:::

## What the video doesn't cover

### Program to interfaces

```java
List<String> list = new ArrayList<>();        // good: the variable type is the interface
ArrayList<String> list2 = new ArrayList<>();  // worse: tied to an implementation
```

This way you can swap the implementation (`ArrayList` → `LinkedList`) without touching the rest of the code.

### Immutable collections (Java 9+)

```java
List<String> days = List.of("Mon", "Tue", "Wed");
Set<Integer> primes = Set.of(2, 3, 5, 7);
days.add("Thu");   // UnsupportedOperationException
```

### Removing while iterating

```java
for (String name : employees) {
    if (name.startsWith("O")) employees.remove(name);   // ConcurrentModificationException!
}
employees.removeIf(name -> name.startsWith("O"));       // correct (lambdas — part 2)
```

### HashMap — a "key → value" dictionary

The author says only `ArrayList` will be used in the course, but in real projects **`Map` is used as often as `List`**:

```java
Map<String, Integer> salaries = new HashMap<>();
salaries.put("Ivan", 5000);
salaries.put("Anna", 6500);
salaries.put("Ivan", 5500);                       // keys are unique: the value is overwritten

System.out.println(salaries.get("Anna"));         // 6500
System.out.println(salaries.getOrDefault("Peter", 0)); // 0
System.out.println(salaries.containsKey("Ivan")); // true

for (Map.Entry<String, Integer> e : salaries.entrySet()) {
    System.out.println(e.getKey() + " → " + e.getValue());
}
```

How `HashMap` works inside (the hash function, buckets, `equals`/`hashCode`) is covered in detail in **part 2 of the course**, where the author writes his own implementations of all the main collections.

### Map of the Collections Framework

```text
Iterable
 └─ Collection
     ├─ List   → ArrayList, LinkedList
     ├─ Set    → HashSet, LinkedHashSet, TreeSet
     └─ Queue  → ArrayDeque, PriorityQueue, LinkedList
Map (a separate hierarchy) → HashMap, LinkedHashMap, TreeMap
```

## Homework

:::task video "Three collections — from the video"
Create three collections: the first holds the numbers 1 to 10; the second holds student names (as many as there are numbers); the third holds strings like "number, name" filled in a loop from the first two. Print the third collection with a for-each loop. {{t j1 4:06:17}}
??? Hint
Use a regular index-based `for` to take elements from both collections at once: `result.add(numbers.get(i) + ", " + students.get(i));`.
:::

:::task easy "Unique words"
Given a sentence, print the number of words and the number of **unique** words (case-insensitive) using `split` and a `HashSet`. Then print the unique words alphabetically using a `TreeSet`.
:::

:::task medium "Word frequency"
Count how many times each word occurs in a text using a `HashMap<String, Integer>`. Print the 3 most frequent words.
??? Hint
`counts.put(word, counts.getOrDefault(word, 0) + 1);` — or shorter: `counts.merge(word, 1, Integer::sum);`.
:::

:::task medium "Cleaning a list"
Fill a `List<Integer>` with 20 random numbers from 1 to 50. Remove all even numbers (with an `Iterator` or `removeIf`), then remove duplicates **keeping the order** (hint: `LinkedHashSet`). Print the result after each step.
:::

:::task hard "Phone book"
Implement a `PhoneBook` class on top of `Map<String, List<String>>`: one person may have several numbers. Methods: `add(name, phone)`, `List<String> find(name)` (an empty list if absent), `removeNumber(phone)`, `printAll()` — in alphabetical order of names. Think about which `Map` to choose so the output is sorted without a separate sort.
??? Hint
`TreeMap` keeps its keys sorted. To add: `book.computeIfAbsent(name, k -> new ArrayList<>()).add(phone);` — or manually: `if (!book.containsKey(name)) book.put(name, new ArrayList<>());`.
:::
