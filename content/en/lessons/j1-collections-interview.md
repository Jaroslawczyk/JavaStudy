The final "interview" on collections: questions from real interviews. Work as in the video — read the question, **answer out loud**, and only then open the answer. The answers below are refined with the corrections from previous lessons.

:::tip "How to practise"
Answering out loud isn't the same as "running it in your head". Record yourself or ask a friend to play the interviewer. Mark the questions where you stumbled and go back to the corresponding lessons.
:::

## Video timestamps

- {{t j1 9:49:38}} — how to approach this "interview"
- {{t j1 9:50:34}} — questions 1–7: hierarchy, List, Set
- {{t j1 9:53:24}} — questions 8–9: `equals` and `hashCode`
- {{t j1 9:54:11}} — questions 10–15: `Map`, `HashMap`, `HashSet`
- {{t j1 9:55:51}} — questions 16–21: algorithmic complexity
- {{t j1 9:57:43}} — the end of the section

## Questions

:::task video "1. Describe the Collection Framework hierarchy"
{{t j1 9:50:34}}
??? Answer
At the top is `Iterable` (it makes for-each work). Below it is `Collection`, which `List`, `Set` and `Queue` extend. Main implementations: `List` — `ArrayList`, `LinkedList`; `Set` — `HashSet`, `LinkedHashSet`, `TreeSet`; `Queue`/`Deque` — `ArrayDeque`, `LinkedList`, `PriorityQueue`. `Map` stands separately: `HashMap`, `LinkedHashMap`, `TreeMap`.
:::

:::task video "2. How do LinkedList and ArrayList differ?"
{{t j1 9:51:14}}
??? Answer
`ArrayList` is backed by a dynamic array, `LinkedList` by a doubly linked list of nodes (and also implements `Deque`). Hence the different operation complexities and memory use (a `LinkedList` node is heavier than an array reference).
:::

:::task video "3. When to use LinkedList and when ArrayList?"
{{t j1 9:51:27}}
??? Answer
By default — `ArrayList`: fast index access, compactness, CPU-cache friendliness. `LinkedList` — with many insertions/removals at the start or at a position where an iterator already stands. For queues and stacks `ArrayDeque` is better.
:::

:::task video "4. How does List differ from Set?"
{{t j1 9:51:42}}
??? Answer
A `List` keeps elements in order, allows duplicates and offers index access. A `Set` allows no identical elements and has no index methods (`get`, `remove(index)`, `add(index, e)`).
:::

:::task video "5. If Set has no get, how do you print all its elements?"
{{t j1 9:52:09}}
??? Answer
`Set` extends `Iterable`, so it's traversed with for-each (or an iterator, or `stream()`/`forEach`).
:::

:::task video "6. The main Set implementations and their differences?"
{{t j1 9:52:19}}
??? Answer
`HashSet` — no order, O(1); `LinkedHashSet` — insertion order, O(1); `TreeSet` — sorted, O(log n).
:::

:::task video "7. A User class with a name field — how will a TreeSet sort them?"
{{t j1 9:52:46}}
??? Answer
A trick question: if `User` doesn't implement `Comparable` and no `Comparator` is passed to the `TreeSet` constructor, the program fails with a `ClassCastException` on insertion.
:::

:::task video "8. What are equals and hashCode, why are they needed?"
{{t j1 9:53:24}}
??? Answer
Methods of `Object`. `equals` compares objects by contents (by reference by default). `hashCode` returns an `int` — the object's numeric representation; hash collections (`HashSet`, `HashMap`) use it to choose a bucket.
:::

:::task video "9. What are the rules for equals and hashCode?"
{{t j1 9:53:50}}
??? Answer
Override `equals` — override `hashCode`. Objects equal by `equals` must have equal hash codes. Different hash codes — the objects are definitely different. Equal hash codes don't guarantee equality (a collision). Plus the `equals` contract: reflexive, symmetric, transitive, consistent, `equals(null) == false`.
:::

:::task video "10. What is a Map for?"
{{t j1 9:54:11}}
??? Answer
To store "key — value" pairs and quickly get a value by its key.
:::

:::task video "11. Can a Map have two identical keys? Two identical values?"
{{t j1 9:54:23}}
??? Answer
Keys — no (a repeated `put` overwrites the value). Values — yes.
:::

:::task video "12. How does HashMap work?"
{{t j1 9:54:31}}
??? Answer
An array of buckets (16 initially) of `Entry`/`Node` objects (hash, key, value, next). The position is based on the key's hash code. Bucket empty — put the pair. Taken — compare keys with `equals`: equal — overwrite the value, not equal — a collision. At 75 % fill (the load factor) the table doubles and pairs are redistributed.
:::

:::task video "13. How are collisions resolved in HashMap?"
{{t j1 9:55:04}}
??? Answer
By chaining: the new element is appended to the bucket's linked list. If a bucket reaches 8+ elements and the table capacity is ≥ 64, the list turns into a red-black tree (Java 8+).
:::

:::task video "14. How can you lose an element in a HashMap?"
{{t j1 9:55:21}}
??? Answer
Use a mutable object as a key and, after `put`, change a field used in `hashCode`: `get` will search a different bucket. That's why keys should be immutable.
:::

:::task video "15. How does HashSet work?"
{{t j1 9:55:36}}
??? Answer
It wraps a `HashMap`: the set's elements are stored as keys, and every value is the same placeholder object.
:::

:::task video "16. Complexity of inserting at the start/middle: ArrayList and LinkedList?"
{{t j1 9:55:51}}
??? Answer
`ArrayList` — O(n) due to shifting. `LinkedList` — O(n) including finding the position by index; the relinking itself is O(1), so inserting at the start/end or via a `ListIterator` is O(1). (The video gives O(1) for `LinkedList` — add the caveat in an interview.)
:::

:::task video "17. Complexity of getting by index?"
{{t j1 9:56:10}}
??? Answer
`ArrayList` — O(1), `LinkedList` — O(n).
:::

:::task video "18. Complexity of removal by index?"
{{t j1 9:56:24}}
??? Answer
`ArrayList` — O(n). `LinkedList` — O(n) to find the node + O(1) to relink; removing the first/last element — O(1).
:::

:::task video "19. Complexity of removal by value (all collections)?"
{{t j1 9:56:30}}
??? Answer
`ArrayList` O(n); `LinkedList` O(n) — the search, the removal itself O(1) (as the video says); `HashSet`/`HashMap` O(1) on average, O(log n) worst case; `TreeSet` O(log n).
:::

:::task video "20. Complexity of contains?"
{{t j1 9:57:16}}
??? Answer
`ArrayList`, `LinkedList` — O(n); `HashSet`, `HashMap.containsKey` — O(1) on average (O(log n) worst case); `TreeSet` — O(log n).
:::

:::task video "21. Complexity of insertion without an index?"
{{t j1 9:57:27}}
??? Answer
O(1) for all except `TreeSet` (O(log n)). Amortised for `ArrayList` due to occasional array growth.
:::

## Extra questions (not from the video, but common)

:::task easy "Comparable vs Comparator"
How do they differ, and when do you use which?
??? Answer
`Comparable` is the "natural order", implemented by the class itself (`compareTo`). `Comparator` is an external order, a separate object (`compare`); needed when you can't change the class or need several orders.
:::

:::task medium "Fail-fast iterators"
What is a `ConcurrentModificationException`, and how do you remove elements correctly during iteration?
??? Answer
JDK collection iterators are fail-fast: if the collection is structurally modified other than through the iterator during traversal, the next `next()` throws (a `modCount` check). Remove via `iterator.remove()` or `collection.removeIf(...)`.
:::

:::task medium "HashMap and multithreading"
Why can't `HashMap` be used from several threads, and what should you use instead?
??? Answer
`HashMap` isn't synchronised: concurrent `put`s may lose data or corrupt the structure. Options: `ConcurrentHashMap` (the main choice), `Collections.synchronizedMap` (one lock for everything); the legacy `Hashtable` isn't used. Details in part 2 of the course.
:::

:::task hard "Design a structure"
You need a structure storing users by `id` with O(1) access, able to list them in registration order and evict the oldest when a limit is exceeded. Which JDK collections would you use and why?
??? Answer
`LinkedHashMap<Long, User>` — O(1) by key and insertion order; evict the oldest via `removeEldestEntry` or `SequencedMap`'s `pollFirstEntry()` (Java 21+).
:::
