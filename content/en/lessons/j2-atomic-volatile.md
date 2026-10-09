Two more tools against concurrency problems: **atomic types** (`AtomicInteger` and friends) — read-modify-write operations in one indivisible step — and the **`volatile`** keyword — a guarantee that changes are visible across threads. Plus a popular misconception: `volatile` does **not** fix a race.

## Video timestamps

- {{t j2 2:11:01}} — back to the counter without synchronisation
- {{t j2 2:13:12}} — an increment is three operations
- {{t j2 2:13:33}} — atomic types: `AtomicInteger`, `AtomicBoolean`, `AtomicLong`…
- {{t j2 2:14:29}} — `getAndIncrement()`, `getAndDecrement()`
- {{t j2 2:15:19}} — a popular question: the `volatile` keyword
- {{t j2 2:15:48}} — a thread caching a variable
- {{t j2 2:16:45}} — the myth: "volatile makes operations atomic"
- {{t j2 2:17:12}} — check: `volatile` doesn't remove the race

## Atomic types

```java
public class Counter {
    private final AtomicInteger value = new AtomicInteger();

    public void increment() { value.incrementAndGet(); }
    public void decrement() { value.decrementAndGet(); }
    public int getValue()   { return value.get(); }
}
```

No `synchronized`, and the result is always 0. The `java.util.concurrent.atomic` package: `AtomicInteger`, `AtomicLong`, `AtomicBoolean`, `AtomicReference<V>`, arrays like `AtomicIntegerArray`…

| Method | What it does |
|---|---|
| `get()` / `set(v)` | Read / write |
| `incrementAndGet()` / `getAndIncrement()` | `++i` / `i++` atomically |
| `addAndGet(delta)` | Add |
| `compareAndSet(expected, new)` | Write `new` only if the current value is `expected` |
| `updateAndGet(x -> x * 2)` | Any function (Java 8+) |
| `accumulateAndGet(x, Math::max)` | Fold with an argument |

### How it works: CAS

Atomics are built not on locks but on the CPU instruction **CAS** (compare-and-swap): "write the new value if memory still holds the old one; otherwise report failure". On failure the operation simply retries:

```java
int prev, next;
do {
    prev = value.get();
    next = prev + 1;
} while (!value.compareAndSet(prev, next));
```

This is a **non-blocking** (lock-free) algorithm: threads don't sleep, they "spin". Under moderate contention it's faster than `synchronized`.

:::tip "LongAdder for hot counters"
If dozens of threads constantly increment one counter (metrics, statistics), `AtomicLong` hits constant CAS retries. **`LongAdder`** (Java 8) keeps several cells and sums them on read — under heavy load it's many times faster.
:::

## volatile

The video's explanation: a thread may cache a variable locally and not see changes made by other threads; `volatile` forbids that caching. That's a good intuition. More precisely (per the Java Memory Model, JMM):

- **Visibility.** A write to a `volatile` field is immediately visible to all threads reading it.
- **Ordering.** Everything a thread wrote **before** writing a `volatile` field becomes visible to a thread that reads that field **afterwards** (the *happens-before* relation). The compiler and CPU won't reorder operations across this boundary.
- **Atomicity** — only for a single read/write (including `long`/`double`). **Compound operations (`count++`) do not become atomic.**

```java
private volatile boolean running = true;     // the classic case: a stop flag

public void run() {
    while (running) { doWork(); }            // without volatile the loop might never see false
}
public void stop() { running = false; }
```

:::warning "A correction to the video"
The author advises making **every** variable accessed from different threads `volatile`. That's unnecessary if all accesses already happen inside `synchronized` on the same monitor (or via a `Lock`) — synchronisation itself provides visibility. `volatile` is needed where there's no synchronisation: flags, once-published references, double-checked locking.
:::

:::interview "Interview question"
**What does volatile do, and does it fix race conditions?** — It guarantees that writes are visible to all threads and forbids reordering around accesses to the field. It doesn't make compound operations atomic: `volatile int count; count++` still loses updates. For counters — `AtomicInteger`/`LongAdder` or synchronisation.
:::

## What the video doesn't cover

- **Double-checked locking** — lazy initialisation with `volatile`:

```java
private static volatile Service instance;
static Service get() {
    Service s = instance;
    if (s == null) {
        synchronized (Service.class) {
            s = instance;
            if (s == null) instance = s = new Service();
        }
    }
    return s;
}
```

Without `volatile` another thread could get a reference to a **not fully constructed** object.

- **`VarHandle`** (Java 9) — low-level field access with various memory modes; modern atomics are built on it.
- More on the memory model — in the article [JMM and volatile](#/extra/jmm-volatile).

## Homework

The video has no tasks — here are our own.

:::task easy "An atomic counter"
Rewrite `Counter` with `AtomicInteger`. Start 8 threads doing 1,000,000 increments each and check the result. Compare the time with the `synchronized` version.
:::

:::task medium "A flag without volatile"
Write a thread with a loop `while (!stop) { counter++; }` (no `sleep` or printing inside!) and stop it from `main` after a second by setting `stop = true`. Run it with and without `volatile`. Without it the program may hang forever — explain why (hint: the JIT hoisted the read out of the loop).
:::

:::task medium "CAS by hand"
Implement `static int incrementIfLessThan(AtomicInteger a, int limit)` using a `compareAndSet` loop: it increments the value only if it's below `limit` and returns the new value. Check with 10 threads that the value never exceeds the limit.
:::

:::task hard "AtomicLong vs LongAdder"
Write a benchmark (ideally with JMH): 1, 4, 16 threads increment a shared counter 10 million times. Compare `synchronized`, `AtomicLong`, `LongAdder`. Build a table and explain why the gap grows as the number of threads increases.
:::
