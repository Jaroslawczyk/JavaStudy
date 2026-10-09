The **Java Memory Model** (JMM) defines when changes made by one thread become visible to others. The video explains `volatile` through a "thread cache" — a useful intuition, but Middle+ interviews expect the concepts of **visibility**, **reordering** and **happens-before**.

## Why problems arise at all

1. **CPU caches.** Each core has its own caches; one core's write isn't instantly visible to another.
2. **Reordering.** The compiler, the JIT and the CPU rearrange independent instructions for speed. Within one thread the result doesn't change, but another thread may observe the operations "in a different order".
3. **JIT optimisations.** Reading a field in a loop may be hoisted out of the loop if the JIT is "sure" the field doesn't change.

```java
// without synchronisation the thread may NEVER finish
static boolean ready;
static int value;

// thread 1               // thread 2
value = 42;               while (!ready) { }
ready = true;             System.out.println(value);   // may print 0!
```

## Happens-before

The JMM guarantees: if action **A happens-before B**, all writes before A are visible in B. The main rules:

| Rule | A happens-before B |
|---|---|
| Program order | each action of a thread → the next action of the same thread |
| Monitor | exiting `synchronized(m)` → a later entry into `synchronized(m)` |
| volatile | a write to a volatile field → a later read of that field |
| Thread start | `t.start()` → any action in `t` |
| Thread termination | any action in `t` → return from `t.join()` |
| Transitivity | A → B and B → C ⇒ A → C |

`java.util.concurrent` adds its own guarantees: a `put` into a `ConcurrentHashMap` → a `get`, `countDown` → return from `await`, submitting a task → its execution, a task's completion → `future.get()`.

## volatile

```java
static volatile boolean ready;
static int value;

value = 42;          // 1
ready = true;        // 2 — a volatile write: everything above is "published"

while (!ready) { }   // a volatile read
System.out.println(value);   // guaranteed to be 42
```

`volatile` gives **visibility** and **no reordering** around accesses to the field, but **not atomicity** of compound operations (`count++`). Details in the [atomics and volatile lesson](#/lessons/j2-atomic-volatile).

## final fields and safe publication

`final` fields have a special guarantee: if the object reference didn't "escape" from the constructor, any thread that obtains the reference sees correctly initialised `final` fields — even without synchronisation. That's why **immutable objects are thread-safe "for free"**.

Ways to publish an object safely: initialise it in a `static` field (via class initialisation), write it to a `volatile` field or an `AtomicReference`, hand it over via a thread-safe collection, publish it inside `synchronized`.

:::warning "Don't let this escape from a constructor"
Registering `this` as a listener or starting a thread that uses `this` right in the constructor can hand a not-fully-constructed object to other threads — and the guarantee for `final` fields is lost.
:::

## Atomicity of long and double

Per the specification, a write to a regular (non-volatile) `long`/`double` field may be non-atomic (two 32-bit halves). On 64-bit JVMs this practically never happens, but `volatile long` formally guarantees atomic reads/writes.

:::interview "Interview questions"
**What is happens-before?** — An ordering relation in the memory model: if A happens-before B, A's results are visible to B. It arises via `synchronized`, `volatile`, `start/join`, `java.util.concurrent` classes and transitivity.

**Why are immutable objects thread-safe?** — Their state doesn't change after the constructor, and `final`-field semantics guarantee other threads see them correctly initialised.
:::

## Homework

:::task easy "Catch the invisibility"
Run the `ready` flag example without `volatile`, with an empty loop body (`while (!ready) {}`). Does the program finish? Add `volatile` and compare. Also try a variant with `Thread.onSpinWait()` in the loop.
:::

:::task medium "Publishing via final"
Write an immutable `Config` class (only `final` fields, defensive copies of collections) and a mutable variant. For each, describe a way to safely hand the object from a loader thread to worker threads and justify it with happens-before rules.
:::

:::task hard "jcstress"
Add OpenJDK **jcstress** and write a test demonstrating reordering (the classic `x = 1; r1 = y;` / `y = 1; r2 = x;` with the outcome `r1 == 0 && r2 == 0`). Repeat with `volatile` and explain the difference in the allowed outcomes.
:::
