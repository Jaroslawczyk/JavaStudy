The final "interview" on the whole course: 2–3 questions from each topic — OOP, collections, generics, concurrency, streams, I/O. This is how a real Java SE technical interview goes. Answer each question out loud; where you're unsure, go back to the lesson via the timestamp link.

:::tip "How to prepare for a real interview"
Don't memorise text — explain in your own words and give a code example. For a question you can't answer, honestly say "I don't know, but I'd reason like this…". An interview, even a failed one, is useful experience: write down the questions and close the gaps. What else gets asked at Junior and Middle level — on the [Levels](#/page/levels) page.
:::

## Video timestamps

- {{t j2 7:22:50}} — the final interview format
- {{t j2 7:23:51}} — OOP, overloading, static, modifiers, interfaces
- {{t j2 7:27:36}} — collections
- {{t j2 7:31:05}} — generics
- {{t j2 7:31:37}} — concurrency
- {{t j2 7:35:02}} — the Stream API
- {{t j2 7:36:16}} — serialisation and I/O
- {{t j2 7:37:30}} — the author's parting words

## OOP and basics

:::task video "1. The principles of OOP. What is polymorphism? A real-life example."
{{t j2 7:23:51}}
??? Answer
Encapsulation, inheritance, polymorphism (+ abstraction). Polymorphism is "one interface, many implementations": a method taking an interface type behaves differently depending on the actual object. Example — cars with the same controls but different behaviour.
:::

:::task video "2. What is overloading? Can methods with the same name differ only in return type?"
{{t j2 7:24:44}}
??? Answer
Overloading — methods with the same name and different parameters (number, types, order) in one class. Differing only in return type is a compile error.
:::

:::task video "3. Static and non-static members. What can access what?"
{{t j2 7:25:20}}
??? Answer
Static members belong to the class and are available without an object; non-static ones belong to an object. A static method can access only static members (non-static ones don't exist without an object); a non-static method can access both.
:::

:::task video "4. Access modifiers"
{{t j2 7:26:08}}
??? Answer
`public` — everywhere; `protected` — package + subclasses; package-private (no modifier) — within the package; `private` — within the class. (The video mentions only subclasses for `protected` — it's visible to the whole package too.)
:::

:::task video "5. Abstract class vs interface"
{{t j2 7:26:32}}
??? Answer
An interface is a contract/behaviour, without state (constants only), multiple implementation; since Java 8 it has `default`/`static` methods, since Java 9 — `private` ones. An abstract class is a common entity of related classes: fields, constructors, any implementation; you can extend only one.
:::

## Collections

:::task video "6. The Collection Framework hierarchy"
{{t j2 7:27:36}}
??? Answer
`Iterable` → `Collection` → `List` (`ArrayList`, `LinkedList`), `Set` (`HashSet`, `LinkedHashSet`, `TreeSet`), `Queue`/`Deque` (`ArrayDeque`, `LinkedList`, `PriorityQueue`). Separately `Map`: `HashMap`, `LinkedHashMap`, `TreeMap`.
:::

:::task video "7. ArrayList vs LinkedList: structure and choice"
{{t j2 7:28:11}}
??? Answer
`ArrayList` — a dynamic array: O(1) index access, insertion in the middle O(n). `LinkedList` — a doubly linked list: O(1) insertion/removal at the ends and via an iterator, index access O(n). Default — `ArrayList`; for queues — `ArrayDeque`.
:::

:::task video "8. List vs Set"
{{t j2 7:28:45}}
??? Answer
A `List` is ordered, allows duplicates, has index access. A `Set` has no duplicates and no index methods.
:::

:::task video "9. equals and hashCode: why and what rules?"
{{t j2 7:29:12}}
??? Answer
`Object` methods: comparison by contents and a numeric representation for hash collections. Override `equals` — override `hashCode`; equal objects — equal hashes; equal hashes don't guarantee equality.
:::

:::task video "10. How does HashMap work and how are collisions resolved?"
{{t j2 7:29:54}}
??? Answer
An array of buckets (16 by default, grows at 75% fill). The index comes from the key's hash; if taken, keys are compared with `equals`: equal — replace the value, otherwise a collision — the element goes into the bucket's linked list; with 8+ elements in a bucket and a capacity ≥ 64 the list turns into a red-black tree.
:::

:::task video "11. Complexity of inserting at the start: ArrayList and LinkedList"
{{t j2 7:30:55}}
??? Answer
`ArrayList` — O(n) (shifting all elements), `LinkedList` — O(1).
:::

## Generics

:::task video "12. What are generics and wildcards?"
{{t j2 7:31:05}}
??? Answer
Parameterised types: classes, interfaces, methods with a type parameter; type checking at compile time, erasure at runtime. The wildcard `?` is an unknown type, bounded by `? extends T` (read) and `? super T` (write) — PECS.
:::

## Concurrency

:::task video "13. How do you stop a thread? interrupt and join"
{{t j2 7:31:37}}
??? Answer
Cooperatively via `interrupt()` (a flag + `InterruptedException` while waiting); `stop()` doesn't work since Java 20. `join()` — wait for another thread to finish.
:::

:::task video "14. Synchronisation methods. What is a monitor?"
{{t j2 7:32:32}}
??? Answer
A `synchronized` method (monitor `this` or `Class`) and a `synchronized` block with an explicit monitor; also `Lock`, atomics, concurrent collections.
:::

:::task video "15. Daemons, wait, notify/notifyAll"
{{t j2 7:33:04}}
??? Answer
A daemon ends when all user threads are done. `wait()` — wait and release the monitor; `notify()` wakes one waiting thread, `notifyAll()` — all. Called inside `synchronized` on the same object, `wait` — in a loop.
:::

:::task video "16. ExecutorService: why, submit vs execute, Runnable vs Callable"
{{t j2 7:33:40}}
??? Answer
A pool of reusable threads with a task queue. `execute(Runnable)` — no result; `submit` returns a `Future`. `Callable` returns a value and can throw checked exceptions.
:::

:::task video "17. volatile"
{{t j2 7:34:35}}
??? Answer
Visibility of writes to all threads and no reordering around the field; it doesn't make `++` atomic.
:::

## Stream API

:::task video "18. What does stream() do and why streams?"
{{t j2 7:35:02}}
??? Answer
It turns a collection into a processing pipeline: compact filtering, transformation and sorting without intermediate collections; laziness; easy parallelism with `parallelStream()`.
:::

:::task video "19. Terminal and intermediate operations. What does map do?"
{{t j2 7:35:43}}
??? Answer
Intermediate operations return a `Stream` and are lazy, any number of them; there's one terminal operation, and it runs the pipeline. `map` transforms each element; the type can change.
:::

## I/O

:::task video "20. Serialisation: what is it and what are the conditions?"
{{t j2 7:36:16}}
??? Answer
Converting an object to bytes and back. Conditions: `Serializable`/`Externalizable`; fields are serialisable or `transient`; a non-serialisable ancestor has an accessible no-arg constructor.
:::

:::task video "21. transient and buffered classes"
{{t j2 7:37:05}}
??? Answer
`transient` excludes a field from serialisation. Buffered: `BufferedInputStream`, `BufferedOutputStream`, `BufferedReader`, `BufferedWriter`.
:::

:::note "About “useless” questions"
At the end the author calls the question about kinds of garbage collectors useless for real work ({{t j2 7:38:06}}). For a Junior that's fair, but already at Middle level, knowing GCs (G1 — the default, ZGC for low pauses, Parallel for throughput) and being able to read GC logs helps solve real performance and memory problems. Don't cram it, but understanding the basics is worth it.
:::

## What they'll ask next (not from the video)

:::task easy "The string pool and comparing strings"
How does `==` differ from `equals` for strings? What is the string pool?
??? Answer
`==` compares references, `equals` — contents. Literals are stored in the string pool and reused, so `"a" == "a"` may be `true`, but `new String("a") == "a"` is `false`. Strings are compared with `equals`.
:::

:::task medium "Records, var, switch expressions"
What from modern Java (17–25) do you use?
??? Answer
`record` for immutable data, `var`, text blocks `"""`, switch expressions and pattern matching (`instanceof` with a variable, `switch` on types, record patterns), `sealed` hierarchies, virtual threads, Sequenced Collections, `Stream.toList()`.
:::

:::task medium "How is JVM memory organised?"
The heap, the stack and what lives where.
??? Answer
A thread's stack — call frames, local primitives and references. The heap — objects (shared by threads, cleaned by the GC, young/old generations). Metaspace — class metadata. `StackOverflowError` — stack overflow (deep recursion), `OutOfMemoryError` — out of heap/metaspace.
:::

:::task hard "Live coding"
Design a thread-safe LRU cache for N elements with `get` and `put` methods and explain the complexity of the operations.
??? Answer
A `LinkedHashMap` with `accessOrder = true` and `removeEldestEntry`, all methods under one lock (`synchronized` or `ReentrantLock`) — O(1). For high contention — ready-made libraries (Caffeine). Discuss why `ConcurrentHashMap` by itself doesn't give an eviction order.
:::

## What's next

Congratulations on finishing the course! You've covered Java SE to the level needed for a Junior interview. Next steps: the [Roadmap](#/roadmap) — what else to learn in Java, [Career](#/page/career) — the backend stack and the job market, [AI](#/page/ai) — how to work with AI assistants.
