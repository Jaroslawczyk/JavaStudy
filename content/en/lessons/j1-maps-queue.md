Wrapping up collections: three kinds of `Set` and `Map` with different element order, the tricky question "how can you lose an element in a `HashMap`", and the **`Queue`** interface — FIFO and LIFO queues.

## Video timestamps

- {{t j1 9:33:24}} — a few more collections you need to know
- {{t j1 9:34:06}} — `HashSet`/`TreeSet`/`LinkedHashSet` and `HashMap`/`TreeMap`/`LinkedHashMap`
- {{t j1 9:35:04}} — `Linked…`: insertion order via links between elements
- {{t j1 9:35:42}} — an interview question: how `HashMap`, `equals` and `hashCode` relate
- {{t j1 9:36:03}} — experiment: changing a key's `id` after `put`
- {{t j1 9:38:06}} — `NullPointerException`: `get` returned `null`
- {{t j1 9:39:07}} — why: the key's hash code changed
- {{t j1 9:39:51}} — how to lose an element in a `Map`
- {{t j1 9:40:34}} — summary: which collection to choose
- {{t j1 9:41:12}} — the collection hierarchy and the `Queue` interface
- {{t j1 9:41:45}} — LIFO: a stack of plates
- {{t j1 9:42:46}} — the `Stack` class is outdated
- {{t j1 9:42:53}} — FIFO: a queue at a shop
- {{t j1 9:43:24}} — queue methods: `add`, `peek`, `poll`
- {{t j1 9:44:13}} — `LinkedList` implements both `List` and `Queue`
- {{t j1 9:44:29}} — the `CarQueue` interface, tests and implementation

## Element order: Hash, Linked, Tree

| Collection | Order | Main operations complexity |
|---|---|---|
| `HashSet` / `HashMap` | **None** (may change on growth) | O(1) |
| `LinkedHashSet` / `LinkedHashMap` | **Insertion order** | O(1) |
| `TreeSet` / `TreeMap` | **Sorted** (elements / keys) | O(log n) |

The `Linked…` versions work like the `Hash…` ones, but each element is additionally linked to the previous and next inserted element — as in `LinkedList`. That's why iteration preserves order. For `Tree…`, elements (keys) must implement `Comparable`, or you need a `Comparator`.

## How to lose an element in a HashMap

```java
Map<CarOwner, Car> map = new HashMap<>();
CarOwner key = new CarOwner(1, "Ivan", "Ivanov");
map.put(key, new Car("Brand1", 1));

key.setId(8);                     // changing a field hashCode depends on!

Car car = map.get(key);           // null — HashMap searches a different bucket
System.out.println(car.getBrand()); // NullPointerException
```

The key object is in the `Map` (`keySet()` shows it, already with `id = 8`), but it can't be found: on `put` the bucket was chosen by the old hash code, while `get` computes the new one.

:::interview "Interview question"
**When can an element get lost in a HashMap?** — When the key is a mutable object and, after `put`, a field used in `hashCode` changes. Takeaway: keys should be **immutable** — `String`, `Integer`, `record`s, classes with `final` fields.
:::

## Queues: FIFO and LIFO

- **LIFO** (Last In, First Out): a stack of plates. The structure is a **stack**.
- **FIFO** (First In, First Out): a checkout queue. The structure is a **queue**.

```java
Queue<String> queue = new ArrayDeque<>();
queue.offer("Anna");          // to the end
queue.offer("Boris");
queue.peek();                 // "Anna" — look at the first without removing
queue.poll();                 // "Anna" — take the first

Deque<String> stack = new ArrayDeque<>();
stack.push("plate 1");
stack.push("plate 2");
stack.pop();                  // "plate 2" — the last one in
```

### Queue methods: two flavours

| Action | Throws an exception | Returns a special value |
|---|---|---|
| Add to the end | `add(e)` | `offer(e)` → `false` |
| Take and remove the first | `remove()` | `poll()` → `null` |
| Look at the first | `element()` | `peek()` → `null` |

The video implements `CarQueue` with `add`, `peek`, `poll` on top of `CarLinkedList`: removing from the start of a linked list is O(1), from the start of an `ArrayList` O(n). That's why in the JDK `LinkedList` implements both `List` and `Queue` (more precisely, `Deque`).

:::outdated "Stack is outdated — use ArrayDeque"
The author mentions that the `Stack` class is outdated. It extends the synchronised `Vector` and is slow. Today stacks and queues use **`ArrayDeque`** — faster than both `Stack` and `LinkedList` (a circular buffer on an array, no nodes). `LinkedList` as a queue is only needed if you require `null` elements or `List` methods.
:::

## What the video doesn't cover

- **`PriorityQueue`** — a priority queue (a binary heap): `poll()` always returns the smallest element per the `Comparator`. `offer`/`poll` are O(log n).
- **`BlockingQueue`** (`ArrayBlockingQueue`, `LinkedBlockingQueue`) — thread-safe queues for the producer–consumer pattern (part 2 of the course).
- **`LinkedHashMap` as an LRU cache**: the constructor with `accessOrder = true` plus an overridden `removeEldestEntry` — a classic interview task.
- **Java 21 — Sequenced Collections**: `LinkedHashSet`, `LinkedHashMap`, `List`, `Deque` and `TreeSet` gained common methods `getFirst()`, `getLast()`, `reversed()`, `putFirst()`…

## Homework

The video has no tasks here — let's check understanding in practice.

:::task easy "Three Sets — three orders"
Add the same 10 words to a `HashSet`, a `LinkedHashSet` and a `TreeSet` and print all three. Explain the difference in order.
:::

:::task medium "The lost key"
Reproduce the video's experiment: a mutable key, `put`, change a field, `get`. Then make `CarOwner` immutable (`final` fields, no setters, or a `record`) and show that the problem is gone.
:::

:::task medium "Balanced brackets"
Using an `ArrayDeque` as a stack, write `boolean isBalanced(String s)` checking that the brackets `()[]{}` in a string are placed correctly: `"{[()]}"` → `true`, `"([)]"` → `false`. A classic interview task.
:::

:::task hard "An LRU cache"
Implement a class `LruCache<K, V>` with capacity `n` on top of a `LinkedHashMap` with `accessOrder = true`: when exceeding the capacity, the least recently accessed element is evicted. Cover it with tests. Then implement the same without `LinkedHashMap` — with a `HashMap` + your own doubly linked list (as in the `LinkedList` lesson).
??? Hint
```java
class LruCache<K, V> extends LinkedHashMap<K, V> {
    private final int capacity;
    LruCache(int capacity) {
        super(16, 0.75f, true);    // accessOrder = true
        this.capacity = capacity;
    }
    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        return size() > capacity;
    }
}
```
:::
